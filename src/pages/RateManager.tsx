import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { IndianRupee, Check, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useDailyRates, usePriceSuggestions, useRoomInventory, formatINR } from "@/lib/re-data/hooks";
import { supabase } from "@/integrations/supabase/client";
import { EmptyState } from "@/components/states/EmptyState";
import { LoadingState } from "@/components/states/LoadingState";
import { ErrorState } from "@/components/states/ErrorState";

export default function RateManager() {
  const { hotelId } = useAuth();
  const rooms = useRoomInventory(hotelId);
  const rates = useDailyRates(hotelId);
  const suggestions = usePriceSuggestions(hotelId);
  const queryClient = useQueryClient();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const roomNameById = new Map<string, string>(
    (rooms.data ?? []).map((r: any) => [r.id, r.name ?? r.label ?? "Room"]),
  );

  const decide = useMutation({
    mutationFn: async (args: { id: string; decision: "approve" | "reject" }) => {
      setPendingId(args.id);
      const { error } = await (supabase as any).rpc("re_apply_price_suggestion", {
        suggestion_id: args.id,
        decision: args.decision,
      });
      if (error) throw error;
      return args;
    },
    onSuccess: (args) => {
      toast.success(args.decision === "approve" ? "Price approved & published" : "Suggestion rejected");
      queryClient.invalidateQueries({ queryKey: ["re_price_suggestions", hotelId] });
      queryClient.invalidateQueries({ queryKey: ["re_daily_rates", hotelId] });
      queryClient.invalidateQueries({ queryKey: ["re_daily_rates_range", hotelId] });
    },
    onError: (err: any) => {
      toast.error(err?.message ?? "Couldn't update suggestion");
    },
    onSettled: () => setPendingId(null),
  });

  const pendingSuggestions = (suggestions.data ?? []).filter(
    (s: any) => (s.status ?? "pending") === "pending",
  );

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
              {(rooms.data ?? []).map((r: any) => (
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
              description="Publish rates by room type and date. Approved AI suggestions will land here automatically."
            />
          ) : (
            <div className="text-sm text-muted-foreground">{(rates.data ?? []).length} rate entries published</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">AI price suggestions</CardTitle>
            <CardDescription>Pending recommendations — approve to publish, reject to discard</CardDescription>
          </div>
          <Badge variant="outline">{pendingSuggestions.length} pending</Badge>
        </CardHeader>
        <CardContent>
          {suggestions.error ? (
            <ErrorState message={suggestions.error.message} onRetry={() => suggestions.refetch()} />
          ) : suggestions.isLoading ? (
            <LoadingState />
          ) : pendingSuggestions.length === 0 ? (
            <EmptyState
              icon={IndianRupee}
              title="No pending suggestions"
              description="AI suggestions will appear here once the pricing engine has enough demand signals."
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Room type</TableHead>
                    <TableHead className="text-right">Current</TableHead>
                    <TableHead className="text-right">Suggested</TableHead>
                    <TableHead className="text-right">Δ</TableHead>
                    <TableHead>Rationale</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingSuggestions.map((s: any) => {
                    const current = Number(s.current_rate ?? 0);
                    const suggested = Number(s.suggested_rate ?? 0);
                    const delta = suggested - current;
                    const deltaPct = current > 0 ? Math.round((delta / current) * 100) : null;
                    const isPending = decide.isPending && pendingId === s.id;
                    return (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium">{s.date ?? s.rate_date ?? "—"}</TableCell>
                        <TableCell>{roomNameById.get(s.room_type_id) ?? "—"}</TableCell>
                        <TableCell className="text-right">{current ? formatINR(current) : "—"}</TableCell>
                        <TableCell className="text-right font-semibold">{formatINR(suggested)}</TableCell>
                        <TableCell className="text-right">
                          {delta !== 0 && (
                            <Badge variant={delta > 0 ? "default" : "secondary"}>
                              {delta > 0 ? "+" : ""}{formatINR(delta)}
                              {deltaPct != null ? ` (${delta > 0 ? "+" : ""}${deltaPct}%)` : ""}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[280px] text-xs text-muted-foreground truncate">
                          {s.rationale ?? "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="default"
                              disabled={decide.isPending}
                              onClick={() => decide.mutate({ id: s.id, decision: "approve" })}
                            >
                              {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={decide.isPending}
                              onClick={() => decide.mutate({ id: s.id, decision: "reject" })}
                            >
                              <X className="h-3 w-3" />
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
