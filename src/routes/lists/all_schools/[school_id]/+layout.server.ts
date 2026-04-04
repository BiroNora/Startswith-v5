import { error, redirect } from '@sveltejs/kit'
import { db } from '$lib/database.js'
import { getName, getSchoolTypeLabels, getDutyLevelLabels, DUTY_TYPES, EVENT_MAP } from '../../../stores/dataStore.js'

export async function load({ params, locals }) {
	if (!locals.user || locals.user.active === false) {
		throw redirect(302, '/auth/login')
	}

	const sc_id = Number(params.school_id)

	const school = await db.school.findUnique({
		where: { school_id: sc_id },
		include: {
			User: true,
			city: true,
			region: true,
			county: true,
			country: true
		}
	})

	if (!school) throw error(404, 'School not found')

	const schoolType = getSchoolTypeLabels(school.school_type);
	const dutyType = getDutyLevelLabels(school.duty_levels);

	const contact = await db.contact.findMany({
		where: { school_id: sc_id },
		orderBy: { contact_id: 'desc' }
	})

	const rawEvents = await db.event.findMany({
		where: { school_id: sc_id },
		orderBy: { closing_date: 'desc' }
	})

	// Események formázása a getName-el
	const mappedEvents = (rawEvents || []).map(event => ({
		...event,
		on_duty_name: getName(DUTY_TYPES, event.duty_level),
		event_type_name: getName(EVENT_MAP, event.event_type)
	}));

	return {
		school,
		schoolType,
		dutyType,
		contact,
		mappedEvents,
		internalContacts: school.User,
		externalContacts: contact,
	}
}
