<script lang="ts">
	import Message from '$lib/components/custom/message.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { passwordRequest } from '$lib/modules/auth/auth.remote';
	import { PasswordRequestClient } from '$lib/modules/auth/client';
	import Icon from '@iconify/svelte';

	const { email } = passwordRequest.fields;

	let emailSent = $state(false);
	let msg = $state<string | null>(null);
</script>

<div class="bg-linear-to-br from-gray-900 to-gray-950 p-8">
	<div class="grid min-h-[90vh] w-full place-content-center">
		<!-- Form Card -->
		<div class="w-full rounded-2xl border bg-card p-8 shadow-md md:mx-auto md:max-w-lg">
			{#if emailSent}
				<!-- Success State -->
				<div class="text-center">
					<div
						class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-900/30"
					>
						<Icon icon="solar:inbox-line-duotone" class="size-8 text-emerald-400" />
					</div>

					<h2 class="mb-4 text-2xl font-bold text-white">Check your email</h2>

					<Message
						variant="success"
						text="We've sent password reset instructions to your email address."
						containerClass="mb-6"
					/>

					<!-- Info Box -->
					<div class="mb-6 rounded-lg bg-gray-800/50 p-4 ring-1 ring-gray-700/50">
						<div class="flex items-start">
							<Icon icon="solar:info-circle-bold" class="mt-0.5 mr-3 size-5 text-gray-400" />
							<p class="text-sm text-gray-300">
								Can't find the email? Check your spam or junk folder.
							</p>
						</div>
					</div>

					<!-- Action Buttons -->
					<div class="space-y-4">
						<a
							href="/auth/sign-in"
							class="block w-full rounded-lg bg-emerald-600 px-4 py-3 text-center font-medium text-white transition-colors hover:bg-emerald-700"
						>
							Return to sign in
						</a>

						<button
							type="button"
							class="w-full text-sm font-medium text-gray-400 transition-colors hover:text-gray-300"
							onclick={() => (emailSent = false)}
						>
							Didn't receive the email? Try again
						</button>
					</div>
				</div>
			{:else}
				<!-- Reset Form -->
				<div>
					<!-- Icon Header -->
					<div class="mb-6 text-center">
						<div
							class="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-sky-900/30"
						>
							<Icon icon="solar:lock-password-bold" class="size-6 text-sky-400" />
						</div>
						<h2 class="mb-2 text-xl font-bold text-white">Forgot your password?</h2>
						<p class="text-gray-400">
							Enter your email address and we'll send you instructions to reset your password.
						</p>
					</div>

					<!-- Error Message -->
					{#if msg !== null}
						<Message variant="alert" text={msg} containerClass="mb-6" />
					{/if}

					<!-- Form -->
					<form
						{...passwordRequest.enhance(async ({ submit, form, data }) => {
							await submit();
							if (passwordRequest.result?.ok) {
								const res = await PasswordRequestClient(data.email);
								if (res?.error) {
									msg = res.error.message!;
								} else {
									emailSent = true;
									// tost.success('Reset instructions sent to your email');
									form.reset();
								}
							}
						})}
						class="space-y-6"
					>
						<div>
							<label for="email" class="mb-1.5 block text-sm font-medium text-gray-300">
								Email address
							</label>
							<Input
								{...email.as('email')}
								icon="solar:letter-bold"
								placeholder="you@example.com"
								class="bg-input/50"
							/>
							{#each email.issues() as issue}
								<Message text={issue.message} />
							{/each}
						</div>

						<Button
							type="submit"
							class="w-full bg-sky-600 text-white hover:bg-sky-700"
							disabled={passwordRequest.pending > 0}
						>
							{#if passwordRequest.pending > 0}
								<Icon icon="eos-icons:three-dots-loading" class="size-12" />
							{:else}
								Send reset instructions
							{/if}
						</Button>
					</form>

					<!-- Footer Links -->
					<div class="mt-6 text-center">
						<a
							href="/auth/sign-in"
							class="text-sm font-medium text-gray-400 transition-colors hover:text-blue-400"
						>
							← Back to sign in
						</a>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
