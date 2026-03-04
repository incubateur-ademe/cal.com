import { defaultResponderForAppDir } from "app/api/defaultResponderForAppDir";
import { parseRequestData } from "app/api/parseRequestData";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { passwordResetRequest } from "@calcom/features/auth/lib/passwordResetRequest";
import prisma from "@calcom/prisma";
import { CreationSource } from "@calcom/prisma/enums";

import { requireAdmin } from "../../_lib/requireAdmin";

const addUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().transform((val) => val.toLowerCase()),
  username: z.string().min(1),
  role: z.enum(["USER", "ADMIN"]).default("USER"),
});

async function handler(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });
  }

  const body = await parseRequestData(req);
  const parsed = addUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid input", errors: parsed.error.flatten() }, { status: 400 });
  }

  const { name, email, username, role } = parsed.data;

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });

  if (existing) {
    return NextResponse.json(
      { message: "Un utilisateur avec cet email ou ce nom d'utilisateur existe déjà" },
      { status: 409 }
    );
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      username,
      role,
      creationSource: CreationSource.WEBAPP,
      weekStart: "Monday",
      locale: "fr",
      timeFormat: 24,
      allowSEOIndexing: false,
      completedOnboarding: true,
    },
  });

  try {
    await passwordResetRequest({ email, name, locale: "fr" });
  } catch (e) {
    console.error("Failed to send password setup email:", e);
  }

  return NextResponse.json(
    { user: { id: user.id, email: user.email }, message: "Utilisateur créé avec succès" },
    { status: 201 }
  );
}

export const POST = defaultResponderForAppDir(handler);
