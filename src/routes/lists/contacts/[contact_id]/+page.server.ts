import { error, redirect } from '@sveltejs/kit'
import { db } from '$lib/database'
import type { Action, Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user || locals.user.active === false) {
		throw redirect(302, '/auth/login')
	}

	const contact = await db.contact.findUnique({
		where: { contact_id: Number(params.contact_id) }
	})

	if (!contact) {
		throw error(404, 'Contact not found')
	}

	const schools = await db.school.findMany({
		where: { school_id: Number(contact.school_id) },
		orderBy: { school_name: 'asc' }
	})

	return { contact, schools }
}

const contact: Action = async ({ request, params, locals }) => {
	if (!locals.user) {
    throw error(401, 'Nem vagy bejelentkezve');
  }

	const data = await request.formData()
	
	await db.contact.update({
		where: { contact_id: Number(params.contact_id) },
		data: {
			contact_email: String(data.get('contactemail')),
			contact_name: String(data.get('contactname')),
			contact_phone: String(data.get('contactphone')),
			contact_note: String(data.get('contactmessage')),
			active: data.get('active') === 'on', // A checkbox 'on' értéket küld, ha be van pipálva
			active_by: locals.user.name
		}
	})

	throw redirect(303, '../../lists/contacts')
}

export const actions: Actions = { contact }
