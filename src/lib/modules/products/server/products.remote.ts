import { query } from '$app/server';
import { db } from '$lib/server/db';

export const getAllProducts = query(async () => {
	const products = await db.query.product.findMany();
	return products;
});
