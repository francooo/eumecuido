import { db } from "@/db";
import { weightRecords, familyMembers } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

// POST - Criar registro de peso
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { memberId, weightKg, recordedBy } = body;

    if (!memberId || !weightKg) {
      return NextResponse.json(
        { error: "memberId e weightKg são obrigatórios" },
        { status: 400 }
      );
    }

    // Validar se membro existe e está ativo
    const [member] = await db
      .select()
      .from(familyMembers)
      .where(and(
        eq(familyMembers.id, parseInt(memberId)),
        eq(familyMembers.isActive, true)
      ));

    if (!member) {
      return NextResponse.json(
        { error: "Membro não encontrado" },
        { status: 404 }
      );
    }

    // Criar registro de peso
    const [newRecord] = await db
      .insert(weightRecords)
      .values({
        memberId: parseInt(memberId),
        weightKg,
        recordedBy: recordedBy || null,
      })
      .returning();

    // Atualizar peso atual do membro
    await db
      .update(familyMembers)
      .set({
        currentWeightKg: weightKg,
        weightLastLoggedAt: new Date(),
      })
      .where(eq(familyMembers.id, parseInt(memberId)));

    return NextResponse.json({ record: newRecord });
  } catch (error: any) {
    console.error("Error creating weight record:", error);
    return NextResponse.json(
      { error: "Erro ao registrar peso" },
      { status: 500 }
    );
  }
}
