import type { Laundromat } from '../constrants/services';

const GOOGLE_MAPS_API_KEY: string = 'YOUR_GOOGLE_MAPS_API_KEY';

type DistanceResult = {
  distanceKm: number;
  duration: string;
  distanceText: string;
};

const SUBURB_COORDS: Record<string, [number, number]> = {
  goodwood: [-33.917, 18.475],
  parow: [-33.904, 18.508],
  bellville: [-33.891, 18.528],
  brackenfell: [-33.875, 18.530],
  woodstock: [-33.927, 18.449],
  'district six': [-33.931, 18.452],
  'district 6': [-33.931, 18.452],
  'salt river': [-33.934, 18.448],
  zonnebloem: [-33.928, 18.455],
  maitland: [-33.945, 18.493],
  pinelands: [-33.950, 18.505],
  observatory: [-33.937, 18.475],
  'cape town': [-33.925, 18.424],
  cbd: [-33.921, 18.418],
  gardens: [-33.918, 18.413],
  'bo-kaap': [-33.919, 18.414],
  'bo kaap': [-33.919, 18.414],
  'sea point': [-33.918, 18.389],
  'green point': [-33.912, 18.398],
  'city bowl': [-33.920, 18.415],
  'de waterkant': [-33.918, 18.411],
  rondebosch: [-33.958, 18.470],
  claremont: [-33.980, 18.465],
  newlands: [-33.978, 18.448],
  kenilworth: [-33.988, 18.452],
  wynberg: [-33.999, 18.459],
  athlone: [-33.955, 18.495],
  'cape flats': [-33.960, 18.500],
  lansdowne: [-33.972, 18.492],
  harfield: [-33.978, 18.478],
  factreton: [-33.930, 18.490],
  panorama: [-33.960, 18.520],
  newton: [-33.934, 18.455],
  hanover: [-33.932, 18.453],
  milnerton: [-33.880, 18.435],
  'table view': [-33.830, 18.430],
  constantia: [-34.010, 18.420],
  tokai: [-34.035, 18.440],
  retreat: [-34.020, 18.470],
  plumstead: [-34.015, 18.480],
  wetton: [-34.005, 18.485],
  lakeside: [-34.045, 18.450],
  muizenberg: [-34.068, 18.450],
  'fish hoek': [-34.100, 18.410],
  strand: [-34.120, 18.820],
  'somerset west': [-34.080, 18.840],
  paarl: [-33.720, 18.960],
  stellenbosch: [-33.930, 18.860],
  mowbray: [-33.948, 18.473],
  rosebank: [-33.950, 18.478],
  hartleyvale: [-33.940, 18.482],
  manenberg: [-33.965, 18.500],
  kensington: [-33.910, 18.490],
};

