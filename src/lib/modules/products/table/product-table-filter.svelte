<script lang="ts" generics="TData">
	import type { Table } from '@tanstack/table-core';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';

	type ToolbarProps = {
		table: Table<TData>;
		searchKey?: string;
		searchPlaceholder?: string;
		filterColumn?: string;
		filterOptions?: { value: string; label: string }[];
		filterPlaceholder?: string;
	};

	let {
		table,
		searchKey = 'name',
		searchPlaceholder = 'Search...',
		filterColumn,
		filterOptions = [],
		filterPlaceholder = 'Filter...'
	}: ToolbarProps = $props();

	// Handle search input
	function handleSearch(value: string) {
		table.getColumn(searchKey)?.setFilterValue(value);
	}

	// Handle filter
	function handleFilter(value: string | undefined) {
		if (!filterColumn) return;
		table.getColumn(filterColumn)?.setFilterValue(value);
	}

	// Get current filter value for display
	const currentFilterValue = $derived(
		filterColumn ? table.getColumn(filterColumn)?.getFilterValue() : null
	);
</script>

<div class="flex items-center gap-4 py-4">
	<!-- Search Input -->
	<Input
		placeholder={searchPlaceholder}
		oninput={(e) => handleSearch(e.currentTarget.value)}
		class="max-w-sm"
	/>

	<!-- Status/Filter Dropdown (optional) -->
	{#if filterColumn && filterOptions.length > 0}
		<Select.Root
			type="single"
			onValueChange={(v) => {
				if (v === 'all') {
					handleFilter(undefined);
				} else {
					handleFilter(v);
				}
			}}
		>
			<Select.Trigger class="h-10 w-[180px]">
				<span class="text-muted-foreground">
					{currentFilterValue || filterPlaceholder}
				</span>
			</Select.Trigger>
			<Select.Portal>
				<Select.Content>
					<Select.Group>
						<Select.Item value="all" label="All">All</Select.Item>
						{#each filterOptions as option}
							<Select.Item value={option.value} label={option.label}>
								{option.label}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Portal>
		</Select.Root>
	{/if}
</div>
