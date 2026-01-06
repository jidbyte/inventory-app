<script lang="ts">
	import Logo from '$lib/components/custom/logo.svelte';
	import Message from '$lib/components/custom/message.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { emailSignup } from '$lib/modules/auth/auth.remote';
	import { GoogleAuthClient, SignUpClient } from '$lib/modules/auth/client';
	import Icon from '@iconify/svelte';

	const { firstname, lastname, email, _password } = emailSignup.fields;

	let msg = $state<string | null>(null);
	let passwordVisible = $state(false);
</script>

<div class="min-h-screen bg-linear-to-br from-gray-900 to-gray-950 p-8">
	<div class="w-full items-center justify-center lg:mt-12 lg:flex lg:gap-6">
		<!-- Header -->
		<div class="mb-8 text-center md:mx-auto lg:text-left">
			<Logo />
			<h1 class="mt-4 text-2xl font-bold text-white lg:text-4xl">Let's get you started</h1>
			<p class="mt-2 hidden text-gray-400 lg:block">
				Start your 14-day free trial. No credit card required.
			</p>
		</div>

		<!-- Form Card -->
		<div class="w-full rounded-2xl border bg-card p-8 shadow-md md:mx-auto md:max-w-lg">
			<!-- Messages  -->
			<div class="mb-6">
				{#if msg == 'success'}
					<Message
						variant="success"
						text="Account created successfully! Please check your email to verify your account."
						containerClass="mb-5"
					/>
				{:else if msg !== null}
					<Message variant="alert" text={msg} containerClass="mb-5" />
				{/if}
			</div>

			<!-- Google Sign Up -->
			<Button onclick={GoogleAuthClient} class="w-full text-base">
				<Icon icon="flat-color-icons:google" class="mr-2 size-5" />
				Continue with Google
			</Button>

			<!-- Divider -->
			<div class="relative py-4">
				<div class="absolute inset-0 flex items-center">
					<div class="w-full border-t border-gray-700"></div>
				</div>
				<div class="relative flex justify-center text-sm">
					<span class="bg-card px-4 text-gray-400">Or continue with email</span>
				</div>
			</div>

			<!-- Sign Up Form -->
			<form
				{...emailSignup.enhance(async ({ submit, form, data }) => {
					await submit();
					if (emailSignup.result?.ok) {
						const res = await SignUpClient(data);

						if (res?.error) {
							msg = res.error?.message!;
						} else {
							msg = 'success';
							form.reset();
						}
					}
				})}
				class="space-y-5"
			>
				<div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
					<div>
						<label for="firstname"> First name </label>
						<Input {...firstname.as('text')} icon="solar:user-bold" />
						{#each firstname.issues() as issue}
							<Message text={issue.message} />
						{/each}
					</div>

					<div>
						<label for="lastname"> Last name </label>
						<Input {...lastname.as('text')} icon="solar:user-bold" />
						{#each lastname.issues() as issue}
							<Message text={issue.message} />
						{/each}
					</div>
				</div>

				<div>
					<label for="email"> Email </label>
					<Input {...email.as('text')} icon="solar:letter-bold" />
					{#each email.issues() as issue}
						<Message text={issue.message} />
					{/each}
				</div>

				<div>
					<label for="password"> Password </label>
					<div class="relative">
						<Input
							{..._password.as(passwordVisible ? 'text' : 'password')}
							icon="solar:lock-password-bold"
						/>
						<button
							type="button"
							onclick={() => (passwordVisible = !passwordVisible)}
							class="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-all hover:text-gray-300"
							aria-label={passwordVisible ? 'Hide password' : 'Show password'}
						>
							{#if passwordVisible}
								<Icon icon="solar:eye-closed-bold" class="size-4.5" />
							{:else}
								<Icon icon="fa6-regular:eye" class="size-5" />
							{/if}
						</button>
					</div>
					{#each _password.issues() as issue}
						<Message text={issue.message} />
					{/each}
				</div>

				<Button
					type="submit"
					class="mt-2 w-full bg-sky-600 text-white"
					disabled={!!emailSignup.pending}
				>
					{#if emailSignup.pending}
							<Icon icon="eos-icons:three-dots-loading" class="size-12"/>
						{:else}
							Sign Up
					{/if}
				</Button>
			</form>

			<!-- Terms & Privacy -->
			<p class="mt-4 text-center text-xs text-gray-300">
				By signing up, you agree to our
				<a href="/" class="font-medium text-blue-400 hover:text-blue-300">Terms</a>
				and
				<a href="/" class="font-medium text-blue-400 hover:text-blue-300">Privacy Policy</a>.
			</p>

			<!-- Footer Links -->
			<p class="mt-4 text-center text-sm text-gray-300">
				Already have an account?
				<a href="/auth/sign-in" class="font-semibold text-blue-400 hover:text-blue-300">
					Sign in
				</a>
			</p>
		</div>
	</div>
</div>
