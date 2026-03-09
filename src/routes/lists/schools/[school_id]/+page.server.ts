import { error, fail, redirect } from '@sveltejs/kit'
import { db } from '$lib/database.js'
import {
	eventMap,
	dutyMap,
	schType,
	duType,
	dateSlugify,
	slugify,
	dutyType,
	schoolType
} from '../../../stores/dataStore.js'
import type { Action, Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user || locals.user.active === false) throw redirect(302, '/auth/login')

	const schoolId = Number(params.school_id)

	const [school, contacts, events] = await Promise.all([
		db.school.findUnique({
			where: { school_id: schoolId },
			include: { city: true, region: true, county: true, country: true }
		}),
		db.contact.findMany({ where: { school_id: schoolId }, orderBy: { contact_id: 'desc' } }),
		db.event.findMany({ where: { school_id: schoolId }, orderBy: { closing_date: 'desc' } })
	])

	if (!school) throw error(404, 'School not found')

	const resS = schType.filter((_, i) => school.school_type.includes(String(i + 1))).join(', ')
	const resD = duType.filter((_, i) => school.duty.includes(String(i + 1))).join(', ')

	const mappedEvents = events.map(obj => ({
		...obj,
		on_duty: dutyMap.find(d => d.id === obj.on_duty)?.name || obj.on_duty,
		event_type: eventMap.find(e => e.id === obj.event_type)?.name || obj.event_type
	}))

	return {
		school,
		resS,
		resD,
		contact: contacts,
		event: mappedEvents,
		city: school.city,
		region: school.region,
		county: school.county,
		country: school.country
	}
}

export const actions: Actions = {
	event: async ({ request, params, locals }) => {
		if (!locals.user) return fail(401)
		const schoolId = Number(params.school_id)
		const data = await request.formData()

		const event_name = String(data.get('fantasy'))
		const on_duty = String(data.get('duty'))
		const event_type = String(data.get('type'))
		const estimated_student = Number(data.get('estimate'))
		const note = String(data.get('message'))

		if (event_name.length < 10) return fail(400, { errors: true })

		//const school_name = 'Eventus Üzleti, Művészeti Szakgimnázium, Technikum, Gimnázium, Szakképző Iskola, Alapfokú Művészeti Iskola és Kollégium'
		//const city_name = 'Egerszalók'
		const school = await db.school.findUnique({
			where: { school_id: schoolId },
			include: { city: true }
		})
		if (!school) return fail(400, { errors: true })

		const clos_date_entry = data.get('meeting-time');

		// Ha kötelező mező, érdemes rögtön hibaágat nyitni, ha null
		if (!clos_date_entry) return fail(400, { errors: true });

		const clos_date = String(clos_date_entry);
		const date = new Date(clos_date);
		const slugDate = dateSlugify(clos_date);
		const event_year = date.getFullYear()
		const month = date.getMonth() + 1
		const semester = month >= 3 && month <= 9 ? 'SPRING' : 'FALL'

		const cn = slugify(school.city.city_name.slice(0, 12))
		const sn = slugify(school.school_name.slice(0, 12))
		const se = slugify(event_name.slice(0, 12))
		const slug = `${slugDate}-${cn}-${se}-${sn}`

		const uniqueSlug = await db.event.findUnique({ where: { slug } })
		if (uniqueSlug) return fail(400, { errors: true })

		await db.event.create({
			data: {
				event_name,
				closing_date: date,
				event_year,
				semester,
				on_duty,
				event_type,
				estimated_student,
				note,
				slug,
				School: {
					connect: {
						school_id: schoolId
					}
				},
				User: {
					connect: {
						user_email: locals.user.email
					}
				}
			}
		})
		throw redirect(303, '../../lists/events')
	},

	contact: async ({ request, params, locals }) => {
		if (!locals.user) throw redirect(302, '/auth/login')

		const schoolId = Number(params.school_id)
		const data = await request.formData()

		const contact_name = String(data.get('contactname'))
		const contact_email = String(data.get('contactemail'))
		const contact_phone = String(data.get('contactphone'))
		const contact_note = String(data.get('contactmessage'))

		const existingContact = await db.contact.findUnique({ where: { contact_email } })
		if (existingContact) return fail(400, { errors: true })


		await db.contact.create({
			data: {
				contact_email,
				contact_name,
				contact_phone,
				contact_note,
				active: true,
				active_by: locals.user.name || locals.user.email,
				User: {
					connect: {
						user_email: locals.user.email
					}
				},
				School: {
					connect: {
						school_id: schoolId
					}
				}
			}
		})

		throw redirect(303, '../../lists/contacts')
	},

	school: async ({ request, params, locals }) => {
		if (!locals.user) throw redirect(302, '/auth/login')

		const schoolId = Number(params.school_id)
		const data = await request.formData()

		// Típusok és szintek összeszedése
		const school_type: string[] = []
		const duty: string[] = []

		schoolType.forEach((type, index) => {
			if (data.get(`isk${String.fromCharCode(65 + index)}`)) {
				school_type.push(type[0])
			}
		})

		if (data.get('bas')) duty.push(dutyType[0][0])
		if (data.get('med')) duty.push(dutyType[1][0])
		if (data.get('hig')) duty.push(dutyType[2][0])

		await db.school.update({
			where: { school_id: schoolId },
			data: {
				school_name: String(data.get('name')),
				zip_code: String(data.get('zip')),
				address: String(data.get('address')),
				dir_name: String(data.get('dirname')),
				dir_phone: String(data.get('dirphone')),
				school_email: String(data.get('email')),
				website: String(data.get('website')) || null,
				school_type,
				duty,
				coop: Boolean(data.get('coop')),
				active: Boolean(data.get('active')),
				note: String(data.get('note')),
				active_by: locals.user.name || locals.user.email,
				basic: Boolean(data.get('bas')),
				medior: Boolean(data.get('med')),
				high: Boolean(data.get('hig'))
			}
		})

		throw redirect(303, '../../lists/schools')
	}
}
