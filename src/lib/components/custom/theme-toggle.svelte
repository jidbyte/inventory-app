<script lang="ts">
	import Icon from '@iconify/svelte';
	import { mode, setMode } from 'mode-watcher';
	import { fly } from 'svelte/transition';

	const options = [
		{ value: 'light', icon: 'lucide:sun' },
		{ value: 'dark', icon: 'lucide:moon' },
		{ value: 'system', icon: 'lucide:monitor' }
	] as const;
</script>

<div
	class="flex w-fit items-center gap-1 rounded-full border border-border bg-secondary/50 p-1 backdrop-blur-md"
>
	{#each options as option}
		<button
			onclick={() => setMode(option.value)}
			class="relative flex items-center justify-center rounded-full p-2 transition-colors duration-300 hover:text-primary
            {mode.current === option.value ? 'text-primary' : 'text-muted-foreground'}"
			aria-label="Set {option.value} mode"
		>
			{#if mode.current === option.value}
				<div
					in:fly={{ y: 2, duration: 300 }}
					class="absolute inset-0 -z-10 rounded-full border border-border bg-background shadow-sm"
				></div>
			{/if}

			<Icon icon={option.icon} class="size-5" />
		</button>
	{/each}
</div>

<style>
	/* Optional: Add a subtle glow when active */
	.text-primary {
		filter: drop-shadow(0 0 8px rgba(var(--primary), 0.2));
	}
</style>
