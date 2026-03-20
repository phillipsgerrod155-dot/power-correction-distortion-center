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

  const activeColor = "oklch(0.75 0.22 142)";
  const inactiveColor = "oklch(0.65 0.22 25)";
  const color = systemPowered ? activeColor : inactiveColor;

  return (
    <div
      data-ocid="power.panel"
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        background: "oklch(0.08 0.02 120)",
        border: `2px solid ${color}`,
        borderRadius: "8px",
        padding: "20px",
        boxShadow: `0 0 30px ${color}40`,
        transition: "all 0.3s ease",
      }}
    >
      <div
        style={{
          fontSize: "0.6rem",
          letterSpacing: "0.25em",
          fontWeight: 900,
          color,
          textShadow: `0 0 10px ${color}`,
          textAlign: "center",
          marginBottom: "16px",
        }}
      >
        MASTER POWER SWITCH — BATTERY CONNECTED
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
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: systemPowered
              ? `radial-gradient(circle, ${activeColor}33, ${activeColor}11)`
              : `radial-gradient(circle, ${inactiveColor}33, ${inactiveColor}11)`,
            border: `3px solid ${color}`,
            boxShadow: `0 0 30px ${color}80, 0 0 60px ${color}40`,
            cursor: "pointer",
            fontSize: "2rem",
            color,
            textShadow: `0 0 20px ${color}`,
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
        animate={{ opacity: [1, 0.8, 1] }}
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

      {/* Battery connection wire */}
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
              ? `linear-gradient(90deg, ${activeColor}, oklch(0.85 0.18 90), ${activeColor})`
              : "oklch(0.2 0.02 100)",
            boxShadow: systemPowered ? `0 0 8px ${activeColor}` : "none",
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
      <div
        style={{
          display: "flex",
          gap: "6px",
          justifyContent: "center",
          fontSize: "0.45rem",
          letterSpacing: "0.15em",
          flexWrap: "wrap",
        }}
      >
        <div style={{ color: hasEnoughPower ? activeColor : inactiveColor }}>
          {hasEnoughPower ? "✓" : "✗"} BATTERY CHECK{" "}
          {hasEnoughPower ? "PASSED" : "FAILED"}
        </div>
        <div style={{ color: "oklch(0.4 0.04 100)" }}>|</div>
        <div
          style={{
            color: systemPowered ? activeColor : "oklch(0.4 0.04 100)",
          }}
        >
          {systemPowered ? "✓" : "○"} AMP CONNECTED
        </div>
      </div>
    </div>
  );
}
