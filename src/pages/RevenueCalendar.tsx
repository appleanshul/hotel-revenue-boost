import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLocalEvents, useDailyRates, useReservationsRange } from "@/lib/re-data/hooks";
import { EmptyState } from "@/components/states/EmptyState";
import { LoadingState } from "@/components/states/LoadingState";

export default function RevenueCalendar() {
  const { hotelId } = useAuth();
  const today = new Date().toISOString().slice(0, 10);
  const to = new Date(Date.now() + 60 * 86400000).toISOString().slice(0, 10);

  const events = useLocalEvents(hotelId);
  const rates = useDailyRates(hotelId);
  const reservations = useReservationsRange(hotelId, today, to);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1440px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Revenue Calendar</h1>
        <p className="text-sm text-muted-foreground">Forward-looking demand, rates and on-the-books revenue</p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Next 60 days</CardTitle>
          <CardDescription>Reservations on the books</CardDescription>
        </CardHeader>
        <CardContent>
          {reservations.isLoading ? <LoadingState /> : reservations.isEmpty ? (
            <EmptyState icon={CalendarDays} title="No forward reservations" description="As future bookings come in via PMS they'll plot here by date." />
          ) : (
            <p className="text-sm text-muted-foreground">{reservations(.data ?? []).length} reservations in the next 60 days</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Events on the horizon</CardTitle>
        </CardHeader>
        <CardContent>
          {events.isLoading ? <LoadingState /> : events.isEmpty ? (
            <EmptyState title="No events scheduled" description="Add demand-driving events so the calendar can suggest rate uplifts." />
          ) : (
            <p className="text-sm text-muted-foreground">{events(.data ?? []).length} events</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Published rates</CardTitle>
        </CardHeader>
        <CardContent>
          {rates.isLoading ? <LoadingState /> : rates.isEmpty ? (
            <EmptyState title="No published rates" description="Publish daily rates from Rate Manager to populate the calendar." />
          ) : (
            <p className="text-sm text-muted-foreground">{rates(.data ?? []).length} rates published</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
