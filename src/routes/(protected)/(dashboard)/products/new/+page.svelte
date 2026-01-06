<script lang="ts">
	import { goto } from '$app/navigation';
	import Message from '$lib/components/custom/message.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { createProduct } from '$lib/modules/products/server/products.remote';
	import Icon from '@iconify/svelte';
	import toast from 'svelte-french-toast';

	const {
		name,
		description,
		sku,
		code,
		brand,
		model,
		quantity,
		restockLevel,
		optimalLevel,
		cost,
		price
	} = createProduct.fields;

	let msg = $state<string | null>(null);
</script>

<div class="min-h-[80vh] space-y-4 rounded-md bg-background p-4 lg:p-8">
	<!-- Messages  -->
	<div>
		{#if msg !== null}
			<Message variant="alert" text={msg} />
		{/if}
	</div>

	<form
		{...createProduct.enhance(async ({ submit, form }) => {
			await submit();

			const res = createProduct.result;
			if (res?.error) {
				msg = res.error.message;
			} else if (res?.success) {
				form.reset();
				goto('/products');
				toast.success('Product created successfully');
			}
		})}
		class="max-w-md space-y-4"
	>
		<div>
			<label for="name">Name</label>
			<Input {...name.as('text')} />
			{#each name.issues() as issue}
				<Message text={issue.message} />
			{/each}
		</div>

		<div>
			<label for="description">Description</label>
			<Input {...description.as('text')} />
			{#each description.issues() as issue}
				<Message text={issue.message} />
			{/each}
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div>
				<label for="brand">Brand</label>
				<Input {...brand.as('text')} />
				{#each brand.issues() as issue}
					<Message text={issue.message} />
				{/each}
			</div>

			<div>
				<label for="model">Model</label>
				<Input {...model.as('text')} />
				{#each model.issues() as issue}
					<Message text={issue.message} />
				{/each}
			</div>

			<div>
				<label for="sku">SKU</label>
				<Input {...sku.as('text')} />
				{#each sku.issues() as issue}
					<Message text={issue.message} />
				{/each}
			</div>

			<div>
				<label for="code">Code</label>
				<Input {...code.as('text')} />
				{#each code.issues() as issue}
					<Message text={issue.message} />
				{/each}
			</div>

			<div>
				<label for="cost">Cost Price</label>
				<Input {...cost.as('text')} />
				{#each cost.issues() as issue}
					<Message text={issue.message} />
				{/each}
			</div>

			<div>
				<label for="price">Selling Price</label>
				<Input {...price.as('text')} />
				{#each price.issues() as issue}
					<Message text={issue.message} />
				{/each}
			</div>
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
			<div>
				<label for="quantity">Qty In Stock</label>
				<Input {...quantity.as('text')} />
				{#each quantity.issues() as issue}
					<Message text={issue.message} />
				{/each}
			</div>

			<div>
				<label for="restockLevel">Restock Level</label>
				<Input {...restockLevel.as('text')} />
				{#each restockLevel.issues() as issue}
					<Message text={issue.message} />
				{/each}
			</div>

			<div>
				<label for="optimalLevel">Optimal Level</label>
				<Input {...optimalLevel.as('text')} />
				{#each optimalLevel.issues() as issue}
					<Message text={issue.message} />
				{/each}
			</div>
		</div>

		<Button type="submit" disabled={!!createProduct.pending}>
			{#if createProduct.pending}
				<Icon icon="eos-icons:three-dots-loading" class="size-12" />
			{:else}
				Create Product
			{/if}
		</Button>
	</form>
</div>
