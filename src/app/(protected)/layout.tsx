import AppNavbar from "@/components/common/app-navbar";
import { AppSidebar } from "@/components/common/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function RProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="overflow-x-hidden">
      <SidebarProvider>
        <div className="flex w-full">
          <AppSidebar />
          <div className="grow min-w-0">
            <AppNavbar />
            <section>{children}</section>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
