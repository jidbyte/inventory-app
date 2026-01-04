import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, integer, boolean, index, primaryKey } from 'drizzle-orm/pg-core';
import { user } from './auth';

export const timestamps = {
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull()
};

export const product = pgTable(
	'product',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		name: text('name').notNull(),
		sku: text('sku').notNull().unique(),
		code: text('code'),
		brand: text('brand'),
		model: text('model'),
		description: text('description'),
		quantity: integer('quantity').notNull().default(0),
		restockLevel: integer('restock_level').notNull().default(0),
		optimalLevel: integer('optimal_level').notNull().default(0),
		cost: integer('cost').notNull().default(0),
		price: integer('price').notNull().default(0),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		...timestamps
	},
	(table) => [
		index('product_userId_idx').on(table.userId),
		index('product_name_idx').on(table.name),
		index('product_sku_idx').on(table.sku)
	]
);

export const category = pgTable(
	'category',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		name: text('name').notNull(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		...timestamps
	},
	(table) => [
		index('category_userId_idx').on(table.userId),
		index('category_name_idx').on(table.name)
	]
);

export const image = pgTable(
	'image',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		url: text('url').notNull(),
		fileKey: text('file_key').notNull(),
		productId: text('product_id')
			.notNull()
			.references(() => product.id, { onDelete: 'cascade' }),
		isPrimary: boolean('is_primary').notNull().default(false),
		...timestamps
	},
	(table) => [
		index('image_productId_idx').on(table.productId),
		index('image_isPrimary_idx').on(table.isPrimary)
	]
);

// Junction m2m table products and categories
export const productCategory = pgTable(
	'product_category',
	{
		productId: text('product_id')
			.notNull()
			.references(() => product.id, { onDelete: 'cascade' }),
		categoryId: text('category_id')
			.notNull()
			.references(() => category.id, { onDelete: 'cascade' }),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(table) => [
		primaryKey({ columns: [table.productId, table.categoryId] }),
		index('productCategory_productId_idx').on(table.productId),
		index('productCategory_categoryId_idx').on(table.categoryId)
	]
);

/// Relations
export const productRelations = relations(product, ({ many }) => ({
	images: many(image),
	productCategories: many(productCategory)
}));

export const categoryRelations = relations(category, ({ many }) => ({
	productCategories: many(productCategory)
}));

export const imageRelations = relations(image, ({ one }) => ({
	product: one(product, {
		fields: [image.productId],
		references: [product.id]
	})
}));

export const productCategoryRelations = relations(productCategory, ({ one }) => ({
	product: one(product, {
		fields: [productCategory.productId],
		references: [product.id]
	}),
	category: one(category, {
		fields: [productCategory.categoryId],
		references: [category.id]
	})
}));
