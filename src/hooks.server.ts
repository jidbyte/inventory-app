import { auth } from '$lib/modules/auth/config';
import { building } from '$app/environment';
import { sequence } from '@sveltejs/kit/hooks';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import type { Handle } from '@sveltejs/kit';

const appHandler: Handle = async ({ event, resolve }) => {
	return svelteKitHandler({ event, resolve, auth, building });
};

const authHandler: Handle = async ({ event, resolve }) => {
	const PUBLIC_ROUTES = ['/', '/pricing'];

	const path = event.url.pathname;
	const authToken = event.cookies.get('better-auth.session_token');

	const isPublicRoute = PUBLIC_ROUTES.includes(path) || path.startsWith('/auth');

	if (!isPublicRoute && !authToken) {
		return new Response(null, {
			status: 302,
			headers: {
				location: `/auth/sign-in?redirect=${encodeURIComponent(path)}`
			}
		});
	}

	return resolve(event);
};

const sessionHandler: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	if (session) {
		event.locals.user = session.user;
		event.locals.session = session.session;
	}

	return resolve(event);
};

export const handle = sequence(appHandler, authHandler, sessionHandler);
