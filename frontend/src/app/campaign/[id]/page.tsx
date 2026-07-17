"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { LoadingState, ErrorState } from "@/components/StateViews";
import { MilestoneTimeline } from "@/components/MilestoneTimeline";
import { PledgeForm } from "@/components/PledgeForm";
import { LiveEventFeed } from "@/components/LiveEventFeed";
import { useWallet } from "@/hooks/useWallet";
import { approveMilestone, getCampaignDetail, releaseMilestone } from "@/lib/api";
import { formatCountdown, formatPercent, shortenAddress, stroopsToXlm } from "@/lib/format";
import type { AsyncStatus, CampaignDetail } from "@/types/domain";

const VIEWER_ACCOUNT = "GBD4SEJ5AXWY3TODGXGBKLGEHFRVZN4TTMZFSQE3QD5SV5Q5LPKVH2L4";

export default function CampaignDetailPage() {
  const params = useParams<{ id: string }>();
  const campaignId = Number(params.id);
  const { publicKey } = useWallet();

  const [status, setStatus] = useState<AsyncStatus>("loading");
  const [detail, setDetail] = useState<CampaignDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyIndex, setBusyIndex] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const result = await getCampaignDetail(campaignId, VIEWER_ACCOUNT);
      setDetail(result);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error ? err.message : "Couldn't load this campaign from the network."
      );
    }
  }, [campaignId]);

  useEffect(() => {
    if (!Number.isNaN(campaignId)) load();
  }, [campaignId, load]);

  async function handleApprove(index: number) {
    if (!detail || !publicKey) return;
    setBusyIndex(index);
    setActionError(null);
    try {
      await approveMilestone(detail.meta.escrowAddress, publicKey, index);
      await load();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Approval failed.");
    } finally {
      setBusyIndex(null);
    }
  }

  async function handleRelease(index: number) {
    if (!detail || !publicKey) return;
    setBusyIndex(index);
    setActionError(null);
    try {
      await releaseMilestone(detail.meta.escrowAddress, publicKey, index);
      await load();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Release failed.");
    } finally {
      setBusyIndex(null);
    }
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        {status === "loading" && <LoadingState label="Loading campaign details…" />}
        {status === "error" && error && <ErrorState message={error} onRetry={load} />}

        {status === "success" && detail && (
          <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
            {/* Left column */}
            <div className="space-y-8">
              <div>
                <span className="rounded-full border border-space-700 bg-space-800 px-2.5 py-1 text-xs text-space-300">
                  {detail.meta.category}
                </span>
                <h1 className="mt-4 font-display text-3xl font-bold text-space-50 sm:text-4xl">
                  {detail.meta.title}
                </h1>
                <p className="mt-2 text-sm text-space-400">
                  Created by{" "}
                  <span className="font-mono text-violet-300">
                    {shortenAddress(detail.meta.creator)}
                  </span>{" "}
                  · {detail.backerCount} backer{detail.backerCount === 1 ? "" : "s"}
                </p>
              </div>

              <div>
                <div className="mb-3 flex items-baseline justify-between">
                  <h2 className="font-display text-xl font-bold text-space-50">Milestones</h2>
                  {publicKey && (
                    <span className="text-xs text-space-500">
                      {publicKey === detail.arbiter
                        ? "✓ You are the arbiter"
                        : "Only the arbiter can manage milestones"}
                    </span>
                  )}
                </div>
                {actionError && (
                  <p className="mb-3 text-xs text-status-red">{actionError}</p>
                )}
                <MilestoneTimeline
                  milestones={detail.milestones}
                  goal={detail.goal}
                  canManage={publicKey === detail.arbiter}
                  busyIndex={busyIndex}
                  onApprove={handleApprove}
                  onRelease={handleRelease}
                />
              </div>

              <LiveEventFeed contractIds={[detail.meta.escrowAddress]} />
            </div>

            {/* Right sidebar */}
            <aside className="space-y-5">
              {/* Funding progress card */}
              <div className="rounded-2xl border border-space-700/60 bg-space-900/70 p-5 backdrop-blur-sm">
                <div className="h-2 w-full overflow-hidden rounded-full bg-space-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-600 via-violet-400 to-cyan-400 transition-all"
                    style={{ width: `${Math.min(formatPercent(detail.totalPledged, detail.goal), 100)}%` }}
                  />
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="font-mono text-2xl font-bold text-space-50">
                    {stroopsToXlm(detail.totalPledged)}
                  </span>
                  <span className="text-sm text-space-400">
                    of {stroopsToXlm(detail.goal)} XLM
                  </span>
                </div>
                <p className="mt-1 text-xs text-space-500">
                  {formatCountdown(detail.deadline)}
                </p>
              </div>

              {/* Pledge form card */}
              <div className="rounded-2xl border border-space-700/60 bg-space-900/70 p-5 backdrop-blur-sm">
                <PledgeForm escrowAddress={detail.meta.escrowAddress} onPledgeSuccess={load} />
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
