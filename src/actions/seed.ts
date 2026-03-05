"use server"

import { db } from "@/db";
import { users, profiles, medications, logs } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function seedDatabase() : Promise<void> {
  // Check if user already exists
  const existingUser = await db.select().from(users).where(eq(users.email, "sarah@example.com"));

  if (existingUser.length > 0) {
    console.log("Already seeded"); return;
  }

  // Insert User
  const [user] = await db.insert(users).values({
    name: "Sarah",
    email: "sarah@example.com",
  }).returning();

  // Insert Profiles
  const [leo] = await db.insert(profiles).values({
    userId: user.id,
    name: "Leo",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzU7rKDBOC7MLNMqteS5G2zJGs86CqhGOexqNz_0S5jNQ-S7HpI2pG8mVYf6Qgc3gly0C02uOrlytQxJaJ5U90e67sw1ZRwiXlzDzo7oke6Eos7xdC6PS0vK7vPFYbf7eUQEuMftanKjIDSzeQnbqrzXip4bGgZrOfK2QWxwFv5WN-LzvR6gFFr5oouB_33h6LbCW-9jkqIxqbcSdYzeRdNWr1qN9P2ImaSO9M-DhwYXE3BYMI3AT9GAMnEedpaV67pYM3AWq1d5k",
    currentWeightKg: "14.2",
    weightLastLoggedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
  }).returning();

  const [dad] = await db.insert(profiles).values({
    userId: user.id,
    name: "Dad",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDR_Wq-UMVzFIU5p0zE65G3Rciq4GNtPnN5RcQdYJ6gDZnFtNbjcvZ8pCDdsx7IjdYXs6ihBZp61pkfA7gBDdjlF1d0kwxIs9wWSczJDqolFUadeSxkA4MaA3ZdvPbStd8bLRee-3R3IhplsGOdul5afJqrdDWL_fYECCUWL3D7v8047Uvqz23y_5MqCeie90EgVCp3hDs1yxZhY26v2rmBdpCKL1IVlbnY5qiqQwLnzvAVh7XOwHusac8Vzo3PqTldu1QfdrYFEZA",
  }).returning();

  // Insert Medications
  const [amoxicillin] = await db.insert(medications).values({
    profileId: leo.id,
    name: "Amoxicillin",
    type: "liquid",
    strength: "250",
    unit: "mg",
    notes: "Oral Suspension • 250mg/5ml",
  }).returning();

  const [ibuprofen] = await db.insert(medications).values({
    profileId: leo.id,
    name: "Ibuprofen",
    type: "tablet",
    strength: "200",
    unit: "mg",
    notes: "Tablet • 200mg",
  }).returning();

  // Insert some logs
  await db.insert(logs).values([
    {
      profileId: leo.id,
      medicationId: ibuprofen.id,
      type: "medication",
      amount: "5",
      unit: "ml",
      loggedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      profileId: leo.id,
      medicationId: amoxicillin.id,
      type: "medication",
      amount: "5",
      unit: "ml",
      loggedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    },
    {
      profileId: leo.id,
      type: "weight",
      amount: "14.2",
      unit: "kg",
      loggedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      profileId: leo.id,
      type: "temperature",
      value: "38.5",
      unit: "C",
      loggedAt: new Date(Date.now() - 14 * 60 * 60 * 1000), // 14 hours ago
    }
  ]);

  console.log("Seeded database successfully"); return;
}
