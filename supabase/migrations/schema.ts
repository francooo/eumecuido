import { pgTable, unique, serial, text, timestamp, foreignKey, numeric } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	password: text().notNull(),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const profiles = pgTable("profiles", {
	id: serial().primaryKey().notNull(),
	userId: serial("user_id").notNull(),
	name: text().notNull(),
	avatarUrl: text("avatar_url"),
	currentWeightKg: numeric("current_weight_kg", { precision: 5, scale:  2 }),
	weightLastLoggedAt: timestamp("weight_last_logged_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "profiles_user_id_users_id_fk"
		}),
]);

export const logs = pgTable("logs", {
	id: serial().primaryKey().notNull(),
	profileId: serial("profile_id").notNull(),
	medicationId: serial("medication_id").notNull(),
	type: text().notNull(),
	amount: numeric({ precision: 10, scale:  2 }),
	unit: text(),
	value: numeric({ precision: 10, scale:  2 }),
	notes: text(),
	loggedAt: timestamp("logged_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.profileId],
			foreignColumns: [profiles.id],
			name: "logs_profile_id_profiles_id_fk"
		}),
	foreignKey({
			columns: [table.medicationId],
			foreignColumns: [medications.id],
			name: "logs_medication_id_medications_id_fk"
		}),
]);

export const medications = pgTable("medications", {
	id: serial().primaryKey().notNull(),
	profileId: serial("profile_id").notNull(),
	name: text().notNull(),
	type: text().notNull(),
	strength: numeric({ precision: 10, scale:  2 }),
	unit: text(),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.profileId],
			foreignColumns: [profiles.id],
			name: "medications_profile_id_profiles_id_fk"
		}),
]);
