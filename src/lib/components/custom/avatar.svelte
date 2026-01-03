<script lang="ts">
	import { cn } from 'tailwind-variants';

	interface Props {
		src?: string | null;
		alt?: string;
		fallback?: string;
		size?: 'sm' | 'md' | 'lg' | 'xl';
		class?: string;
		shape?: 'circle' | 'square';
	}

	let {
		src = null,
		alt = '',
		fallback = '',
		size = 'md',
		class: className = '',
		shape = 'circle'
	}: Props = $props();

	let imageLoaded = $state(false);
	let imageError = $state(false);

	// Generate initials from fallback text
	const getInitials = (text: string): string => {
		if (!text) return '?';

		const words = text.trim().split(/\s+/);
		if (words.length === 1) {
			return words[0].charAt(0).toUpperCase();
		}
		return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
	};

	const initials = $derived(getInitials(fallback || alt));

	// Size classes
	const sizeClasses = {
		sm: 'size-6 text-xs',
		md: 'size-8 text-sm',
		lg: 'size-10 text-base',
		xl: 'size-12 text-lg'
	};

	// Shape classes
	const shapeClasses = {
		circle: 'rounded-full',
		square: 'rounded-lg'
	};

	// Generate a consistent color based on the fallback text
	const getColorFromText = (text: string): string => {
		const colors = [
			'bg-gradient-to-br from-sky-500 to-blue-600',
			'bg-gradient-to-br from-purple-500 to-pink-600',
			'bg-gradient-to-br from-green-500 to-emerald-600',
			'bg-gradient-to-br from-orange-500 to-red-600',
			'bg-gradient-to-br from-indigo-500 to-purple-600',
			'bg-gradient-to-br from-cyan-500 to-teal-600',
			'bg-gradient-to-br from-rose-500 to-pink-600',
			'bg-gradient-to-br from-amber-500 to-orange-600'
		];

		let hash = 0;
		for (let i = 0; i < text.length; i++) {
			hash = text.charCodeAt(i) + ((hash << 5) - hash);
		}
		return colors[Math.abs(hash) % colors.length];
	};

	const backgroundColor = $derived(getColorFromText(fallback || alt || ''));

	const handleImageLoad = () => {
		imageLoaded = true;
		imageError = false;
	};

	const handleImageError = () => {
		imageError = true;
		imageLoaded = false;
	};

	const showImage = $derived(src && !imageError);
</script>

<div
	class={cn(
		'relative inline-flex items-center justify-center overflow-hidden font-semibold text-white',
		sizeClasses[size],
		shapeClasses[shape],
		!showImage && backgroundColor,
		className
	)}
	role="img"
	aria-label={alt || fallback}
>
	{#if showImage}
		<img
			{src}
			{alt}
			onload={handleImageLoad}
			onerror={handleImageError}
			class={cn(
				'size-full object-cover transition-opacity duration-300',
				imageLoaded ? 'opacity-100' : 'opacity-0'
			)}
		/>

		{#if !imageLoaded}
			<!-- Loading state shows initials while image loads -->
			<span class="absolute inset-0 flex items-center justify-center">
				{initials}
			</span>
		{/if}
	{:else}
		<!-- Fallback: Show initials -->
		<span class="select-none">
			{initials}
		</span>
	{/if}
</div>
