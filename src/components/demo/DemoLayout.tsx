import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DemoSidebar } from "@/components/demo/DemoSidebar";
import { Outlet, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, ArrowLeft } from "lucide-react";
import { TenantBadge } from "@/components/TenantBadge";

export function DemoLayout() {
  const { signOut } = useAuth();
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DemoSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center justify-between border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10 px-2">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="ml-1" />
              <div className="ml-2">
                <TenantBadge mode="demo" hotelName="The Grand Horizon" />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" asChild className="gap-1.5">
                <Link to="/">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to live
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={signOut} className="gap-1.5">
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
