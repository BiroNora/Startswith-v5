import { error, fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/database';
import { dutyMap, eventMap, gradeMap, channelMap, statusMap } from '../../../stores/dataStore';
import { checkEventAccess } from '$lib/validation';

export async function load({params, locals}) {
	if (!locals.user || locals.user.active === false) {
		throw redirect(302, '/auth/login');
	}

	const event_id = Number(params.event_id);

	const eventData = await checkEventAccess(locals, event_id);

	if (!eventData) throw error(404, 'Event not found');

	// --- NÉVFORDÍTÁSOK ---
	const eventTypeName = eventMap.find((e) => e.id === eventData.event_type)?.name || eventData.event_type;
	const dutyName = dutyMap.find((d) => d.id === eventData.on_duty)?.name || eventData.on_duty;

	const formattedInters = eventData.InterestedStudents.map((ints) => ({
		...ints,
		grade_name: gradeMap.find((g) => g.id === ints.grade)?.name || ints.grade,
		channel_name: channelMap.find((c) => c.id === ints.channel)?.name || ints.channel,
		status_name: statusMap.find((s) => s.id === ints.status)?.name || ints.status
	}));

	const [countries, regions] = await Promise.all([
		db.country.findMany(),
		db.region.findMany({ orderBy: { region_name: 'asc' } })
	]);

	return {
		event: eventData,
		school: eventData.School,
		cityname: eventData.School.city.city_name,
		inters: formattedInters,
		countries,
		regions,
		eventTypeName,
		dutyName,
		// Svelte bind:value-hoz és hibaellenőrzéshez szükséges változók
		onduty: eventData.on_duty,
		eventtype: eventData.event_type,
		schoolCountry: eventData.School.country_id,
		schoolRegion: eventData.School.region_id
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
	},

	delInterest: async ({ request, locals }) => {
		const data = await request.formData();
		const intrest_id = Number(data.get('int_id'));
		const event_id = Number(data.get('event_id'));

		const event = await checkEventAccess(locals, event_id);

		const belongsToEvent = event.InterestedStudents.some(
      (s) => s.intrest_id === intrest_id
    );

    if (!belongsToEvent) {
      return fail(403, { interest: true, message: "Ez az adat nem ehhez az eseményhez tartozik." });
    }

		try {
			await db.interestedStudents.delete({ where: { intrest_id } });
			return { success: true, interest: false };
		} catch (e) {
			return fail(400, { interest: true });
		}
	}
}; */
