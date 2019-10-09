import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();
const { env } = process;

let mailInstance;
const createEmailConnection = async () => {
  if (env.NODE_ENV === 'dev') {
    mailInstance = nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: env.MAIL_EMAIL,
        pass: env.MAIL_PASSWORD,
      },
    });
  } else {
    mailInstance = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: env.MAIL_EMAIL,
        pass: env.MAIL_PASSWORD,
      },
    });
  }

};

export { createEmailConnection, mailInstance };