const AREA_ROAD_DISTANCES: Record<string, Record<string, number>> = {
  Observatory: {
    observatory: 1.0,
    mowbray: 2.5,
    rondebosch: 4.0,
    claremont: 5.0,
    newlands: 6.0,
    kenilworth: 5.5,
    wynberg: 6.5,
    woodstock: 2.5,
    'salt river': 2.5,
    zonnebloem: 2.5,
    maitland: 2.5,
    factreton: 3.0,
    goodwood: 4.5,
    pinelands: 3.5,
    athlone: 2.0,
    manenberg: 3.0,
    lansdowne: 3.0,
    harfield: 4.0,
    'cape flats': 2.5,
    'district six': 3.0,
    'district 6': 3.0,
    'cape town': 4.0,
    cbd: 3.5,
    gardens: 4.5,
    'bo-kaap': 3.5,
    'bo kaap': 3.5,
    'de waterkant': 4.0,
    'city bowl': 4.0,
    'green point': 5.0,
    'sea point': 6.0,
    newton: 2.5,
    hanover: 2.5,
    parow: 5.0,
    bellville: 7.0,
    kensington: 4.5,
    panorama: 6.0,
    milnerton: 5.5,
    'cape gardens': 3.5,
    retreat: 7.0,
    plumstead: 6.5,
    wetton: 5.5,
  },
  Maitland: {
    maitland: 2.0,
    goodwood: 3.0,
    pinelands: 3.0,
    factreton: 2.5,
    observatory: 2.5,
    mowbray: 3.0,
    rondebosch: 5.0,
    claremont: 6.0,
    newlands: 7.0,
    kenilworth: 6.5,
    wynberg: 7.5,
    woodstock: 3.0,
    'salt river': 3.0,
    zonnebloem: 3.0,
    athlone: 3.0,
    manenberg: 3.5,
    lansdowne: 4.0,
    harfield: 5.0,
    'cape flats': 3.0,
    'district six': 3.5,
    'district 6': 3.5,
    'cape town': 4.5,
    cbd: 4.0,
    gardens: 5.0,
    'bo-kaap': 4.0,
    'bo kaap': 4.0,
    'de waterkant': 4.5,
    'city bowl': 4.5,
    'green point': 5.5,
    'sea point': 6.5,
    newton: 3.0,
    hanover: 3.0,
    parow: 4.0,
    bellville: 6.0,
    kensington: 3.5,
    panorama: 5.0,
    milnerton: 5.0,
    'cape gardens': 4.0,
    hartleyvale: 3.5,
    retreat: 8.0,
    plumstead: 7.0,
    wetton: 6.0,
  },
  Woodstock: {
    woodstock: 1.5,
    'salt river': 2.0,
    zonnebloem: 1.5,
    newton: 1.0,
    hanover: 1.0,
    'district six': 2.0,
    'district 6': 2.0,
    observatory: 2.5,
    mowbray: 3.0,
    maitland: 3.0,
    factreton: 3.0,
    goodwood: 4.0,
    athlone: 2.5,
    manenberg: 4.5,
    rondebosch: 5.0,
    claremont: 6.5,
    newlands: 8.0,
    kenilworth: 7.5,
    wynberg: 8.5,
    harfield: 7.0,
    lansdowne: 6.0,
    'cape flats': 5.0,
    'cape town': 2.0,
    cbd: 1.5,
    gardens: 2.5,
    'bo-kaap': 2.0,
    'bo kaap': 2.0,
    'de waterkant': 2.5,
    'city bowl': 2.0,
    'green point': 3.5,
    'sea point': 4.5,
    pinelands: 4.0,
    hartleyvale: 2.5,
    parow: 5.5,
    bellville: 8.0,
    kensington: 5.0,
    panorama: 6.0,
    milnerton: 5.5,
    'cape gardens': 2.0,
    retreat: 9.0,
    plumstead: 8.0,
    wetton: 7.0,
  },
  'Cape Town CBD': {
    cbd: 2.0,
    'cape town': 2.0,
    gardens: 4.0,
    'bo-kaap': 2.0,
    'bo kaap': 2.0,
    'de waterkant': 2.5,
    'city bowl': 2.5,
    'green point': 4.0,
    'sea point': 6.0,
    'district six': 2.0,
    'district 6': 2.0,
    woodstock: 2.5,
    'salt river': 2.5,
    zonnebloem: 2.0,
    hanover: 1.5,
    newton: 2.0,
    observatory: 3.5,
    mowbray: 4.0,
    maitland: 4.0,
    factreton: 3.5,
    goodwood: 5.0,
    pinelands: 5.0,
    athlone: 3.5,
    manenberg: 5.5,
    rondebosch: 5.5,
    claremont: 6.5,
    newlands: 7.5,
    kenilworth: 7.0,
    wynberg: 8.0,
    harfield: 6.0,
    lansdowne: 5.5,
    'cape flats': 5.0,
    parow: 6.0,
    bellville: 8.0,
    kensington: 5.5,
    panorama: 6.5,
    milnerton: 4.5,
    'cape gardens': 1.5,
    hartleyvale: 3.5,
    retreat: 10.0,
    plumstead: 9.0,
    wetton: 8.0,
  },
};

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function extractSuburb(address: string): string | null {
  const lower = address.toLowerCase().trim();
  const sortedKeys = Object.keys(SUBURB_COORDS).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (lower.includes(key)) {
      return key;
    }
  }
  return null;
}

