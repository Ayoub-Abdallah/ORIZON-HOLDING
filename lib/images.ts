/** Unsplash photo (free licence) served from Unsplash's CDN, resized and auto-formatted (AVIF/WebP). */
export const photo = (id: string, width = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=70`;

export const photos = {
  // Divisions
  intelligence: "1677442135703-1787eea5ce01",
  software: "1489875347897-49f64b51c1f8",
  products: "1551650975-87deedd944c3",
  data: "1644088379091-d574269d422f",
  cloud: "1680992046626-418f7e910589",
  security: "1614064641938-3bbee52942c7",
  enterprise: "1526628953301-3e589a6a8b74",
  // Sections & pages
  glowLines: "1757484965213-8393e82789fe",
  ledPanel: "1550751827-4bd374c3f58b",
  motherboard: "1631375937044-6dd5beac01d2",
  blueCircuit: "1592659762303-90081d34b277",
  blackCircuit: "1518770660439-4636190af475",
  tealWaves: "1655841439659-0afc60676b70",
  blueWallpaper: "1579548122080-c35fd6820ecb",
  earthNight: "1676944229887-b2def0f94185",
  earthLights: "1769251968740-f8ffa70f9043",
  tower: "1510507024924-fc3847d49ae2",
  lightsWall: "1561233835-f937539b95b9",
  blueBlur: "1645724298070-c30a506ec96f",
  serverRack: "1680992046626-418f7e910589",
} as const;
