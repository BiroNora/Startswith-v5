import { error, fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/database';
import { dutyMap, eventMap, gradeMap, channelMap, statusMap } from '../../../stores/dataStore';
import type { Actions, PageServerLoad } from './$types';
import { checkEventAccess } from '$lib/validation';

export const load: PageServerLoad = async ({ params, locals }) => {
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

export const actions: Actions = {
	interested: async ({ request, params, locals }) => {
		const event_id = Number(params.event_id);
		await checkEventAccess(locals, event_id);

		const data = await request.formData();
		const applied = data.get('apply') !== 'true';

		try {
			await db.interestedStudents.create({
				data: {
					event_id,
					intrest_count: Number(data.get('number')),
					grade: String(data.get('grade')),
					applied,
					work_title: !applied || data.get('subject') === 'null' ? '0' : String(data.get('subject')),
					channel: String(data.get('channel')),
					status: !applied || data.get('status') === 'null' ? '0' : String(data.get('status')),
					country_id: Number(data.get('country')),
					region_id: Number(data.get('connect'))
				}
			});
			return { success: true };
		} catch (e) {
			return fail(400, { interest: true });
		}
	},

	event: async ({ request, params, locals }) => {
		const event_id = Number(params.event_id);
		await checkEventAccess(locals, event_id);

		const data = await request.formData();
		const event_name = String(data.get('fantasy'));
		const date = new Date(String(data.get('meeting-time')));

		// Frontend elvárás: hiba esetén title: true ÉS a többi kulcs defaultja
		if (event_name.length < 10) return fail(400, { title: true, success: false });

		await db.event.update({
			where: { event_id },
			data: {
				event_name,
				closing_date: date,
				event_year: date.getFullYear(),
				semester: date.getMonth() + 1 >= 3 && date.getMonth() + 1 <= 9 ? 'SPRING' : 'FALL',
				on_duty: String(data.get('duty')),
				event_type: String(data.get('type')),
				estimated_student: Number(data.get('estimate')),
				note: String(data.get('message'))
			}
		});
		return { success: true };
	},

	eventU: async ({ request, params, locals }) => {
		const event_id = Number(params.event_id);
		const event = await checkEventAccess(locals, event_id);

		const data = await request.formData();
		const email = String(data.get('email'));

		const targetUser = await db.user.findUnique({
      where: { user_email: email },
      select: { user_id: true }
    });
    if (!targetUser) return fail(400, { userevent: true, alreadyevent: false });

		if (event.User.some(u => u.user_id === targetUser.user_id)) {
      return fail(400, { alreadyevent: true, userevent: false });
    }

		await db.event.update({
			where: { event_id },
			data: { User: { connect: { user_id: targetUser.user_id } } }
		});
		return { eventresult: true, userevent: false, alreadyevent: false };
	},

	eventUD: async ({ request, params, locals }) => {
		const event_id = Number(params.event_id);
		const event = await checkEventAccess(locals, event_id);

		const data = await request.formData();
		const email = String(data.get('email'));

		const targetUser = await db.user.findUnique({
      where: { user_email: email },
      select: { user_id: true }
    });
    if (!targetUser) return fail(400, { user: true, already: false });

		if (!event.User.some(u => u.user_id === targetUser.user_id)) {
      return fail(400, { already: true, user: false });
    }

		await db.event.update({
			where: { event_id },
			data: { User: { disconnect: { user_id: targetUser.user_id } } }
		});
		return { result: true, user: false, already: false };
	},

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
};
