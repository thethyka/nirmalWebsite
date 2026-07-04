import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import { GateForm } from "./gate-form";

export default async function GatePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const secret = process.env.SESSION_SECRET;
  const role = token && secret ? await verifySessionToken(token, secret) : null;

  if (role) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <GateForm />
    </div>
  );
}
