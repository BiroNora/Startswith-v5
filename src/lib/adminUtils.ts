// src/lib/adminUtils.ts
import { db } from '$lib/database';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'node:crypto';

export const getValidatedUser = async (formData: FormData) => {
  const email = String(formData.get('email') || '').trim().toLowerCase();
  if (!email || !email.includes('@')) return { email: null, user: null, error: "Érvénytelen email!" };

  const user = await db.user.findUnique({ where: { user_email: email } });
  return { email, user };
};

export const generateSecurePassword = async () => {
  const newPass = randomBytes(4).toString('hex');
  const passwordHash = await bcrypt.hash(newPass, 10);
  return { newPass, passwordHash };
};
