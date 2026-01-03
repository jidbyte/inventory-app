import { z } from 'zod';

export const signupSchema = z.object({
	firstname: z.string().min(1, 'First name is required'),
	lastname: z.string().min(1, 'Last name is required'),
	email: z.email('Please enter a valid email'),
	_password: z.string().min(8, 'Password must be at least 8 characters')
});

export const loginSchema = z.object({
	email: z.email('Please enter a valid email'),
	_password: z.string().min(8, 'Password must be at least 8 characters'),
	rememberMe: z.boolean().optional()
});

export const emailSchema = z.object({
	email: z.email('Please enter a valid email')
});

export const resetPasswordSchema = z
	.object({
		password: z.string().min(8, 'Password must be at least 8 characters'),
		confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
		token: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword']
	});

export const updateProfileSchema = z.object({
	image: z.string().optional(),
	firstname: z.string().min(1, 'First name is required'),
	lastname: z.string().min(1, 'Last name is required')
});

export const updatePasswordSchema = z
	.object({
		currentPassword: z.string().min(1, 'Password is required'),
		newPassword: z.string().min(8, 'Password must be at least 8 characters'),
		confirmNewPassword: z.string()
	})
	.refine((data) => data.newPassword === data.confirmNewPassword, {
		message: "Passwords don't match",
		path: ['confirmNewPassword']
	});

export type SignupProps = z.infer<typeof signupSchema>;
export type LoginProps = z.infer<typeof loginSchema>;
export type ResetPasswordProps = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileProps = z.infer<typeof updateProfileSchema>;
export type UpdatePasswordProps = z.infer<typeof updatePasswordSchema>;
