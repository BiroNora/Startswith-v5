import { db } from "$lib/database"
import { redirect } from "@sveltejs/kit"
import type { Actions } from "./$types"

export const actions: Actions = {
  activity: async ({ request, locals }) => {
    const data = await request.formData()
    const end_date = new Date(String(data.get('meeting-time')));
    const my_id = String(data.get('user_id'));
    console.log("locals.user: ", locals.user)

    await db.activity.create({
      data: {
        end_date,
        act_name: String(data.get('fantasy')),
        act_note: String(data.get('message')),
        duty_level: Number(String(data.get('duty')) + data.get('region')),
        duty_num: Number(data.get('duty')),
        region_num: Number(data.get('region')),
        user_id: my_id
      }
    });

    throw redirect(303, '/lists/activities');
  }}
