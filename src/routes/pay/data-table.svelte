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
	import { Input } from '$lib/components/ui/input';

	type DataTableProps<TData, TValue> = {
		columns: ColumnDef<TData, TValue>[];
		data: TData[];
		searchKey?: string;
		searchPlaceholder?: string;
	};

	let {
		data,
		columns,
		searchKey = 'email',
		searchPlaceholder = 'Search...'
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

	// Handle search input
	function handleSearch(value: string) {
		table.getColumn(searchKey)?.setFilterValue(value);
	}

	// Handle status filter
	function handleStatusFilter(value: string | undefined) {
		table.getColumn('status')?.setFilterValue(value);
	}

	// Status options
	const statusOptions = [
		{ value: 'pending', label: 'Pending' },
		{ value: 'processing', label: 'Processing' },
		{ value: 'success', label: 'Success' },
		{ value: 'failed', label: 'Failed' }
	];
</script>

<div class="w-full">
	<!-- Search and Filter Section -->
	<div class="flex items-center gap-4 py-4">
		<Input
			placeholder={searchPlaceholder}
			oninput={(e) => handleSearch(e.currentTarget.value)}
			class="max-w-sm"
		/>

		<Select.Root
			type="single"
			onValueChange={(v) => {
				// Clear filter if "all" is selected, otherwise set the filter value
				if (v === 'all') {
					handleStatusFilter(undefined);
				} else {
					handleStatusFilter(v);
				}
			}}
		>
			<Select.Trigger class="h-10 w-[180px]">
				<span class="text-muted-foreground">
					{table.getColumn('status')?.getFilterValue() || 'Filter by status'}
				</span>
			</Select.Trigger>
			<Select.Portal>
				<Select.Content>
					<Select.Group>
						<Select.Item value="all" label="All statuses">All statuses</Select.Item>
						{#each statusOptions as status}
							<Select.Item value={status.value} label={status.label}>
								{status.label}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Portal>
		</Select.Root>
	</div>

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
					<Table.Row data-state={row.getIsSelected() && 'selected'}>
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

	<!-- Pagination Section -->
	<div class="flex items-center justify-between space-x-2 py-4">
		<div class="flex-1 text-sm text-muted-foreground">
			{table.getFilteredRowModel().rows.length} row(s) total.
		</div>

		<div class="flex items-center space-x-6 lg:space-x-8">
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
</div>
