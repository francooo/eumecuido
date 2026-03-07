import { relations } from "drizzle-orm/relations";
import { users, profiles, logs, medications } from "./schema";

export const profilesRelations = relations(profiles, ({one, many}) => ({
	user: one(users, {
		fields: [profiles.userId],
		references: [users.id]
	}),
	logs: many(logs),
	medications: many(medications),
}));

export const usersRelations = relations(users, ({many}) => ({
	profiles: many(profiles),
}));

export const logsRelations = relations(logs, ({one}) => ({
	profile: one(profiles, {
		fields: [logs.profileId],
		references: [profiles.id]
	}),
	medication: one(medications, {
		fields: [logs.medicationId],
		references: [medications.id]
	}),
}));

export const medicationsRelations = relations(medications, ({one, many}) => ({
	logs: many(logs),
	profile: one(profiles, {
		fields: [medications.profileId],
		references: [profiles.id]
	}),
}));