import { db } from '$lib/server/db';
import { getRequestEvent } from '$app/server';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { PasswordResetEmail, VerificationEmail } from '$lib/server/mailer/emails';
import 'dotenv/config';

export const auth = betterAuth({
	baseURL: process.env.BETTER_AUTH_URL,
	database: drizzleAdapter(db, {
		provider: 'pg'
	}),

	user: {
		changeEmail: { enabled: true },
		deleteUser: { enabled: true }
	},

	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
		sendResetPassword: async ({ user, url, token }) => {
			PasswordResetEmail({ email: user.email, url });
		}
	},

	emailVerification: {
		sendOnSignIn: true,
		sendVerificationEmail: async ({ user, url }) => {
			VerificationEmail({ email: user.email, url });
		}
	},

	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
		}
	},

	plugins: [sveltekitCookies(() => getRequestEvent())]
});
