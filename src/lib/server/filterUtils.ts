import { db } from '$lib/database';

export async function getFilterBaseData() {
  const [yearsData, countries, regions] = await Promise.all([
    db.event.findMany({
      distinct: ['event_year'],
      select: { event_year: true },
      orderBy: { event_year: 'asc' }
    }),
    db.country.findMany({ orderBy: { country_name: 'asc' } }),
    db.region.findMany({ orderBy: { region_name: 'asc' } })
  ]);

  return {
    distinctYears: yearsData.map(y => String(y.event_year)),
    distinctCountries: countries,
    distictRegions: regions
  };
}
