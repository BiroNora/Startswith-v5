import { error, redirect } from '@sveltejs/kit';
import { db } from '$lib/database';
import { isAllowed, generateDutyCodes } from '../../stores/dataStore';

export async function load({ locals }) {
  if (!locals.user) throw redirect(302, '/auth/login');
  console.log("USER USER. ", locals.user)

  const finalKeys = generateDutyCodes(locals.user.duty || []);

  console.log("Generált finalKeys: ", finalKeys);

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

  const activities = allActivities.filter((act) =>
    isAllowed(finalKeys, act.duty_level)
  );

  const c_messages = allCMessages.filter((msg) =>
    msg.duty_level.some((code) => isAllowed(finalKeys, code))
  );

  return {
    activities,
    c_messages,
    user_id: locals.user.user_id,
    user: locals.user,
    finalKeys
  };
}
