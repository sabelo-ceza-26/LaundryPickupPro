import type { Laundromat } from '../constrants/services';

export const LAUNDROMATS: Laundromat[] = [
  {
    id: 'laundry-1',
    name: 'My Laundry Lounge',
    address: '77 Observatory Rd, Observatory, Cape Town',
    lat: -33.937,
    lng: 18.475,
    area: 'Observatory',
    suburbs: ['observatory', 'mowbray', 'rondebosch'],
  },
  {
    id: 'laundry-2',
    name: 'AtTheLaundry',
    address: '3 Voortrekker Rd, Maitland, Cape Town',
    lat: -33.945,
    lng: 18.493,
    area: 'Maitland',
    suburbs: ['maitland', 'goodwood', 'pinelands', 'factreton'],
  },
  {
    id: 'laundry-3',
    name: 'WASHD LAUNDRY',
    address: '102 Albert Rd, Woodstock, Cape Town',
    lat: -33.927,
    lng: 18.449,
    area: 'Woodstock',
    suburbs: ['woodstock', 'salt river', 'zonnebloem', 'athlone'],
  },
  {
    id: 'laundry-4',
    name: 'Skoon Portside',
    address: '25 Bree St, Cape Town CBD',
    lat: -33.921,
    lng: 18.418,
    area: 'Cape Town CBD',
    suburbs: ['cape town', 'cbd', 'gardens', 'bo-kaap', 'sea point', 'green point'],
  },
];
