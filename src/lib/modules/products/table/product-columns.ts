import type { ColumnDef } from '@tanstack/table-core';
import { renderComponent } from '$lib/components/ui/data-table/render-helpers';
import SortHeader from '$lib/components/ui/data-table/sort-header.svelte';
import ProductTableActions from './product-table-actions.svelte';
import { formatDistanceToNow } from 'date-fns';

export type Product = {
	id: string;
	name: string;
	sku: string;
	code: string | null;
	brand: string | null;
	model: string | null;
	description: string | null;
	quantity: number;
	restockLevel: number;
	optimalLevel: number;
	cost: number;
	price: number;
	userId: string;
	createdAt: Date;
	updatedAt: Date;
};

export const productColumns: ColumnDef<Product>[] = [
	{
		accessorKey: 'name',
		header: ({ column }) => {
			return renderComponent(SortHeader, { column, title: 'Name' });
		},
		cell: ({ row }) => {
			const name = row.getValue('name') as string;
			return `<div class="max-w-60 min-w-30 overflow-hidden">
				<p class="font-medium line-clamp-2 text-sm text-ellipsis wrap-break-words">${name}</p>
			</div>`;
		}
	},
	{
		accessorKey: 'brand',
		header: ({ column }) => {
			return renderComponent(SortHeader, { column, title: 'Brand' });
		},
		cell: ({ row }) => {
			const brand = row.getValue('brand') as string | null;
			return brand || '—';
		}
	},
	{
		accessorKey: 'sku',
		header: ({ column }) => {
			return renderComponent(SortHeader, { column, title: 'SKU' });
		}
	},
	{
		accessorKey: 'quantity',
		header: ({ column }) => {
			return renderComponent(SortHeader, { column, title: 'In Stock' });
		},
		cell: ({ row }) => {
			const quantity = row.getValue('quantity') as number;
			const restockLevel = row.original.restockLevel || 0;
			const textColor = quantity < restockLevel ? 'text-destructive' : 'text-accent';
			return `<span class="font-medium ${textColor}">${quantity.toLocaleString()}</span>`;
		}
	},
	{
		accessorKey: 'price',
		header: ({ column }) => {
			return renderComponent(SortHeader, { column, title: 'Price' });
		},
		cell: ({ row }) => {
			const price = row.getValue('price') as number;
			return `<span class="text-emerald-700 dark:text-emerald-300 font-medium">$${(price / 100).toFixed(2)}</span>`;
		}
	},
	{
		accessorKey: 'createdAt',
		header: ({ column }) => {
			return renderComponent(SortHeader, { column, title: 'Created' });
		},
		cell: ({ row }) => {
			const date = row.getValue('createdAt') as Date;
			const timeAgo = formatDistanceToNow(date, {
				addSuffix: true,
				includeSeconds: false
			}).replace(/^about /, '');
			return `<span class="text-sm">${timeAgo}</span>`;
		}
	},
	{
		accessorKey: 'updatedAt',
		header: ({ column }) => {
			return renderComponent(SortHeader, { column, title: 'Updated' });
		},
		cell: ({ row }) => {
			const date = row.getValue('updatedAt') as Date;
			const timeAgo = formatDistanceToNow(date, {
				addSuffix: true,
				includeSeconds: false
			}).replace(/^about /, '');
			return `<span class="text-sm">${timeAgo}</span>`;
		}
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			return renderComponent(ProductTableActions, { id: row.original.id });
		}
	}
];
