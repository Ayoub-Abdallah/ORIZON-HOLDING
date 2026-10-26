/** Reads an env var, ignoring stray whitespace and quotes pasted into a dashboard (even an unmatched one). */
export function env(name: string): string | undefined {
  const value = process.env[name]?.trim().replace(/^["']+|["']+$/g, "").trim();
  return value || undefined;
}
