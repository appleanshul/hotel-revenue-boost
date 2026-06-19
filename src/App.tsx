import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Layout } from "@/components/Layout";
import { DemoLayout } from "@/components/demo/DemoLayout";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import RateManager from "@/pages/RateManager";
import AiCommandCenter from "@/pages/AiCommandCenter";
import Reports from "@/pages/Reports";
import ChannelManager from "@/pages/ChannelManager";
import DirectBooking from "@/pages/DirectBooking";
import RevenueCalendar from "@/pages/RevenueCalendar";
import GuestRevenue from "@/pages/GuestRevenue";
import Campaigns from "@/pages/Campaigns";
import GeoOptimization from "@/pages/GeoOptimization";
import DemoDashboard from "@/pages/demo/DemoDashboard";
import DemoRateManager from "@/pages/demo/DemoRateManager";
import DemoAiCommandCenter from "@/pages/demo/DemoAiCommandCenter";
import DemoReports from "@/pages/demo/DemoReports";
import DemoChannelManager from "@/pages/demo/DemoChannelManager";
import DemoDirectBooking from "@/pages/demo/DemoDirectBooking";
import DemoRevenueCalendar from "@/pages/demo/DemoRevenueCalendar";
import DemoGuestRevenue from "@/pages/demo/DemoGuestRevenue";
import DemoCampaigns from "@/pages/demo/DemoCampaigns";
import DemoGeoOptimization from "@/pages/demo/DemoGeoOptimization";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/rates" element={<RateManager />} />
                <Route path="/ai-center" element={<AiCommandCenter />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/channels" element={<ChannelManager />} />
                <Route path="/direct-booking" element={<DirectBooking />} />
                <Route path="/calendar" element={<RevenueCalendar />} />
                <Route path="/guests" element={<GuestRevenue />} />
                <Route path="/campaigns" element={<Campaigns />} />
                <Route path="/geo" element={<GeoOptimization />} />
              </Route>
              <Route element={<DemoLayout />}>
                <Route path="/demo" element={<DemoDashboard />} />
                <Route path="/demo/rates" element={<DemoRateManager />} />
                <Route path="/demo/ai-center" element={<DemoAiCommandCenter />} />
                <Route path="/demo/reports" element={<DemoReports />} />
                <Route path="/demo/channels" element={<DemoChannelManager />} />
                <Route path="/demo/direct-booking" element={<DemoDirectBooking />} />
                <Route path="/demo/calendar" element={<DemoRevenueCalendar />} />
                <Route path="/demo/guests" element={<DemoGuestRevenue />} />
                <Route path="/demo/campaigns" element={<DemoCampaigns />} />
                <Route path="/demo/geo" element={<DemoGeoOptimization />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
