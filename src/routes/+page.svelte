<script lang="ts">
	import ThemeToggle from '$lib/components/custom/theme-toggle.svelte';
	import { Button } from '$lib/components/ui/button';
	import Icon from '@iconify/svelte';
</script>

<div class="min-h-screen bg-background p-8 text-foreground transition-colors duration-500">
	<header class="mx-auto mb-12 flex max-w-4xl items-center justify-between">
		<div class="flex items-center gap-2">
			<div class="rounded-xl bg-primary p-2">
				<Icon icon="lucide:zap" class="size-6 text-primary-foreground" />
			</div>
			<h1 class="text-xl font-bold tracking-tight">Inventory Pro</h1>
		</div>

		<ThemeToggle />

		<div class="flex gap-2">
			<Button href="/auth/sign-up">
				<Icon icon="lucide:user" class="size-4" />
				<span>Register</span>
			</Button>

			<Button href="/auth/sign-in">
				<Icon icon="lucide:user" class="size-4" />
				<span>Login</span>
			</Button>
		</div>
	</header>

	<main class="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
		<div class="rounded-3xl border border-border bg-card p-8 shadow-sm md:col-span-2">
			<h2 class="mb-4 inline-flex items-center gap-2 text-3xl font-semibold">
				<Icon icon="tabler:building-store" class="size-8 text-sky-500" />
				<span>Welcome Home</span>
			</h2>
			<p class="leading-relaxed text-muted-foreground">
				Lorem ipsum, dolor sit amet consectetur adipisicing elit. Inventore quisquam maxime id
				recusandae saepe amet dolorem sed asperiores, quia dolorum sapiente consequatur enim debitis
				veritatis? Dolor laborum quo qui quod deserunt quasi tenetur id repellat provident modi
				sequi, sint molestias.
			</p>
		</div>

		<div
			class="flex flex-col items-center justify-center rounded-3xl border border-border bg-secondary/30 p-8 text-center"
		>
			<div class="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
				<Icon icon="lucide:book-open" class="size-6 text-primary" />
			</div>
			<h3 class="font-medium">Documentation</h3>
			<a
				href="https://svelte.dev/docs/kit"
				class="mt-2 text-sm text-muted-foreground hover:underline"
			>
				Read the docs →
			</a>
		</div>
	</main>
</div>
