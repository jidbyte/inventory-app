<script lang="ts">
	import { enhance } from '$app/forms';

	type FormResult = {
		success?: boolean;
		filename?: string;
		url?: string;
		error?: string;
	};

	let { form } = $props<{ form: FormResult | null }>();
	let selectedFile = $state<File | null>(null);
	let previewUrl = $state<string>('');
	let isUploading = $state(false);
	let isDeleting = $state(false);

	function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		if (file) {
			selectedFile = file;
			previewUrl = URL.createObjectURL(file);
		}
	}

	function clearSelection() {
		selectedFile = null;
		previewUrl = '';
	}
</script>

<div class="container">
	<h1>Upload Image to Cloudflare R2</h1>

	<form
		method="POST"
		action="?/upload"
		enctype="multipart/form-data"
		use:enhance={() => {
			isUploading = true;
			return async ({ result, update }) => {
				await update();
				isUploading = false;

				// Log the result to console
				console.log('Upload result:', result);

				// Check if upload was successful and log the response
				if (result.type === 'success' && result.data?.success) {
					console.log('✅ Upload successful!');
					console.log('Filename:', result.data.filename);
					console.log('URL:', result.data.url);
					console.log('Full response:', result.data);
					clearSelection();
				} else if (result.type === 'failure') {
					console.error('❌ Upload failed:', result.data?.error);
				}
			};
		}}
	>
		<div class="upload-area">
			<input
				type="file"
				name="image"
				accept="image/*"
				onchange={handleFileSelect}
				disabled={isUploading}
			/>
		</div>

		{#if previewUrl}
			<div class="preview">
				<img src={previewUrl} alt="Preview" />
			</div>
		{/if}

		<button type="submit" disabled={!selectedFile || isUploading}>
			{isUploading ? 'Uploading...' : 'Upload Image'}
		</button>
	</form>

	{#if form?.error}
		<p class="error">{form.error}</p>
	{/if}

	{#if form?.success}
		<div class="success">
			<p>Upload successful!</p>
			<p>File: {form.filename}</p>
			<img src={form.url} alt="Uploaded" />
		</div>
	{/if}
</div>

{#if form?.success}
	<div class="success">
		<p>✅ Upload successful!</p>
		<p>File: {form.filename}</p>
		<img src={form.url} alt="Uploaded" />

		<form
			method="POST"
			action="?/delete"
			use:enhance={() => {
				isDeleting = true;
				return async ({ result, update }) => {
					await update();
					isDeleting = false;

					if (result.type === 'success' && result.data?.deleted) {
						console.log('✅ Image deleted!');
					}
				};
			}}
		>
			<input type="hidden" name="filename" value={form.filename} />
			<button type="submit" class="delete-btn" disabled={isDeleting}>
				{isDeleting ? 'Deleting...' : 'Delete Image'}
			</button>
		</form>
	</div>
{/if}

<style>
	.container {
		max-width: 600px;
		margin: 2rem auto;
		padding: 2rem;
	}

	.upload-area {
		margin: 1rem 0;
	}

	.preview {
		margin: 1rem 0;
	}

	.preview img {
		max-width: 100%;
		max-height: 300px;
		border-radius: 8px;
	}

	button {
		padding: 0.5rem 1rem;
		background: #0066cc;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	button:disabled {
		background: #ccc;
		cursor: not-allowed;
	}

	.error {
		color: red;
		margin-top: 1rem;
	}

	.success {
		color: green;
		margin-top: 1rem;
	}

	.success img {
		max-width: 100%;
		margin-top: 1rem;
		border-radius: 8px;
	}
</style>
