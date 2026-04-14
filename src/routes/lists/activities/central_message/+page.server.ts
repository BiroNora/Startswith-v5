import { db } from '$lib/server/database';
import { error, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	dir_message: async ({ request, locals }) => {
		const formData = await request.formData();
		const my_id = String(formData.get('user_id'));

		const userDuty = locals.user?.duty;
		if (!userDuty || userDuty.length < 5) {
			throw error(403, 'Unauthorized: Missing director rights');
		}

		// Segédfüggvény a szintek kódolásához
		const getLevelCode = (levelNum: number, regKey: string) => {
			const selection = formData.get(regKey);
			if (selection === null || selection === '') return 0;

			const regionId = Number(selection);
			// Matematikai kódolás: szint * 100 + régió
			// Ha a régió 0 (All regions), akkor kerek 100, 200 vagy 300 lesz
			return levelNum * 100 + regionId;
		};

		// +page.server.ts - javasolt szerkezet az on_duty-hoz:
		const on_duty = [];
		if (formData.has('basic')) on_duty.push(getLevelCode(1, 'regB'));
		if (formData.has('medior')) on_duty.push(getLevelCode(2, 'regM'));
		if (formData.has('high')) on_duty.push(getLevelCode(3, 'regH'));

		await db.centralMessage.create({
			data: {
				end_date: new Date(String(formData.get('meeting-time'))),
				cm_name: String(formData.get('memo')),
				cm_note: String(formData.get('message')),
				duty_level: on_duty,
				user_id: my_id
			}
		});
		throw redirect(302, '/lists/activities?success=true');
	}
};
