<script lang="ts">
	import DashboardHeader from '$lib/components/custom/dashboard-header.svelte';
	import DashboardSidebar from '$lib/components/custom/dashboard-sidebar.svelte';
	import { sidebar } from '$lib/states/sidebar.svelte';

	let { children, data } = $props();
</script>

<div class="flex h-screen">
	<DashboardSidebar />

	<div
		class="flex flex-1 flex-col transition-all duration-300 ease-in-out"
		class:md:ml-56={sidebar.isOpen}
		class:md:ml-16={!sidebar.isOpen}
	>
		<DashboardHeader {data} />

		<main class="flex-1 bg-gray-800 p-4 md:p-8">
			{@render children()}
		</main>
	</div>
</div>
