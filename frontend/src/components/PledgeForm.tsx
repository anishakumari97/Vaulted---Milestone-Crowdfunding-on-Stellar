"use client";

import { useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { pledgeToCampaign } from "@/lib/api";
import { xlmToStroops } from "@/lib/format";
import type { AsyncStatus } from "@/types/domain";

export function PledgeForm({
  escrowAddress,
  onPledgeSuccess,
}: {
  escrowAddress: string;
  onPledgeSuccess?: () => void;
}) {
  const { isConnected, publicKey, connect } = useWallet();
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<AsyncStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const numeric = Number(amount);
    if (!amount || Number.isNaN(numeric) || numeric <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }

    if (!isConnected || !publicKey) {
      await connect();
      return;
    }

    setStatus("loading");
    try {
      const result = await pledgeToCampaign(escrowAddress, publicKey, xlmToStroops(amount));
      setTxHash(result.hash);
      setStatus("success");
      setAmount("");
      onPledgeSuccess?.();
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "The pledge couldn't be completed. Please try again."
      );
    }
  }

  if (status === "success" && txHash) {
    return (
      <div className="rounded-xl border border-status-green/30 bg-status-green/5 p-4">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-status-green/20 text-status-green text-xs">✓</span>
          <p className="text-sm font-semibold text-status-green">Pledge confirmed!</p>
        </div>
        <p className="mt-2 text-xs text-space-400">
          Transaction{" "}
          <a
            href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-space-300 underline underline-offset-2 hover:text-violet-300"
          >
            {txHash.slice(0, 10)}…{txHash.slice(-6)} ↗
          </a>
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-3 text-xs text-violet-300 underline-offset-2 hover:underline"
        >
          Pledge again
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label className="block text-xs font-medium text-space-400" htmlFor="pledge-amount">
        Pledge amount (XLM)
      </label>
      <div className="flex gap-2">
        <input
          id="pledge-amount"
          type="number"
          min="0"
          step="0.0000001"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="100"
          disabled={status === "loading"}
          className="flex-1 rounded-xl border border-space-700 bg-space-900 px-4 py-3 font-mono text-space-50 outline-none placeholder:text-space-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 disabled:opacity-60 transition"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-violet-glow transition hover:from-violet-500 hover:to-violet-400 disabled:opacity-60"
        >
          {status === "loading" ? (
            <span className="flex items-center gap-2">
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Confirming…
            </span>
          ) : isConnected ? (
            "Pledge"
          ) : (
            "Connect to pledge"
          )}
        </button>
      </div>
      {error && <p className="text-xs text-status-red">{error}</p>}
      <p className="text-xs text-space-500">
        Funds move into escrow immediately and accrue yield until milestones release them.
      </p>
    </form>
  );
}
