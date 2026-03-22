import { db } from "$lib/database"
import { fail, redirect } from "@sveltejs/kit"
import type { Actions } from "./$types"
import { checkEventAccess } from "$lib/validation";

export const actions: Actions = {
  event: async ({ request, params, locals }) => {
    const event_id = Number(params.event_id);
    await checkEventAccess(locals, event_id);

    const data = await request.formData();
    const event_name = String(data.get('fantasy'));
    const date = new Date(String(data.get('meeting-time')));

    // Frontend elvárás: hiba esetén title: true ÉS a többi kulcs defaultja
    if (event_name.length < 10) return fail(400, { title: true, success: false });

    await db.event.update({
      where: { event_id },
      data: {
        event_name,
        closing_date: date,
        event_year: date.getFullYear(),
        semester: date.getMonth() + 1 >= 3 && date.getMonth() + 1 <= 9 ? 'SPRING' : 'FALL',
        on_duty: String(data.get('duty')),
        event_type: String(data.get('type')),
        estimated_student: Number(data.get('estimate')),
        note: String(data.get('message'))
      }
    });
    
    throw redirect(303, `/lists/events/${params.event_id}`);
  }
}
