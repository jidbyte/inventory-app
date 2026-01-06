<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import {
		Dialog,
		DialogTrigger,
		DialogContent,
		DialogHeader,
		DialogTitle,
		DialogDescription,
		DialogFooter,
		DialogClose
	} from '$lib/components/ui/dialog/index.js';
	import { deleteProduct, getProductById } from '$lib/modules/products/server/products.remote';
	import Icon from '@iconify/svelte';
	import toast from 'svelte-french-toast';

	let { params } = $props();

	async function handleDelete(id: string) {
		const result = await deleteProduct(id);
		if (result?.success) {
			goto('/products');
			toast.success('Product deleted successfully');
		} else {
			toast.success(result.error?.message || 'Request failed!');
		}
	}
</script>

<div class="min-h-[80vh] rounded-md bg-background">
	{#await getProductById(params.id)}
		<div class="flex h-full flex-col items-center justify-center gap-4">
			<Icon icon="mingcute:loading-fill" class="size-15 animate-spin" />
			<span>Loading product...</span>
		</div>
	{:then product}
		<div class="space-y-4">
			<div>
				<div class="font-medium">{product.name}</div>
				<div class="text-sm text-muted-foreground">{product.sku}</div>
			</div>

			<Dialog>
				<DialogTrigger class={buttonVariants({ variant: 'destructive' })}>
					Delete product
				</DialogTrigger>

				<DialogContent class="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Delete product</DialogTitle>
						<DialogDescription>
							This action cannot be undone. This will permanently delete
							<strong class="mx-1">{product.name}</strong>
							and remove it from your inventory
						</DialogDescription>
					</DialogHeader>

					<DialogFooter class="gap-2 sm:justify-end">
						<DialogClose class={buttonVariants({ variant: 'secondary' })}>Cancel</DialogClose>
						<Button variant="destructive" onclick={() => handleDelete(product.id)}>
							{deleteProduct.pending ? 'Deleting...' : 'Confirm delete'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	{:catch error}
		<p class="text-red-600">Error loading product: {error.message}</p>
	{/await}
</div>
