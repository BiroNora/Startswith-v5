import { db } from '$lib/server/database';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	activity: async ({ request, locals }) => {
		const data = await request.formData();
		const end_date = new Date(String(data.get('meeting-time')));
		const my_id = String(data.get('user_id'));
		const level = Number(data.get('duty'));
		const region = Number(data.get('region'));
		const duty_level = level * 100 + region;

		await db.activity.create({
			data: {
				end_date,
				act_name: String(data.get('fantasy')),
				act_note: String(data.get('message')),
				duty_level: duty_level,
				user_id: my_id
			}
		});

		throw redirect(303, '/lists/activities');
	}
};
