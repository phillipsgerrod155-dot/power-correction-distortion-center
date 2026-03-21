import { motion } from "motion/react";

interface PowerSwitchProps {
  batteryW: number;
  systemPowered: boolean;
  onToggle: () => void;
}

export function PowerSwitch({
  batteryW,
  systemPowered,
  onToggle,
}: PowerSwitchProps) {
  const hasEnoughPower = batteryW >= 50_000;

  const formatW = (w: number) =>
    w >= 1_000_000_000
      ? `${(w / 1_000_000_000).toFixed(2)}B W`
      : w >= 1_000_000
        ? `${(w / 1_000_000).toFixed(1)}M W`
        : w >= 1_000
          ? `${(w / 1_000).toFixed(1)}k W`
          : `${w} W`;

  // GREEN when OFF, electric BLUE when ON
  const offColor = "#00e060"; // bright green
  const onColor = "#00aaff"; // electric blue
  const color = systemPowered ? onColor : offColor;

  return (
    <div
      data-ocid="power.panel"
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        background: "oklch(0.08 0.02 120)",
        border: `2px solid ${color}`,
        borderRadius: "8px",
        padding: "20px",
        boxShadow: `0 0 30px ${color}50, 0 0 60px ${color}20`,
        transition: "all 0.3s ease",
      }}
    >
      <div
        style={{
          fontSize: "0.6rem",
          letterSpacing: "0.25em",
          fontWeight: 900,
          color,
          textShadow: `0 0 12px ${color}`,
          textAlign: "center",
          marginBottom: "16px",
        }}
      >
        MASTER POWER SWITCH — BATTERY CONNECTED
      </div>

      {/* State label */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "8px",
          fontSize: "0.65rem",
          letterSpacing: "0.2em",
          fontWeight: 900,
        }}
      >
        <span
          style={{
            display: "inline-block",
            padding: "3px 12px",
            borderRadius: "4px",
            border: `1px solid ${color}80`,
            background: `${color}15`,
            color,
            textShadow: `0 0 10px ${color}`,
            boxShadow: `0 0 12px ${color}30`,
          }}
        >
          {systemPowered ? "🔵 BLUE = SYSTEM ON" : "🟢 GREEN = SYSTEM OFF"}
        </span>
      </div>

      {/* Big power button */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "16px",
        }}
      >
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={onToggle}
          data-ocid="power.toggle"
          style={{
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${color}25, ${color}08)`,
            border: `3px solid ${color}`,
            boxShadow: `0 0 40px ${color}80, 0 0 80px ${color}30, inset 0 0 20px ${color}10`,
            cursor: "pointer",
            fontSize: "2.2rem",
            color,
            textShadow: `0 0 24px ${color}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
          }}
        >
          ⏻
        </motion.button>
      </div>

      {/* Status */}
      <motion.div
        animate={{ opacity: [1, 0.75, 1] }}
        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
        style={{
          fontSize: "0.55rem",
          letterSpacing: "0.2em",
          fontWeight: 700,
          textAlign: "center",
          color,
          textShadow: `0 0 8px ${color}`,
          marginBottom: "12px",
        }}
      >
        {systemPowered
          ? "⚡ SYSTEM ONLINE — AMP POWERED"
          : !hasEnoughPower
            ? "⚠ BATTERY TOO LOW — CANNOT ACTIVATE"
            : "● SYSTEM DEAD — PRESS TO ACTIVATE"}
      </motion.div>

      {/* Battery wire */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "12px",
        }}
      >
        <div
          style={{
            fontSize: "0.5rem",
            letterSpacing: "0.15em",
            color: "oklch(0.5 0.06 100)",
            whiteSpace: "nowrap",
          }}
        >
          BATTERY
        </div>
        <motion.div
          animate={systemPowered ? { opacity: [1, 0.4, 1] } : { opacity: 0.3 }}
          transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY }}
          style={{
            flex: 1,
            height: "3px",
            background: systemPowered
              ? `linear-gradient(90deg, ${onColor}, oklch(0.85 0.18 90), ${onColor})`
              : "oklch(0.2 0.02 100)",
            boxShadow: systemPowered ? `0 0 8px ${onColor}` : "none",
            borderRadius: "2px",
            transition: "all 0.3s ease",
          }}
        />
        <div
          style={{
            fontSize: "0.5rem",
            letterSpacing: "0.15em",
            color,
            whiteSpace: "nowrap",
          }}
        >
          {formatW(batteryW)}
        </div>
      </div>

      {/* Power check indicators */}
      <div style={{ display: "flex", gap: "8px" }}>
        {[
          { label: "4 GAUGE WIRE", ok: true },
          { label: "BATTERY FEED", ok: batteryW > 0 },
          { label: "50K THRESHOLD", ok: hasEnoughPower },
        ].map(({ label, ok }) => (
          <div
            key={label}
            style={{
              flex: 1,
              textAlign: "center",
              padding: "4px",
              borderRadius: "3px",
              background: ok ? `${offColor}12` : "rgba(80,80,80,0.1)",
              border: `1px solid ${ok ? `${offColor}50` : "rgba(80,80,80,0.2)"}`,
            }}
          >
            <div
              style={{
                fontSize: "0.4rem",
                letterSpacing: "0.1em",
                color: ok ? offColor : "#444",
                fontWeight: 700,
              }}
            >
              {ok ? "✓" : "○"} {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
