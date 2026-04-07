import { error, redirect } from '@sveltejs/kit';
import { db } from '$lib/database';

export async function load({ locals }) {
  if (!locals.user) throw redirect(302, '/auth/login');

  const dutySet = new Set<number>();

  const userDuties = locals.user.duty || [];

  userDuties.forEach((d) => {
    if (d.type === 'SUPERIOR') {
      if (d.region_id > 0) {
        dutySet.add(Number(`1${d.region_id}`));
        dutySet.add(Number(`2${d.region_id}`));
        dutySet.add(Number(`3${d.region_id}`));
      }
    } else if (d.type === 'DIRECTOR' || d.region_id === 0) {
      if (d.level > 0) {
        dutySet.add(d.level * 100);
      }
    } else {
      if (d.level > 0 && d.region_id > 0) {
        dutySet.add(Number(`${d.level}${d.region_id}`));
      }
    }
  });

  const allowedLevels = Array.from(
    new Set(
      Array.from(dutySet).map((k) => {
        if (k >= 100) return Math.floor(k / 100);
        return Math.floor(k / 10);
      })
    )
  );

  const finalKeys = Array.from(dutySet);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [allActivities, allCMessages] = await Promise.all([
    db.activity.findMany({
      where: { end_date: { gte: today } },
      orderBy: { end_date: 'desc' },
    }),
    db.centralMessage.findMany({
      where: { end_date: { gte: today } },
      orderBy: { end_date: 'desc' },
    }),
  ]);

  const activities = allActivities.filter((act) => finalKeys.includes(act.duty_level));
  const c_messages = allCMessages.filter((msg) =>
    msg.duty_level.some((code) => finalKeys.includes(code))
  );

  return {
    activities,
    c_messages,
    user_id: locals.user.user_id,
    allowedLevels,
    user: locals.user
  };
}
