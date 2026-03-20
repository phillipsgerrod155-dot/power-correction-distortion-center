import { Slider } from "@/components/ui/slider";

interface SmoothLoudBoosterProps {
  boostLevel: number;
  onBoostChange: (v: number) => void;
}

function getStatus(level: number): {
  label: string;
  color: string;
  glow: string;
} {
  if (level === 0) return { label: "OFF", color: "#444", glow: "none" };
  if (level <= 15)
    return { label: "WARMING", color: "#00ff88", glow: "0 0 12px #00ff88" };
  if (level <= 35)
    return {
      label: "PUSHING",
      color: "#d4af37",
      glow: "0 0 16px #d4af37, 0 0 32px rgba(212,175,55,0.4)",
    };
  return {
    label: "FULL STOMP",
    color: "#ffd700",
    glow: "0 0 20px #ffd700, 0 0 40px rgba(255,215,0,0.5)",
  };
}

export function SmoothLoudBooster({
  boostLevel,
  onBoostChange,
}: SmoothLoudBoosterProps) {
  const pct = (boostLevel / 50) * 100;
  const { label, color, glow } = getStatus(boostLevel);

  // Fill gradient: green (0) → gold (25) → bright gold (50)
  const fillGradient =
    boostLevel === 0
      ? "rgba(255,255,255,0.05)"
      : "linear-gradient(90deg, #00ff88 0%, #d4af37 60%, #ffd700 100%)";

  return (
    <div
      data-ocid="smooth_booster.panel"
      className="rounded border border-border bg-card p-4 space-y-4"
      style={{
        boxShadow:
          boostLevel > 0
            ? "0 0 18px rgba(212,175,55,0.15), inset 0 0 12px rgba(212,175,55,0.04)"
            : "0 0 8px rgba(255,255,255,0.04)",
        transition: "box-shadow 0.3s ease",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{
                background: color,
                boxShadow: glow,
                transition: "background 0.3s ease, box-shadow 0.3s ease",
              }}
            />
            <span
              className="text-xs font-black tracking-[0.25em]"
              style={{ color: "#d4af37" }}
            >
              SMOOTH LOUD BOOSTER
            </span>
          </div>
          <p className="text-[9px] tracking-[0.18em] text-muted-foreground pl-4">
            CLEAN · SMOOTH · LOUD — 0 TO 50
          </p>
        </div>

        {/* Big value display */}
        <div className="text-right">
          <span
            className="font-black tabular-nums leading-none"
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              color,
              textShadow: boostLevel > 0 ? glow : "none",
              transition: "color 0.2s ease, text-shadow 0.2s ease",
            }}
          >
            {boostLevel}
          </span>
          <span
            className="block text-[9px] tracking-widest mt-0.5"
            style={{ color: "#666" }}
          >
            / 50
          </span>
        </div>
      </div>

      {/* Fill bar */}
      <div className="space-y-1">
        <div
          className="relative w-full rounded-full overflow-hidden"
          style={{
            height: "10px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${pct}%`,
              background: fillGradient,
              boxShadow: boostLevel > 0 ? `0 0 8px ${color}80` : "none",
              transition: "width 0.08s ease-out",
            }}
          />
          {/* Tick at 25 (mid) */}
          <div
            className="absolute top-0 h-full w-px"
            style={{ left: "50%", background: "rgba(212,175,55,0.3)" }}
          />
        </div>
        <div className="flex justify-between text-[8px] text-muted-foreground">
          <span>0 = off</span>
          <span style={{ color: "#00ff88" }}>25</span>
          <span style={{ color: "#ffd700" }}>50 = max clean boost</span>
        </div>
      </div>

      {/* Slider */}
      <div className="px-1">
        <Slider
          min={0}
          max={50}
          step={1}
          value={[boostLevel]}
          onValueChange={([v]) => onBoostChange(v)}
          data-ocid="smooth_booster.input"
          className="cursor-pointer"
        />
      </div>

      {/* Status line */}
      <div className="flex items-center justify-between">
        <span
          className="text-[11px] font-black tracking-[0.2em]"
          style={{
            color,
            textShadow: boostLevel > 0 ? glow : "none",
            transition: "all 0.2s ease",
          }}
        >
          {label}
        </span>
        <span className="text-[8px] tracking-[0.12em] text-muted-foreground">
          ALL 9 CORRECTIONS + TITANIUM RIDING THIS BOOST
        </span>
      </div>
    </div>
  );
}
