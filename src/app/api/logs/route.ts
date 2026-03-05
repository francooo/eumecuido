import { db } from "@/db";
import { logs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const profileId = request.nextUrl.searchParams.get("profileId");
  if (profileId) {
    const entries = await db.select().from(logs).where(eq(logs.profileId, Number(profileId))).orderBy(desc(logs.loggedAt));
    return NextResponse.json(entries);
  }
  const allLogs = await db.select().from(logs).orderBy(desc(logs.loggedAt));
  return NextResponse.json(allLogs);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { profileId, medicationId, type, amount, unit, value, notes } = body;

  if (!profileId || !type) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const [entry] = await db.insert(logs).values({
    profileId,
    medicationId: medicationId || undefined,
    type,
    amount: amount || undefined,
    unit: unit || undefined,
    value: value || undefined,
    notes: notes || undefined,
  }).returning();

  return NextResponse.json(entry);
}
