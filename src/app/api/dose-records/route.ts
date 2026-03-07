import { db } from "@/db";
import { doseRecords, scheduledDoses, familyMembers } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
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
      nextDoseScheduledAt,
      recordedBy,
    } = body;

    if (!memberId || !medicationNameApplied || appliedDosage == null || appliedDosage === "" || !appliedUnit || !appliedAt || !timeOption) {
      return NextResponse.json(
        { error: "Campos obrigatórios faltando" },
        { status: 400 }
      );
    }

    const mid = parseInt(memberId);
    const appliedDosageStr = String(appliedDosage);
    const appliedAtDate = new Date(appliedAt);
    const recordedByNum =
      recordedBy != null && recordedBy !== "" && !Number.isNaN(Number(recordedBy))
        ? parseInt(String(recordedBy), 10)
        : null;

    // Validar se membro existe
    const [member] = await db
      .select()
      .from(familyMembers)
      .where(and(
        eq(familyMembers.id, mid),
        eq(familyMembers.isActive, true)
      ));

    if (!member) {
      return NextResponse.json(
        { error: "Membro não encontrado" },
        { status: 404 }
      );
    }

    // INSERT com apenas colunas que existem na tabela (evita erro se weight_kg_at_moment/next_dose_scheduled_at não existirem)
    const [newRecord] = await db.transaction(async (tx) => {
      const result = await tx.execute(sql`
        INSERT INTO dose_records (
          member_id,
          scheduled_dose_id,
          medication_id,
          medication_name_applied,
          applied_dosage,
          applied_unit,
          applied_at,
          time_option,
          recorded_by
        ) VALUES (
          ${mid},
          ${scheduledDoseId ? parseInt(scheduledDoseId) : null},
          ${medicationId ? parseInt(medicationId) : null},
          ${medicationNameApplied},
          ${appliedDosageStr},
          ${appliedUnit},
          ${appliedAtDate},
          ${timeOption},
          ${recordedByNum}
        )
        RETURNING *
      `);

      const rows = (result as { rows?: unknown[] }).rows ?? (Array.isArray(result) ? result : [result]);
      const record = rows[0];
      if (!record) throw new Error("Falha ao inserir registro de dose");

      // Se houver dose agendada vinculada, atualizar status para 'taken'
      if (scheduledDoseId) {
        await tx
          .update(scheduledDoses)
          .set({ status: "taken" })
          .where(eq(scheduledDoses.id, parseInt(scheduledDoseId)));
      }

      // Se informou próxima dose, criar agendamento
      if (nextDoseScheduledAt) {
        const nextAt = new Date(nextDoseScheduledAt);
        await tx.insert(scheduledDoses).values({
          memberId: mid,
          medicationId: medicationId ? parseInt(medicationId) : null,
          name: medicationNameApplied,
          dosage: appliedDosageStr,
          unit: appliedUnit,
          scheduledTime: nextAt,
          status: "pending",
        });
      }

      return [record];
    });

    return NextResponse.json({ record: newRecord });
  } catch (error: any) {
    console.error("Error registering dose:", error);
    return NextResponse.json(
      { error: error?.message || "Erro ao registrar dose" },
      { status: 500 }
    );
  }
}
