<script lang="ts" generics="TData, TValue">
	import {
		type ColumnDef,
		getCoreRowModel,
		getPaginationRowModel,
		getSortedRowModel,
		getFilteredRowModel,
		type SortingState
	} from '@tanstack/table-core';
	import { createSvelteTable, FlexRender } from '$lib/components/ui/data-table/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Select from '$lib/components/ui/select';
	import { Button } from '$lib/components/ui/button';
	import ProductTableFilter from './product-table-filter.svelte';
	import { Navigate } from '$lib/utils/helpers';

	type DataTableProps<TData, TValue> = {
		columns: ColumnDef<TData, TValue>[];
		data: TData[];
		searchKey?: string;
		searchPlaceholder?: string;
		filterColumn?: string;
		filterOptions?: { value: string; label: string }[];
		filterPlaceholder?: string;
	};

	let {
		data,
		columns,
		searchKey = 'name',
		searchPlaceholder = 'Search...',
		filterColumn,
		filterOptions = [],
		filterPlaceholder = 'Filter by status'
	}: DataTableProps<TData, TValue> = $props();

	let sorting = $state<SortingState>([]);
	let columnFilters = $state<{ id: string; value: unknown }[]>([]);
	let tableState = $state({
		pageIndex: 0,
		pageSize: 10
	});

	const table = createSvelteTable({
		get data() {
			return data;
		},
		get columns() {
			return columns;
		},
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			get pagination() {
				return tableState;
			},
			get sorting() {
				return sorting;
			},
			get columnFilters() {
				return columnFilters;
			}
		},
		onPaginationChange: (updater) => {
			if (typeof updater === 'function') {
				tableState = updater(tableState);
			} else {
				tableState = updater;
			}
		},
		onSortingChange: (updater) => {
			if (typeof updater === 'function') {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		onColumnFiltersChange: (updater) => {
			if (typeof updater === 'function') {
				columnFilters = updater(columnFilters);
			} else {
				columnFilters = updater;
			}
		},
		manualPagination: false,
		manualSorting: false
	});
</script>

<div class="w-full">
	<!-- Filters Toolbar Component -->
	<ProductTableFilter
		{table}
		{searchKey}
		{searchPlaceholder}
		{filterColumn}
		{filterOptions}
		{filterPlaceholder}
	/>

	<!-- Table Section  -->
	<div class="rounded-md border">
		<Table.Root>
			<!-- Table Header -->
			<Table.Header>
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row>
						{#each headerGroup.headers as header (header.id)}
							<Table.Head colspan={header.colSpan}>
								{#if !header.isPlaceholder}
									<FlexRender
										content={header.column.columnDef.header}
										context={header.getContext()}
									/>
								{/if}
							</Table.Head>
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>

			<!-- Table Content -->
			<Table.Body>
				{#each table.getRowModel().rows as row (row.id)}
					<Table.Row
						onclick={() => Navigate(`/products/${(row.original as { id: string }).id}`)}
						data-state={row.getIsSelected() && 'selected'}
					>
						{#each row.getVisibleCells() as cell (cell.id)}
							<Table.Cell>
								<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
							</Table.Cell>
						{/each}
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>

	<!-- Table Footer - Pagination -->
	<div class="mt-4 flex items-center justify-between">
		<div class="flex items-center space-x-6">
			<div class="flex items-center space-x-2">
				<p class="text-sm font-medium">Rows per page</p>
				<Select.Root
					type="single"
					value={String(tableState.pageSize)}
					onValueChange={(v) => {
						if (v) {
							table.setPageSize(Number(v));
						}
					}}
				>
					<Select.Trigger class="h-8 w-[70px]">
						{tableState.pageSize}
					</Select.Trigger>
					<Select.Portal>
						<Select.Content side="top">
							<Select.Group>
								{#each [10, 25, 50, 100] as pageSize}
									<Select.Item value={String(pageSize)} label={String(pageSize)}>
										{pageSize}
									</Select.Item>
								{/each}
							</Select.Group>
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			</div>

			<div class="flex w-[100px] items-center justify-center text-sm font-medium">
				Page {tableState.pageIndex + 1} of {table.getPageCount()}
			</div>
		</div>

		<div class="flex items-center space-x-2">
			<Button
				variant="outline"
				size="sm"
				onclick={() => table.setPageIndex(0)}
				disabled={!table.getCanPreviousPage()}
			>
				First
			</Button>
			<Button
				variant="outline"
				size="sm"
				onclick={() => table.previousPage()}
				disabled={!table.getCanPreviousPage()}
			>
				Previous
			</Button>
			<Button
				variant="outline"
				size="sm"
				onclick={() => table.nextPage()}
				disabled={!table.getCanNextPage()}
			>
				Next
			</Button>
			<Button
				variant="outline"
				size="sm"
				onclick={() => table.setPageIndex(table.getPageCount() - 1)}
				disabled={!table.getCanNextPage()}
			>
				Last
			</Button>
		</div>
	</div>
</div>
