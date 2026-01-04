<script lang="ts">
	import DataTable from './data-table.svelte';
	import { columns } from './columns.js';

	type Payment = {
		id: string;
		amount: number;
		status: 'pending' | 'processing' | 'success' | 'failed';
		email: string;
	};

	export const payments: Payment[] = [
		{
			id: '728ed52f',
			amount: 100,
			status: 'pending',
			email: 'm@example.com'
		},
		{
			id: '489e1d42',
			amount: 125,
			status: 'processing',
			email: 'example@gmail.com'
		},
		{
			id: '3f8a7b91',
			amount: 299.99,
			status: 'success',
			email: 'user1@company.com'
		},
		{
			id: '6c2d9e45',
			amount: 75.5,
			status: 'failed',
			email: 'customer@shop.com'
		},
		{
			id: '9a1b4c7d',
			amount: 450,
			status: 'processing',
			email: 'support@tech.io'
		},
		{
			id: '2e5f8a3b',
			amount: 199.99,
			status: 'success',
			email: 'billing@corp.com'
		},
		{
			id: '7d3c6a9f',
			amount: 59.99,
			status: 'pending',
			email: 'info@startup.com'
		},
		{
			id: '4b9e2d6a',
			amount: 1200,
			status: 'success',
			email: 'premium@client.net'
		},
		{
			id: '1a8f5c3e',
			amount: 85.25,
			status: 'failed',
			email: 'contact@business.org'
		},
		{
			id: '5d7a2e9b',
			amount: 320.75,
			status: 'processing',
			email: 'sales@product.dev'
		},
		{
			id: '8c3b6f1d',
			amount: 25.99,
			status: 'pending',
			email: 'user@domain.co'
		},
		{
			id: '6e9a4b2f',
			amount: 650.0,
			status: 'success',
			email: 'admin@enterprise.com'
		}
	];
</script>

<div class="p-8">
	<DataTable data={payments} {columns} />

	<!-- <DataTable
	data={payments}
	{columns}
	searchKey="status"
	searchPlaceholder="Filter by status..."
/> -->
</div>
