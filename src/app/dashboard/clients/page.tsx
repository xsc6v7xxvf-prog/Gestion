import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteClient } from "@/actions/clients";

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Clientes</h1>
        <Link
          href="/dashboard/clients/new"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Nuevo cliente
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Teléfono</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 text-slate-900">{client.name}</td>
                <td className="px-4 py-3 text-slate-500">{client.email ?? "—"}</td>
                <td className="px-4 py-3 text-slate-500">{client.phone ?? "—"}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/dashboard/clients/${client.id}/edit`}
                      className="text-slate-500 hover:text-slate-900"
                    >
                      Editar
                    </Link>
                    <form
                      action={async () => {
                        "use server";
                        await deleteClient(client.id);
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
            {clients.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                  No hay clientes registrados todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
