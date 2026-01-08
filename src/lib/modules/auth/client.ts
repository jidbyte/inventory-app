import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { createAuthClient } from 'better-auth/svelte';
import type {
	LoginProps,
	ResetPasswordProps,
	SignupProps,
	UpdatePasswordProps,
	UpdateProfileProps
} from './schema';

export const client = createAuthClient();

export const SignOutClient = async () => {
	try {
		await client.signOut();
		goto(resolve('/'));
	} catch (error) {
		console.error('Error signing out:', error);
	}
};

export const GoogleAuthClient = async () => {
	try {
		await client.signIn.social({
			provider: 'google',
			callbackURL: '/overview'
		});
	} catch (error) {
		console.error('Google sign-in error:', error);
		// tost.error('Request failed. Please try again.');
	}
};

export const SignUpClient = async ({ firstname, lastname, email, _password }: SignupProps) => {
	try {
		const result = await client.signUp.email({
			name: `${firstname} ${lastname}`,
			email,
			password: _password,
			callbackURL: '/auth/sign-in'
		});

		return result;
	} catch (error) {
		console.error('Error signing up:', error);
		// toast.error('Request failed. Please try again.');
	}
};

export const LoginClient = async ({ email, _password, rememberMe }: LoginProps) => {
	try {
		const result = await client.signIn.email({
			email,
			password: _password,
			rememberMe,
			callbackURL: '/overview'
		});

		return result;
	} catch (error) {
		console.error('Error signing in:', error);
		// toast.error('Request failed. Please try again.');
	}
};

export const PasswordRequestClient = async (email: string) => {
	try {
		const result = client.requestPasswordReset({ email, redirectTo: '/auth/password/reset' });
		return result;
	} catch (error) {
		console.error('Error signing in:', error);
		// 	toast.error('Request failed. Please try again.');
		// }
	}
};

export const PasswordResetClient = async ({ password, token }: ResetPasswordProps) => {
	try {
		const result = client.resetPassword({ newPassword: password, token });
		return result;
	} catch (error) {
		console.error('Error signing in:', error);
		// tost.error('Request failed. Please try again.');
	}
};

export const UpdateProfileClient = async ({ image, firstname, lastname }: UpdateProfileProps) => {
	try {
		const result = await client.updateUser({
			image,
			name: `${firstname} ${lastname}`
		});

		if (result.error) {
			// return toast.error(result.error.message || 'Failed to update profile');
		}

		// tost.success('User profile updated successfully');
	} catch (error) {
		console.error('Update error:', error);
		// toast.error('Request failed. Please try again.');
	}
};

export const UpdateEmailClient = async (newEmail: string) => {
	try {
		const result = await client.changeEmail({ newEmail, callbackURL: '' });

		if (result.error) {
			// return toast.error(result.error.message || 'Failed to update email');
		}

		// toast.success('Email updated successfully');
	} catch (error) {
		console.error('Update error:', error);
		// toast.error('Request failed. Please try again.');
	}
};

export const UpdatePasswordClient = async ({
	newPassword,
	currentPassword
}: UpdatePasswordProps) => {
	try {
		const { data, error } = await client.changePassword({
			newPassword,
			currentPassword,
			revokeOtherSessions: true
		});

		if (error) {
			if (error.code === 'INVALID_PASSWORD') {
				return;
				// return toast.error('Invalid password. Enter the correct current password');
			}

			// return toast.error(error.message || 'Failed to update password');
		}

		// toast.success('Password updated successfully');
	} catch (error) {
		console.error('Update error:', error);
		// toast.error('Failed to update password');
	}
};

export const DeleteAccountClient = async (password: string) => {
	try {
		const result = await client.deleteUser({ password, callbackURL: '/' });

		if (result.error) {
			return;
			// return toast.error(result.error.message || 'Failed to delete account');
		}

		// return toast.success('Account deleted successfully');
	} catch (error) {
		console.error('Delete error:', error);
		// toast.error('Failed to delete account');
	}
};
