import { Slider } from "@/components/ui/slider";

interface SmoothLoudBoosterProps {
  boostLevel: number;
  onBoostChange: (v: number) => void;
}

type Zone = {
  label: string;
  status: string;
  color: string;
  glow: string;
  bg: string;
};

function getZone(level: number): Zone {
  if (level === 0)
    return {
      label: "OFF",
      status: "INACTIVE",
      color: "#444",
      glow: "none",
      bg: "rgba(255,255,255,0.02)",
    };
  if (level <= 16)
    return {
      label: "ZONE 1",
      status: "WARMING",
      color: "#00e060",
      glow: "0 0 14px #00e060, 0 0 28px rgba(0,224,96,0.4)",
      bg: "rgba(0,224,96,0.05)",
    };
  if (level <= 25)
    return {
      label: "ZONE 2",
      status: "BUILDING",
      color: "#c8a000",
      glow: "0 0 14px #c8a000, 0 0 28px rgba(200,160,0,0.4)",
      bg: "rgba(200,160,0,0.05)",
    };
  if (level <= 33)
    return {
      label: "ZONE 2",
      status: "GOLD PUSH",
      color: "#d4af37",
      glow: "0 0 16px #d4af37, 0 0 32px rgba(212,175,55,0.4)",
      bg: "rgba(212,175,55,0.05)",
    };
  if (level <= 42)
    return {
      label: "ZONE 3",
      status: "FULL DRIVE",
      color: "#ffc800",
      glow: "0 0 18px #ffc800, 0 0 36px rgba(255,200,0,0.5)",
      bg: "rgba(255,200,0,0.06)",
    };
  return {
    label: "ZONE 3",
    status: "FULL STOMP",
    color: "#ffd700",
    glow: "0 0 24px #ffd700, 0 0 48px rgba(255,215,0,0.6), 0 0 80px rgba(255,215,0,0.2)",
    bg: "rgba(255,215,0,0.08)",
  };
}

export function SmoothLoudBooster({
  boostLevel,
  onBoostChange,
}: SmoothLoudBoosterProps) {
  const pct = (boostLevel / 50) * 100;
  const zone = getZone(boostLevel);

  // Zone boundary percentages (0-33%, 34-66%, 67-100%)
  const zone1End = 33;
  const zone2End = 66;

  return (
    <div
      data-ocid="smooth_booster.panel"
      className="rounded border border-border bg-card p-4 space-y-4"
      style={{
        boxShadow:
          boostLevel > 0
            ? `0 0 20px ${zone.color}20`
            : "0 0 8px rgba(255,255,255,0.04)",
        transition: "box-shadow 0.3s ease",
        background: boostLevel > 0 ? zone.bg : undefined,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{
                background: zone.color,
                boxShadow: zone.glow,
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
              color: zone.color,
              textShadow: boostLevel > 0 ? zone.glow : "none",
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

      {/* Zone label badge */}
      {boostLevel > 0 && (
        <div className="flex justify-center">
          <span
            className="text-[10px] font-black tracking-[0.25em] px-3 py-1 rounded border"
            style={{
              color: zone.color,
              borderColor: `${zone.color}60`,
              background: `${zone.color}10`,
              textShadow: zone.glow,
            }}
          >
            ◈ {zone.label} — {zone.status}
          </span>
        </div>
      )}

      {/* Zone boundaries explanation */}
      <div className="flex gap-1 text-[7px] tracking-wider">
        <div style={{ flex: zone1End, textAlign: "center", color: "#00e060" }}>
          ZONE 1
        </div>
        <div
          style={{
            flex: zone2End - zone1End,
            textAlign: "center",
            color: "#d4af37",
          }}
        >
          ZONE 2
        </div>
        <div
          style={{
            flex: 100 - zone2End,
            textAlign: "center",
            color: "#ffd700",
          }}
        >
          ZONE 3
        </div>
      </div>

      {/* Fill bar with 3 zones */}
      <div className="space-y-1">
        <div
          className="relative w-full rounded-full overflow-hidden"
          style={{
            height: "10px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Zone backgrounds */}
          <div
            style={{
              position: "absolute",
              left: 0,
              width: `${zone1End}%`,
              height: "100%",
              background: "rgba(0,224,96,0.08)",
              borderRight: "1px solid rgba(0,224,96,0.2)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: `${zone1End}%`,
              width: `${zone2End - zone1End}%`,
              height: "100%",
              background: "rgba(212,175,55,0.08)",
              borderRight: "1px solid rgba(212,175,55,0.2)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: `${zone2End}%`,
              width: `${100 - zone2End}%`,
              height: "100%",
              background: "rgba(255,215,0,0.1)",
            }}
          />
          {/* Active fill */}
          <div
            className="h-full rounded-full"
            style={{
              width: `${pct}%`,
              background:
                boostLevel === 0
                  ? "transparent"
                  : pct <= zone1End
                    ? "#00e060"
                    : pct <= zone2End
                      ? "linear-gradient(90deg, #00e060 0%, #d4af37 100%)"
                      : `linear-gradient(90deg, #00e060 0%, #d4af37 ${zone2End}%, #ffd700 100%)`,
              boxShadow: boostLevel > 0 ? `0 0 8px ${zone.color}` : "none",
              transition: "width 0.08s, box-shadow 0.3s",
            }}
          />
        </div>

        {/* Zone tick marks */}
        <div className="relative" style={{ height: "8px" }}>
          <div
            style={{
              position: "absolute",
              left: `${zone1End}%`,
              top: 0,
              width: "1px",
              height: "100%",
              background: "rgba(0,224,96,0.3)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: `${zone2End}%`,
              top: 0,
              width: "1px",
              height: "100%",
              background: "rgba(212,175,55,0.3)",
            }}
          />
          <span
            style={{
              position: "absolute",
              left: `${zone1End}%`,
              fontSize: "6px",
              color: "rgba(0,224,96,0.5)",
              transform: "translateX(-50%)",
            }}
          >
            17
          </span>
          <span
            style={{
              position: "absolute",
              left: `${zone2End}%`,
              fontSize: "6px",
              color: "rgba(212,175,55,0.5)",
              transform: "translateX(-50%)",
            }}
          >
            34
          </span>
        </div>
      </div>

      {/* Slider */}
      <Slider
        min={0}
        max={50}
        step={1}
        value={[boostLevel]}
        onValueChange={([v]) => onBoostChange(v)}
        data-ocid="smooth_booster.input"
        style={{ "--slider-color": zone.color } as React.CSSProperties}
      />

      {/* Scale labels */}
      <div className="flex justify-between text-[7px] text-muted-foreground">
        <span style={{ color: "#00e060" }}>0 — Z1</span>
        <span style={{ color: "#d4af37" }}>17</span>
        <span style={{ color: "#d4af37" }}>25 — Z2</span>
        <span style={{ color: "#ffd700" }}>34</span>
        <span style={{ color: "#ffd700" }}>50 — Z3</span>
      </div>
    </div>
  );
}
