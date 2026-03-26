import { db } from "$lib/database"
import { redirect } from "@sveltejs/kit"
import type { Actions } from "./$types"

export const actions: Actions = {
  activity: async ({ request }) => {
    const data = await request.formData()
    const end_date = new Date(String(data.get('meeting-time')));
    const my_id = String(data.get('user_id'));

    await db.activity.create({
      data: {
        end_date,
        act_name: String(data.get('fantasy')),
        act_note: String(data.get('message')),
        on_duty: String(data.get('duty')) + data.get('region'),
        dir_flag: false,
        all_region: false,
        user_id: my_id
      }
    });

    throw redirect(303, '/lists/activities');
  }}
