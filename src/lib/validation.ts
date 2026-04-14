import { db } from '$lib/server/database';
import { error, redirect } from '@sveltejs/kit';

// Közös adatbetöltő a legördülő menükhöz
export async function getLocationData() {
	const [countries, regions, counties, cities] = await Promise.all([
		db.country.findMany({ orderBy: { country_name: 'asc' } }),
		db.region.findMany({ orderBy: { region_name: 'asc' } }),
		db.county.findMany({ orderBy: { county_name: 'asc' } }),
		db.city.findMany({ orderBy: { city_name: 'asc' } })
	]);
	return { countries, regions, counties, cities };
}

// Form adatok tisztítása és objektumba rendezése
export function parseSchoolFormData(data: FormData) {
	const school_type = data.getAll('schoolTypeIds').map((id) => Number(id));
	const duty_levels = data.getAll('dutyLevelIds').map((id) => Number(id));

	return {
		user_email: String(data.get('useremail')),
		country_id: Number(data.get('countr')),
		region_id: Number(data.get('region')),
		county_id: Number(data.get('county')),
		city_id: Number(data.get('city')),
		school_name: String(data.get('name')),
		school_email: String(data.get('email')),
		om_id: String(data.get('om')) || null,
		zip_code: String(data.get('zip')),
		address: String(data.get('address')),
		dir_name: String(data.get('dirname')),
		dir_phone: String(data.get('dirphone')),
		website: String(data.get('website')) || null,
		coop: data.get('coop') === 'on',
		note: String(data.get('note')),
		isNotClassified: Boolean(data.get('iskO')),
		school_type,
		duty_levels
	};
}

/**
 * Ellenőrzi, hogy a felhasználó jogosult-e az esemény módosítására
 */
export async function checkEventAccess(locals: App.Locals, eventId: number) {
	if (!locals.user?.user_id) throw redirect(302, '/auth/login');

	const event = await db.event.findFirst({
		where: {
			event_id: eventId,
			User: { some: { user_id: locals.user.user_id } }
		},
		include: {
			School: { include: { city: true } },
			InterestedStudents: { orderBy: { intrest_id: 'desc' } },
			User: { select: { user_email: true, user_id: true } }
		}
	});

	if (!event) {
		throw error(403, 'Nincs jogosultságod ehhez az eseményhez!');
	}

	return event;
}

/**
 * Ellenőrzi, hogy a felhasználó jogosult-e az iskola módosítására
 */
export async function checkSchoolAccess(locals: App.Locals, schoolId: number) {
	if (!locals.user?.user_id) throw redirect(302, '/auth/login');

	const hasAccess = await db.school.findFirst({
		where: {
			school_id: schoolId,
			User: { some: { user_id: locals.user.user_id } }
		}
	});

	if (!hasAccess) {
		throw error(403, 'Nincs jogosultságod ennek az iskolának a szerkesztéséhez!');
	}

	return hasAccess;
}
