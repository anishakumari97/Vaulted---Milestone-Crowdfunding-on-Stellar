import Link from "next/link";
import Image from "next/image";
import { WalletButton } from "./WalletButton";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-space-800/80 bg-space-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative h-8 w-8 overflow-hidden rounded-lg ring-1 ring-violet-500/30 group-hover:ring-violet-400/60 transition">
            <Image src="/logo.png" alt="NexFund logo" fill className="object-cover" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">
            <span className="hero-gradient-text">Nex</span>
            <span className="text-space-50">Fund</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-space-300 sm:flex">
          <Link href="/" className="transition hover:text-violet-300">
            Explore
          </Link>
          <Link href="/create" className="transition hover:text-violet-300">
            Launch
          </Link>
        </nav>

        <WalletButton />
      </div>
    </header>
  );
}
