import {
  LayoutDashboard,
  IndianRupee,
  Brain,
  BarChart3,
  Globe,
  MousePointerClick,
  CalendarDays,
  Users,
  Megaphone,
  SearchCheck,
  FlaskConical,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const coreItems = [
  { title: "Dashboard", url: "/demo", icon: LayoutDashboard },
  { title: "Rate Manager", url: "/demo/rates", icon: IndianRupee },
  { title: "AI Command Center", url: "/demo/ai-center", icon: Brain },
  { title: "Reports & Analytics", url: "/demo/reports", icon: BarChart3 },
  { title: "Channel Manager", url: "/demo/channels", icon: Globe },
];

const growthItems = [
  { title: "Direct Booking", url: "/demo/direct-booking", icon: MousePointerClick },
  { title: "Revenue Calendar", url: "/demo/calendar", icon: CalendarDays },
  { title: "Guest Insights", url: "/demo/guests", icon: Users },
  { title: "Campaigns", url: "/demo/campaigns", icon: Megaphone },
  { title: "GEO — AI Discovery", url: "/demo/geo", icon: SearchCheck },
];

export function DemoSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const renderItems = (items: typeof coreItems) =>
    items.map((item) => (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton asChild isActive={isActive(item.url)}>
          <NavLink
            to={item.url}
            end
            className="hover:bg-sidebar-accent/60"
            activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold"
          >
            <item.icon className="mr-2 h-4 w-4 shrink-0" />
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ));

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground font-bold text-sm">
            <FlaskConical className="h-4 w-4" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-sidebar-foreground">Demo Mode</span>
              <span className="text-[10px] text-sidebar-foreground/60">The Grand Horizon</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Revenue Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(coreItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Growth & Direct Sales</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(growthItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        {!collapsed && (
          <div className="rounded-lg bg-accent/15 px-3 py-2 text-[11px] text-sidebar-foreground/70">
            Showcase data only — not connected to PMS
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
