import { prisma } from "@/lib/prisma";
import { OrderForm } from "../order-form";

export default async function NewOrderPage() {
  const clients = await prisma.client.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">
        Nueva orden de servicio
      </h1>
      <OrderForm clients={clients} />
    </div>
  );
}
