<script lang="ts">
	import type { Column } from '@tanstack/table-core';
	import { ArrowUpDown, ArrowUp, ArrowDown } from '@lucide/svelte/icons';

	type Props = {
		column: Column<any, unknown>;
		title: string;
	};

	let { column, title }: Props = $props();
</script>

<button
	type="button"
	class="flex items-center gap-2 hover:text-foreground"
	onclick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
>
	<span>{title}</span>
	{#if column.getIsSorted() === 'desc'}
		<ArrowDown class="h-4 w-4" />
	{:else if column.getIsSorted() === 'asc'}
		<ArrowUp class="h-4 w-4" />
	{:else}
		<ArrowUpDown class="h-4 w-4" />
	{/if}
</button>
