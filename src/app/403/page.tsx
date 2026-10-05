import React from "react";
import Link from "next/link";
import { ShieldAlert, Home, Lock } from "lucide-react";
import type { Metadata } from "next";
import ReportIssueLink from "../components/ReportIssueLink";

export const metadata: Metadata = {
  title: "403 Forbidden | TheySix",
};

export default function ForbiddenPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12">
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-hairline text-center max-w-lg w-full space-y-6 shadow-2xl">
        <div className="w-20 h-20 rounded-3xl bg-[#FBBF24]/10 border border-[#FBBF24]/20 text-[#FBBF24] flex items-center justify-center mx-auto shadow-inner">
          <Lock className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-[#FBBF24] uppercase tracking-wider">
            Error 403
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">
            Access Forbidden
          </h1>
          <p className="text-sm text-ink-muted leading-relaxed">
            You do not have administrative permission to access this area or the Nether portal has been sealed.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#4CADD0] hover:bg-[#4CADD0] text-ink font-bold text-sm transition-all shadow-md shadow-[#4CADD0]/20"
          >
            <Home className="w-4 h-4" /> Return to Safe Ground
          </Link>
        </div>
        <ReportIssueLink />
      </div>
    </div>
  );
}

