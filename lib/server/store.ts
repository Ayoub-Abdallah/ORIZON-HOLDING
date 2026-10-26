import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { env } from "./env";

// Tiny document store with two drivers:
//  - Upstash Redis (REST) when UPSTASH_REDIS_REST_URL / _TOKEN are set — use this in production.
//  - JSON files on disk otherwise (./.data locally, /tmp on serverless).

export type Collection = "leads" | "conversations";

interface Driver {
  all<T>(collection: Collection): Promise<T[]>;
  get<T>(collection: Collection, id: string): Promise<T | null>;
  put<T extends { id: string }>(collection: Collection, item: T): Promise<void>;
}

const PREFIX = "orizon:";

function upstashDriver(url: string, token: string): Driver {
  async function cmd<T>(...args: string[]): Promise<T> {
    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(args),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Upstash ${args[0]} failed: ${res.status}`);
    const json = (await res.json()) as { result: T };
    return json.result;
  }
  return {
    async all<T>(collection: Collection) {
      const flat = (await cmd<string[] | null>("HGETALL", PREFIX + collection)) ?? [];
      const out: T[] = [];
      for (let i = 1; i < flat.length; i += 2) out.push(JSON.parse(flat[i]) as T);
      return out;
    },
    async get<T>(collection: Collection, id: string) {
      const raw = await cmd<string | null>("HGET", PREFIX + collection, id);
      return raw ? (JSON.parse(raw) as T) : null;
    },
    async put(collection, item) {
      await cmd("HSET", PREFIX + collection, item.id, JSON.stringify(item));
    },
  };
}

function fileDriver(dir: string): Driver {
  let queue: Promise<unknown> = Promise.resolve();
  const file = (c: Collection) => path.join(dir, `${c}.json`);

  async function read<T>(c: Collection): Promise<Record<string, T>> {
    try {
      return JSON.parse(await fs.readFile(file(c), "utf8")) as Record<string, T>;
    } catch {
      return {};
    }
  }

  return {
    async all<T>(c: Collection) {
      return Object.values(await read<T>(c));
    },
    async get<T>(c: Collection, id: string) {
      return (await read<T>(c))[id] ?? null;
    },
    put(c, item) {
      // Serialize writes so concurrent requests don't clobber each other.
      const next = queue.then(async () => {
        await fs.mkdir(dir, { recursive: true });
        const data = await read<typeof item>(c);
        data[item.id] = item;
        await fs.writeFile(file(c), JSON.stringify(data, null, 2));
      });
      queue = next.catch(() => undefined);
      return next;
    },
  };
}

function createDriver(): Driver {
  const url = env("UPSTASH_REDIS_REST_URL");
  const token = env("UPSTASH_REDIS_REST_TOKEN");
  if (url && token) return upstashDriver(url, token);
  const dir = process.env.DATA_DIR ?? (process.env.VERCEL ? "/tmp/orizon-data" : path.join(process.cwd(), ".data"));
  return fileDriver(dir);
}

export const store = createDriver();

export function newId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}${crypto.randomUUID().replace(/-/g, "").slice(0, 10)}`;
}
