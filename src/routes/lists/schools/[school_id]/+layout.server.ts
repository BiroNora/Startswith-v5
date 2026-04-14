import { error, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/database.js';
import {
	getSchoolTypeLabels,
	getDutyLevelLabels,
	DUTY_TYPES,
	EVENT_MAP,
	getName
} from '../../../stores/dataStore.js';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params, locals }) => {
	if (!locals.user) {
		throw redirect(302, '/auth/login');
	}

	const schoolId = Number(params.school_id);
	if (isNaN(schoolId)) {
		throw error(400, 'Érvénytelen iskola azonosító');
	}

	const [school, contacts, events] = await Promise.all([
		db.school.findUnique({
			where: { school_id: schoolId },
			include: {
				city: true,
				region: true,
				county: true,
				country: true
			}
		}),
		db.contact.findMany({
			where: { school_id: schoolId },
			orderBy: { contact_id: 'desc' }
		}),
		db.event.findMany({
			where: { school_id: schoolId },
			orderBy: { closing_date: 'desc' }
		})
	]);

	if (!school) {
		throw error(404, 'School not found');
	}

	const schoolType = getSchoolTypeLabels(school.school_type);
	const dutyType = getDutyLevelLabels(school.duty_levels);

	// Események formázása a getName-el
	const mappedEvents = (events || []).map((event) => ({
		...event,
		on_duty_name: getName(DUTY_TYPES, event.duty_level),
		event_type_name: getName(EVENT_MAP, event.event_type)
	}));

	return {
		school,
		school_type: schoolType,
		duty_type: dutyType,
		contact: contacts,
		event: mappedEvents,
		city: school.city,
		region: school.region,
		county: school.county,
		country: school.country
	};
};
