import { ResetPasswordForm } from "./reset-password-form";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-xl font-semibold text-slate-900">
          Nueva contraseña
        </h1>
        <p className="mb-6 text-sm text-slate-500">
          Elige una nueva contraseña para tu cuenta.
        </p>

        {token ? (
          <ResetPasswordForm token={token} />
        ) : (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            Enlace inválido. Solicita uno nuevo desde &ldquo;¿Olvidaste tu
            contraseña?&rdquo;.
          </p>
        )}
      </div>
    </div>
  );
}
