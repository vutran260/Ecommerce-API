import { pgTable, uuid, varchar, timestamp, foreignKey, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const admin = pgTable("LP_ADMIN", {
	id: uuid("id").default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	email: varchar("email"),
	phone: varchar("phone"),
	password: varchar("password"),
	username: varchar("username"),
	fullname: varchar("fullname"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
});

export const user = pgTable("LP_USER", {
	id: uuid("id").default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	email: varchar("email"),
	phone: varchar("phone"),
	password: varchar("password"),
	username: varchar("username"),
	fullname: varchar("fullname"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
});

export const seller = pgTable("LP_SELLER", {
	id: uuid("id").primaryKey().notNull().references(() => user.id),
	storeId: uuid("store_id").references(() => store.id),
	email: varchar("email"),
	phone: varchar("phone"),
	password: varchar("password"),
	username: varchar("username"),
	fullname: varchar("fullname"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
});

export const store = pgTable("LP_STORE", {
		id: uuid("id").primaryKey().notNull(),
		storeKey: varchar("store_key"),
		storeName: varchar("store_name"),
		status: varchar("status"),
		createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
		updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
		deletedAt: timestamp("deleted_at", { mode: 'string' }),
	},
	(table) => {
		return {
			lpStoreStoreKeyKey: unique("LP_STORE_store_key_key").on(table.storeKey),
		}
	});

export const buyer = pgTable("LP_BUYER", {
	id: uuid("id").default(sql`uuid_generate_v4()`).primaryKey().notNull().references(() => user.id),
	email: varchar("email"),
	phone: varchar("phone"),
	password: varchar("password"),
	username: varchar("username"),
	fullname: varchar("fullname"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
});

export const product = pgTable("LP_PRODUCT", {
	id: uuid("id").default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	product_name: varchar("product_name"),
	product_tag: varchar("product_tag"),
	product_type: varchar("product_type"),
	stock: varchar("stock"),
	price: varchar("price"),
	status: varchar("status"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
});

export const category = pgTable("LP_CATEGORY", {
	id: uuid("id").default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	parent_id: varchar("parent_id") || null,
	category_name: varchar("category_name"),
	category_tag: varchar("category_tag"),
	status: varchar("status"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
});