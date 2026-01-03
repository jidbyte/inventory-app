<script lang="ts">
	import Icon from '@iconify/svelte';
	import { cn } from '$lib/utils/helpers.js';

	type Variant = 'error' | 'warning' | 'alert' | 'success';

	export let text: string;
	export let variant: Variant = 'error';
	export let containerClass: string = '';
	export let iconClass: string = '';
	export let textClass: string = '';

	$: variantConfig = {
		error: {
			icon: 'solar:danger-circle-bold',
			bg: 'bg-red-900/20',
			border: 'ring-red-800/30',
			iconColor: 'text-red-400',
			textColor: 'text-red-300'
		},
		alert: {
			icon: 'solar:danger-triangle-bold',
			bg: 'bg-red-900/20',
			border: 'ring-red-800/30',
			iconColor: 'text-red-400',
			textColor: 'text-red-300'
		},
		success: {
			icon: 'solar:check-circle-bold',
			bg: 'bg-emerald-900/20',
			border: 'ring-emerald-800/30',
			iconColor: 'text-emerald-400',
			textColor: 'text-emerald-300'
		},
		warning: {
			icon: 'solar:danger-triangle-bold',
			bg: 'bg-amber-900/20',
			border: 'ring-amber-800/30',
			iconColor: 'text-amber-400',
			textColor: 'text-amber-300'
		}
	}[variant];

	$: isInline = variant === 'error';
</script>

{#if isInline}
	<!-- Inline message for form fields -->
	<div class={cn('mt-1.5 flex items-center gap-1.5', containerClass)}>
		<Icon icon={variantConfig.icon} class={cn('h-4 w-4', variantConfig.iconColor, iconClass)} />
		<small class={cn('text-sm', variantConfig.textColor, textClass)}>
			{text}
		</small>
	</div>
{:else}
	<!-- Block message for alerts/toasts -->
	<div class={cn('rounded-md p-4 ring-1', variantConfig.bg, variantConfig.border, containerClass)}>
		<div class="flex items-center">
			<Icon
				icon={variantConfig.icon}
				class={cn('mr-3 h-5 w-5', variantConfig.iconColor, iconClass)}
			/>
			<p class={cn('text-sm font-medium', variantConfig.textColor, textClass)}>{text}</p>
		</div>
	</div>
{/if}
