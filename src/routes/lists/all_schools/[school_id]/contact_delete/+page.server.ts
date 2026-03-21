import { db } from "$lib/database"
import { fail, redirect } from "@sveltejs/kit"
import type { Actions } from "./$types"

export const actions: Actions = {
	schoolUD: async ({ request, params }) => {
		const sc_id = Number(params.school_id)
		const data = await request.formData()
		const email = String(data.get('email'))

		const user = await db.user.findUnique({
			where: { user_email: email },
			select: { user_id: true }
		});

		if (!user) return fail(400, { user: false, alreadycontact: false })

		const school = await db.school.findFirst({
			where: {
				school_id: sc_id,
				User: { some: { user_id: user.user_id } }
			}
		});

		if (!school) {
			// Ha létezik a user, de nincs ehhez az iskolához kötve
			return fail(400, { user: true, alreadycontact: false });
		}

		await db.school.update({
			where: { school_id: sc_id },
			data: {
				User: {
					disconnect: { user_id: user.user_id }
				}
			}
		})

		throw redirect(303, `/lists/all_schools/${params.school_id}`);
	}
}
