import { command, form, query } from '$app/server';
import { db } from '$lib/server/db';
import { product } from '$lib/server/db/schema';
import { requireAuth } from '$lib/utils/server';
import { eq, and } from 'drizzle-orm';
import { createProductSchema } from './schema';
import { handleDbError } from '$lib/server/db/errors';
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

		return dbProduct;
	} catch (error) {
		const { message } = handleDbError(error);
		throw new Error(message);
	}
});

export const createProduct = form(createProductSchema, async (productData) => {
	try {
		const userId = requireAuth();

		const [newProduct] = await db
			.insert(product)
			.values({ ...productData, userId })
			.returning();

		await getAllProducts().refresh();
		return { success: true, product: newProduct };
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
			where: and(eq(product.id, productId), eq(product.userId, userId))
		});

		if (!existingProduct) {
			return { success: false, error: { message: 'Product not found' } };
		}

		await db.delete(product).where(eq(product.id, productId));

		await getAllProducts().refresh();
		return { success: true };
	} catch (error) {
		const { message } = handleDbError(error);
		return { success: false, error: { message } };
	}
});
