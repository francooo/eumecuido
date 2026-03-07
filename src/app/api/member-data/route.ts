import { db } from "@/db";
import { familyMembers, weightRecords, scheduledDoses, doseRecords } from "@/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET - Buscar todos os dados de um membro específico
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('memberId');

    if (!memberId) {
      return NextResponse.json(
        { error: "memberId é obrigatório" },
        { status: 400 }
      );
    }

    // Buscar membro
    const [member] = await db
      .select()
      .from(familyMembers)
      .where(and(
        eq(familyMembers.id, parseInt(memberId)),
        eq(familyMembers.isActive, true)
      ));

    if (!member) {
      return NextResponse.json({ member: null });
    }

    // Buscar peso mais recente (tabela weight_records)
    const [latestWeight] = await db
      .select()
      .from(weightRecords)
      .where(eq(weightRecords.memberId, parseInt(memberId)))
      .orderBy(desc(weightRecords.recordedAt))
      .limit(1);

    // Peso: priorizar weight_records; se não houver, usar currentWeightKg do membro (ex.: novo membro com peso no cadastro)
    const rawWeight = latestWeight
      ? latestWeight.weightKg
      : member.currentWeightKg;
    const parsed = rawWeight != null && String(rawWeight).trim() !== "" ? parseFloat(String(rawWeight)) : NaN;
    const currentWeightValue = Number.isNaN(parsed) ? null : parsed;
    const weightLastLoggedAtValue = latestWeight?.recordedAt ?? (member.currentWeightKg ? member.weightLastLoggedAt : null);

    // Calcular variação de peso
    let weightVariation = null;
    if (latestWeight) {
      const weights = await db
        .select()
        .from(weightRecords)
        .where(eq(weightRecords.memberId, parseInt(memberId)))
        .orderBy(desc(weightRecords.recordedAt))
        .limit(2);
      
      if (weights.length >= 2) {
        weightVariation = parseFloat(weights[0].weightKg) - parseFloat(weights[1].weightKg);
      }
    }

    // Buscar medicamentos/doses de hoje
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayDoses = await db
      .select()
      .from(scheduledDoses)
      .where(and(
        eq(scheduledDoses.memberId, parseInt(memberId)),
        sql`${scheduledDoses.scheduledTime} >= ${today}`,
        sql`${scheduledDoses.scheduledTime} < ${tomorrow}`
      ))
      .orderBy(scheduledDoses.scheduledTime);

    // Buscar próximas doses
    const nextDoses = await db
      .select()
      .from(scheduledDoses)
      .where(and(
        eq(scheduledDoses.memberId, parseInt(memberId)),
        sql`${scheduledDoses.scheduledTime} > NOW()`
      ))
      .orderBy(scheduledDoses.scheduledTime)
      .limit(3);

    // Buscar doses registradas ontem
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdayDoses = await db
      .select()
      .from(doseRecords)
      .where(and(
        eq(doseRecords.memberId, parseInt(memberId)),
        sql`${doseRecords.appliedAt} >= ${yesterday}`,
        sql`${doseRecords.appliedAt} < ${today}`
      ))
      .orderBy(doseRecords.appliedAt);

    return NextResponse.json({
      member: {
        ...member,
        currentWeight: currentWeightValue,
        weightVariation,
        weightLastLoggedAt: weightLastLoggedAtValue,
      },
      todayDoses,
      nextDoses,
      yesterdayDoses,
    });
  } catch (error: any) {
    console.error("Error fetching member data:", error);
    return NextResponse.json(
      { error: "Erro ao buscar dados do membro" },
      { status: 500 }
    );
  }
}
