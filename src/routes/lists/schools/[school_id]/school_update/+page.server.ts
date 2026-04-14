import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db } from '$lib/server/database';

export const load = async ({ parent }) => {
	return await parent();
};

export const actions: Actions = {
	school: async ({ request, params, locals }) => {
		if (!locals.user) throw redirect(302, '/auth/login');

		const schoolId = Number(params.school_id);

		const formData = await request.formData();
		const schoolTypes = formData.getAll('schoolTypeIds').map((id) => Number(id));
		const dutyLevels = formData.getAll('dutyLevelIds').map((id) => Number(id));

		await db.school.update({
			where: { school_id: schoolId },
			data: {
				school_name: String(formData.get('name')),
				zip_code: String(formData.get('zip')),
				address: String(formData.get('address')),
				dir_name: String(formData.get('dirname')),
				dir_phone: String(formData.get('dirphone')),
				school_email: String(formData.get('email')),
				website: String(formData.get('website')) || null,
				school_type: schoolTypes,
				duty_levels: dutyLevels,
				coop: formData.has('coop'), // Ha benne van a formban, akkor true, ha nincs, false
				active: formData.has('active'),
				note: String(formData.get('note')),
				active_by: locals.user.serial
			}
		});

		throw redirect(303, '../../../lists/schools');
	}
};
