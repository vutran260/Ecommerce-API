import { mysqlTable, mysqlSchema, AnyMySqlColumn, primaryKey, varchar, timestamp, foreignKey, unique } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"


export const Admin = mysqlTable("LP_ADMIN", {
	id: varchar("id", { length: 255 }).notNull(),
	email: varchar("email", { length: 255 }),
	phone: varchar("phone", { length: 225 }),
	password: varchar("password", { length: 225 }),
	username: varchar("username", { length: 225 }),
	fullname: varchar("fullname", { length: 225 }),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
},
(table) => {
	return {
		lpAdminId: primaryKey({ columns: [table.id], name: "LP_ADMIN_id"}),
	}
});

export const Buyer = mysqlTable("LP_BUYER", {
	id: varchar("id", { length: 255 }).notNull().references(() => User.id),
	email: varchar("email", { length: 255 }),
	phone: varchar("phone", { length: 225 }),
	password: varchar("password", { length: 225 }),
	username: varchar("username", { length: 225 }),
	fullname: varchar("fullname", { length: 225 }),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
},
(table) => {
	return {
		lpBuyerId: primaryKey({ columns: [table.id], name: "LP_BUYER_id"}),
	}
});

export const Product = mysqlTable("LP_PRODUCT", {
	id: varchar("id", { length: 255 }).notNull(),
	productName: varchar("product_name", { length: 255 }),
	productTag: varchar("product_tag", { length: 255 }),
	productType: varchar("product_type", { length: 255 }),
	stock: varchar("stock", { length: 255 }),
	price: varchar("price", { length: 255 }),
	status: varchar("status", { length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
},
(table) => {
	return {
		lpProductId: primaryKey({ columns: [table.id], name: "LP_PRODUCT_id"}),
	}
});

export const Seller = mysqlTable("LP_SELLER", {
	id: varchar("id", { length: 255 }).notNull().references(() => User.id),
	storeId: varchar("store_id", { length: 255 }).references(() => Store.id),
	email: varchar("email", { length: 255 }),
	phone: varchar("phone", { length: 225 }),
	password: varchar("password", { length: 225 }),
	username: varchar("username", { length: 225 }),
	fullname: varchar("fullname", { length: 225 }),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
},
(table) => {
	return {
		lpSellerId: primaryKey({ columns: [table.id], name: "LP_SELLER_id"}),
	}
});

export const Store = mysqlTable("LP_STORE", {
	id: varchar("id", { length: 255 }).notNull(),
	storeKey: varchar("store_key", { length: 255 }),
	storeName: varchar("store_name", { length: 255 }),
	status: varchar("status", { length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
},
(table) => {
	return {
		lpStoreId: primaryKey({ columns: [table.id], name: "LP_STORE_id"}),
		storeKey: unique("store_key").on(table.storeKey),
	}
});

export const User = mysqlTable("LP_USER", {
	id: varchar("id", { length: 255 }).notNull(),
	email: varchar("email", { length: 255 }),
	phone: varchar("phone", { length: 225 }),
	password: varchar("password", { length: 225 }),
	username: varchar("username", { length: 225 }),
	fullname: varchar("fullname", { length: 225 }),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
},
(table) => {
	return {
		lpUserId: primaryKey({ columns: [table.id], name: "LP_USER_id"}),
	}
});


export const category = mysqlTable("LP_CATEGORY", {
	id: varchar("id", { length: 255 }).notNull(),
	parent_id: varchar("parent_id", {length: 255}),
	category_name: varchar("category_name", { length: 255}),
	category_tag: varchar("category_tag", { length: 255}),
	status: varchar("status", { length: 255}),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
});