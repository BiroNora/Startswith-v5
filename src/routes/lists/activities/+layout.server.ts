import { error, redirect } from '@sveltejs/kit'
import { db } from '$lib/database'

export async function load({locals}) {
  // 1. Jogosultság ellenőrzése
  if (!locals.user || locals.user.active === false) throw redirect(302, '/auth/login');

  const today = new Date()
  today.setDate(today.getDate() - 1)

  // 2. Változók kiszámítása (függvényen belül!)
  const user_id = locals.user.user_id;
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

  const [activities, regions, city] = await Promise.all([
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
    regions,
    city,
    user_id,
    user_duty,
    dir_flag,
    dir_duty,
    is_director
  };
};

/* export const actions: Actions = {
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


} */
