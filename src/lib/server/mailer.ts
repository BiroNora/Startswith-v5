import nodemailer from 'nodemailer';

// Ez a konfiguráció a Dockerben futó MailHoghoz csatlakozik
export const transporter = nodemailer.createTransport({
  host: 'localhost',
  port: 1025,
  secure: false, // MailHog nem használ SSL-t
  auth: {
    user: 'any-user', // MailHog-nál bármit beírhatsz
    pass: 'any-password'
  }
});
