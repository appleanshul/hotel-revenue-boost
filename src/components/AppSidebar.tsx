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
  Hotel,
  SearchCheck,
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
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Rate Manager", url: "/rates", icon: IndianRupee },
  { title: "AI Command Center", url: "/ai-center", icon: Brain },
  { title: "Reports & Analytics", url: "/reports", icon: BarChart3 },
  { title: "Channel Manager", url: "/channels", icon: Globe },
];

const growthItems = [
  { title: "Direct Booking", url: "/direct-booking", icon: MousePointerClick },
  { title: "Revenue Calendar", url: "/calendar", icon: CalendarDays },
  { title: "Guest Insights", url: "/guests", icon: Users },
  { title: "Campaigns", url: "/campaigns", icon: Megaphone },
];

export function AppSidebar() {
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
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold text-sm">
            RE
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-sidebar-foreground">Revenue Engine</span>
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
          <div className="rounded-lg bg-sidebar-accent/40 px-3 py-2 text-[11px] text-sidebar-foreground/70">
            <Hotel className="inline h-3 w-3 mr-1" />
            Powered by SynSok
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
