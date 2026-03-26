import { db } from "$lib/database"
import { error, redirect } from "@sveltejs/kit"
import type { Actions } from "./$types"

export const actions: Actions = {
  dir_message: async ({ request, locals }) => {
    const data = await request.formData();
    const reg = String(data.get('region'));
    const my_id = String(data.get('user_id'));


    const userDuty = locals.user?.duty;
    if (!userDuty || userDuty.length < 5) {
      throw error(403, 'Unauthorized: Missing director rights');
    }

    // dir_duty kiszámítása az akción belül
    const dir_num = userDuty[4];
    let on_duty = String(dir_num % 10);

    let all_region = false;
    if (reg === 'ALL') {
      on_duty += '0';
      all_region = true;
    } else {
      on_duty += reg;
    }

    await db.activity.create({
      data: {
        end_date: new Date(String(data.get('meeting-time'))),
        act_name: String(data.get('message')),
        on_duty,
        dir_flag: true,
        all_region,
        user_id: my_id
      }
    });
    throw redirect(303, '/lists/activities');
  }
}
