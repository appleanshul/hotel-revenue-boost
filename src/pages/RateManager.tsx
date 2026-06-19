import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { IndianRupee } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useDailyRates, usePriceSuggestions, useRoomInventory, formatINR } from "@/lib/re-data/hooks";
import { EmptyState } from "@/components/states/EmptyState";
import { LoadingState } from "@/components/states/LoadingState";
import { ErrorState } from "@/components/states/ErrorState";

export default function RateManager() {
  const { hotelId } = useAuth();
  const rooms = useRoomInventory(hotelId);
  const rates = useDailyRates(hotelId);
  const suggestions = usePriceSuggestions(hotelId);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1440px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Rate Manager</h1>
        <p className="text-sm text-muted-foreground">Daily rates, room types and AI price suggestions</p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Room types</CardTitle>
          <CardDescription>Sourced from your PMS</CardDescription>
        </CardHeader>
        <CardContent>
          {rooms.error ? (
            <ErrorState message={rooms.error.message} onRetry={() => rooms.refetch()} />
          ) : rooms.isLoading ? (
            <LoadingState />
          ) : rooms.isEmpty ? (
            <EmptyState icon={IndianRupee} title="No room types found" description="Add room types in your PMS to manage rates here." />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
              {rooms.data!.map((r: any) => (
                <div key={r.id} className="rounded-md border p-3">
                  <p className="text-sm font-semibold text-foreground">{r.name ?? r.label ?? "Room"}</p>
                  <p className="text-xs text-muted-foreground">
                    {(r.total_rooms ?? r.count ?? r.room_count ?? 0)} rooms
                  </p>
                  {r.base_rate != null && (
                    <p className="text-sm mt-2 font-medium">{formatINR(Number(r.base_rate))}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Daily rates</CardTitle>
          <CardDescription>Calendar of published rates</CardDescription>
        </CardHeader>
        <CardContent>
          {rates.error ? (
            <ErrorState message={rates.error.message} onRetry={() => rates.refetch()} />
          ) : rates.isLoading ? (
            <LoadingState />
          ) : rates.isEmpty ? (
            <EmptyState
              icon={IndianRupee}
              title="No daily rates set"
              description="Publish rates by room type and date. Once added they'll appear here and feed your channel manager."
              action={{ label: "Add rate", disabled: true }}
            />
          ) : (
            <div className="text-sm text-muted-foreground">{rates.data!.length} rate entries</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">AI price suggestions</CardTitle>
          <CardDescription>Pending recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          {suggestions.error ? (
            <ErrorState message={suggestions.error.message} onRetry={() => suggestions.refetch()} />
          ) : suggestions.isLoading ? (
            <LoadingState />
          ) : suggestions.isEmpty ? (
            <EmptyState
              icon={IndianRupee}
              title="No price suggestions yet"
              description="AI suggestions will appear here once the pricing engine has enough demand signals."
            />
          ) : (
            <div className="space-y-2">
              {suggestions.data!.slice(0, 10).map((s: any) => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-md border">
                  <div>
                    <p className="text-sm font-medium">{s.date}</p>
                    <p className="text-xs text-muted-foreground">{s.rationale ?? "—"}</p>
                  </div>
                  <div className="text-sm font-semibold">{formatINR(Number(s.suggested_rate))}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
