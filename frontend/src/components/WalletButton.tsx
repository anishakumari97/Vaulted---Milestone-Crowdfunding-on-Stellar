"use client";

import { useWallet } from "@/hooks/useWallet";
import { shortenAddress } from "@/lib/format";

export function WalletButton() {
  const { isConnected, publicKey, connect, disconnect, connectError, isConnecting, balance } =
    useWallet();

  if (isConnected && publicKey) {
    return (
      <button
        onClick={disconnect}
        className="group flex items-center gap-2.5 rounded-full border border-space-600 bg-space-800/60 px-4 py-2 text-sm transition hover:border-status-red/50 backdrop-blur-sm"
        title="Click to disconnect"
      >
        <span className="h-2 w-2 rounded-full bg-status-green animate-pulse" aria-hidden />
        <span className="font-mono text-space-200 group-hover:hidden">
          {balance !== null ? `${Number(balance).toFixed(2)} XLM · ` : ""}
          {shortenAddress(publicKey)}
        </span>
        <span className="hidden font-mono text-status-red group-hover:inline">Disconnect</span>
      </button>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={connect}
        disabled={isConnecting}
        className="rounded-full bg-gradient-to-r from-violet-600 to-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-violet-glow transition hover:from-violet-500 hover:to-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isConnecting ? (
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Connecting…
          </span>
        ) : (
          "Connect wallet"
        )}
      </button>
      {connectError && <span className="text-xs text-status-red">{connectError}</span>}
    </div>
  );
}
