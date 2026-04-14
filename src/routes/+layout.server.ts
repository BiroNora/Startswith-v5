import { db } from '$lib/server/database';
import type { Country, Region } from '@prisma/client';
import type { LayoutServerLoad } from './$types';

interface FilterCache {
	years: string[];
	countries: Country[];
	regions: Region[];
	distinctYears: string[];
}

let cachedFilterData: FilterCache | null = null;

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!cachedFilterData) {
		console.log('--- Filter adatok cache-elése ---');
		const [yearsData, countries, regions] = await Promise.all([
			db.event.findMany({
				distinct: ['event_year'],
				select: { event_year: true },
				orderBy: { event_year: 'asc' }
			}),
			db.country.findMany({ orderBy: { country_name: 'asc' } }),
			db.region.findMany({ orderBy: { region_name: 'asc' } })
		]);

		const yearsArr = yearsData.map((y) => String(y.event_year));
		const distinctYears = [...new Set(yearsArr)].sort();
		distinctYears.unshift('ALL');

		cachedFilterData = {
			years: yearsArr,
			countries: countries,
			regions: regions,
			distinctYears
		};
	}

	return {
		user: locals.user,
		...cachedFilterData
	};
};
