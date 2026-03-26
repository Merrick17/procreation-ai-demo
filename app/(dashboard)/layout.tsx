import { Header } from "@/components/dashboard/dashboard-header";
import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-[#0B0D14]">
      {/* Background gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />
        <div className="absolute top-1/3 -left-40 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-primary/3 rounded-full blur-[100px]" />
      </div>

      <div className="relative flex min-h-screen">
        <Sidebar />

        <div className="flex-1 min-w-0">
          <Header />
          <main className="min-h-[calc(100vh-64px)]">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
