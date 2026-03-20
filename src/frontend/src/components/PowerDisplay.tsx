interface PowerDisplayProps {
  batteryW?: number;
  systemPowered?: boolean;
}

export function PowerDisplay({ batteryW, systemPowered }: PowerDisplayProps) {
  const maxBattery = 200_000_000;
  const batteryPct =
    batteryW !== undefined
      ? Math.min(100, Math.round((batteryW / maxBattery) * 100))
      : 100;

  const formatW = (w: number) =>
    w >= 1_000_000
      ? `${(w / 1_000_000).toFixed(1)}M W`
      : w >= 1_000
        ? `${(w / 1_000).toFixed(1)}k W`
        : `${w} W`;

  const rows = [
    {
      label: "CHARGER",
      value: "200,000,000W",
      note: "SECRETLY DOUBLED →",
      doubled: "2,000,000,000W",
    },
    { label: "BATTERY", value: "200,000,000W", note: null, doubled: null },
    {
      label: "HEADROOM",
      value: "+50,000,000W",
      note: "RESERVE",
      doubled: null,
    },
    {
      label: "CLASSIFIED RESERVE",
      value: "+50,000,000W",
      note: "HIDDEN",
      doubled: null,
    },
  ];

  return (
    <div
      className="rounded border border-border bg-card p-4"
      style={{ boxShadow: "0 0 12px rgba(212,175,55,0.08)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-2 h-2 rounded-full"
          style={{
            background: systemPowered !== false ? "#00ff88" : "#ffd700",
            boxShadow:
              systemPowered !== false ? "0 0 6px #00ff88" : "0 0 6px #ffd700",
          }}
        />
        <span className="text-gold text-xs font-black tracking-[0.25em]">
          SYSTEM POWER COMMAND
        </span>
        <div
          className="ml-auto text-[9px] tracking-widest font-bold"
          style={{
            color: systemPowered !== false ? "#00ff88" : "#ffd700",
            textShadow:
              systemPowered !== false ? "0 0 8px #00ff88" : "0 0 8px #ffd700",
          }}
        >
          {systemPowered !== false ? "AMP ONLINE" : "AMP OFFLINE — CHARGING"}
        </div>
      </div>

      {/* Live battery watts */}
      {batteryW !== undefined && (
        <div className="mb-3 rounded border border-border bg-muted/20 px-3 py-2">
          <div className="flex items-baseline gap-2">
            <span className="text-[9px] text-muted-foreground tracking-widest">
              BATTERY LIVE
            </span>
            <span
              className="text-sm font-black tracking-widest"
              style={{
                color: systemPowered ? "#00ff88" : "#ffd700",
                textShadow: systemPowered
                  ? "0 0 10px #00ff88"
                  : "0 0 10px #ffd700",
              }}
            >
              {formatW(batteryW)}
            </span>
            <span className="text-[9px] text-muted-foreground">
              → 200,000,000W
            </span>
          </div>
        </div>
      )}

      {/* Power rows */}
      <div className="space-y-2 mb-4">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex flex-wrap items-center gap-2 text-[10px]"
          >
            <span className="text-muted-foreground w-36 tracking-wider">
              {r.label}
            </span>
            <span className="text-gold font-bold">{r.value}</span>
            {r.note && (
              <span className="text-muted-foreground text-[9px]">{r.note}</span>
            )}
            {r.doubled && (
              <span className="text-green-active font-bold">{r.doubled}</span>
            )}
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="border-t border-border pt-3 mb-4">
        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-muted-foreground tracking-wider">
            TOTAL OUTPUT
          </span>
          <span className="text-gold font-black text-base tracking-widest">
            850,000,000W
          </span>
        </div>
      </div>

      {/* Battery progress */}
      <div className="mb-3">
        <div className="flex justify-between text-[9px] mb-1">
          <span className="text-muted-foreground tracking-wider">
            BATTERY CHARGE
          </span>
          <span className="text-gold">{batteryPct}%</span>
        </div>
        <div className="h-3 rounded bg-muted overflow-hidden">
          <div
            className="h-full rounded"
            style={{
              width: `${batteryPct}%`,
              background:
                batteryPct >= 100
                  ? "linear-gradient(90deg, #00cc66, #00ff88)"
                  : "linear-gradient(90deg, #d4af37, #ffd700)",
              boxShadow: batteryPct >= 100 ? "0 0 8px #00ff88" : "none",
              transition: "width 0.05s linear",
            }}
          />
        </div>
        <div className="text-[8px] text-muted-foreground mt-1 tracking-wider">
          AMP ACTIVATES AT: 50,000W MINIMUM
        </div>
      </div>

      {/* Wire gauge — 4 GAUGE controlled delivery */}
      <div className="text-center text-[8px] text-gold tracking-[0.2em] mt-2 border-t border-border pt-2">
        4 GAUGE WIRE — CONTROLLED POWER DELIVERY
      </div>
    </div>
  );
}
