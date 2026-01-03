import { sendEmail } from './template';

const APP_NAME = 'Inventory Pro';

export function VerificationEmail(input: { email: string; url: string }) {
	sendEmail({
		to: input.email,
		subject: `Verify your email for ${APP_NAME}`,
		heading: 'Confirm your email',
		body: 'Click the button below to verify your email address and get started.',
		buttonText: 'Verify email',
		buttonUrl: input.url
	});
}

export function PasswordResetEmail(input: { email: string; url: string }) {
	sendEmail({
		to: input.email,
		subject: `Reset your password for ${APP_NAME}`,
		heading: 'Reset your password',
		body: 'Click the button below to reset your password. This link will expire in 1 hour.',
		buttonText: 'Reset password',
		buttonUrl: input.url
	});
}
