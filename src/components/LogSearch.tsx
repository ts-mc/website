"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type LogSearchProps = { dates: string[] };

function dateString(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function monthFromDate(date: string) {
  const [year, month] = date.split("-").map(Number);
  return new Date(year, month - 1, 1);
}

export function LogSearch({ dates }: LogSearchProps) {
  const router = useRouter();
  const availableDates = useMemo(() => new Set(dates), [dates]);
  const latestDate = dates.slice().sort().at(-1) ?? dateString(new Date().getFullYear(), new Date().getMonth(), 1);
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => monthFromDate(latestDate));
  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const dayCount = new Date(year, month + 1, 0).getDate();
  const monthLabel = new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(calendarMonth);

  function openLog(nextDate: string) {
    router.push(`/logs/${nextDate}`);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      setError("Enter a date in YYYY-MM-DD format.");
      return;
    }
    openLog(date);
  }

  return (
    <form onSubmit={submit} className="relative mt-8 max-w-xl" role="search">
      <label htmlFor="log-date" className="reference-index block">Find a day&apos;s changelog</label>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <div className="flex min-h-12 flex-1 border border-[var(--edge)] bg-[var(--raised)]">
          <input
            id="log-date"
            type="text"
            inputMode="numeric"
            placeholder="YYYY-MM-DD"
            value={date}
            onChange={(event) => { setDate(event.target.value); setError(""); }}
            className="min-w-0 flex-1 bg-transparent px-4 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--muted)]"
            aria-describedby={error ? "log-date-error" : undefined}
          />
          <button type="button" onClick={() => setCalendarOpen((open) => !open)} className="border-l border-[var(--edge)] px-4 text-sm text-[var(--portal)]" aria-expanded={calendarOpen} aria-controls="log-calendar">Calendar</button>
        </div>
        <button type="submit" className="min-h-12 border border-[var(--portal)] px-5 text-sm font-bold text-[var(--portal)] transition-colors hover:bg-[rgba(153,225,217,.14)]">Open log</button>
      </div>
      {error ? <p id="log-date-error" className="mt-2 text-sm text-[var(--danger)]">{error}</p> : null}
      {calendarOpen ? (
        <div id="log-calendar" className="absolute z-20 mt-2 w-full max-w-sm border border-[var(--edge)] bg-[var(--raised)] p-4 shadow-2xl" role="dialog" aria-label="Changelog calendar">
          <div className="flex items-center justify-between gap-3">
            <button type="button" onClick={() => setCalendarMonth(new Date(year, month - 1, 1))} className="px-2 py-1 text-[var(--portal)]" aria-label="Previous month">←</button>
            <p className="text-sm font-bold text-[var(--ink)]">{monthLabel}</p>
            <button type="button" onClick={() => setCalendarMonth(new Date(year, month + 1, 1))} className="px-2 py-1 text-[var(--portal)]" aria-label="Next month">→</button>
          </div>
          <div className="mt-4 grid grid-cols-7 place-items-center gap-y-2 text-center">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => <span key={`${day}-${index}`} className="reference-index text-[.55rem]">{day}</span>)}
            {Array.from({ length: firstWeekday }, (_, index) => <span key={`blank-${index}`} />)}
            {Array.from({ length: dayCount }, (_, index) => {
              const day = index + 1;
              const currentDate = dateString(year, month, day);
              const hasLog = availableDates.has(currentDate);
              return <button key={currentDate} type="button" disabled={!hasLog} onClick={() => hasLog && openLog(currentDate)} className={`grid h-9 w-9 place-items-center text-sm ${hasLog ? "rounded-full border border-[var(--portal)] text-[var(--ink)] transition-colors hover:bg-[rgba(153,225,217,.16)]" : "cursor-default text-[var(--muted)] opacity-50"}`} aria-label={hasLog ? `Open changelog for ${currentDate}` : `No changelog for ${currentDate}`}>{day}</button>;
            })}
          </div>
          <p className="mt-4 text-xs text-[var(--muted)]">Circled dates have changelogs.</p>
        </div>
      ) : null}
    </form>
  );
}
