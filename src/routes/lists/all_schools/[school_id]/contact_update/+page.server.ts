import { db } from '$lib/server/database';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	schoolU: async ({ request, params }) => {
		const sc_id = Number(params.school_id);
		const data = await request.formData();
		const email = String(data.get('email'));

		const user = await db.user.findUnique({
			where: { user_email: email },
			select: { user_id: true } // Csak az ID kell nekünk!
		});

		if (!user) return fail(400, { usercontact: true });

		const alreadyExists = await db.school.findFirst({
			where: {
				school_id: sc_id,
				User: {
					some: { user_id: user.user_id }
				}
			}
		});

		if (alreadyExists) return fail(400, { alreadycontact: true });

		await db.school.update({
			where: { school_id: sc_id },
			data: { User: { connect: { user_id: user.user_id } } }
		});

		throw redirect(303, `/lists/all_schools/${params.school_id}`);
	}
};
