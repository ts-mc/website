import { MessageCircle } from "lucide-react";

export default function ReportIssueLink() {
  return (
    <a
      href="https://discord.ro-mihaiu.xyz"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-ink-muted hover:text-[#4CADD0] transition-colors"
    >
      <MessageCircle className="w-4 h-4" /> Report an important issue
    </a>
  );
}