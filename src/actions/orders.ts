"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/require-auth";

const STATUS_VALUES = ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"] as const;

const orderSchema = z.object({
  title: z.string().min(1, "El título es obligatorio."),
  description: z.string().optional().or(z.literal("")),
  clientId: z.string().min(1, "Selecciona un cliente."),
  status: z.enum(STATUS_VALUES),
  scheduledAt: z.string().optional().or(z.literal("")),
});

function parseOrderForm(formData: FormData) {
  return orderSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    clientId: formData.get("clientId"),
    status: formData.get("status"),
    scheduledAt: formData.get("scheduledAt"),
  });
}

export async function createServiceOrder(_prevState: unknown, formData: FormData) {
  await requireAuth();

  const parsed = parseOrderForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const data = parsed.data;
  await prisma.serviceOrder.create({
    data: {
      title: data.title,
      description: data.description || null,
      clientId: data.clientId,
      status: data.status,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      completedAt: data.status === "COMPLETED" ? new Date() : null,
    },
  });

  revalidatePath("/dashboard/orders");
  return { success: true };
}

export async function updateServiceOrder(
  id: string,
  _prevState: unknown,
  formData: FormData
) {
  await requireAuth();

  const parsed = parseOrderForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const data = parsed.data;
  const existing = await prisma.serviceOrder.findUnique({ where: { id } });

  await prisma.serviceOrder.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description || null,
      clientId: data.clientId,
      status: data.status,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      completedAt:
        data.status === "COMPLETED"
          ? existing?.completedAt ?? new Date()
          : null,
    },
  });

  revalidatePath("/dashboard/orders");
  return { success: true };
}

export async function deleteServiceOrder(id: string) {
  await requireAuth();
  await prisma.serviceOrder.delete({ where: { id } });
  revalidatePath("/dashboard/orders");
}
