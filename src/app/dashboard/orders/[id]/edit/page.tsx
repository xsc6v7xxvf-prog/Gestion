import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OrderForm } from "../../order-form";

export default async function EditOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [order, clients] = await Promise.all([
    prisma.serviceOrder.findUnique({ where: { id } }),
    prisma.client.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!order) {
    notFound();
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">
        Editar orden de servicio
      </h1>
      <OrderForm order={order} clients={clients} />
    </div>
  );
}
