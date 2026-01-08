<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import {
		Dialog,
		DialogClose,
		DialogContent,
		DialogFooter,
		DialogTitle
	} from '$lib/components/ui/dialog';
	import DialogTrigger from '$lib/components/ui/dialog/dialog-trigger.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { getAllCategories } from '../server/products.remote';

	let { product } = $props();

	let newCategory = $state('');
	let selectedCategories = $state<string[]>([]);

	function addNewCategory() {
		const value = newCategory.trim().toLowerCase();
		if (!value) return;

		if (!selectedCategories.includes(value)) {
			selectedCategories = [...selectedCategories, value];
		}

		newCategory = '';
	}

	function removeCategory(index: number) {
		selectedCategories = selectedCategories.filter((_, i) => i !== index);
	}

	function toggleCategory(name: string) {
		if (selectedCategories.includes(name.trim().toLowerCase())) {
			selectedCategories = selectedCategories.filter((c) => c !== name);
		} else {
			selectedCategories = [...selectedCategories, name];
		}
	}

	$inspect(selectedCategories);
</script>

<section class="space-y-4 rounded-md bg-background p-4 lg:p-8">
	<input
		{...product.categories.as('select multiple')}
		bind:value={selectedCategories}
		class="hidden"
		readonly
	/>

	{#await getAllCategories()}
		<p class="py-8 font-bold text-gray-500">Loading categories...</p>
	{:then allCategories}
		<div>
			{#if selectedCategories.length > 0}
				<ul class="flex flex-wrap gap-2">
					{#each selectedCategories as ctg, index}
						<li class="flex items-center gap-2 rounded-full border border-white px-4 py-1">
							<span>{ctg}</span>
							<button
								type="button"
								onclick={() => removeCategory(index)}
								class="text-red-600 hover:text-red-800"
							>
								×
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		</div>

		<div>
			<div class="flex w-full gap-4">
				<Input type="text" bind:value={newCategory} />
				<Button onclick={addNewCategory}>Add</Button>
			</div>
		</div>

		<Dialog>
			<DialogTrigger class={buttonVariants({ variant: 'outline' })}>
				Select categories
			</DialogTrigger>

			<DialogContent class="sm:max-w-md">
				<DialogTitle>All Categories</DialogTitle>

				<div>
					{#if allCategories.length > 0}
						<ul>
							{#each allCategories as ctg}
								<li class="flex items-center gap-2">
									<input
										type="checkbox"
										checked={selectedCategories.includes(ctg.name)}
										onchange={() => toggleCategory(ctg.name)}
									/>
									<span>{ctg.name}</span>
								</li>
							{/each}
						</ul>
					{:else}
						<p>No categories found.</p>
					{/if}
				</div>

				<DialogFooter class="gap-2 sm:justify-end">
					<DialogClose class={buttonVariants({ variant: 'secondary' })}>Confirm</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	{:catch error}
		<p class="text-red-600">Error loading tags: {error.message}</p>
	{/await}
</section>
