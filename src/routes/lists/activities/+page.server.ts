import { error, redirect } from '@sveltejs/kit'
import { db } from '$lib/database'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
  // 1. Jogosultság ellenőrzése
  if (!locals.user || locals.user.active === false) throw redirect(302, '/auth/login');

  const today = new Date()
  today.setDate(today.getDate() - 1)

  // 2. Változók kiszámítása (függvényen belül!)
  const user_duty = locals.user.duty;
  const dir_num = user_duty[4] ?? 0;

  // Alapértelmezett értékek
  let dir_duty = "";
  if (dir_num > 50) {
    dir_duty = String(dir_num % 10); // BAS, MED, HIGH
  }

  const is_director = dir_num % 10 !== 0;
  const dir_flag = is_director;

  // 3. Adatbázis lekérések
  today.setHours(0, 0, 0, 0); // Ma éjféltől nézzük a lejáratot

  const [activities, regio, city] = await Promise.all([
    db.activity.findMany({
      where: { end_date: { gte: today } },
      orderBy: { end_date: 'desc' }
    }),
    db.region.findMany({
      select: { region_id: true, region_name: true },
      orderBy: { region_name: 'asc' }
    }),
    db.city.findMany({})
  ]);

  if (!activities) {
    throw error(404, 'Program not found');
  }

  return {
    activities,
    regio,
    city,
    user_duty,
    dir_flag,
    dir_duty,
    is_director
  };
};

export const actions: Actions = {
  activity: async ({ request }) => {
    const data = await request.formData()
    const end_date = new Date(String(data.get('meeting-time')));

    await db.activity.create({
      data: {
        end_date,
        act_name: String(data.get('fantasy')),
        act_note: String(data.get('message')),
        on_duty: String(data.get('duty')) + data.get('region'),
        dir_flag: false,
        all_region: false
      }
    });

    throw redirect(303, '/lists/activities'); // Használj abszolút utat
  },

  delAct: async ({ request }) => {
    const data = await request.formData();
    const act_id = Number(data.get('actid'));

    if (!act_id) throw error(400, 'Invalid Activity ID');

    await db.activity.delete({
      where: { act_id: act_id }
    });

    throw redirect(303, '/lists/activities');
  },

  dir_message: async ({ request, locals }) => {
    const data = await request.formData();
    const reg = String(data.get('region'));

    const userDuty = locals.user?.duty;
    if (!userDuty || userDuty.length < 5) {
      throw error(403, 'Unauthorized: Missing director rights');
    }

    // dir_duty kiszámítása az akción belül is kell, mert a globális változó törölve lett
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
        act_name: String(data.get('dir_message')),
        on_duty,
        dir_flag: true,
        all_region
      }
    });
    throw redirect(303, '/lists/activities');
  }
}
