"use server"

import { db } from "@/db";
import { logs } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function logDose(formData: FormData) {
  const profileId = Number(formData.get("profileId"));
  const medicationId = Number(formData.get("medicationId"));
  const amount = formData.get("amount") as string;
  const unit = formData.get("unit") as string;

  if (!profileId || !medicationId || !amount || !unit) {
    return { error: "Missing required fields" };
  }

  await db.insert(logs).values({
    profileId,
    medicationId,
    type: "medication",
    amount,
    unit,
  });

  revalidatePath("/dashboard");
  revalidatePath("/history");

  return { success: true };
}
