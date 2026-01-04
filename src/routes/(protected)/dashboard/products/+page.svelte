<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { productColumns } from '$lib/modules/products/table/product-columns';
	import ProductTable from '$lib/modules/products/table/product-table.svelte';
	import { getAllProducts } from '$lib/modules/products/server/products.remote';


</script>

<div>
	{#await getAllProducts()}
		<p class="py-8 font-bold text-gray-500">Loading products...</p>
	{:then products}
		<div>
			<div class="rounded-md bg-sky-200 p-4 text-sky-900 shadow-sm lg:p-6">
				<div class="flex w-full items-center justify-between">
					<h2
						class="inline-flex items-center justify-center gap-2 text-xl font-semibold lg:text-2xl"
					>
						<span>Products</span>
						<span class="grid h-8 w-8 place-content-center rounded-full bg-sky-300 p-1 text-sm">
							{products.length}
						</span>
					</h2>
					<Button variant="secondary">+ Add Product</Button>
				</div>
			</div>

			<div class="mt-4 rounded-md bg-background p-4 lg:p-6">
				<ProductTable
					data={products}
					columns={productColumns}
					searchKey="name"
					searchPlaceholder="Search products..."
				/>
			</div>
		</div>
	{:catch error}
		<p class="text-red-600">Error loading products: {error.message}</p>
	{/await}
</div>