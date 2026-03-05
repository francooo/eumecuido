import { NextResponse } from "next/server";
import { seedDatabase } from "@/actions/seed";

export async function POST() {
  await seedDatabase();
  return NextResponse.json({ success: true });
}
