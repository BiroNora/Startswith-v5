import { error, redirect } from "@sveltejs/kit"
import { db } from "$lib/database"

export async function load({ params, locals }) {
  if (!locals.user) {
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
