const FUSE_NAMES = [
  "COMMANDER",
  "GAIN CORRECTION",
  "MONITOR",
  "STABILIZER",
  "SIGNAL CLEANER",
  "HARD CORRECTION",
  "STABILIZER HELPER",
  "BRICK WALL",
  "x10 SMART CHIP",
];

const FULL_STOMP_FORCE =
  "85,900,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000";

interface FuseBoardProps {
  corrections?: { name: string; on: boolean }[];
  activeCorrectionCount?: number;
}

export function FuseBoard({
  corrections,
  activeCorrectionCount = 0,
}: FuseBoardProps) {
  const fuseStates = FUSE_NAMES.map((name, idx) => {
    if (corrections) {
      const match = corrections.find((c) => c.name === name);
      return match ? match.on : activeCorrectionCount > idx;
    }
    return activeCorrectionCount > idx;
  });

  const allOn = fuseStates.every(Boolean);
  const anyOn = fuseStates.some(Boolean);
  const onCount = fuseStates.filter(Boolean).length;
  const masterOn = activeCorrectionCount > 0;

  return (
    <div
      className="rounded border border-border bg-card p-4"
      style={{ boxShadow: "0 0 12px rgba(0,255,136,0.05)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-2 h-2 rounded-full"
          style={
            anyOn
              ? { background: "#00ff88", boxShadow: "0 0 6px #00ff88" }
              : { background: "#ff4444" }
          }
        />
        <span className="text-gold text-xs font-black tracking-[0.25em]">
          250W FUSE BOARD — ALL SYSTEMS
        </span>
      </div>

      {/* 150B Titanium Master Fuse */}
      <div
        className="rounded border-2 p-3 mb-4 flex items-center justify-between"
        style={{
          borderColor: masterOn ? "#00ff88" : "#555",
          background: masterOn ? "rgba(0,255,136,0.06)" : "rgba(80,80,80,0.06)",
          boxShadow: masterOn
            ? "0 0 18px rgba(0,255,136,0.35), inset 0 0 12px rgba(0,255,136,0.08)"
            : "none",
          animation: masterOn
            ? "titaniumPulse 1.6s ease-in-out infinite"
            : "none",
        }}
        data-ocid="fuseboard.panel"
      >
        <div>
          <div
            className="font-black text-[11px] tracking-[0.2em]"
            style={{ color: masterOn ? "#00ff88" : "#888" }}
          >
            150B TITANIUM MASTER FUSE
          </div>
          <div className="text-[9px] text-muted-foreground tracking-wider mt-0.5">
            MASTER OVERRIDE — ALL SYSTEMS
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div
            className="w-4 h-4 rounded-full"
            style={{
              background: masterOn ? "#00ff88" : "#555",
              boxShadow: masterOn
                ? "0 0 12px #00ff88, 0 0 24px rgba(0,255,136,0.6)"
                : "none",
              animation: masterOn
                ? "ledPulse 1.2s ease-in-out infinite"
                : "none",
            }}
          />
          <span
            className="text-[9px] font-bold tracking-widest"
            style={{ color: masterOn ? "#00ff88" : "#888" }}
          >
            {masterOn ? "● LIVE" : "○ STANDBY"}
          </span>
        </div>
      </div>

      {/* Fuse grid — 9 fuses @ 250W each */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {FUSE_NAMES.map((name, idx) => {
          const isLit = fuseStates[idx];
          return (
            <div
              key={name}
              className="rounded border p-2 flex flex-col items-center gap-1"
              style={{
                borderColor: isLit
                  ? "oklch(0.68 0.22 142 / 0.5)"
                  : "oklch(0.3 0.04 250)",
                background: isLit
                  ? "oklch(0.68 0.22 142 / 0.07)"
                  : "oklch(0.15 0.02 250)",
                boxShadow: isLit ? "0 0 8px oklch(0.68 0.22 142)" : "none",
                transition:
                  "box-shadow 0.25s ease, border-color 0.25s ease, background 0.25s ease",
                animation: isLit
                  ? "ledPulse 1.4s ease-in-out infinite"
                  : "none",
              }}
              data-ocid={`fuseboard.item.${idx + 1}`}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  background: isLit ? "#00ff88" : "#555",
                  boxShadow: isLit ? "0 0 8px oklch(0.68 0.22 142)" : "none",
                  transition: "background 0.25s, box-shadow 0.25s",
                }}
              />
              <div className="text-[8px] text-center text-muted-foreground tracking-wider leading-tight">
                {name}
              </div>
              <div className="text-[8px] text-gold font-bold">250W</div>
              <div
                className="text-[7px] tracking-widest font-black"
                style={{ color: isLit ? "#00ff88" : "#666" }}
              >
                {isLit ? "INTACT ● LIVE" : "BLOWN ○ OFF"}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer count */}
      <div className="border-t border-border pt-3 text-center mb-3">
        <span
          className="text-[9px] tracking-[0.2em] font-bold"
          style={{ color: allOn ? "#00ff88" : anyOn ? "#ffaa00" : "#666" }}
        >
          {allOn
            ? "9/9 FUSES ACTIVE — MAXIMUM STOMP ENGAGED"
            : onCount > 0
              ? `${onCount}/9 FUSES ACTIVE — SYSTEM PROTECTED`
              : "ALL CORRECTIONS OFF — FUSES ON STANDBY"}
        </span>
      </div>

      {/* Full Stomp Force — only when all 9 on */}
      {allOn && (
        <div
          className="rounded border-2 p-3"
          style={{
            borderColor: "#ffd700",
            background: "rgba(255,215,0,0.06)",
            boxShadow:
              "0 0 20px rgba(255,215,0,0.3), inset 0 0 12px rgba(255,215,0,0.06)",
            animation: "goldPulse 2s ease-in-out infinite",
          }}
          data-ocid="fuseboard.panel"
        >
          <div
            className="text-[9px] font-black tracking-[0.2em] text-center mb-2"
            style={{ color: "#ffd700" }}
          >
            ⚡ FULL STOMP FORCE ENGAGED ⚡
          </div>
          <div
            className="text-[8px] font-bold text-center leading-relaxed"
            style={{
              color: "#ffd700",
              wordBreak: "break-all",
              overflowWrap: "break-word",
              maxWidth: "100%",
            }}
          >
            {FULL_STOMP_FORCE}
          </div>
          <div
            className="text-[7px] text-center mt-1 tracking-widest"
            style={{ color: "rgba(255,215,0,0.6)" }}
          >
            ALL 9 CORRECTIONS STOMPING HARD
          </div>
        </div>
      )}

      <style>{`
        @keyframes ledPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
        @keyframes titaniumPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes goldPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 20px rgba(255,215,0,0.3), inset 0 0 12px rgba(255,215,0,0.06); }
          50% { opacity: 0.85; box-shadow: 0 0 30px rgba(255,215,0,0.5), inset 0 0 18px rgba(255,215,0,0.1); }
        }
      `}</style>
    </div>
  );
}
