import { db } from "@/db";
import { medications } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const profileId = request.nextUrl.searchParams.get("profileId");
  if (profileId) {
    const meds = await db.select().from(medications).where(eq(medications.profileId, Number(profileId)));
    return NextResponse.json(meds);
  }
  const allMeds = await db.select().from(medications);
  return NextResponse.json(allMeds);
}
