<script lang="ts">
	import Message from '$lib/components/custom/message.svelte';
	import { Input } from '$lib/components/ui/input';

	let { product } = $props();
</script>

<section class="space-y-4 rounded-md bg-background p-4 lg:p-8">
	<div>
		<label for="name">Name</label>
		<Input {...product.name.as('text')} />
		{#each product.name.issues() as issue}
			<Message text={issue.message} />
		{/each}
	</div>

	<div>
		<label for="description">Description</label>
		<Input {...product.description.as('text')} />
		{#each product.description.issues() as issue}
			<Message text={issue.message} />
		{/each}
	</div>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		<div>
			<label for="brand">Brand</label>
			<Input {...product.brand.as('text')} />
			{#each product.brand.issues() as issue}
				<Message text={issue.message} />
			{/each}
		</div>

		<div>
			<label for="model">Model</label>
			<Input {...product.model.as('text')} />
			{#each product.model.issues() as issue}
				<Message text={issue.message} />
			{/each}
		</div>

		<div>
			<label for="sku">SKU</label>
			<Input {...product.sku.as('text')} />
			{#each product.sku.issues() as issue}
				<Message text={issue.message} />
			{/each}
		</div>

		<div>
			<label for="code">Code</label>
			<Input {...product.code.as('text')} />
			{#each product.code.issues() as issue}
				<Message text={issue.message} />
			{/each}
		</div>

		<div>
			<label for="cost">Cost Price</label>
			<Input {...product.cost.as('text')} />
			{#each product.cost.issues() as issue}
				<Message text={issue.message} />
			{/each}
		</div>

		<div>
			<label for="price">Selling Price</label>
			<Input {...product.price.as('text')} />
			{#each product.price.issues() as issue}
				<Message text={issue.message} />
			{/each}
		</div>
	</div>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
		<div>
			<label for="quantity">Qty In Stock</label>
			<Input {...product.quantity.as('text')} />
			{#each product.quantity.issues() as issue}
				<Message text={issue.message} />
			{/each}
		</div>

		<div>
			<label for="restockLevel">Restock Level</label>
			<Input {...product.restockLevel.as('text')} />
			{#each product.restockLevel.issues() as issue}
				<Message text={issue.message} />
			{/each}
		</div>

		<div>
			<label for="optimalLevel">Optimal Level</label>
			<Input {...product.optimalLevel.as('text')} />
			{#each product.optimalLevel.issues() as issue}
				<Message text={issue.message} />
			{/each}
		</div>
	</div>
</section>
