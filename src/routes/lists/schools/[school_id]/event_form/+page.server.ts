import { db } from "$lib/database"
import { fail, redirect } from "@sveltejs/kit"
import { dateSlugify, SEMESTERS, slugify } from "../../../../stores/dataStore"
import type { Actions } from "./$types"

export const actions: Actions = {
  event_form: async ({ request, params, locals }) => {
    if (!locals.user) return fail(401)
      
    const schoolId = Number(params.school_id)
    const data = await request.formData()

    const event_name = String(data.get('fantasy'))
    const duty_level = Number(data.get('duty'))
    const event_type = Number(data.get('type'))
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
    const semester = month >= 3 && month <= 9 ? 1 : 2;

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
        duty_level,
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
    throw redirect(303, '../../../lists/events')
  }
}
