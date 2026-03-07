import { db } from "@/db";
import { familyMembers, familyMemberAudit, profiles, weightRecords } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET - Listar membros da família APENAS do usuário autenticado
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId'); // AGORA usa userId, não familyId

    if (!userId) {
      return NextResponse.json(
        { error: "userId é obrigatório" },
        { status: 400 }
      );
    }

    console.log(`Buscando membros para userId: ${userId}`);

    // Primeiro, busca os perfis deste usuário
    const userProfiles = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, parseInt(userId)));

    console.log(`Perfis encontrados: ${userProfiles.length}`);

    if (!userProfiles || userProfiles.length === 0) {
      console.log('Nenhum perfil encontrado, retornando lista vazia');
      return NextResponse.json({ members: [] });
    }

    // Pega o primeiro perfil do usuário (família principal)
    const profileId = userProfiles[0].id;
    console.log(`Profile ID: ${profileId}`);

    // Busca membros CRIADOS por este usuário OU vinculados ao perfil dele
    const members = await db
      .select()
      .from(familyMembers)
      .where(
        and(
          eq(familyMembers.createdByUserId, parseInt(userId)),
          eq(familyMembers.isActive, true)
        )
      )
      .orderBy(familyMembers.createdAt);

    console.log(`Membros encontrados: ${members.length}`);

    return NextResponse.json({ members });
  } catch (error: any) {
    console.error("Error fetching family members:", error.message);
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao buscar membros" },
      { status: 500 }
    );
  }
}

// POST - Criar novo membro VINCULADO AO USUÁRIO AUTENTICADO (com peso - MELHORIA 2)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { createdByUserId, name, relation, photoUrl, currentWeightKg } = body;

    if (!createdByUserId || !name || !relation) {
      return NextResponse.json(
        { error: "Campos obrigatórios faltando" },
        { status: 400 }
      );
    }

    // NÃO aceitar familyId do frontend - sempre usar o userId como familyId
    // Isso garante isolamento total
    const familyId = createdByUserId; // familyId = userId para isolamento

    // Criar membro em transação com registro de peso se informado
    const [newMember] = await db.transaction(async (tx) => {
      // Inserir membro
      const [member] = await tx
        .insert(familyMembers)
        .values({
          familyId, // AGORA familyId é igual ao userId
          createdByUserId,
          name,
          relation,
          photoUrl: photoUrl || null,
          currentWeightKg: currentWeightKg || null,
          weightLastLoggedAt: currentWeightKg ? new Date() : null,
        })
        .returning();

      // Se peso foi informado, criar registro inicial
      if (currentWeightKg) {
        await tx.insert(weightRecords).values({
          memberId: member.id,
          weightKg: currentWeightKg,
          recordedBy: createdByUserId,
        });
      }

      // Registrar auditoria
      await tx.insert(familyMemberAudit).values({
        memberId: member.id,
        action: 'INSERT',
        performedBy: createdByUserId,
        newData: JSON.stringify({
          name,
          relation,
          photoUrl,
          familyId,
          currentWeightKg,
        }),
      });

      return [member];
    });

    return NextResponse.json({ member: newMember });
  } catch (error: any) {
    console.error("Error creating family member:", error);
    return NextResponse.json(
      { error: "Erro ao criar membro" },
      { status: 500 }
    );
  }
}
