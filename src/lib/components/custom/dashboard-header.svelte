<script lang="ts">
	import { sidebar } from '$lib/states/sidebar.svelte';
	import { cn } from '$lib/utils/helpers';
	import Icon from '@iconify/svelte';
	import { Button } from '../ui/button';
	import { Input } from '../ui/input';
	import Avatar from './avatar.svelte';
	import type { PageData } from '../../../routes/$types';

	let { data }: { data: PageData } = $props();

	const user = $derived(data.user);
</script>

<!-- Larger Screens Header -->
<header class="sticky top-0 z-40 hidden border-b border-gray-600 md:block">
	<div class="flex h-15 items-center justify-between gap-6 p-4 px-8">
		<!-- Search Input -->
		<div class="md:w-xs lg:w-sm">
			<Input type="search" class="h-9 border-gray-400" icon="icon-park-outline:search" />
		</div>

		<!-- Action Buttons -->
		<div class="flex items-center justify-center gap-6">
			<Button size="sm">
				<Icon icon="bxs:plus-square" />
				<span>Quick Create</span>
			</Button>

			<div class="flex items-center justify-center gap-4">
				<span>
					<Icon icon="tabler:help-circle-filled" class="size-6 text-white/70 hover:text-white" />
				</span>
				<span>
					<Icon icon="famicons:notifications" class="size-6 text-white/70 hover:text-white" />
				</span>
				<span>
					<Icon icon="solar:settings-bold" class="size-6 text-white/70 hover:text-white" />
				</span>
			</div>

			<!-- User avatar -->
			<div class="flex items-center gap-2 rounded-full border bg-gray-700 p-1 pr-4">
				<Avatar fallback={user?.name} src={user?.image!} alt="User avatar" />
				<span>{user?.name}</span>
			</div>
		</div>
	</div>
</header>

<!-- Small Screens Header -->
<header class="sticky top-0 z-40 block border-b border-gray-600 md:hidden">
	<div class="flex h-15 items-center justify-between p-4">
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

		<div class="flex gap-4">
			<button>
				<Icon icon="bx:search" class="size-6 cursor-pointer hover:text-sky-300" />
			</button>
			<button>
				<Icon icon="ri:menu-3-line" class="size-6 cursor-pointer hover:text-sky-300" />
			</button>
		</div>
	</div>
</header>
