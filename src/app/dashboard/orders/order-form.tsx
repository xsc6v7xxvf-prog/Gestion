"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Client, ServiceOrder } from "@prisma/client";
import { ORDER_STATUS_LABELS } from "@/lib/labels";
import { createServiceOrder, updateServiceOrder } from "@/actions/orders";

type OrderFormState = { error?: string; success?: boolean };

function toDateInputValue(date: Date | null | undefined) {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

export function OrderForm({
  order,
  clients,
}: {
  order?: ServiceOrder;
  clients: Client[];
}) {
  const router = useRouter();
  const boundAction = order
    ? (prevState: OrderFormState, formData: FormData) =>
        updateServiceOrder(order.id, prevState, formData)
    : createServiceOrder;
  const [state, formAction, pending] = useActionState<OrderFormState, FormData>(
    boundAction,
    {}
  );

  useEffect(() => {
    if (state?.success) {
      router.push("/dashboard/orders");
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
        <label htmlFor="title" className="mb-1 block text-sm font-medium text-slate-700">
          Título *
        </label>
        <input
          id="title"
          name="title"
          defaultValue={order?.title}
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
          defaultValue={order?.clientId ?? ""}
          required
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
        <label htmlFor="status" className="mb-1 block text-sm font-medium text-slate-700">
          Estado
        </label>
        <select
          id="status"
          name="status"
          defaultValue={order?.status ?? "PENDING"}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        >
          {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="scheduledAt" className="mb-1 block text-sm font-medium text-slate-700">
          Fecha programada
        </label>
        <input
          id="scheduledAt"
          name="scheduledAt"
          type="date"
          defaultValue={toDateInputValue(order?.scheduledAt)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
      </div>
      <div>
        <label
          htmlFor="description"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={order?.description ?? ""}
          rows={3}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
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
