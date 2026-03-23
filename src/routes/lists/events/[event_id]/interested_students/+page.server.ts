import { db } from "$lib/database"
import { fail, redirect } from "@sveltejs/kit"
import type { Actions } from "./$types"
import { checkEventAccess } from "$lib/validation";

export const actions: Actions = {
  interested: async ({ request, params, locals }) => {
    const event_id = Number(params.event_id);
    await checkEventAccess(locals, event_id);

    const data = await request.formData();
    const applied = data.get('apply') !== 'true';

    try {
      await db.interestedStudents.create({
        data: {
          event_id,
          intrest_count: Number(data.get('number')),
          grade: String(data.get('grade')),
          applied,
          work_title: !applied || data.get('subject') === 'null' ? '0' : String(data.get('subject')),
          channel: String(data.get('channel')),
          status: !applied || data.get('status') === 'null' ? '0' : String(data.get('status')),
          country_id: Number(data.get('country')),
          region_id: Number(data.get('connect'))
        }
      });
    } catch (e) {
      console.error(e);
      return fail(400, { interest: true });
    }
    throw redirect(303, `/lists/events/${params.event_id}`);
  }
}
