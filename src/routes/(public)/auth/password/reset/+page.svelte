<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { passwordReset } from '$lib/modules/auth/auth.remote';
	import { PasswordResetClient } from '$lib/modules/auth/client';
	import toast from 'svelte-french-toast';
	import Icon from '@iconify/svelte';
	import Message from '$lib/components/custom/message.svelte';

	const { password, confirmPassword, token } = passwordReset.fields;

	let message = $state<string | null>(null);
	let resetToken = $state('');
	let tokenValid = $state(false);

	onMount(() => {
		resetToken = page.url.searchParams.get('token') || '';

		if (!resetToken) {
			toast.error('Invalid or missing reset token');
			goto('/auth/password/forgot');
		} else {
			tokenValid = true;
		}
	});
</script>

<div class="bg-linear-to-br from-gray-900 to-gray-950 p-8">
	<div class="grid min-h-[90vh] w-full place-content-center">
		<!-- Form Card -->
		<div class="w-full rounded-2xl border bg-card p-8 shadow-md md:mx-auto md:max-w-lg">
			{#if tokenValid}
				<!-- Header Section -->
				<div class="mb-8 text-center">
					<div
						class="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-sky-900/30"
					>
						<Icon icon="solar:lock-password-bold" class="size-6 text-sky-400" />
					</div>
					<h2 class="mb-2 text-2xl font-bold text-white">Create new password</h2>
					<p class="text-gray-400">Please enter a strong password for your account.</p>
				</div>

				<!-- Error Message -->
				{#if message !== null}
					<Message variant="alert" text={message} containerClass="mb-6" />
				{/if}

				<!-- Form -->
				<form
					{...passwordReset.enhance(async ({ submit, form, data }) => {
						await submit();
						if (passwordReset.result?.ok) {
							const res = await PasswordResetClient(data);
							if (res?.error) {
								message = res.error.message!;
							} else {
								toast.success('Password reset successful. Redirecting to sign in...');
								form.reset();
								setTimeout(() => {
									goto('/auth/sign-in');
								}, 2000);
							}
						}
					})}
					class="space-y-6"
				>
					<!-- New Password -->
					<div>
						<label for="password" class="mb-1.5 block text-sm font-medium text-gray-300">
							New password
						</label>
						<Input
							{...password.as('password')}
							icon="solar:lock-password-bold"
							placeholder="At least 8 characters"
							class="bg-input/50"
						/>
						{#each password.issues() as issue}
							<Message text={issue.message} />
						{/each}
					</div>

					<!-- Confirm Password -->
					<div>
						<label for="confirmPassword" class="mb-1.5 block text-sm font-medium text-gray-300">
							Confirm new password
						</label>
						<Input
							{...confirmPassword.as('password')}
							icon="solar:lock-password-bold"
							placeholder="Re-enter your password"
							class="bg-input/50"
						/>
						{#each confirmPassword.issues() as issue}
							<Message text={issue.message} />
						{/each}
					</div>

					<input {...token.as('hidden', 'text')} bind:value={resetToken} readonly class="hidden" />

					<!-- Submit Button -->
					<Button
						type="submit"
						class="w-full bg-sky-600 text-white hover:bg-sky-700"
						disabled={!!passwordReset.pending}
					>
						{#if passwordReset.pending}
							<Icon icon="svg-spinners:90-ring-with-bg" class="mr-2 size-5" />
							Resetting password...
						{:else}
							Reset password
						{/if}
					</Button>
				</form>

				<!-- Footer Link -->
				<div class="mt-6 text-center">
					<a
						href="/auth/sign-in"
						class="text-sm font-medium text-gray-400 transition-colors hover:text-blue-400"
					>
						← Back to sign in
					</a>
				</div>
			{:else}
				<!-- Loading State -->
				<div class="text-center">
					<div
						class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-800/30"
					>
						<Icon icon="svg-spinners:90-ring-with-bg" class="size-8 text-gray-400" />
					</div>
					<h2 class="mb-4 text-2xl font-bold text-white">Verifying reset token</h2>
					<p class="text-gray-400">Please wait while we validate your reset link.</p>
				</div>
			{/if}
		</div>
	</div>
</div>
