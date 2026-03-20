const FULL_FORCE =
  "85,900,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000";

const CORRECTIONS = [
  { name: "COMMANDER", value: "34.36 OCTODECILLION XP", fuse: true },
  { name: "GAIN CORRECTION", value: "34.36 OCTODECILLION XP", fuse: true },
  { name: "MONITOR", value: "34.36 OCTODECILLION XP", fuse: true },
  { name: "STABILIZER", value: "34.36 OCTODECILLION XP", fuse: true },
  { name: "SIGNAL CLEANER", value: "34.36 OCTODECILLION XP", fuse: true },
  { name: "HARD CORRECTION", value: "985 BILLION × ALL", fuse: true },
  { name: "STABILIZER HELPER", value: "BRICK WALL EASER", fuse: true },
  { name: "BRICK WALL", value: "FINAL CEILING", fuse: true },
  { name: "SMART CHIP", value: "x10 MULTIPLIER", fuse: false },
];

interface CorrectionForceDisplayProps {
  liveDb?: number;
  volume?: number;
}

function getBarColor(db: number): {
  color: string;
  glow: string;
  label: string;
} {
  if (db < 100) {
    return {
      color: "#00ff88",
      glow: "0 0 12px #00ff88, 0 0 24px rgba(0,255,136,0.4)",
      label: "GREEN",
    };
  }
  if (db < 130) {
    const t = (db - 100) / 30;
    const r = Math.round(0 + t * 212);
    const g = Math.round(255 - t * (255 - 175));
    const b = Math.round(136 - t * 136);
    const hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    return {
      color: hex,
      glow: `0 0 12px ${hex}, 0 0 24px rgba(212,175,55,0.5)`,
      label: "GOLD",
    };
  }
  const t = Math.min((db - 130) / 20, 1);
  const r = Math.round(212 + t * (255 - 212));
  const g = Math.round(175 - t * 175);
  const b = Math.round(55 - t * 55);
  const hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  return {
    color: hex,
    glow: `0 0 14px ${hex}, 0 0 28px rgba(255,80,0,0.5)`,
    label: "HOT",
  };
}

