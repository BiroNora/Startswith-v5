import { db } from '$lib/server/database';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { generateDutyCodes, isAllowed } from '../../stores/dataStore';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user || (!locals.user.isDirector && !locals.user.isSuperior))
		throw redirect(302, '/auth/login');

	return locals.user;
};

export const actions: Actions = {
	user_active_change: async ({ request, locals }) => {
		if (!locals.user?.email) throw redirect(302, '/auth/login');

		const formData = await request.formData();
		const targetEmail = String(formData.get('email'));

		const targetUser = await db.user.findUnique({
			where: { user_email: targetEmail },
			select: { active: true, user_duties: true }
		});

		if (!targetUser) {
			return fail(404, { userNotFound: true });
		}

		const targetUserDuties = generateDutyCodes(targetUser?.user_duties);
		const userDuties = generateDutyCodes(locals.user.duty);
		const hasPermission = targetUserDuties.some((tDuty) => isAllowed(userDuties, tDuty));

		if (!hasPermission)
			return fail(403, {
				unauthorized: true,
				message: 'Nincs jogosultsága a felhasználó módosításához.'
			});

		const sessionUserNum = locals.user.serial;

		console.log('targetUserDuties: ', targetUserDuties);
		console.log('userDuties: ', userDuties);
		console.log('common: ', hasPermission);
		try {
			const updatedUser = await db.user.update({
				where: { user_email: targetEmail },
				data: {
					active: !targetUser.active,
					active_by: sessionUserNum
				}
			});

			return {
				success: true,
				newStatus: updatedUser.active,
				email: targetEmail
			};
		} catch (err) {
			console.error('Adatbázis hiba:', err);
			return fail(500, { dbError: true });
		}
	}
};
