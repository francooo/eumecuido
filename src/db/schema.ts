import { pgTable, serial, text, timestamp, numeric, boolean, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  firstName: text('first_name'), // Novo campo para saudação
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  authProvider: text('auth_provider').default('email'), // email, google, apple
  lastLoginAt: timestamp('last_login_at'), // Data do último login
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
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

// Novas tabelas para funcionalidades da Home Screen
export const familyMembers = pgTable('family_members', {
  id: serial('id').primaryKey(),
  familyId: serial('family_id').notNull(), // Grupo familiar
  createdByUserId: serial('created_by_user_id').references(() => users.id).notNull(),
  name: text('name').notNull(),
  relation: text('relation').notNull(), // Pai, Mãe, Filho, etc
  photoUrl: text('photo_url'),
  currentWeightKg: numeric('current_weight_kg', { precision: 5, scale: 2 }), // MELHORIA 1 e 2
  weightLastLoggedAt: timestamp('weight_last_logged_at'), // MELHORIA 1
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Tabela para doses agendadas (MELHORIA 1 e 4)
export const scheduledDoses = pgTable('scheduled_doses', {
  id: serial('id').primaryKey(),
  memberId: serial('member_id').references(() => familyMembers.id).notNull(),
  medicationId: serial('medication_id').references(() => medications.id),
  name: text('name').notNull(),
  dosage: numeric('dosage', { precision: 10, scale: 2 }).notNull(),
  unit: text('unit').notNull(), // ml, mg, etc
  scheduledTime: timestamp('scheduled_time').notNull(),
  status: text('status').default('pending').notNull(), // pending, taken, missed
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Tabela para registros de peso (MELHORIA 1 e 2)
export const weightRecords = pgTable('weight_records', {
  id: serial('id').primaryKey(),
  memberId: serial('member_id').references(() => familyMembers.id).notNull(),
  weightKg: numeric('weight_kg', { precision: 5, scale: 2 }).notNull(),
  recordedAt: timestamp('recorded_at').defaultNow().notNull(),
  recordedBy: serial('recorded_by').references(() => users.id),
});

// Tabela para doses registradas (MELHORIA 4 e 5)
export const doseRecords = pgTable('dose_records', {
  id: serial('id').primaryKey(),
  memberId: serial('member_id').references(() => familyMembers.id).notNull(),
  scheduledDoseId: serial('scheduled_dose_id').references(() => scheduledDoses.id),
  medicationId: serial('medication_id').references(() => medications.id),
  medicationNameApplied: text('medication_name_applied').notNull(), // Nome editado
  appliedDosage: numeric('applied_dosage', { precision: 10, scale: 2 }).notNull(),
  appliedUnit: text('applied_unit').notNull(), // MELHORIA 5: ml, mg, etc
  appliedAt: timestamp('applied_at').notNull(),
  timeOption: text('time_option').notNull(), // now, 15m_ago, 30m_ago
  recordedBy: serial('recorded_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const familyMemberAudit = pgTable('family_member_audit', {
  id: serial('id').primaryKey(),
  memberId: serial('member_id').references(() => familyMembers.id).notNull(),
  action: text('action').notNull(), // INSERT, UPDATE, DELETE
  performedBy: serial('performed_by').references(() => users.id).notNull(),
  oldData: text('old_data'), // JSON stringificado
  newData: text('new_data'), // JSON stringificado
  performedAt: timestamp('performed_at').defaultNow().notNull(),
});

export const userSessions = pgTable('user_sessions', {
  id: serial('id').primaryKey(),
  userId: serial('user_id').references(() => users.id).notNull(),
  deviceInfo: text('device_info'),
  loginAt: timestamp('login_at').defaultNow().notNull(),
  screenLoaded: text('screen_loaded'), // 'home_screen'
  ipAddress: text('ip_address'),
});

export const appEvents = pgTable('app_events', {
  id: serial('id').primaryKey(),
  userId: serial('user_id'), // references users.id - nullable para permitir eventos sem usuário
  eventType: text('event_type').notNull(), // 'home_date_rendered'
  eventData: text('event_data'), // JSON stringificado
  deviceTimezone: text('device_timezone'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