export function CorrectionForceDisplay({
  liveDb = 0,
  volume,
}: CorrectionForceDisplayProps) {
  const displayDb = Math.max(liveDb, 85 + ((volume || 0) / 100) * 65);
  // Scale goes 0 → 150 (full end)
  const clampedDb = Math.max(0, Math.min(150, displayDb));
  const barFill = displayDb > 0 ? (clampedDb / 150) * 100 : 0;
  const { color, glow } = getBarColor(clampedDb);
  const isHot = displayDb > 100;

  return (
    <div
      className="rounded border border-border bg-card p-4 overflow-hidden"
      style={{ boxShadow: "0 0 12px rgba(212,175,55,0.08)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-2 h-2 rounded-full bg-green-active flex-shrink-0"
          style={{ boxShadow: "0 0 6px #00ff88" }}
        />
        <span className="text-gold text-xs font-black tracking-[0.25em]">
          TOTAL COMBINED CORRECTION FORCE
        </span>
      </div>

      {/* Live DB + Active Force bar — full 0→150 scale */}
      {displayDb > 0 && (
        <div className="mb-4 rounded border border-border bg-muted/50 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span
              className="text-[10px] font-black tracking-[0.2em]"
              style={{ color, textShadow: isHot ? glow : undefined }}
            >
              CORRECTION STOMPING AT:
            </span>
            <span
              className="text-xs font-black tabular-nums"
              style={{ color, textShadow: glow }}
            >
              {displayDb.toFixed(1)} dB
            </span>
          </div>

          {/* Bar: 0 to 150 full end — 8px tall, full color transition */}
          <div
            className="relative w-full rounded-full overflow-hidden"
            style={{
              height: "8px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${barFill}%`,
                background:
                  clampedDb < 80
                    ? "linear-gradient(90deg, #00ff88 0%, #00ff88 100%)"
                    : clampedDb < 120
                      ? "linear-gradient(90deg, #00ff88 0%, #d4af37 100%)"
                      : clampedDb < 140
                        ? "linear-gradient(90deg, #00ff88 0%, #d4af37 50%, #ff6600 100%)"
                        : "linear-gradient(90deg, #00ff88 0%, #d4af37 40%, #ff6600 70%, #dc143c 100%)",
                boxShadow: glow,
                transition: "width 0.08s ease-out",
              }}
            />
            {/* Tick marks at 50, 80, 100, 110, 120, 130, 140 */}
            {[50, 80, 100, 110, 120, 130, 140].map((t) => (
              <div
                key={t}
                className="absolute top-0 h-full w-px"
                style={{
                  left: `${(t / 150) * 100}%`,
                  background:
                    t >= 130 ? "rgba(255,80,0,0.6)" : "rgba(212,175,55,0.4)",
                }}
              />
            ))}
          </div>

          {/* Subtitle */}
          <div className="text-center">
            <span
              className="text-[8px] tracking-[0.18em]"
              style={{ color: "#555" }}
            >
              CORRECTION SCALE → 150 FULL END
            </span>
          </div>

          {/* MAX warnings */}
          {displayDb >= 150 && (
            <div
              className="text-center text-[10px] font-black tracking-[0.18em] animate-pulse"
              style={{ color: "#ff2200", textShadow: "0 0 10px #ff2200" }}
            >
              MAX REACHED — FULL 150 STOMP
            </div>
          )}
          {displayDb >= 140 && displayDb < 150 && (
            <div
              className="text-center text-[10px] font-black tracking-[0.15em] animate-pulse"
              style={{ color: "#ff6600", textShadow: "0 0 8px #ff660080" }}
            >
              PUSHING MAX — ALL CORRECTIONS STOMPING
            </div>
          )}

          {/* Scale labels — 0 to 150 */}
          <div className="flex justify-between text-[8px] text-muted-foreground">
            <span>0</span>
            <span style={{ color: "#00ff88" }}>50</span>
            <span style={{ color: "#d4af37" }}>100</span>
            <span style={{ color: "#ff6600" }}>130</span>
            <span style={{ color: displayDb >= 148 ? "#ff2200" : "#888" }}>
              150
            </span>
          </div>
        </div>
      )}

      {/* Big force number */}
      <div
        className="rounded border border-border bg-muted p-3 mb-4"
        style={{
          boxShadow: isHot
            ? `inset 0 0 16px rgba(212,175,55,0.06), 0 0 8px ${color}33`
            : "inset 0 0 16px rgba(212,175,55,0.06)",
          overflow: "hidden",
          transition: "box-shadow 0.3s ease",
        }}
      >
        <p
          className="font-black leading-relaxed"
          style={{
            fontSize: "clamp(7px, 1.1vw, 11px)",
            letterSpacing: "0.04em",
            wordBreak: "break-all",
            overflowWrap: "break-word",
            hyphens: "auto",
            maxWidth: "100%",
            color: isHot ? color : "#d4af37",
            textShadow: isHot ? glow : undefined,
            transition: "color 0.3s ease, text-shadow 0.3s ease",
          }}
          data-ocid="correction_force.panel"
        >
          {FULL_FORCE}
        </p>
      </div>

      {/* Correction table */}
      <div className="space-y-1 mb-4">
        {CORRECTIONS.map((c) => (
          <div key={c.name} className="flex items-center gap-2 text-[10px]">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{
                background: c.fuse ? (isHot ? color : "#00ff88") : "#444",
                boxShadow: c.fuse ? (isHot ? glow : "0 0 5px #00ff88") : "none",
                transition: "background 0.3s ease, box-shadow 0.3s ease",
              }}
            />
            <span className="text-muted-foreground w-36 tracking-wider flex-shrink-0">
              {c.name}
            </span>
            <span
              className="font-bold truncate"
              style={{
                color: isHot ? color : "#d4af37",
                textShadow: isHot ? glow : undefined,
                transition: "color 0.3s ease",
              }}
            >
              {c.value}
            </span>
            <span className="ml-auto text-[9px] flex-shrink-0">
              {c.fuse ? (
                <span className="text-green-active">250W FUSE ✓</span>
              ) : (
                <span className="text-muted-foreground">NO FUSE NEEDED</span>
              )}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-border pt-3 text-center">
        <span className="text-[9px] text-gold tracking-[0.15em]">
          HARD CORRECTION 985 BILLION — MULTIPLIED INTO ALL CORRECTIONS — FULL
          END STOMP TO 150
        </span>
      </div>
    </div>
  );
}
