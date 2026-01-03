<script lang="ts">
	import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';
	import { cn, type WithElementRef } from '$lib/utils/helpers.js';
	import Icon from '@iconify/svelte';
	import type { IconifyIcon } from '@iconify/svelte';

	type InputType = Exclude<HTMLInputTypeAttribute, 'file'>;

	type Props = WithElementRef<
		Omit<HTMLInputAttributes, 'type'> &
			({ type: 'file'; files?: FileList } | { type?: InputType; files?: undefined })
	> & {
		icon?: IconifyIcon | string;
		iconClass?: string;
	};

	let {
		ref = $bindable(null),
		value = $bindable(),
		type,
		files = $bindable(),
		class: className,
		'data-slot': dataSlot = 'input',
		icon,
		iconClass = '',
		...restProps
	}: Props = $props();

	let hasIcon = $derived(!!icon);
	let paddingClass = $derived(hasIcon ? 'pl-10' : '');
</script>

<div class="relative">
	{#if hasIcon && icon}
		<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
			<Icon {icon} class={cn('size-5 text-muted-foreground', iconClass)} />
		</div>
	{/if}

	{#if type === 'file'}
		<input
			bind:this={ref}
			data-slot={dataSlot}
			class={cn(
				'flex h-10 w-full min-w-0 rounded-sm border border-input bg-input/50 px-3 pt-1.5 text-sm font-medium shadow-xs ring-offset-background transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
				paddingClass,
				'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
				'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
				className
			)}
			type="file"
			bind:files
			bind:value
			{...restProps}
		/>
	{:else}
		<input
			bind:this={ref}
			data-slot={dataSlot}
			class={cn(
				'flex h-10 w-full min-w-0 rounded-sm border border-input bg-input/50 px-3 py-2 text-base shadow-xs ring-offset-background transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
				paddingClass,
				'focus-visible:border-ring focus-visible:ring-[1.5px] focus-visible:ring-sky-500',
				'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
				className
			)}
			{type}
			bind:value
			{...restProps}
		/>
	{/if}
</div>
