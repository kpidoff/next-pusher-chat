"use server";

import { prisma } from "../../lib/prisma";

export async function getUser(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return user;
}

export async function getManyUsers() {
  const users = await prisma.user.findMany();
  return users;
}

