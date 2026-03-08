import { db } from '$lib/database'
import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from "./$types"
import nodemailer from 'nodemailer'

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) {
    throw redirect(302, '/auth/login')
  }
}

export const actions: Actions = {
  forgot: async ({ request }) => {
    const data = await request.formData()
    const userEmail = String(data.get('email'))

    const user = await db.user.findUnique({
      where: { user_email: userEmail }
    })

    if (!user) {
      return fail(400, { credentials: true })
    }

    // Generate a unique token for password reset
    const resetToken = crypto.randomUUID()

    // Store the token and associate it with the user in your database
    await db.user.update({
      where: { user_email: userEmail },
      data: {
        resetToken: resetToken,
        resetTokenExpiry: new Date(Date.now() + 300000), // Token expiry in 5 min
      }
    })

    // Send a password reset email with the link containing the resetToken
    const resetLink = `http://localhost:5173/auth/reset-password?${resetToken}`


    // Use this transporter for sending emails
    const transporter = nodemailer.createTransport({
      host: 'localhost',
      port: 1025, // The default MailHog SMTP port
      secure: false, // Use SSL, false for TLS
    })

    try {
      await transporter.sendMail({
        from: 'startswith@stsw.com',
        to: userEmail,
        subject: 'Password Reset',
        text: `Kattints a linkre a jelszó visszaállításához: ${resetLink}`,
      })
      return { sent: true }
    } catch (error) {
      return fail(500, { emailError: true })
    }
  }
}