function getEstimatedDistance(area: string, suburb: string, laundromats: Laundromat[]): number {
  const distances = AREA_ROAD_DISTANCES[area];
  if (distances && distances[suburb] !== undefined) {
    return distances[suburb];
  }

  const suburbCoords = SUBURB_COORDS[suburb];
  const laundromat = laundromats.find(l => l.area === area);
  if (suburbCoords && laundromat) {
    const straightLine = haversineKm(suburbCoords[0], suburbCoords[1], laundromat.lat, laundromat.lng);
    return Math.round(straightLine * 1.4 * 10) / 10;
  }

  return 5;
}

function getSuburbToSuburbDistance(fromSuburb: string, toSuburb: string): number | null {
  let bestDist: number | null = null;

  for (const [, distances] of Object.entries(AREA_ROAD_DISTANCES)) {
    const fromDist = distances[fromSuburb];
    const toDist = distances[toSuburb];
    if (fromDist !== undefined && toDist !== undefined) {
      const total = fromDist + toDist;
      if (bestDist === null || total < bestDist) {
        bestDist = total;
      }
    }
  }

  return bestDist;
}

export function findClosestLaundromat(address: string, laundromats: Laundromat[]): Laundromat | null {
  if (laundromats.length === 0) return null;

  const suburb = extractSuburb(address);

  if (suburb) {
    let best: Laundromat = laundromats[0];
    let bestDist = Infinity;

    for (const l of laundromats) {
      const dist = getEstimatedDistance(l.area, suburb, laundromats);
      if (dist < bestDist) {
        bestDist = dist;
        best = l;
      }
    }
    return best;
  }

  return laundromats[0];
}

export async function getDistance(
  origin: string,
  destination: string,
  laundromats: Laundromat[]
): Promise<DistanceResult | null> {
  if (!origin.trim() || !destination.trim()) return null;

  if (isGoogleMapsConfigured()) {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${GOOGLE_MAPS_API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'OK' || !data.rows?.[0]?.elements?.[0]) return null;

      const element = data.rows[0].elements[0];
      if (element.status !== 'OK') return null;

      const distanceMeters = element.distance.value;
      const distanceKm = distanceMeters / 1000;
      const distanceText = element.distance.text;
      const duration = element.duration.text;

      return { distanceKm, duration, distanceText };
    } catch {
      // fall through to estimate
    }
  }

  const originSuburb = extractSuburb(origin);
  const destSuburb = extractSuburb(destination);

  if (originSuburb && destSuburb && originSuburb !== destSuburb) {
    const roadDist = getSuburbToSuburbDistance(originSuburb, destSuburb);
    if (roadDist !== null) {
      const estimated = Math.round(roadDist * 10) / 10;
      return {
        distanceKm: estimated,
        duration: `${Math.round(estimated * 3)} min`,
        distanceText: `${estimated.toFixed(1)} km`,
      };
    }

    const originCoords = SUBURB_COORDS[originSuburb];
    const destCoords = SUBURB_COORDS[destSuburb];
    if (originCoords && destCoords) {
      const dist = haversineKm(originCoords[0], originCoords[1], destCoords[0], destCoords[1]);
      const estimated = Math.round(dist * 1.4 * 10) / 10;
      return {
        distanceKm: estimated,
        duration: `${Math.round(estimated * 3)} min`,
        distanceText: `${estimated.toFixed(1)} km`,
      };
    }
  }

  if (originSuburb) {
    const closest = findClosestLaundromat(origin, laundromats);
    if (closest) {
      const estimated = getEstimatedDistance(closest.area, originSuburb, laundromats);
      return {
        distanceKm: estimated,
        duration: `${Math.round(estimated * 3)} min`,
        distanceText: `${estimated.toFixed(1)} km`,
      };
    }
  }

  if (destSuburb) {
    const closest = findClosestLaundromat(destination, laundromats);
    if (closest) {
      const estimated = getEstimatedDistance(closest.area, destSuburb, laundromats);
      return {
        distanceKm: estimated,
        duration: `${Math.round(estimated * 3)} min`,
        distanceText: `${estimated.toFixed(1)} km`,
      };
    }
  }

  return {
    distanceKm: 5,
    duration: '~15 min',
    distanceText: '~5.0 km',
  };
}

export function isGoogleMapsConfigured(): boolean {
  return (
    GOOGLE_MAPS_API_KEY !== 'YOUR_GOOGLE_MAPS_API_KEY' &&
    GOOGLE_MAPS_API_KEY.length > 0
  );
}
