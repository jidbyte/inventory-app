<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Button } from '$lib/components/ui/button';

	// Sample products data
	const products = [
		{
			id: 1,
			name: 'Premium Laptop',
			category: 'Electronics',
			price: '$1,299.99',
			stock: 45,
			status: 'In Stock',
			sales: 128
		},
		{
			id: 2,
			name: 'Wireless Headphones',
			category: 'Audio',
			price: '$199.99',
			stock: 12,
			status: 'Low Stock',
			sales: 89
		},
		{
			id: 3,
			name: 'Smart Watch',
			category: 'Wearables',
			price: '$349.99',
			stock: 0,
			status: 'Out of Stock',
			sales: 203
		},
		{
			id: 4,
			name: 'Desk Chair',
			category: 'Furniture',
			price: '$459.99',
			stock: 23,
			status: 'In Stock',
			sales: 67
		}
	];
</script>

<!-- Welcome Header -->
<div class="mb-8">
	<h1 class="text-2xl font-bold lg:text-3xl">All Products</h1>
	<p class="mt-2 text-gray-600">Here's what's happening with your products today.</p>
</div>

<!-- Stats Cards -->
<div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
	<div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
		<div class="flex items-center justify-between">
			<div>
				<p class="text-sm text-gray-500">Total Products</p>
				<p class="mt-2 text-2xl font-bold">8</p>
			</div>
			<div class="rounded-lg bg-sky-50 p-3">
				<Icon icon="solar:widget-bold" class="size-6 text-sky-600" />
			</div>
		</div>
	</div>

	<div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
		<div class="flex items-center justify-between">
			<div>
				<p class="text-sm text-gray-500">In Stock</p>
				<p class="mt-2 text-2xl font-bold text-gray-900">4</p>
			</div>
			<div class="rounded-lg bg-green-50 p-3">
				<Icon icon="solar:check-circle-bold" class="size-6 text-green-600" />
			</div>
		</div>
	</div>

	<div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
		<div class="flex items-center justify-between">
			<div>
				<p class="text-sm text-gray-500">Low Stock</p>
				<p class="mt-2 text-2xl font-bold text-gray-900">2</p>
			</div>
			<div class="rounded-lg bg-yellow-50 p-3">
				<Icon icon="solar:danger-triangle-bold" class="size-6 text-yellow-600" />
			</div>
		</div>
	</div>

	<div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
		<div class="flex items-center justify-between">
			<div>
				<p class="text-sm text-gray-500">Total Sales</p>
				<p class="mt-2 text-2xl font-bold text-gray-900">842</p>
			</div>
			<div class="rounded-lg bg-purple-50 p-3">
				<Icon icon="solar:chart-bold" class="size-6 text-purple-600" />
			</div>
		</div>
	</div>
</div>

<!-- Products Table -->
<div class="rounded-xl border border-gray-200 bg-white shadow-sm">
	<!-- Table Header -->
	<div class="border-b border-gray-200 px-6 py-4">
		<div class="flex items-center justify-between">
			<div>
				<h2 class="text-lg font-semibold text-gray-900">Products</h2>
				<p class="mt-1 text-sm text-gray-500">Manage your product inventory and details</p>
			</div>
			<Button class="bg-sky-600 text-white hover:bg-sky-700">
				<Icon icon="solar:add-circle-bold" class="mr-2 size-4" />
				Add Product
			</Button>
		</div>
	</div>

	<!-- Table -->
	<div class="overflow-x-auto">
		<table class="w-full">
			<thead>
				<tr class="border-b border-gray-200 bg-gray-50">
					<th
						class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
					>
						Product
					</th>
					<th
						class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
					>
						Category
					</th>
					<th
						class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
					>
						Price
					</th>
					<th
						class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
					>
						Stock
					</th>
					<th
						class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
					>
						Status
					</th>
					<th
						class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
					>
						Sales
					</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200">
				{#each products as product}
					<tr class="hover:bg-gray-50">
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="flex items-center">
								<div
									class="size-10 shrink-0 rounded-md bg-linear-to-br from-gray-200 to-gray-300"
								></div>
								<div class="ml-4">
									<div class="text-sm font-medium text-gray-900">{product.name}</div>
									<div class="text-sm text-gray-500">
										ID: PROD-{product.id.toString().padStart(3, '0')}
									</div>
								</div>
							</div>
						</td>
						<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-900">{product.category}</td>
						<td class="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
							{product.price}
						</td>
						<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-900">{product.stock}</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<span
								class="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
								class:bg-green-100={product.status === 'In Stock'}
								class:text-green-800={product.status === 'In Stock'}
								class:bg-yellow-100={product.status === 'Low Stock'}
								class:text-yellow-800={product.status === 'Low Stock'}
								class:bg-red-100={product.status === 'Out of Stock'}
								class:text-red-800={product.status === 'Out of Stock'}
							>
								{product.status}
							</span>
						</td>
						<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-900">{product.sales}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
