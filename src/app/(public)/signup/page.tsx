import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/server/auth/session";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata = {
  title: "Enroll Now | Virtual Theological Institute",
  description: "Create your free student scholar account for 100% tuition-free theological education.",
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; switch?: string }>;
}) {
  const params = await searchParams;
  const session = await getSessionFromCookies();

  // If already authenticated and not explicitly switching accounts, redirect immediately
  if (session?.user && params.switch !== "true") {
    const role = session.user.role;
    const dest =
      params.redirect && params.redirect !== "/"
        ? params.redirect
        : role === "SUPER_ADMIN" || role === "ADMIN"
        ? "/admin"
        : role === "INSTRUCTOR"
        ? "/instructor/dashboard"
        : "/student/learning";
    redirect(dest);
  }

  return (
    <div className="min-h-[calc(100vh-14rem)] bg-[#FAF9F6] py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <Suspense fallback={<div className="text-xs font-bold text-[#57595F]">Loading Registration...</div>}>
        <SignupForm />
      </Suspense>
    </div>
  );
}
