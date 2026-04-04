import { db } from "$lib/database"
import { fail, redirect } from "@sveltejs/kit"
import type { Actions } from "./$types"

export const actions: Actions = {
  contact_form: async ({ request, params, locals }) => {
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
        active_by: locals.user.serial,
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

    throw redirect(303, '../../../lists/contacts')
  }
}
