import { db } from "@/db";
import { doseRecords, scheduledDoses, familyMembers } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

// POST - Registrar dose aplicada
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      memberId,
      scheduledDoseId,
      medicationId,
      medicationNameApplied,
      appliedDosage,
      appliedUnit,
      appliedAt,
      timeOption,
      recordedBy,
    } = body;

    if (!memberId || !medicationNameApplied || !appliedDosage || !appliedUnit || !appliedAt || !timeOption) {
      return NextResponse.json(
        { error: "Campos obrigatórios faltando" },
        { status: 400 }
      );
    }

    // Validar se membro existe
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

    // Criar registro de dose em transação
    const [newRecord] = await db.transaction(async (tx) => {
      // Inserir registro
      const [record] = await tx
        .insert(doseRecords)
        .values({
          memberId: parseInt(memberId),
          scheduledDoseId: scheduledDoseId ? parseInt(scheduledDoseId) : null,
          medicationId: medicationId ? parseInt(medicationId) : null,
          medicationNameApplied,
          appliedDosage,
          appliedUnit,
          appliedAt: new Date(appliedAt),
          timeOption,
          recordedBy: recordedBy || null,
        })
        .returning();

      // Se houver dose agendada vinculada, atualizar status para 'taken'
      if (scheduledDoseId) {
        await tx
          .update(scheduledDoses)
          .set({ status: 'taken' })
          .where(eq(scheduledDoses.id, parseInt(scheduledDoseId)));
      }

      return [record];
    });

    return NextResponse.json({ record: newRecord });
  } catch (error: any) {
    console.error("Error registering dose:", error);
    return NextResponse.json(
      { error: "Erro ao registrar dose" },
      { status: 500 }
    );
  }
}
