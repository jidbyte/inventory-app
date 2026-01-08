import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import {
	R2_ACCOUNT_ID,
	R2_ACCESS_KEY_ID,
	R2_SECRET_ACCESS_KEY,
	R2_BUCKET_NAME
} from '$env/static/private';

export const r2Client = new S3Client({
	region: 'auto',
	endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: R2_ACCESS_KEY_ID,
		secretAccessKey: R2_SECRET_ACCESS_KEY
	}
});

export async function uploadToR2(file: File, key: string): Promise<string> {
	const buffer = Buffer.from(await file.arrayBuffer());

	const command = new PutObjectCommand({
		Bucket: R2_BUCKET_NAME,
		Key: key,
		Body: buffer,
		ContentType: file.type
	});

	await r2Client.send(command);

	return key;
}

export async function deleteFromR2(key: string): Promise<void> {
	const command = new DeleteObjectCommand({
		Bucket: R2_BUCKET_NAME,
		Key: key
	});

	await r2Client.send(command);
}
