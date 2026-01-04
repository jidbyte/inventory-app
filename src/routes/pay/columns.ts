import type { ColumnDef } from '@tanstack/table-core';
import { formatCurrency } from '$lib/hooks/useCurrency';
import { renderComponent } from '$lib/components/ui/data-table/render-helpers';
import DataTableActions from './data-table-actions.svelte';
import DataTableSortHeader from './data-table-sort-header.svelte';

export type Payment = {
	id: string;
	amount: number;
	status: 'pending' | 'processing' | 'success' | 'failed';
	email: string;
};

export const columns: ColumnDef<Payment>[] = [
	{
		accessorKey: 'status',
		header: ({ column }) => {
			return renderComponent(DataTableSortHeader, { column, title: 'Status' });
		}
	},
	{
		accessorKey: 'email',
		header: ({ column }) => {
			return renderComponent(DataTableSortHeader, { column, title: 'Email' });
		}
	},
	{
		accessorKey: 'amount',
		header: ({ column }) => {
			return renderComponent(DataTableSortHeader, { column, title: 'Amount' });
		},
		cell: ({ row }) => {
			const amount = row.getValue('amount') as number;
			return formatCurrency('GHS', amount);
		}
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			return renderComponent(DataTableActions, { id: row.original.id });
		}
	}
];
