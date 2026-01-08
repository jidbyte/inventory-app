import { r2Client, uploadToR2 } from '$lib/server/cloudflare/r2';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { fail, type Actions } from '@sveltejs/kit';

export const actions = {
	upload: async ({ request }) => {
		const formData = await request.formData();
		const file = formData.get('image') as File;

		if (!file || file.size === 0) {
			return fail(400, { error: 'No file uploaded' });
		}

		// Validate file type
		if (!file.type.startsWith('image/')) {
			return fail(400, { error: 'File must be an image' });
		}

		// Validate file size (e.g., max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			return fail(400, { error: 'File size must be less than 5MB' });
		}

		try {
			// Generate unique filename
			const timestamp = Date.now();
			const filename = `${timestamp}-${file.name}`;

			await uploadToR2(file, filename);

			return {
				success: true,
				filename,
				url: `${process.env.R2_PUBLIC_URL}/${filename}`
			};
		} catch (error) {
			console.error('Upload error:', error);
			return fail(500, { error: 'Failed to upload file' });
		}
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const filename = formData.get('filename') as string;

		if (!filename) {
			return fail(400, { error: 'No filename provided' });
		}

		try {
			const command = new DeleteObjectCommand({
				Bucket: process.env.R2_BUCKET_NAME,
				Key: filename
			});

			await r2Client.send(command);

			return {
				deleted: true,
				filename
			};
		} catch (error) {
			console.error('Delete error:', error);
			return fail(500, { error: 'Failed to delete file' });
		}
	}
} satisfies Actions;
