import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();
const { env } = process;

let mailInstance;
const createEmailConnection = async () => {
	const testAccount = await nodemailer.createTestAccount();
	mailInstance = nodemailer.createTransport({
	   	service: 'gmail',
	    auth: {
	        user: env.MAIL_EMAIL,
	        pass: env.MAIL_PASSWORD
	    }
	});
}

export { createEmailConnection, mailInstance };