import { useEffect, useRef } from "react";

interface ChipDef {
  name: string;
  color: string;
  glow: string;
  barColor: string;
}

const CHIPS: ChipDef[] = [
  {
    name: "CLEANING CHIP",
    color: "text-green-active",
    glow: "bg-green-active",
    barColor: "oklch(0.72 0.2 145)",
  },
  {
    name: "FIXING CHIP",
    color: "text-green-active",
    glow: "bg-green-active",
    barColor: "oklch(0.72 0.2 145)",
  },
  {
    name: "REPORTING CHIP",
    color: "text-blue-hi",
    glow: "bg-blue-hi",
    barColor: "oklch(0.65 0.2 250)",
  },
  {
    name: "CRASH PREVENTION",
    color: "text-gold",
    glow: "bg-gold",
    barColor: "oklch(0.85 0.18 90)",
  },
  {
    name: "NON-STOP WORKING",
    color: "text-green-active",
    glow: "bg-green-active",
    barColor: "oklch(0.72 0.2 145)",
  },
];

interface Chips12StatusProps {
  liveDb: number;
}

export function Chips12Status({ liveDb }: Chips12StatusProps) {
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number>(0);
  const tickRef = useRef<number>(0);

  useEffect(() => {
    const animate = () => {
      tickRef.current += 1;
      const t = tickRef.current;
      // Base activity influenced by liveDb
      const base = Math.max(0.15, Math.min(1, (liveDb - 60) / 90));
      barsRef.current.forEach((bar, i) => {
        if (!bar) return;
        // Each chip fluctuates at slightly different rates
        const wave =
          Math.sin(t * 0.05 + i * 1.4) * 0.3 +
          Math.sin(t * 0.12 + i * 0.9) * 0.2;
        const width = Math.max(8, Math.min(100, (base + wave) * 100));
        bar.style.width = `${width}%`;
      });
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [liveDb]);

  return (
    <div className="space-y-3">
      <div className="panel-title text-xs tracking-widest">
        12.0 LIVE CHIP STATUS
      </div>
      <div className="text-muted-foreground text-[8px] tracking-widest mb-2">
        ALWAYS-ON · CLEANING · FIXING · REPORTING · CRASH PREVENTION
      </div>

      {CHIPS.map((chip, i) => (
        <div
          key={chip.name}
          className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0"
        >
          {/* Pulse dot */}
          <div className="relative flex-shrink-0">
            <div
              className={`w-2.5 h-2.5 rounded-full ${chip.glow} animate-pulse`}
              style={{ boxShadow: `0 0 8px 2px ${chip.barColor}80` }}
            />
          </div>

          {/* Name + status */}
          <div className="flex-shrink-0 w-36">
            <div
              className={`text-[9px] font-black tracking-widest ${chip.color}`}
            >
              {chip.name}
            </div>
            <div className="text-green-active text-[7px] font-bold tracking-widest">
              ACTIVE
            </div>
          </div>

          {/* Activity bar */}
          <div className="flex-1 relative h-1.5 bg-muted/20 rounded-full overflow-hidden">
            <div
              ref={(el) => {
                barsRef.current[i] = el;
              }}
              className="h-full rounded-full transition-none"
              style={{
                width: "40%",
                background: chip.barColor,
                boxShadow: `0 0 6px ${chip.barColor}`,
                transition: "width 0.08s linear",
              }}
            />
          </div>

          {/* dB read */}
          <div className="text-[8px] font-mono text-muted-foreground w-10 text-right flex-shrink-0">
            {liveDb > 0 ? `${Math.round(liveDb)} dB` : "--"}
          </div>
        </div>
      ))}

      <div className="text-muted-foreground text-[7px] text-center tracking-widest pt-1">
        12.0 CHIPS POWERED BY TITANIUM WARLOCK · 400,000 STRENGTH
      </div>
    </div>
  );
}
