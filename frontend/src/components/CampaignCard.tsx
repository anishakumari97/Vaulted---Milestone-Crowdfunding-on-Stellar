import Link from "next/link";
import { formatCountdown, formatPercent, stroopsToXlm } from "@/lib/format";
import type { CampaignStatus } from "@/types/domain";

export function CampaignCard({ status }: { status: CampaignStatus }) {
  const pct = formatPercent(status.totalPledged, status.goal);
  const isFunded = pct >= 100;

  return (
    <Link
      href={`/campaign/${status.meta.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-space-700/60 bg-space-900/70 p-5 backdrop-blur-sm transition hover:border-violet-500/40 hover:shadow-violet-glow"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full border border-space-700 bg-space-800 px-2.5 py-1 text-xs text-space-300">
          {status.meta.category}
        </span>
        {isFunded && (
          <span className="rounded-full border border-status-green/30 bg-status-green/15 px-2.5 py-1 text-xs font-medium text-status-green">
            ✓ Funded
          </span>
        )}
      </div>

      <h3 className="mt-4 font-display text-xl font-semibold leading-snug text-space-50 group-hover:text-violet-200 transition">
        {status.meta.title}
      </h3>

      <div className="mt-5 flex-1">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-space-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-600 via-violet-400 to-cyan-400 transition-all"
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
        <div className="mt-2 flex items-baseline justify-between text-sm">
          <span className="font-mono text-space-100">
            {stroopsToXlm(status.totalPledged)} <span className="text-space-400">XLM</span>
          </span>
          <span className="text-space-400">{pct.toFixed(0)}% of goal</span>
        </div>
      </div>

      <p className="mt-4 text-xs text-space-500">{formatCountdown(status.deadline)}</p>
    </Link>
  );
}
