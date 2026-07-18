"use client";

import { useCallback, useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { CampaignCard } from "@/components/CampaignCard";
import { LoadingState, ErrorState, EmptyState } from "@/components/StateViews";
import { getCampaignStatus, listCampaignIds } from "@/lib/api";
import { CONTRACT_IDS } from "@/lib/network";
import type { AsyncStatus, CampaignStatus } from "@/types/domain";

const VIEWER_ACCOUNT =
  "GBD4SEJ5AXWY3TODGXGBKLGEHFRVZN4TTMZFSQE3QD5SV5Q5LPKVH2L4";

function SuccessBanner() {
  const searchParams = useSearchParams();
  const hash = searchParams.get("registered");

  if (!hash) return null;

  return (
    <div className="mb-8 rounded-xl border border-status-green/30 bg-status-green/10 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-status-green/20 text-status-green">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" transform="translate(-2, -2)" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-status-green">Campaign successfully registered on-chain!</p>
          <a
            href={`https://stellar.expert/explorer/testnet/tx/${hash}`}
            target="_blank"
            rel="noreferrer"
            className="mt-1 block text-xs text-status-green/80 hover:text-status-green underline underline-offset-2"
          >
            View transaction on Stellar Expert ↗
          </a>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [status, setStatus] = useState<AsyncStatus>("loading");
  const [campaigns, setCampaigns] = useState<CampaignStatus[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      if (!CONTRACT_IDS.registry) {
        setCampaigns([]);
        setStatus("success");
        return;
      }
      const ids = await listCampaignIds(VIEWER_ACCOUNT);
      const results = (
        await Promise.allSettled(
          ids.map((id) => getCampaignStatus(id, VIEWER_ACCOUNT))
        )
      )
        .filter((r): r is PromiseFulfilledResult<CampaignStatus> => r.status === "fulfilled")
        .map((r) => r.value);
      setCampaigns(results);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error ? err.message : "Couldn't load campaigns from the network."
      );
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Suspense fallback={null}>
          <SuccessBanner />
        </Suspense>

        {/* Hero Section */}
        <section className="grid-pattern-bg relative -mx-4 mb-14 overflow-hidden rounded-3xl border border-space-700/60 bg-space-900/60 px-6 py-16 sm:mx-0 sm:px-12 backdrop-blur-sm">
          {/* Floating orbs */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-600/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 left-10 h-48 w-48 rounded-full bg-cyan-500/8 blur-3xl" />

          <p className="relative inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.15em] text-violet-300">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Escrowed · Milestone-gated · On-chain
          </p>

          <h1 className="relative mt-5 max-w-xl font-display text-4xl font-bold leading-[1.1] text-balance sm:text-5xl">
            <span className="text-space-50">Fund the future,</span>{" "}
            <span className="hero-gradient-text">milestone by milestone.</span>
          </h1>

          <p className="relative mt-5 max-w-md text-space-300">
            Backers pledge to campaigns; funds sit in smart escrow.
            Creators unlock capital only when each milestone is proven —
            transparently, on the Stellar network.
          </p>

          <div className="relative mt-8 flex flex-wrap gap-3">
            <Link
              href="/create"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-violet-glow transition hover:from-violet-500 hover:to-violet-400 hover:shadow-lg"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Launch a campaign
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-space-600 px-6 py-3 text-sm font-medium text-space-200 transition hover:border-violet-500/50 hover:text-violet-300"
            >
              Explore projects
            </Link>
          </div>
        </section>

        {/* Campaigns Grid */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-space-50">
            Active campaigns
          </h2>
          <span className="text-xs text-space-500">Live on Stellar</span>
        </div>

        {status === "loading" && <LoadingState label="Reading campaigns from the registry…" />}

        {status === "error" && error && (
          <ErrorState message={error} onRetry={load} />
        )}

        {status === "success" && campaigns.length === 0 && (
          <EmptyState
            title="No campaigns yet"
            message="Once a campaign is registered on-chain, it will appear here for everyone to discover and back."
            action={
              <Link
                href="/create"
                className="rounded-full border border-violet-500/50 px-5 py-2.5 text-sm text-violet-300 transition hover:bg-violet-500/10"
              >
                Be the first to launch one
              </Link>
            }
          />
        )}

        {status === "success" && campaigns.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((c) => (
              <CampaignCard key={c.meta.id} status={c} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
