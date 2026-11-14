"use client";

import {
  BookOpen,
  CalendarDays,
  House,
  Info,
  Scale,
  Share2,
  VolumeX,
  type LucideIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

type DestinationId = "wiki" | "events" | "about" | "main" | "socials" | "legal";

type Destination = {
  id: DestinationId;
  href: string;
  label: string;
  icon: LucideIcon;
};

const destinations: Destination[] = [
  { id: "wiki", href: "https://wiki-theysix.ro-mihaiu.xyz", label: "Wiki", icon: BookOpen },
  { id: "events", href: "https://events-theysix.ro-mihaiu.xyz", label: "Events", icon: CalendarDays },
  { id: "about", href: "https://theysix.ro-mihaiu.xyz/about", label: "About", icon: Info },
  { id: "main", href: "https://theysix.ro-mihaiu.xyz", label: "Main", icon: House },
  { id: "socials", href: "https://theysix.ro-mihaiu.xyz/socials", label: "Socials", icon: Share2 },
  { id: "legal", href: "https://wiki-theysix.ro-mihaiu.xyz/legal/terms", label: "Legal", icon: Scale },
];

function orderedDestinations(selected: DestinationId) {
  if (selected === "main") return destinations;

  const items = [...destinations];
  const mainIndex = items.findIndex((item) => item.id === "main");
  const selectedIndex = items.findIndex((item) => item.id === selected);
  [items[mainIndex], items[selectedIndex]] = [items[selectedIndex], items[mainIndex]];
  return items;
}

function selectedCategory(pathname: string): DestinationId {
  if (pathname.startsWith("/legal")) return "legal";
  if (pathname.startsWith("/events")) return "events";
  if (pathname.startsWith("/about")) return "about";
  if (pathname.startsWith("/socials")) return "socials";
  if (pathname.startsWith("/wiki") || pathname.startsWith("/w")) return "wiki";
  return "main";
}

function DockSlot({ item }: { item: Destination }) {
  const Icon = item.icon;

  return (
    <li>
      <a className="archive-dock-slot" href={item.href}>
        <Icon aria-hidden="true" size={16} strokeWidth={1.75} />
        <span>{item.label}</span>
      </a>
    </li>
  );
}

function Divider() {
  return <li aria-hidden="true" className="archive-dock-divider" />;
}

export function Dock() {
  const pathname = usePathname();
  const selected = selectedCategory(pathname);
  const [audioMessage, setAudioMessage] = useState("");
  const items = orderedDestinations(selected);
  const left = items.slice(0, 3);
  const center = items[3];
  const right = items.slice(4);
  const CenterIcon = center.icon;

  return (
    <div className="archive-dock-wrap">
      <nav aria-label="Primary" className="archive-dock">
        <ul>
          {left.map((item) => <DockSlot key={item.id} item={item} />)}
          <Divider />
          <li className="archive-dock-center-wrap">
            <a
              className="archive-dock-center"
              href={center.href}
              aria-current="page"
              aria-label={`THEYSIX ${center.label}`}
            >
              <CenterIcon aria-hidden="true" size={24} strokeWidth={1.6} />
              <span>{center.label}</span>
            </a>
          </li>
          <Divider />
          {right.map((item) => <DockSlot key={item.id} item={item} />)}
          <li>
            <button
              className="archive-dock-slot archive-dock-audio"
              type="button"
              aria-label="Audio playback is unavailable in this prototype"
              title="Audio playback is unavailable in this prototype"
              onClick={() => setAudioMessage("Audio is unavailable in this preview.")}
            >
              <VolumeX aria-hidden="true" size={16} strokeWidth={1.75} />
              <span>Audio</span>
            </button>
          </li>
        </ul>
      </nav>
      <p className={`archive-dock-status${audioMessage ? " is-visible" : ""}`} aria-live="polite">
        {audioMessage}
      </p>
    </div>
  );
}
export function FarmExplorer(){const farms=[['Iron Farm','Java','A compact iron archive entry with a world download and tutorial link.','Iron'],['Creeper Farm','Java','A Java creeper build recorded in the farm archive.','Creeper'],['Bedrock Mob Farm','Bedrock','A Bedrock archive entry; local availability is shown only when supplied.','Mob'],['RXP RF V2','Java','A referenced world and schematic entry from the existing archive.','Raid'],['Survival Build','Build','A cross-platform build entry from the reference archive.','Build']];const [q,setQ]=useState('');const [filter,setFilter]=useState('All');const list=farms.filter(f=>(filter==='All'||f[1]===filter||f[3]===filter)&&(f.join(' ').toLowerCase().includes(q.toLowerCase())));return <><div className="controls"><input aria-label="Search farms" placeholder="Search the archive…" value={q} onChange={e=>setQ(e.target.value)}/>{['All','Java','Bedrock','Build'].map(x=><button className={'filter '+(filter===x?'active':'')} key={x} onClick={()=>setFilter(x)}>{x}</button>)}</div><div className="farm-list">{list.map(f=><article className="farm" key={f[0]}><div><div className="meta"><span>{f[1]}</span><span>{f[3]}</span></div><h3>{f[0]}</h3><p>{f[2]}</p></div><div className="farm-actions"><a href="#details">Inspect</a></div></article>)}{!list.length&&<p style={{padding:'2rem 0',color:'var(--muted)'}}>No matching archive entries.</p>}</div></>}
