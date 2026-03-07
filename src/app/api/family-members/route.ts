import { db } from "@/db";
import { familyMembers, familyMemberAudit, weightRecords } from "@/db/schema";
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

    // Busca membros CRIADOS por este usuário (não exige perfil)
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

// DELETE - Excluir (desativar) membro da família
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get("memberId");
    const userId = searchParams.get("userId");

    if (!memberId || !userId) {
      return NextResponse.json(
        { error: "memberId e userId são obrigatórios" },
        { status: 400 }
      );
    }

    const id = parseInt(memberId, 10);
    const uid = parseInt(userId, 10);
    if (Number.isNaN(id) || Number.isNaN(uid)) {
      return NextResponse.json({ error: "IDs inválidos" }, { status: 400 });
    }

    const [member] = await db
      .select()
      .from(familyMembers)
      .where(
        and(
          eq(familyMembers.id, id),
          eq(familyMembers.createdByUserId, uid),
          eq(familyMembers.isActive, true)
        )
      );

    if (!member) {
      return NextResponse.json(
        { error: "Membro não encontrado ou sem permissão" },
        { status: 404 }
      );
    }

    await db
      .update(familyMembers)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(familyMembers.id, id));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting family member:", error);
    return NextResponse.json(
      { error: "Erro ao excluir membro" },
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
