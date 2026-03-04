import { defaultResponderForAppDir } from "app/api/defaultResponderForAppDir";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import prisma from "@calcom/prisma";

import { requireAdmin } from "../_lib/requireAdmin";

async function handler(_req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      role: true,
      createdDate: true,
    },
    orderBy: { createdDate: "desc" },
  });

  return NextResponse.json({ users });
}

export const GET = defaultResponderForAppDir(handler);
