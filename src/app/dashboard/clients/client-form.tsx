"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Client } from "@prisma/client";
import { createClient, updateClient } from "@/actions/clients";

type ClientFormState = { error?: string; success?: boolean };

export function ClientForm({ client }: { client?: Client }) {
  const router = useRouter();
  const boundAction = client
    ? (prevState: ClientFormState, formData: FormData) =>
        updateClient(client.id, prevState, formData)
    : createClient;
  const [state, formAction, pending] = useActionState<ClientFormState, FormData>(
    boundAction,
    {}
  );

  useEffect(() => {
    if (state?.success) {
      router.push("/dashboard/clients");
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
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
          Nombre *
        </label>
        <input
          id="name"
          name="name"
          defaultValue={client?.name}
          required
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={client?.email ?? ""}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="phone" className="mb-1 block text-sm font-medium text-slate-700">
          Teléfono
        </label>
        <input
          id="phone"
          name="phone"
          defaultValue={client?.phone ?? ""}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="address" className="mb-1 block text-sm font-medium text-slate-700">
          Dirección
        </label>
        <input
          id="address"
          name="address"
          defaultValue={client?.address ?? ""}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="notes" className="mb-1 block text-sm font-medium text-slate-700">
          Notas
        </label>
        <textarea
          id="notes"
          name="notes"
          defaultValue={client?.notes ?? ""}
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
