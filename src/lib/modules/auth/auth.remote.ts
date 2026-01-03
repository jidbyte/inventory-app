import { form } from '$app/server';
import {
	emailSchema,
	loginSchema,
	resetPasswordSchema,
	signupSchema,
	updatePasswordSchema,
	updateProfileSchema
} from './schema';
import z from 'zod';

export const emailSignup = form(signupSchema, async (data) => {
	if (data) return { ok: true };
});

export const emailLogin = form(loginSchema, async (data) => {
	if (data) return { ok: true };
});

export const passwordRequest = form(emailSchema, async (data) => {
	if (data) return { ok: true };
});

export const passwordReset = form(resetPasswordSchema, async (data) => {
	if (data) return { ok: true };
});

export const updateProfile = form(updateProfileSchema, async (data) => {
	if (data) return { ok: true };
});

export const updateEmail = form(emailSchema, async (data) => {
	if (data) return { ok: true };
});

export const updatePassword = form(updatePasswordSchema, async (data) => {
	if (data) return { ok: true };
});

export const deleteUser = form(z.object({ password: z.string() }), async (data) => {
	if (data) return { ok: true };
});
