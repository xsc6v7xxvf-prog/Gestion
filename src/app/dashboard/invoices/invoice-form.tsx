"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Client, ServiceOrder } from "@prisma/client";
import { createInvoice } from "@/actions/invoices";

type InvoiceFormState = { error?: string; success?: boolean };

export function InvoiceForm({
  clients,
  serviceOrders,
}: {
  clients: Client[];
  serviceOrders: ServiceOrder[];
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<InvoiceFormState, FormData>(
    createInvoice,
    {}
  );

  useEffect(() => {
    if (state?.success) {
      router.push("/dashboard/invoices");
      router.refresh();
    }
  }, [state?.success, router]);

  return (
    <form action={formAction} className="max-w-lg space-y-4">
      {state?.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="number" className="mb-1 block text-sm font-medium text-slate-700">
          Número de factura *
        </label>
        <input
          id="number"
          name="number"
          required
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="amount" className="mb-1 block text-sm font-medium text-slate-700">
          Monto *
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          min="0"
          required
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="clientId" className="mb-1 block text-sm font-medium text-slate-700">
          Cliente *
        </label>
        <select
          id="clientId"
          name="clientId"
          required
          defaultValue=""
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        >
          <option value="" disabled>
            Selecciona un cliente
          </option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="serviceOrderId"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Orden de servicio relacionada
        </label>
        <select
          id="serviceOrderId"
          name="serviceOrderId"
          defaultValue=""
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        >
          <option value="">Ninguna</option>
          {serviceOrders.map((order) => (
            <option key={order.id} value={order.id}>
              {order.title}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {pending ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}
