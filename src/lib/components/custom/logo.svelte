<script lang="ts">
	import Icon from '@iconify/svelte';

	type Size = 'sm' | 'md' | 'lg' | 'xl';
	type Variant = 'default' | 'text-only' | 'icon-only';

	export let variant: Variant = 'default';
	export let size: Size = 'md';

	const sizeMap: Record<Size, { container: string; text: string; icon: string }> = {
		sm: { container: 'size-10', text: 'text-sm', icon: 'size-5' },
		md: { container: 'size-15', text: 'text-base', icon: 'size-8' },
		lg: { container: 'size-20', text: 'text-lg', icon: 'size-10' },
		xl: { container: 'size-24', text: 'text-xl', icon: 'size-12' }
	};

	const currentSize = sizeMap[size];
</script>

<div>
	{#if variant == 'text-only'}
		<span class="font-semibold {currentSize.text}"> MyLogo </span>
	{:else if variant == 'icon-only'}
		<Icon icon="icon-park-twotone:paper-ship" class={currentSize.icon} />
	{:else}
		<Icon icon="icon-park-twotone:paper-ship" class={currentSize.icon} />
		<span class="font-semibold {currentSize.text}"> MyLogo </span>
	{/if}
</div>
