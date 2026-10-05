import React from "react";
import Link from "next/link";
import { ZapOff, RefreshCw, Home } from "lucide-react";
import type { Metadata } from "next";
import ReportIssueLink from "../components/ReportIssueLink";

export const metadata: Metadata = {
  title: "503 Service Unavailable | TheySix",
};

export default function ServiceUnavailablePage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12">
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-hairline text-center max-w-lg w-full space-y-6 shadow-2xl">
        <div className="w-20 h-20 rounded-3xl bg-[#FB7185]/10 border border-[#FB7185]/20 text-[#FB7185] flex items-center justify-center mx-auto shadow-inner">
          <ZapOff className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-[#FB7185] uppercase tracking-wider">
            Error 503
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">
            Redstone Overload
          </h1>
          <p className="text-sm text-ink-muted leading-relaxed">
            Our server is temporarily undergoing maintenance or experiencing heavy tick-rate delay. Please check back in a moment!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#4CADD0] hover:bg-[#4CADD0] text-ink font-bold text-sm transition-all shadow-md shadow-[#4CADD0]/20"
          >
            <Home className="w-4 h-4" /> Go to Home
          </Link>
          <a
            href="https://discord.gg/theysix"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-bg-elev hover:bg-surface-hover text-ink font-semibold text-sm border border-hairline transition-all"
          >
            Check Status on Discord
          </a>
        </div>
        <ReportIssueLink />
      </div>
    </div>
  );
}

