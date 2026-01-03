import { env } from '$env/dynamic/private';
import nodemailer from 'nodemailer';

export interface SendEmailInput {
	to: string;
	subject: string;
	html: string;
}

const transporter = nodemailer.createTransport({
	host: env.MAILER_HOST,
	port: Number(env.MAILER_PORT),
	secure: false
});

export async function Mailer(input: SendEmailInput): Promise<void> {
	await transporter.sendMail({
		from: env.MAILER_SENDER,
		to: input.to,
		subject: input.subject,
		html: input.html
	});
}
