import { prisma } from "@/lib/prisma";
import { InvoiceForm } from "../invoice-form";

export default async function NewInvoicePage() {
  const [clients, serviceOrders] = await Promise.all([
    prisma.client.findMany({ orderBy: { name: "asc" } }),
    prisma.serviceOrder.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Nueva factura</h1>
      <InvoiceForm clients={clients} serviceOrders={serviceOrders} />
    </div>
  );
}
