import { ClientForm } from "../client-form";

export default function NewClientPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Nuevo cliente</h1>
      <ClientForm />
    </div>
  );
}
