<script lang="ts">
	import { goto } from '$app/navigation';
	import Message from '$lib/components/custom/message.svelte';
	import { Button } from '$lib/components/ui/button';
	import AddCategories from '$lib/modules/products/form/add-categories.svelte';
	import AddDetails from '$lib/modules/products/form/add-details.svelte';
	import AddImages from '$lib/modules/products/form/add-images.svelte';
	import { createProduct } from '$lib/modules/products/server/products.remote';
	import Icon from '@iconify/svelte';

	let msg = $state<string | null>(null);
</script>

<div class="min-h-[80vh] space-y-6">
	<!-- Page Header -->
	<div class="flex items-center justify-between rounded-md bg-background p-4 lg:p-8">
		<h2 class="text-xl font-semibold lg:text-2xl">New Product</h2>
	</div>

	<!-- Messages  -->
	{#if msg !== null}
		<Message variant="alert" text={msg} />
	{/if}

	<form
		{...createProduct.enhance(async ({ submit, form }) => {
			await submit();

			const res = createProduct.result;
			if (res?.error) {
				msg = res.error.message;
			} else if (res?.success) {
				form.reset();
				goto('/products');
			}
		})}
		enctype="multipart/form-data"
		class="space-y-6"
	>
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<AddDetails product={createProduct.fields} />

			<div class="space-y-6">
				<AddImages product={createProduct.fields} />
				<AddCategories product={createProduct.fields} />
			</div>
		</div>

		<div class="flex gap-4">
			<Button type="submit" disabled={!!createProduct.pending}>
				{#if createProduct.pending}
					<Icon icon="eos-icons:three-dots-loading" class="size-12" />
				{:else}
					Create Product
				{/if}
			</Button>
			<Button type="button" variant="outline" onclick={() => goto('/products')}>Cancel</Button>
		</div>
	</form>
</div>
