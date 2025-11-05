// src/lib/geo.ts
export type CCoord = { lon:number; lat:number }
export const COUNTRY_CENTER: Record<string, CCoord> = {
  CL: { lon:-70.66, lat:-33.45 }, // Santiago
  PE: { lon:-77.04, lat:-12.05 }, // Lima
  AR: { lon:-58.38, lat:-34.60 }, // Buenos Aires
  PA: { lon:-79.52, lat:  8.98 }, // Panam&aacute;
  EC: { lon:-78.50, lat:-0.19 },  // Quito
  CO: { lon:-74.08, lat:  4.61 }, // Bogotá
  BR: { lon:-47.88, lat:-15.79 }, // Brasilia
  PY: { lon:-57.63, lat:-25.29 }, // Asunción
}
