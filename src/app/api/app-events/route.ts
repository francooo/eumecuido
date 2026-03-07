import { db } from "@/db";
import { appEvents } from "@/db/schema";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, eventType, eventData, deviceTimezone } = body;

    await db.insert(appEvents).values({
      userId: userId || null,
      eventType,
      eventData: JSON.stringify(eventData || {}),
      deviceTimezone: deviceTimezone || 'America/Sao_Paulo',
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error logging app event:", error.message);
    return NextResponse.json(
      { error: "Erro ao registrar evento" },
      { status: 500 }
    );
  }
}
