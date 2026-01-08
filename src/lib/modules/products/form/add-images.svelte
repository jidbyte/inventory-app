<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Icon from '@iconify/svelte';

	type UploadedImage = {
		url: string;
		fileKey: string;
	};

	let { product } = $props();

	let selectedFiles = $state<File[]>([]);
	let previewUrls = $state<string[]>([]);
	let uploadedImages = $state<UploadedImage[]>([]);
	let isUploading = $state(false);
	let uploadError = $state<string | null>(null);

	const MAX_IMAGES = 5;

	function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		const files = Array.from(input.files || []);

		// Check if adding these files would exceed the limit
		if (selectedFiles.length + uploadedImages.length + files.length > MAX_IMAGES) {
			uploadError = `You can only upload up to ${MAX_IMAGES} images`;
			return;
		}

		// Validate each file
		for (const file of files) {
			if (!file.type.startsWith('image/')) {
				uploadError = 'Only image files are allowed';
				return;
			}
			if (file.size > 5 * 1024 * 1024) {
				uploadError = 'Each image must be less than 5MB';
				return;
			}
		}

		uploadError = null;
		selectedFiles = [...selectedFiles, ...files];
		previewUrls = [...previewUrls, ...files.map((file) => URL.createObjectURL(file))];
	}

	function removePreview(index: number) {
		URL.revokeObjectURL(previewUrls[index]);
		selectedFiles = selectedFiles.filter((_, i) => i !== index);
		previewUrls = previewUrls.filter((_, i) => i !== index);
	}

	async function uploadImages() {
		if (selectedFiles.length === 0) return;

		isUploading = true;
		uploadError = null;

		try {
			for (const file of selectedFiles) {
				const formData = new FormData();
				formData.append('image', file);

				const response = await fetch('?/upload', {
					method: 'POST',
					body: formData
				});

				const result = await response.json();

				if (result.type === 'success' && result.data) {
					uploadedImages = [
						...uploadedImages,
						{
							url: result.data.url,
							fileKey: result.data.filename
						}
					];
				} else {
					throw new Error(result.data?.error || 'Upload failed');
				}
			}

			// Clear previews after successful upload
			previewUrls.forEach((url) => URL.revokeObjectURL(url));
			selectedFiles = [];
			previewUrls = [];
		} catch (error) {
			uploadError = error instanceof Error ? error.message : 'Failed to upload images';
		} finally {
			isUploading = false;
		}
	}

	async function removeUploadedImage(index: number) {
		const image = uploadedImages[index];

		try {
			const formData = new FormData();
			formData.append('filename', image.fileKey);

			const response = await fetch('?/delete', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (result.type === 'success') {
				uploadedImages = uploadedImages.filter((_, i) => i !== index);
			}
		} catch (error) {
			console.error('Failed to delete image:', error);
		}
	}

	// Update the product.images value whenever uploadedImages changes
	$effect(() => {
		const imageUrls = uploadedImages.map((img) => img.url);
		product.images.value = imageUrls;
	});
</script>

<section class="space-y-4 rounded-md bg-background p-4 lg:p-6">
	<!-- Hidden input for form submission -->
	{#each uploadedImages as img, i}
		<input type="hidden" name="images[{i}]" value={img.url} />
	{/each}

	<h3 class="text-lg font-medium">Product Images (Max {MAX_IMAGES})</h3>

	{#if uploadError}
		<div class="rounded-md bg-red-50 p-3 text-sm text-red-600">
			{uploadError}
		</div>
	{/if}

	<!-- Upload Area -->
	<div class="w-full">
		<label
			class="group flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-muted-foreground/40 bg-muted/20 p-6 transition focus-within:ring-2 focus-within:ring-ring hover:bg-muted/30 disabled:opacity-50"
		>
			<input
				type="file"
				accept="image/*"
				multiple
				class="sr-only"
				onchange={handleFileSelect}
				disabled={isUploading || uploadedImages.length >= MAX_IMAGES}
			/>

			<div class="flex flex-col items-center gap-2 text-center">
				<svg
					class="h-8 w-8 text-muted-foreground transition group-hover:text-foreground"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.5"
						d="M12 16v-8m0 0l-3 3m3-3l3 3M4 16.5a3.5 3.5 0 013.5-3.5h9a3.5 3.5 0 010 7h-9A3.5 3.5 0 014 16.5z"
					/>
				</svg>

				<p class="text-sm font-medium">
					{uploadedImages.length >= MAX_IMAGES
						? 'Maximum images reached'
						: 'Click to upload or drag & drop'}
				</p>
				<p class="text-xs text-muted-foreground">
					PNG, JPG, WEBP (max 5MB) • {uploadedImages.length}/{MAX_IMAGES} uploaded
				</p>
			</div>
		</label>
	</div>

	<!-- Preview Selected Files -->
	{#if previewUrls.length > 0}
		<div class="space-y-2">
			<p class="text-sm font-medium">Selected files ({selectedFiles.length})</p>
			<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
				{#each previewUrls as url, index}
					<div class="group relative aspect-square overflow-hidden rounded-lg border">
						<img src={url} alt="Preview {index + 1}" class="h-full w-full object-cover" />
						<button
							type="button"
							onclick={() => removePreview(index)}
							aria-label="Remove preview image {index + 1}"
							class="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-600"
						>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
				{/each}
			</div>

			<Button type="button" onclick={uploadImages} disabled={isUploading} class="w-full">
				{#if isUploading}
					<Icon icon="eos-icons:three-dots-loading" class="mr-2 size-5" />
					Uploading...
				{:else}
					Upload {selectedFiles.length} {selectedFiles.length === 1 ? 'Image' : 'Images'}
				{/if}
			</Button>
		</div>
	{/if}

	<!-- Uploaded Images -->
	{#if uploadedImages.length > 0}
		<div class="space-y-2">
			<p class="text-sm font-medium">Uploaded images</p>
			<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
				{#each uploadedImages as image, index}
					<div class="group relative aspect-square overflow-hidden rounded-lg border">
						<img src={image.url} alt="Uploaded {index + 1}" class="h-full w-full object-cover" />
						{#if index === 0}
							<div
								class="absolute top-2 left-2 rounded bg-blue-500 px-2 py-1 text-xs font-medium text-white"
							>
								Primary
							</div>
						{/if}
						<div
							class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100"
						>
							<button
								type="button"
								onclick={() => removeUploadedImage(index)}
								class="rounded-full bg-red-500 p-2 text-white hover:bg-red-700"
								aria-label="Delete uploaded image {index + 1}"
							>
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
									/>
								</svg>
							</button>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</section>
