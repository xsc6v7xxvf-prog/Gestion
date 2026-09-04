import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const [
    totalClients,
    openOrders,
    pendingInvoices,
    paidInvoices,
  ] = await Promise.all([
    prisma.client.count(),
    prisma.serviceOrder.count({
      where: { status: { in: ["PENDING", "IN_PROGRESS"] } },
    }),
    prisma.invoice.count({ where: { status: "PENDING" } }),
    prisma.invoice.count({ where: { status: "PAID" } }),
  ]);

  const cards = [
    { label: "Clientes", value: totalClients },
    { label: "Órdenes abiertas", value: openOrders },
    { label: "Facturas pendientes", value: pendingInvoices },
    { label: "Facturas pagadas", value: paidInvoices },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Resumen</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
