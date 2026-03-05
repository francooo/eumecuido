import { db } from "@/db";
import { profiles } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  const allProfiles = await db.select().from(profiles);
  return NextResponse.json(allProfiles);
}
