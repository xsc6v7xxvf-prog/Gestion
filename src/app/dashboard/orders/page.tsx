import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteServiceOrder } from "@/actions/orders";
import { ORDER_STATUS_LABELS } from "@/lib/labels";

export default async function OrdersPage() {
  const orders = await prisma.serviceOrder.findMany({
    orderBy: { createdAt: "desc" },
    include: { client: true },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Órdenes de servicio</h1>
        <Link
          href="/dashboard/orders/new"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Nueva orden
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Título</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 text-slate-900">{order.title}</td>
                <td className="px-4 py-3 text-slate-500">{order.client.name}</td>
                <td className="px-4 py-3 text-slate-500">
                  {ORDER_STATUS_LABELS[order.status]}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/dashboard/orders/${order.id}/edit`}
                      className="text-slate-500 hover:text-slate-900"
                    >
                      Editar
                    </Link>
                    <form
                      action={async () => {
                        "use server";
                        await deleteServiceOrder(order.id);
                      }}
                    >
                      <button type="submit" className="text-red-600 hover:text-red-800">
                        Eliminar
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                  No hay órdenes de servicio todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
