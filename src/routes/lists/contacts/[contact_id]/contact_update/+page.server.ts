import { error, redirect } from '@sveltejs/kit'
import { db } from '$lib/database'
import type { Actions } from './$types'


export const actions: Actions = {
  contact: async ({ request, params, locals }) => {
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
        active_by: locals.user.serial
      }
    })
    throw redirect(303, `/lists/contacts/${params.contact_id}`);
  }
}
