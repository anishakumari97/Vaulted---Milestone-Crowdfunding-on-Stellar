import { stroopsToXlm } from "@/lib/format";
import type { Milestone } from "@/types/domain";

export function MilestoneTimeline({
  milestones,
  goal,
  onApprove,
  onRelease,
  canManage,
  busyIndex,
}: {
  milestones: Milestone[];
  goal: string;
  onApprove?: (index: number) => void;
  onRelease?: (index: number) => void;
  canManage: boolean;
  busyIndex: number | null;
}) {
  return (
    <ol className="space-y-3">
      {milestones.map((milestone, index) => {
        const amount = (BigInt(goal) * BigInt(milestone.releaseBps)) / 10_000n;
        const status = milestone.released
          ? "released"
          : milestone.approved
          ? "approved"
          : "pending";

        return (
          <li
            key={index}
            className="flex items-start gap-4 rounded-xl border border-space-700/60 bg-space-900/50 p-4 backdrop-blur-sm transition hover:border-space-600/60"
          >
            <StatusDot status={status} index={index} />
            <div className="flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="font-medium text-space-100">{milestone.description}</p>
                <span className="shrink-0 font-mono text-sm text-violet-300">
                  {stroopsToXlm(amount.toString())} XLM
                </span>
              </div>
              <p className="mt-1 text-xs capitalize">
                {status === "released" && <span className="text-status-green">✓ Released</span>}
                {status === "approved" && <span className="text-violet-400">⬡ Approved</span>}
                {status === "pending" && <span className="text-space-500">○ Pending</span>}
              </p>
            </div>

            {canManage && status === "pending" && onApprove && (
              <button
                onClick={() => onApprove(index)}
                disabled={busyIndex === index}
                className="shrink-0 rounded-full border border-space-600 px-3 py-1.5 text-xs transition hover:border-violet-500 hover:text-violet-300 disabled:opacity-50"
              >
                {busyIndex === index ? "Approving…" : "Approve"}
              </button>
            )}

            {canManage && status === "approved" && onRelease && (
              <button
                onClick={() => onRelease(index)}
                disabled={busyIndex === index}
                className="shrink-0 rounded-full bg-gradient-to-r from-violet-600 to-violet-500 px-3 py-1.5 text-xs font-semibold text-white shadow-violet-glow transition hover:from-violet-500 hover:to-violet-400 disabled:opacity-50"
              >
                {busyIndex === index ? "Releasing…" : "Release funds"}
              </button>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function StatusDot({ status, index }: { status: "pending" | "approved" | "released"; index: number }) {
  const styles = {
    pending:  "border-space-600 bg-space-800 text-space-500",
    approved: "border-violet-500 bg-violet-500/20 text-violet-400",
    released: "border-status-green bg-status-green/20 text-status-green",
  } as const;

  return (
    <div
      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${styles[status]}`}
    >
      {status === "released" ? "✓" : index + 1}
    </div>
  );
}
