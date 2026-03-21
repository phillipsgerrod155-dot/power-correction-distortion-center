const FUSE_NAMES = [
  "EASY LIMITOR",
  "SYSTEM CLEAN DRIVE",
  "STABILIZER",
  "STABILIZER HELPER",
  "MONITOR",
  "COMMANDER",
  "BRICK WALL HELPER",
  "BRICK WALL",
];

const TITANIUM_FUSE = "TITANIUM OVERDRIVE";

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

  const titaniumOn = corrections
    ? (corrections.find((c) => c.name === TITANIUM_FUSE)?.on ??
      activeCorrectionCount >= 9)
    : activeCorrectionCount >= 9;

  const allOn = fuseStates.every(Boolean) && titaniumOn;
  const anyOn = fuseStates.some(Boolean) || titaniumOn;
  const onCount = fuseStates.filter(Boolean).length + (titaniumOn ? 1 : 0);
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
          FUSE BOARD — 120 FUSES TOTAL — 120W EACH
        </span>
      </div>

      {/* Titanium 150B Master Fuse */}
      <div
        className="rounded border-2 p-3 mb-4"
        style={{
          borderColor: titaniumOn ? "#00a8ff" : "#555",
          background: titaniumOn
            ? "rgba(0,168,255,0.06)"
            : "rgba(80,80,80,0.06)",
          boxShadow: titaniumOn
            ? "0 0 18px rgba(0,168,255,0.35), inset 0 0 12px rgba(0,168,255,0.08)"
            : "none",
          animation: titaniumOn
            ? "titaniumPulse 1.6s ease-in-out infinite"
            : "none",
        }}
        data-ocid="fuseboard.panel"
      >
        <div className="flex items-center justify-between">
          <div>
            <div
              className="font-black text-[11px] tracking-[0.2em]"
              style={{ color: titaniumOn ? "#00a8ff" : "#888" }}
            >
              TITANIUM OVERDRIVE
            </div>
            <div className="text-[9px] text-muted-foreground tracking-wider mt-0.5">
              150,000,000,000 BI FUSE — COMMANDS ALL
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div
              className="w-4 h-4 rounded-full"
              style={{
                background: titaniumOn ? "#00a8ff" : "#555",
                boxShadow: titaniumOn
                  ? "0 0 12px #00a8ff, 0 0 24px rgba(0,168,255,0.6)"
                  : "none",
                animation: titaniumOn
                  ? "ledPulse 1.2s ease-in-out infinite"
                  : "none",
              }}
            />
            <span
              className="text-[9px] font-bold tracking-widest"
              style={{ color: titaniumOn ? "#00a8ff" : "#888" }}
            >
              {titaniumOn ? "● LIVE" : "○ STANDBY"}
            </span>
          </div>
        </div>
        <div
          className="text-[8px] mt-2 tracking-wider"
          style={{ color: titaniumOn ? "rgba(0,168,255,0.7)" : "#555" }}
        >
          Each X added = Titanium 6x stronger, every correction 5x stronger
        </div>
      </div>

      {/* Fuse grid — 8 fuses @ 120W each */}
      <div className="grid grid-cols-4 gap-2 mb-4">
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
              <div className="text-[7px] text-center text-muted-foreground tracking-wider leading-tight">
                {name}
              </div>
              <div className="text-[8px] text-gold font-bold">120W</div>
              <div
                className="text-[7px] tracking-widest font-black"
                style={{ color: isLit ? "#00ff88" : "#666" }}
              >
                {isLit ? "● LIVE" : "○ OFF"}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer count */}
      <div className="border-t border-border pt-3 text-center">
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
        {masterOn && (
          <div
            className="text-[8px] mt-1"
            style={{ color: "rgba(0,168,255,0.6)" }}
          >
            150,000,000,000 BI FUSE COMMANDING ALL 8 CORRECTIONS
          </div>
        )}
      </div>

      <style>{`
        @keyframes ledPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
        @keyframes titaniumPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
