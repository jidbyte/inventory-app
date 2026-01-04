<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { sidebar } from '$lib/states/sidebar.svelte';
	import Icon from '@iconify/svelte';
	import { cn } from 'tailwind-variants';
	import Button from '../ui/button/button.svelte';
	import { SignOutClient } from '$lib/modules/auth/client';
	import { slide } from 'svelte/transition';

	const routes = [
		{ name: 'Overview', icon: 'solar:widget-5-bold', path: '/dashboard/overview' },
		{ name: 'Products', icon: 'solar:box-minimalistic-bold', path: '/dashboard/products' },
		{ name: 'Sales', icon: 'solar:dollar-bold', path: '/dashboard/sales' },
		{ name: 'Purchases', icon: 'solar:cart-bold', path: '/dashboard/purchases' },
		{ name: 'Clients', icon: 'solar:user-bold', path: '/dashboard/clients' },
		{ name: 'Vendors', icon: 'solar:suitcase-tag-bold', path: '/dashboard/vendors' },
		{ name: 'Analytics', icon: 'solar:chart-bold', path: '/dashboard/analytics' }
	];

	let pathname = $derived(page.url.pathname);

	const Navigate = (path: string) => goto(path);
</script>

<aside
	class={cn(
		'fixed top-0 left-0 z-40 hidden border-r border-gray-600 bg-gray-950 shadow-sm transition-all duration-300 md:block',
		sidebar.isOpen ? 'w-56' : 'w-16'
	)}
>
	<div class="flex h-screen flex-col items-start justify-between">
		<div class="w-full">
			<!-- Sidebar Header -->
			<header
				class="flex h-15 items-center justify-between border-b border-gray-600 p-4 transition-all duration-300"
			>
				<!-- Logo-->
				<div
					class={cn(
						'inline-flex items-center gap-1 font-medium',
						sidebar.isOpen ? 'text-2xl' : 'hidden'
					)}
				>
					<Icon icon="icon-park-twotone:paper-ship" />
					<span class="text-lg tracking-tight">Inventory</span>
				</div>

				<!-- Toggle Sidebar -->
				<button onclick={() => sidebar.toggle()}>
					<Icon
						icon={sidebar.isOpen
							? 'solar:round-alt-arrow-left-bold'
							: 'solar:round-alt-arrow-right-bold'}
						class="size-6 text-gray-200 hover:text-sky-200"
					/>
				</button>
			</header>

			<!-- Sidebar Navigation -->
			<nav class="w-full flex-1 overflow-y-auto px-2 py-10">
				<ul class={cn('space-y-1', !sidebar.isOpen && 'grid place-content-center')}>
					{#each routes as route}
						<li>
							<button
								onclick={() => Navigate(route.path)}
								class={cn(
									'inline-flex w-full items-center gap-2 p-2 text-white/70 transition-colors duration-200 hover:text-white',
									pathname === route.path && 'rounded bg-white/15 font-medium text-white'
								)}
							>
								<Icon icon={route.icon} class={sidebar.isOpen ? 'size-4.5' : 'size-6'} />
								{#if sidebar.isOpen}
									<span
										in:slide={{ duration: 250, axis: 'x' }}
										out:slide={{ duration: 200, axis: 'x' }}
									>
										{route.name}
									</span>
								{/if}
							</button>
						</li>
					{/each}
				</ul>
			</nav>
		</div>

		<!-- Sidebar Footer -->
		<footer class="w-full p-4">
			<Button
				onclick={SignOutClient}
				class="inline-flex w-full items-center gap-2"
				variant="outline"
			>
				<Icon icon="solar:logout-2-outline" />
				<span class:hidden={!sidebar.isOpen}>Sign out</span>
			</Button>
		</footer>
	</div>
</aside>
