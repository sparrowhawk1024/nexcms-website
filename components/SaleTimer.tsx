"use client";
import { useState, useEffect, useCallback } from "react";

interface SaleTimerProps {
  endsAt: string;
  compact?: boolean;
  className?: string;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function SaleTimer({ endsAt, compact = false, className = "" }: SaleTimerProps) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [expired, setExpired] = useState(false);
  const [mounted, setMounted] = useState(false);

  const tick = useCallback(() => {
    const diff = new Date(endsAt).getTime() - Date.now();
    if (diff <= 0) {
      setExpired(true);
      return;
    }
    const d = Math.floor(diff / 86_400_000);
    const h = Math.floor((diff % 86_400_000) / 3_600_000);
    const m = Math.floor((diff % 3_600_000) / 60_000);
    const s = Math.floor((diff % 60_000) / 1_000);
    setTime({ d, h, m, s });
  }, [endsAt]);

  useEffect(() => {
    setMounted(true);
    tick();
    const id = setInterval(tick, 1_000);
    return () => clearInterval(id);
  }, [tick]);

  if (!mounted) return null;
  if (expired) return (
    <span className={`text-red-400 text-xs font-medium ${className}`}>
      Deal expired
    </span>
  );

  if (compact) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <span className="text-[10px] text-fuchsia-300/60 font-bold uppercase tracking-wide">Ends</span>
        <span className="font-mono text-xs text-cyan-400 font-bold bg-cyan-400/10 px-1.5 py-0.5 rounded border border-cyan-400/20">
          {time.d > 0 ? `${time.d}d ` : ""}{pad(time.h)}:{pad(time.m)}:{pad(time.s)}
        </span>
      </div>
    );
  }

  const units = [
    ...(time.d > 0 ? [{ val: time.d, label: "Days" }] : []),
    { val: time.h, label: "Hrs" },
    { val: time.m, label: "Min" },
    { val: time.s, label: "Sec" },
  ];

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="text-[10px] text-fuchsia-300/60 uppercase tracking-wider font-bold shrink-0">
        Ends in
      </span>
      {units.map(({ val, label }, i) => (
        <div key={label} className="flex items-center gap-1">
          <div className="flex flex-col items-center">
            <span className="bg-[#0b0213] border border-cyan-400/30 text-cyan-400 font-mono font-black text-sm px-2 py-0.5 rounded shadow-[0_0_8px_rgba(34,211,238,0.2)] min-w-[2rem] text-center tabular-nums">
              {pad(val)}
            </span>
            <span className="text-[9px] text-fuchsia-400/40 uppercase tracking-widest mt-0.5">{label}</span>
          </div>
          {i < units.length - 1 && (
            <span className="text-cyan-400/60 font-bold text-sm mb-3">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
