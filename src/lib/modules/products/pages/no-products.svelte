<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Icon from '@iconify/svelte';
</script>

<div
	class="rounded-md bg-background p-4"
>
  <div class="flex flex-col items-center justify-center min-h-[80vh] space-y-4">
       <Icon icon="fluent:box-dismiss-20-regular" class="size-30 text-gray-300" />

	<h2 class="text-2xl font-bold lg:text-3xl">No Products Found</h2>

	<p class="max-w-sm text-gray-300 text-center mb-6">
		You currently have no products. Add your first product to start managing your inventory.
	</p>

	<Button variant="secondary" href="/products/new">
		+ Add Product
	</Button>
  </div>
</div>
