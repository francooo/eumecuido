import { db } from "@/db";
import { users, profiles, userSessions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase().trim()));

    if (!user) {
      return NextResponse.json(
        { error: "Email ou senha incorretos" },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { error: "Email ou senha incorretos" },
        { status: 401 }
      );
    }

    const userProfiles = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, user.id));

    // Atualizar last_login_at
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));

    // Registrar sessão
    const headersList = request.headers;
    await db.insert(userSessions).values({
      userId: user.id,
      deviceInfo: headersList.get('user-agent') || 'unknown',
      screenLoaded: 'home_screen',
      ipAddress: headersList.get('x-forwarded-for')?.split(',')[0] || 'unknown',
    });

    return NextResponse.json({
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email,
        firstName: user.firstName || user.name.split(' ')[0]
      },
      profiles: userProfiles,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Erro ao fazer login" },
      { status: 500 }
    );
  }
}
