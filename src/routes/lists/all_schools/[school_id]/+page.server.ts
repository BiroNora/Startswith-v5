import { error, fail, redirect } from '@sveltejs/kit'
import { db } from '$lib/database.js'
import { eventMap, dutyMap, schType, duType, getName } from '../../../stores/dataStore.js'
import type { Actions } from './$types'

export async function load({ params, locals }) {
	if (!locals.user || locals.user.active === false) {
		throw redirect(302, '/auth/login')
	}

	const sc_id = Number(params.school_id)

	const school = await db.school.findUnique({
		where: { school_id: sc_id },
		include: {
			User: true,
			city: true,
			region: true,
			county: true,
			country: true
		}
	})

	if (!school) throw error(404, 'School not found')

	const resS = school.school_type
		.map(id => schType[Number(id) - 1])
		.filter(Boolean)
		.join(', ')

	const resD = school.duty
		.map(id => duType[Number(id) - 1])
		.filter(Boolean)
		.join(', ')

	// 3. Kapcsolatok és Események
	const contact = await db.contact.findMany({
		where: { school_id: sc_id },
		orderBy: { contact_id: 'desc' }
	})

	const rawEvents = await db.event.findMany({
		where: { school_id: sc_id },
		orderBy: { closing_date: 'desc' }
	})

	// 4. Események formázása a getName-el
	const event = rawEvents.map(obj => ({
		...obj,
		on_duty_name: getName(dutyMap, obj.on_duty),
		event_type_name: getName(eventMap, obj.event_type)
	}))

	return {
		school,
		resS,
		resD,
		contact,
		event,
		internalContacts: school.User,
		externalContacts: contact,
	}
}

export const actions: Actions = {
	schoolU: async ({ request, params }) => {
		const sc_id = Number(params.school_id)
		const data = await request.formData()
		const email = String(data.get('email'))

		const user = await db.user.findUnique({
			where: { user_email: email },
			select: { user_id: true } // Csak az ID kell nekünk!
		});

		if (!user) return fail(400, { usercontact: true })

		const alreadyExists = await db.school.findFirst({
			where: {
				school_id: sc_id,
				User: {
					some: { user_id: user.user_id }
				}
			}
		})

		if (alreadyExists) return fail(400, { alreadycontact: true })

		const contactresult = await db.school.update({
			where: { school_id: sc_id },
			data: { User: { connect: { user_id: user.user_id } } }
		})
		return { contactresult }
	},

	schoolUD: async ({ request, params }) => {
		const sc_id = Number(params.school_id)
		const data = await request.formData()
		const email = String(data.get('email'))

		const user = await db.user.findUnique({ where: { user_email: email }, select: { user_id: true } })
		if (!user) return fail(400, { user: true })

		const result = await db.school.update({
			where: { school_id: sc_id },
			data: { User: { disconnect: { user_id: user.user_id } } }
		})
		return { result }
	}
}
