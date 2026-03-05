import { pgTable, serial, text, timestamp, numeric, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const profiles = pgTable('profiles', {
  id: serial('id').primaryKey(),
  userId: serial('user_id').references(() => users.id).notNull(),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),
  currentWeightKg: numeric('current_weight_kg', { precision: 5, scale: 2 }),
  weightLastLoggedAt: timestamp('weight_last_logged_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const medications = pgTable('medications', {
  id: serial('id').primaryKey(),
  profileId: serial('profile_id').references(() => profiles.id).notNull(),
  name: text('name').notNull(),
  type: text('type').notNull(), // 'liquid', 'tablet', 'other'
  strength: numeric('strength', { precision: 10, scale: 2 }),
  unit: text('unit'), // 'mg', 'ml', 'drops', 'mcg', 'units'
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const logs = pgTable('logs', {
  id: serial('id').primaryKey(),
  profileId: serial('profile_id').references(() => profiles.id).notNull(),
  medicationId: serial('medication_id').references(() => medications.id),
  type: text('type').notNull(), // 'medication', 'weight', 'temperature', 'note'
  amount: numeric('amount', { precision: 10, scale: 2 }),
  unit: text('unit'),
  value: numeric('value', { precision: 10, scale: 2 }), // e.g., temperature value
  notes: text('notes'),
  loggedAt: timestamp('logged_at').defaultNow().notNull(),
});
