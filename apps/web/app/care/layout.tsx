import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CareSidebar } from "@/components/care-sidebar";
import { AuthProvider } from "@/components/auth-provider";

export default async function CareLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "care_coordinator" && session.user.role !== "super_admin") {
    redirect("/app");
  }

  return (
    <AuthProvider>
      <div className="flex h-screen bg-background overflow-hidden">
        <CareSidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}
