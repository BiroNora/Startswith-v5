import { error, redirect } from '@sveltejs/kit';
import { db } from '$lib/database';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user || locals.user.active === false) {
    throw redirect(302, '/auth/login');
  }

  const [users, regions] = await Promise.all([
    db.user.findMany({
      where: { active: true }, // Már itt szűrhetünk az aktívakra
      orderBy: { user_name: 'asc' }
    }),
    db.region.findMany()
  ]);

  if (!users || !regions) {
    throw error(404, 'Data not found');
  }

  return { users, regions };
};
