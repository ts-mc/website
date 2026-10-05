import React from "react";
import Link from "next/link";
import { Compass, Home } from "lucide-react";
import ReportIssueLink from "./components/ReportIssueLink";

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12">
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-hairline text-center max-w-lg w-full space-y-6 shadow-2xl">
        <div className="w-20 h-20 rounded-3xl bg-[#FF3B3B]/10 border border-red-500/20 text-[#FB7185] flex items-center justify-center mx-auto shadow-inner">
          <span className="text-3xl font-black font-mono">404</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">
            Lost in the Void
          </h1>
          <p className="text-sm text-ink-muted leading-relaxed">
            The farm blueprint, coordinate, or chunk you are looking for does not exist or has fallen out of the world.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#4CADD0] hover:bg-[#4CADD0] text-ink font-bold text-sm transition-all shadow-md shadow-[#4CADD0]/20"
          >
            <Home className="w-4 h-4" /> Return Home
          </Link>
          <Link
            href="/?category=all"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-bg-elev hover:bg-surface-hover text-ink font-semibold text-sm border border-hairline transition-all"
          >
            <Compass className="w-4 h-4" /> Browse All Farms
          </Link>
        </div>
        <ReportIssueLink />
      </div>
    </div>
  );
}

