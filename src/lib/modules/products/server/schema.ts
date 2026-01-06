import * as z from 'zod';

const numericString = (field: string) =>
	z
		.string()
		.default('0')
		.refine((val) => !isNaN(Number(val)), {
			message: `${field} must be a valid number`
		})
		.transform(Number)
		.pipe(
			z.number().min(0, {
				message: `${field} must be 0 or greater`
			})
		);

export const createProductSchema = z.object({
	name: z
		.string()
		.min(1, { message: 'Name is required' })
		.max(50, { message: 'Name must not exceed 50 characters' }),
	sku: z
		.string()
		.min(1, { message: 'SKU is required' })
		.max(20, { message: 'SKU must not exceed 20 characters' }),
	code: z.string().max(20, { message: 'Code must not exceed 20 characters' }).optional(),
	brand: z.string().max(50, { message: 'Brand must not exceed 50 characters' }).optional(),
	model: z.string().max(50, { message: 'Model must not exceed 50 characters' }).optional(),
	description: z
		.string()
		.max(500, { message: 'Description must not exceed 500 characters' })
		.optional(),
	quantity: numericString('Quantity'),
	restockLevel: numericString('Restock level'),
	optimalLevel: numericString('Optimal level'),
	cost: numericString('Cost'),
	price: numericString('Price')
});

export const updateProductSchema = createProductSchema.partial().extend({
	id: z.string().min(1)
});
