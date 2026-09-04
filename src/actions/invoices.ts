"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/require-auth";

const invoiceSchema = z.object({
  number: z.string().min(1, "El número de factura es obligatorio."),
  amount: z.coerce.number().positive("El monto debe ser mayor a 0."),
  clientId: z.string().min(1, "Selecciona un cliente."),
  serviceOrderId: z.string().optional().or(z.literal("")),
});

export async function createInvoice(_prevState: unknown, formData: FormData) {
  await requireAuth();

  const parsed = invoiceSchema.safeParse({
    number: formData.get("number"),
    amount: formData.get("amount"),
    clientId: formData.get("clientId"),
    serviceOrderId: formData.get("serviceOrderId"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const data = parsed.data;

  const existing = await prisma.invoice.findUnique({
    where: { number: data.number },
  });
  if (existing) {
    return { error: "Ya existe una factura con ese número." };
  }

  await prisma.invoice.create({
    data: {
      number: data.number,
      amount: data.amount,
      clientId: data.clientId,
      serviceOrderId: data.serviceOrderId || null,
    },
  });

  revalidatePath("/dashboard/invoices");
  return { success: true };
}

export async function markInvoicePaid(id: string) {
  await requireAuth();
  await prisma.invoice.update({
    where: { id },
    data: { status: "PAID", paidAt: new Date() },
  });
  revalidatePath("/dashboard/invoices");
}

export async function cancelInvoice(id: string) {
  await requireAuth();
  await prisma.invoice.update({
    where: { id },
    data: { status: "CANCELLED" },
  });
  revalidatePath("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  await requireAuth();
  await prisma.invoice.delete({ where: { id } });
  revalidatePath("/dashboard/invoices");
}
