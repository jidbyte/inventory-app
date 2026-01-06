<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import NoProducts from '$lib/modules/products/pages/no-products.svelte';
	import { getAllProducts } from '$lib/modules/products/server/products.remote';
	import { productColumns } from '$lib/modules/products/table/product-columns';
	import ProductTable from '$lib/modules/products/table/product-table.svelte';
	import Icon from '@iconify/svelte';
</script>

<div>
	{#await getAllProducts()}
		<div
			class="flex min-h-[80vh] flex-col items-center justify-center gap-4 rounded-md bg-background"
		>
			<Icon icon="mingcute:loading-fill" class="size-15 animate-spin" />
			<span>Loading products...</span>
		</div>
	{:then products}
		{#if products.length > 0}
			<div>
				<div class="rounded-md bg-background p-4 shadow-sm lg:p-6">
					<div class="flex w-full items-center justify-between">
						<h2
							class="inline-flex items-center justify-center gap-2 text-xl font-semibold lg:text-2xl"
						>
							<span>Products</span>
							<span class="grid h-8 w-8 place-content-center rounded-full bg-white/10 p-1 text-sm">
								{products.length}
							</span>
						</h2>

						<Button variant="secondary" href="/products/new">+ Add Product</Button>
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
		{:else}
			<NoProducts />
		{/if}
	{:catch error}
		<p class="text-red-600">Error loading products: {error.message}</p>
	{/await}
</div>
