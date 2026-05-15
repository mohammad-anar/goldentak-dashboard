import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";

const CommonLayout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "300px",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset className="bg-[#f8f9fa]">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default CommonLayout;
