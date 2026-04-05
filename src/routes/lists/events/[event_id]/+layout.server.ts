import { error, redirect } from '@sveltejs/kit';
import { DUTY_MAP, GRADE_MAP, CHANNEL_MAP, STATUS_MAP, EVENT_MAP } from '../../../stores/dataStore';
import { checkEventAccess } from '$lib/validation';

export async function load({ params, locals }) {
	if (!locals.user) {
		throw redirect(302, '/auth/login');
	}

	const event_id = Number(params.event_id);

	const eventData = await checkEventAccess(locals, event_id);

	if (!eventData) throw error(404, 'Event not found');

	// --- NÉVFORDÍTÁSOK ---
	const eventTypeName = EVENT_MAP.find((e) => e.id === eventData.event_type)?.name || eventData.event_type;
	const dutyName = DUTY_MAP.find((d) => d.id === eventData.duty_level)?.name || eventData.duty_level;

	const formattedInters = eventData.InterestedStudents.map((ints) => ({
		...ints,
		grade_name: GRADE_MAP.find((g) => g.id === ints.grade)?.name || ints.grade,
		channel_name: CHANNEL_MAP.find((c) => c.id === ints.channel)?.name || ints.channel,
		status_name: STATUS_MAP.find((s) => s.id === ints.status)?.name || ints.status
	}));

	const isDeletable = eventData.User.length <= 1 && eventData.InterestedStudents.length === 0;

	return {
		event: eventData,
		school: eventData.School,
		cityname: eventData.School.city.city_name,
		inters: formattedInters,
		eventTypeName,
		dutyName,
		// Svelte bind:value-hoz és hibaellenőrzéshez szükséges változók
		onduty: eventData.duty_level,
		eventtype: eventData.event_type,
		schoolCountry: eventData.School.country_id,
		schoolRegion: eventData.School.region_id,
		isDeletable
	};
};



/*
	delUser: async ({ params, locals }) => {
		const event_id = Number(params.event_id);
		const event = await checkEventAccess(locals, event_id);

		// Ha van gazda (több mint 1) vagy van érdeklődő, nem törölhető
		if (event && (event.User.length > 1 || event.InterestedStudents.length > 0)) {
			return fail(400, { intern: true });
		}

		await db.event.delete({ where: { event_id } });
		throw redirect(303, '/lists/events');
	},*/
