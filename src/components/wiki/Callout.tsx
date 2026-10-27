import { AlertTriangle, Info, OctagonAlert } from "lucide-react";

const variants = {
  note: {
    caption: "Note",
    border: "border-l-[var(--brand)]",
    ground: "bg-[#4CADD0]/10",
    text: "text-ink-muted",
    icon: Info,
    iconColor: "text-brand",
  },
  warning: {
    caption: "Warning",
    border: "border-l-[var(--amber)]",
    ground: "bg-[var(--amber)]/10",
    text: "text-ink-muted",
    icon: AlertTriangle,
    iconColor: "text-[var(--amber)]",
  },
  danger: {
    caption: "Danger",
    border: "border-l-[var(--rose)]",
    ground: "bg-[var(--rose)]/10",
    text: "text-ink-muted",
    icon: OctagonAlert,
    iconColor: "text-[var(--rose)]",
  },
} as const;

export function Callout({
  variant,
  children,
}: {
  variant: "note" | "warning" | "danger";
  children: React.ReactNode;
}) {
  const v = variants[variant];
  const Icon = v.icon;
  return (
    <aside
      className={`my-6 rounded-card border border-hairline border-l-[3px] ${v.border} ${v.ground} px-4 py-3`}
    >
      <p className={`label-mono mb-1 flex items-center gap-1.5 ${v.iconColor}`}>
        <Icon className="size-3.5" aria-hidden />
        {v.caption}
      </p>
      <div className={`text-[15.5px] leading-7 ${v.text}`}>{children}</div>
    </aside>
  );
}
