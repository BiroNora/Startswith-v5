import { db } from "$lib/database"
import { error, redirect } from "@sveltejs/kit"
import type { Actions } from "./$types"

export const actions: Actions = {
  dir_message: async ({ request, locals }) => {
    const formData = await request.formData();
    console.log("locals.user: ", locals.user)
    console.log("Minden beérkező adat:", Object.fromEntries(formData));

    const my_id = String(formData.get('user_id'));

    const userDuty = locals.user?.duty;
    if (!userDuty || userDuty.length < 5) {
      throw error(403, 'Unauthorized: Missing director rights');
    }

    // Segédfüggvény a szintek kódolásához
    const getLevelCode = (levelName: string, regKey: string) => {
      if (!formData.has(levelName)) return null;

      const selection = formData.get(regKey);

      return selection ? Number(selection) : null;
    };

    const on_duty = [
      getLevelCode('basic', 'regB') ?? 0,
      getLevelCode('medior', 'regM') ?? 0,
      getLevelCode('high', 'regH') ?? 0
    ];

    await db.centralMessage.create({
      data: {
        end_date: new Date(String(formData.get('meeting-time'))),
        cm_name: String(formData.get('memo')),
        cm_note: String(formData.get('message')),
        duty_level: on_duty,
        user_id: my_id
      }
    });
    throw redirect(302, '/lists/activities?success=true');
  }
}
