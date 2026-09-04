import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { markInvoicePaid, cancelInvoice, deleteInvoice } from "@/actions/invoices";
import { INVOICE_STATUS_LABELS } from "@/lib/labels";

const currencyFormatter = new Intl.NumberFormat("es", {
  style: "currency",
  currency: "USD",
});

export default async function InvoicesPage() {
  const invoices = await prisma.invoice.findMany({
    orderBy: { issuedAt: "desc" },
    include: { client: true },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Facturación</h1>
        <Link
          href="/dashboard/invoices/new"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Nueva factura
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Número</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Monto</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 text-slate-900">{invoice.number}</td>
                <td className="px-4 py-3 text-slate-500">{invoice.client.name}</td>
                <td className="px-4 py-3 text-slate-500">
                  {currencyFormatter.format(Number(invoice.amount))}
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {INVOICE_STATUS_LABELS[invoice.status]}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    {invoice.status === "PENDING" && (
                      <>
                        <form
                          action={async () => {
                            "use server";
                            await markInvoicePaid(invoice.id);
                          }}
                        >
                          <button
                            type="submit"
                            className="text-green-600 hover:text-green-800"
                          >
                            Marcar pagada
                          </button>
                        </form>
                        <form
                          action={async () => {
                            "use server";
                            await cancelInvoice(invoice.id);
                          }}
                        >
                          <button
                            type="submit"
                            className="text-slate-500 hover:text-slate-800"
                          >
                            Cancelar
                          </button>
                        </form>
                      </>
                    )}
                    <form
                      action={async () => {
                        "use server";
                        await deleteInvoice(invoice.id);
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
            {invoices.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  No hay facturas registradas todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
