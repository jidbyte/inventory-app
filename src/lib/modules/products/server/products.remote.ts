import { command, form, query } from '$app/server';
import { db } from '$lib/server/db';
import { category, product, productCategory, image } from '$lib/server/db/schema';
import { requireAuth } from '$lib/utils/server';
import { eq, and } from 'drizzle-orm';
import { createProductSchema } from './schema';
import { handleDbError } from '$lib/server/db/errors';
import { deleteFromR2 } from '$lib/server/cloudflare/r2';
import z from 'zod';

export const getAllProducts = query(async () => {
	try {
		const userId = requireAuth();

		const products = await db.query.product.findMany({
			where: eq(product.userId, userId),
			with: {
				images: true,
				productCategories: {
					with: {
						category: true
					}
				}
			},
			orderBy: (product, { desc }) => [desc(product.updatedAt)]
		});

		return products;
	} catch (error) {
		const { message } = handleDbError(error);
		throw new Error(message);
	}
});

export const getProductById = query(z.string(), async (productId) => {
	try {
		const userId = requireAuth();

		const dbProduct = await db.query.product.findFirst({
			where: and(eq(product.id, productId), eq(product.userId, userId)),
			with: {
				images: true,
				productCategories: {
					with: {
						category: true
					}
				}
			}
		});

		if (!dbProduct) {
			throw new Error('Product not found');
		}

		const { productCategories, ...productData } = dbProduct;
		const categories = productCategories.map((pc) => ({
			id: pc.category.id,
			name: pc.category.name
		}));

		return {
			...productData,
			categories
		};
	} catch (error) {
		const { message } = handleDbError(error);
		throw new Error(message);
	}
});

export const getAllCategories = query(async () => {
	try {
		const userId = requireAuth();

		const categories = await db.query.category.findMany({
			where: eq(category.userId, userId),
			with: {
				productCategories: {
					with: {
						product: true
					}
				}
			},
			orderBy: (category, { asc }) => [asc(category.name)]
		});

		return categories;
	} catch (error) {
		const { message } = handleDbError(error);
		throw new Error(message);
	}
});

export const createProduct = form(createProductSchema, async (data) => {
	try {
		const userId = requireAuth();
		const { categories: productCategories, images: productImages, ...productData } = data;

		await db.transaction(async (tx) => {
			// 1. Create product
			const [newProduct] = await tx
				.insert(product)
				.values({ ...productData, userId })
				.returning();

			// 2. Handle categories
			if (productCategories && productCategories.length > 0) {
				const categoryNames = productCategories
					.flatMap((c) => c.split(',').map((n) => n.trim().toLowerCase()))
					.filter(Boolean);

				for (const name of categoryNames) {
					let [existingCategory] = await tx
						.select()
						.from(category)
						.where(and(eq(category.name, name), eq(category.userId, userId)));

					if (!existingCategory) {
						[existingCategory] = await tx.insert(category).values({ name, userId }).returning();
					}

					await tx.insert(productCategory).values({
						productId: newProduct.id,
						categoryId: existingCategory.id
					});
				}
			}

			// 3. Handle images
			if (productImages && productImages.length > 0) {
				for (let i = 0; i < productImages.length; i++) {
					const imageUrl = productImages[i];
					// Extract fileKey from URL (assuming format: https://domain.com/timestamp-filename.jpg)
					const fileKey = imageUrl.split('/').pop() || '';

					await tx.insert(image).values({
						url: imageUrl,
						fileKey: fileKey,
						productId: newProduct.id,
						isPrimary: i === 0 // First image is primary
					});
				}
			}
		});

		await getAllProducts().refresh();
		return { success: true };
	} catch (error) {
		const { message, constraint } = handleDbError(error);
		console.error('Database operation failed:', { message, constraint });

		return { success: false, error: { message, constraint } };
	}
});

export const deleteProduct = command(z.string(), async (productId) => {
	try {
		const userId = requireAuth();

		const existingProduct = await db.query.product.findFirst({
			where: and(eq(product.id, productId), eq(product.userId, userId)),
			with: {
				images: true
			}
		});

		if (!existingProduct) {
			return { success: false, error: { message: 'Product not found' } };
		}

		// Delete images from R2
		for (const img of existingProduct.images) {
			try {
				await deleteFromR2(img.fileKey);
			} catch (error) {
				console.error(`Failed to delete image from R2: ${img.fileKey}`, error);
			}
		}

		// Delete product (cascade will handle images and productCategory)
		await db.delete(product).where(eq(product.id, productId));

		await getAllProducts().refresh();
		return { success: true };
	} catch (error) {
		const { message } = handleDbError(error);
		return { success: false, error: { message } };
	}
});

export const deleteImage = command(z.string(), async (imageId) => {
	try {
		const userId = requireAuth();

		// Get the image with its product to verify ownership
		const existingImage = await db.query.image.findFirst({
			where: eq(image.id, imageId),
			with: {
				product: true
			}
		});

		if (!existingImage) {
			return { success: false, error: { message: 'Image not found' } };
		}

		// Verify the user owns the product
		if (existingImage.product.userId !== userId) {
			return { success: false, error: { message: 'Unauthorized' } };
		}

		// Delete from R2
		try {
			await deleteFromR2(existingImage.fileKey);
		} catch (error) {
			console.error(`Failed to delete image from R2: ${existingImage.fileKey}`, error);
		}

		// Delete from database
		await db.delete(image).where(eq(image.id, imageId));

		// Refresh products list
		await getAllProducts().refresh();
		return { success: true };
	} catch (error) {
		const { message } = handleDbError(error);
		return { success: false, error: { message } };
	}
});
