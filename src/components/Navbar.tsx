"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BookOpen, CalendarDays, House, Info, Pause, Play, Scale, Share2, type LucideIcon } from "lucide-react";

type Category = "wiki" | "events" | "about" | "main" | "socials" | "legal";

type Destination = {
  id: Category;
  href: string;
  label: string;
  icon: LucideIcon;
};

const destinations: Destination[] = [
  { id: "wiki", href: "https://wiki.theysix.tech", label: "Wiki", icon: BookOpen },
  { id: "events", href: "https://events-theysix.ro-mihaiu.xyz", label: "Events", icon: CalendarDays },
  { id: "about", href: "/about", label: "About", icon: Info },
  { id: "main", href: "/", label: "Main", icon: House },
  { id: "socials", href: "/socials", label: "Socials", icon: Share2 },
  { id: "legal", href: "https://wiki.theysix.tech/legal/terms", label: "Legal", icon: Scale },
];

const slotClass = "flex min-h-12 min-w-14 shrink-0 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[var(--muted)] transition-colors duration-150 hover:bg-white/5 hover:text-[var(--ink)] sm:min-w-24";
const labelClass = "text-[9px] font-semibold uppercase tracking-[0.16em] sm:text-[10px]";

function Slot({ item, active }: { item: Destination; active?: boolean }) {
  const Icon = item.icon;

  return (
    <li>
      <a href={item.href} aria-current={active ? "page" : undefined} className={`${slotClass} aria-[current=page]:text-[var(--portal)]`}>
        <Icon className="size-4" aria-hidden="true" />
        <span className={labelClass}>{item.label}</span>
      </a>
    </li>
  );
}

function selectedCategory(pathname: string): Category {
  if (pathname.startsWith("/about")) return "about";
  if (pathname.startsWith("/socials")) return "socials";
  if (/^\/(privacy|terms|tos|cookies)/.test(pathname)) return "legal";
  return "main";
}

function orderedDestinations(selected: Category) {
  if (selected === "main") return destinations;
  const items = [...destinations];
  const mainIndex = items.findIndex((item) => item.id === "main");
  const selectedIndex = items.findIndex((item) => item.id === selected);
  [items[mainIndex], items[selectedIndex]] = [items[selectedIndex], items[mainIndex]];
  return items;
}

function Divider() {
  return <li aria-hidden="true" className="h-8 w-px shrink-0 self-center bg-[var(--rule)]" />;
}

export function Navbar() {
  const pathname = usePathname();
  const [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);
  useEffect(() => () => {
    audio.current?.pause();
    audio.current = null;
  }, []);
  const toggleAudio = () => {
    if (!audio.current) {
      audio.current = new Audio("/audio/vesper-hatamitsunami.mp3");
      audio.current.loop = true;
      audio.current.volume = 0.35;
      audio.current.addEventListener("error", () => setPlaying(false));
    }
    if (audio.current.paused) void audio.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    else { audio.current.pause(); setPlaying(false); }
  };
  const ordered = orderedDestinations(selectedCategory(pathname));
  const left = ordered.slice(0, 3);
  const center = ordered[3];
  const right = ordered.slice(4);
  const CenterIcon = center.icon;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-3" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
      <nav aria-label="Primary" className="theysix-dock pointer-events-auto max-w-full rounded-[999px] px-3 py-2">
        <ul className="flex items-center gap-1">
          {left.map((item) => <Slot key={item.id} item={item} />)}
          <Divider />
          <li className="-my-3 px-1">
            <a href={center.href} aria-label={`THEYSIX ${center.label}`} aria-current="page" className="theysix-dock-home grid size-16 place-items-center rounded-[999px] transition-colors duration-150 hover:border-[var(--portal)] sm:size-[4.5rem]">
              <CenterIcon className="size-6 text-[var(--portal)]" aria-hidden="true" />
              <span className={labelClass}>{center.label}</span>
            </a>
          </li>
          <Divider />
          {right.map((item) => <Slot key={item.id} item={item} />)}
          <li>
            <button type="button" onClick={toggleAudio} aria-pressed={playing} aria-label={playing ? "Pause Vesper by HATAMITSUNAMI" : "Play Vesper by HATAMITSUNAMI"} className={slotClass}>
              {playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
              <span className={labelClass}>Audio</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
