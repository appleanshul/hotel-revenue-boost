import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, Building2 } from "lucide-react";

export function Layout() {
  const { hotelName, signOut } = useAuth();
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center justify-between border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10 px-2">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="ml-1" />
              {hotelName && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground ml-2">
                  <Building2 className="h-3.5 w-3.5" />
                  <span className="font-medium text-foreground">{hotelName}</span>
                </div>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={signOut} className="gap-1.5">
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </Button>
          </header>
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
