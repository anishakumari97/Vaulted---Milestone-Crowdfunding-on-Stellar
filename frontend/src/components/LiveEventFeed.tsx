"use client";

import { useEventStream } from "@/hooks/useEventStream";
import { formatRelativeTime } from "@/lib/format";
import type { ContractEventType } from "@/types/domain";

const EVENT_LABELS: Record<ContractEventType | "unknown", string> = {
  campaign_init: "Campaign created",
  pledge_made: "New pledge",
  milestone_approved: "Milestone approved",
  funds_released: "Funds released",
  refund_issued: "Refund issued",
  campaign_registered: "Campaign listed",
  vault_deposit: "Vault deposit",
  vault_withdraw: "Vault withdrawal",
  unknown: "Activity",
};

const EVENT_COLORS: Record<ContractEventType | "unknown", string> = {
  campaign_init:      "bg-space-500",
  pledge_made:        "bg-status-green",
  milestone_approved: "bg-violet-400",
  funds_released:     "bg-cyan-500",
  refund_issued:      "bg-status-amber",
  campaign_registered:"bg-space-400",
  vault_deposit:      "bg-status-green",
  vault_withdraw:     "bg-cyan-400",
  unknown:            "bg-space-500",
};

const EVENT_ICON_COLORS: Record<ContractEventType | "unknown", string> = {
  campaign_init:      "text-space-400",
  pledge_made:        "text-status-green",
  milestone_approved: "text-violet-300",
  funds_released:     "text-cyan-400",
  refund_issued:      "text-status-amber",
  campaign_registered:"text-space-300",
  vault_deposit:      "text-status-green",
  vault_withdraw:     "text-cyan-300",
  unknown:            "text-space-400",
};

export function LiveEventFeed({ contractIds }: { contractIds: string[] }) {
  const { events, isConnected, error } = useEventStream({ contractIds });

  return (
    <div className="rounded-2xl border border-space-700/60 bg-space-900/50 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-space-800 px-4 py-3">
        <h3 className="text-sm font-semibold text-space-200">Live activity</h3>
        <span className="flex items-center gap-1.5 text-xs text-space-500">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isConnected ? "bg-status-green animate-pulse-slow" : "bg-space-600"
            }`}
          />
          {isConnected ? "Streaming" : "Connecting…"}
        </span>
      </div>

      <div className="max-h-72 overflow-y-auto px-4 py-3">
        {error && (
          <p className="py-4 text-center text-xs text-status-red">
            Couldn&apos;t reach the event stream. Retrying…
          </p>
        )}

        {!error && events.length === 0 && (
          <p className="py-6 text-center text-xs text-space-500">
            No on-chain activity yet for this campaign. Pledges and milestone
            updates will appear here in real time.
          </p>
        )}

        <ul className="space-y-3">
          {events.map((event) => (
            <li key={event.id} className="flex items-start gap-3 animate-slide-up">
              <span
                className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${EVENT_COLORS[event.type]}`}
              />
              <div className="flex-1">
                <p className={`text-sm font-medium ${EVENT_ICON_COLORS[event.type]}`}>
                  {EVENT_LABELS[event.type]}
                </p>
                <p className="text-xs text-space-500">
                  Ledger {event.ledger} · {formatRelativeTime(event.timestamp)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
