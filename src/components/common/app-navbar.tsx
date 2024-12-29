import { SidebarTrigger } from "../ui/sidebar";

function AppNavbar() {
  return (
    <nav className="h-12 w-full border-b flex justify-between items-center">
      <SidebarTrigger />
    </nav>
  );
}

export default AppNavbar;
