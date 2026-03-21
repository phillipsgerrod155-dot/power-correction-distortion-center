interface Correction {
  name: string;
  strength: string;
  on: boolean;
}

interface CorrectionSystemProps {
  corrections: Correction[];
  onToggle: (i: number) => void;
  correctionForce: string;
}

// Canonical correction order per spec
const CORRECTION_ORDER = [
  "EASY LIMITOR",
  "SYSTEM CLEAN DRIVE",
  "STABILIZER",
  "STABILIZER HELPER",
  "MONITOR",
  "COMMANDER",
  "BRICK WALL HELPER",
  "BRICK WALL",
  "TITANIUM OVERDRIVE",
];

export function CorrectionSystem({
  corrections,
  onToggle,
  correctionForce,
}: CorrectionSystemProps) {
  // Sort corrections to canonical order
  const ordered = CORRECTION_ORDER.map((name) => {
    const idx = corrections.findIndex(
      (c) => c.name.toUpperCase() === name.toUpperCase(),
    );
    return {
      correction:
        idx >= 0
          ? corrections[idx]
          : { name, strength: "34.36 Octodecillion XP", on: true },
      originalIdx: idx,
    };
  });

  return (
    <div className="panel space-y-2">
      <div className="panel-title">CORRECTION SYSTEM</div>

      <div
        style={{
          fontSize: "7px",
          letterSpacing: "0.15em",
          color: "rgba(0,255,136,0.5)",
          textAlign: "center",
          padding: "3px 0",
        }}
      >
        ALL 9 CORRECTIONS — COMBINED TITANIUM FORCE — 34.36 OCTODECILLION
      </div>

      <div className="space-y-1">
        {ordered.map(({ correction: corr, originalIdx }, displayIdx) => (
          <div
            key={corr.name}
            className="flex items-center gap-2 rounded px-2 py-1"
            style={{
              background: corr.on ? "rgba(0,255,136,0.04)" : "rgba(0,0,0,0.2)",
              border: `1px solid ${corr.on ? "rgba(0,255,136,0.15)" : "rgba(80,80,80,0.15)"}`,
              transition: "all 0.2s",
            }}
          >
            {/* Step number */}
            <span
              style={{
                fontSize: "7px",
                color: corr.on ? "rgba(0,255,136,0.5)" : "#444",
                minWidth: "14px",
                fontFamily: "monospace",
              }}
            >
              {String(displayIdx + 1).padStart(2, "0")}
            </span>

            {/* Fuse indicator */}
            <div
              style={{
                width: "16px",
                height: "8px",
                borderRadius: "2px",
                background: corr.on ? "rgba(0,255,136,0.7)" : "#333",
                boxShadow: corr.on ? "0 0 4px rgba(0,255,136,0.5)" : "none",
                border: `1px solid ${corr.on ? "rgba(0,255,136,0.4)" : "rgba(80,80,80,0.3)"}`,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontSize: "4px",
                  fontWeight: 900,
                  color: corr.on ? "#000" : "#555",
                  letterSpacing: "0",
                }}
              >
                250W
              </span>
            </div>

            {/* Name */}
            <span
              className="flex-1 font-bold tracking-wide"
              style={{
                fontSize: "8px",
                color: corr.on ? "rgba(0,255,136,0.9)" : "#555",
                textShadow: corr.on ? "0 0 4px rgba(0,255,136,0.3)" : "none",
              }}
            >
              {corr.name}
            </span>

            {/* Strength */}
            <span
              style={{
                fontSize: "7px",
                color: corr.on ? "rgba(0,200,255,0.7)" : "#444",
                fontFamily: "monospace",
                maxWidth: "80px",
                textAlign: "right",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {corr.strength}
            </span>

            {/* Toggle */}
            <button
              type="button"
              onClick={() => originalIdx >= 0 && onToggle(originalIdx)}
              className={`text-[7px] font-bold px-1.5 py-0.5 transition-colors flex-shrink-0 ${
                corr.on
                  ? "bg-green-active text-navy"
                  : "bg-muted/50 text-muted-foreground border border-border"
              }`}
              data-ocid={`correction.toggle.${displayIdx + 1}`}
            >
              {corr.on ? "ON" : "OFF"}
            </button>
          </div>
        ))}
      </div>

      {/* Correction force display */}
      <div className="border border-red-alert bg-red-alert/5 p-2 mt-2 overflow-hidden">
        <div className="text-muted-foreground text-[8px] tracking-widest mb-1">
          CORRECTION FORCE
        </div>
        <div
          className="text-red-alert font-black font-mono glow-red"
          style={{
            fontSize: "clamp(7px, 1.1vw, 10px)",
            wordBreak: "break-all",
            overflowWrap: "break-word",
            lineHeight: 1.4,
            maxWidth: "100%",
          }}
        >
          {correctionForce}
        </div>
      </div>

      {/* System status */}
      <div className="border border-blue-hi/40 bg-blue-hi/5 p-2">
        <div className="flex items-center justify-between">
          <span className="text-gold text-[9px] font-bold">
            TITANIUM × 985B
          </span>
          <span className="text-blue-hi text-[8px]">MAX DISTORTION KILL</span>
        </div>
        <div className="text-muted-foreground text-[8px] mt-0.5">
          UNIFIED FORCE → EASY LIMITOR → BRICK WALL
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-border pt-2">
        <button
          type="button"
          className="text-[8px] font-bold px-2 py-0.5 bg-green-active text-navy"
        >
          STAB ON
        </button>
        <span className="text-muted-foreground text-[8px] flex-1">dBFS</span>
        <span className="text-blue-hi text-[9px] font-mono">-∞ dBFS</span>
      </div>
      <div className="h-1 bg-muted/30 overflow-hidden">
        <div className="h-full w-full bg-green-active/20" />
      </div>
    </div>
  );
}
