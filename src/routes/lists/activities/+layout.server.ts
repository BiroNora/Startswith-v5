import { error, redirect } from '@sveltejs/kit'
import { db } from '$lib/database'

export async function load({ locals }) {
  if (!locals.user) throw redirect(302, '/auth/login');

  console.log("USER INNEN: ", locals.user)

  const dutySet = new Set<number>();

  // A locals.user.duty tartalmazza a UserDuty[] tömböt
  locals.user.duty.forEach(d => {
    if (d.type === 'SUPERIOR') {
      // Ha Superior (level: 0), akkor minden szintre (1,2,3) kap kulcsot az adott régióban
      if (d.region_id > 0) {
        dutySet.add(Number(`1${d.region_id}`));
        dutySet.add(Number(`2${d.region_id}`));
        dutySet.add(Number(`3${d.region_id}`));
      }
    }
    else if (d.type === 'DIRECTOR' || d.region_id === 0) {
      // Ha Director vagy a régió 0, akkor az adott szinten mindenkié (100, 200, 300)
      if (d.level > 0) {
        dutySet.add(d.level * 100);
      }
    }
    else {
      // Normál USER: Szint + Régió (pl. level: 1, region: 4 -> 14)
      if (d.level > 0 && d.region_id > 0) {
        dutySet.add(Number(`${d.level}${d.region_id}`));
      }
    }
  });

  const keys = Array.from(dutySet).sort((a, b) => a - b);
  console.log("DUTY KEYS: ", keys)
  const finalKeys = [...new Set([
    ...Array.from(dutySet),
    ...(locals.user.allowedLevels || [])
  ])].sort((a, b) => a - b);

  console.log("finalKeys (UNIQUE): ", finalKeys);

  // 2. ADATOK LEKÉRÉSE
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [allActivities, allCMessages] = await Promise.all([
    db.activity.findMany({
      where: { end_date: { gte: today } },
      orderBy: { end_date: 'desc' }
    }),
    db.centralMessage.findMany({
      where: { end_date: { gte: today } },
      orderBy: { end_date: 'desc' }
    })
  ]);

  // 3. SZŰRÉS a legyártott kulcsok alapján
  // Csak azokat hagyjuk meg, amiknek a kódja benne van a júzer kulcsai között
  const activities = allActivities.filter(act =>
    finalKeys.includes(act.duty_level)
  );

  const c_messages = allCMessages.filter((msg) =>
    msg.duty_level.some(code => finalKeys.includes(code))
  );

  return {
    activities,
    c_messages,
    user_id: locals.user.user_id,
    // dutyKeys: keys Opcionális: a frontend is láthatja, mik alapján szűrtünk
  };
};
