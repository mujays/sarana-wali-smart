import { AppSidebar } from "@/components/common/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function RProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <div>
          <SidebarTrigger />
          {children}
        </div>
      </SidebarProvider>
    </div>
  );
}
