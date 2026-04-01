import { db } from '$lib/database';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url }) => {
  const email = url.searchParams.get('email');
  if (!email) return { foundUser: null };

  const user = await db.user.findUnique({
    where: { user_email: email },
    include: { user_duties: true }
  });

  return {
    foundUser: user ? {
      user_id: user.user_id,
      name: user.user_name,
      email: user.user_email,
      duties: user.user_duties || []
    } : null
  };
};
