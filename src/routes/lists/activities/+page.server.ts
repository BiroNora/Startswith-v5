import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db } from '$lib/server/database';

export const actions: Actions = {
	delAct: async ({ request, locals }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));
		const type = data.get('item_type');
		const user = locals.user;

		if (!id || isNaN(id)) throw error(400, 'Érvénytelen azonosító');
		if (!user) throw error(401, 'Bejelentkezés szükséges');

		const isActivity = type === 'act';
		const model = isActivity ? db.activity : db.centralMessage;
		const whereClause = isActivity ? { act_id: id } : { cm_id: id };

		try {
			const item = await (model as any).findUnique({ where: whereClause });

			if (!item || item.user_id !== user.user_id) {
				return fail(403, { message: 'Nincs jogosultságod a törléshez!' });
			}

			await (model as any).delete({ where: whereClause });
		} catch (err) {
			if (err instanceof Response) throw err;

			console.error('Törlési hiba:', err);
			return fail(500, { error: true, message: 'Hiba a törlés során.' });
		}

		throw redirect(303, '/lists/activities');
	}
};
