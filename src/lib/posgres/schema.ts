import { pgTable, uuid, varchar, timestamp, foreignKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const admin = pgTable("admin", {
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

export const seller = pgTable("seller", {
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

export const store = pgTable("store", {
	id: uuid("id").primaryKey().notNull().references(() => seller.id),
	storeName: varchar("store_name"),
	status: varchar("status"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
});

export const buyer = pgTable("buyer", {
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