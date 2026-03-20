import { motion } from "motion/react";

interface BatteryChargerProps {
  batteryW: number;
  systemPowered: boolean;
}

export function BatteryCharger({
  batteryW,
  systemPowered,
}: BatteryChargerProps) {
  const maxW = 200_000_000;
  const pct = Math.min(100, (batteryW / maxW) * 100);
  const isCharging = batteryW < maxW;
  const isFull = batteryW >= maxW;

  const chargeColor = isFull ? "oklch(0.75 0.22 142)" : "oklch(0.85 0.18 90)";

  const formatW = (w: number) =>
    w >= 1_000_000_000
      ? `${(w / 1_000_000_000).toFixed(3)}B W`
      : w >= 1_000_000
        ? `${(w / 1_000_000).toFixed(2)}M W`
        : w >= 1_000
          ? `${(w / 1_000).toFixed(1)}k W`
          : `${w} W`;

  return (
    <div
      data-ocid="battery.panel"
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        background: "oklch(0.08 0.02 120)",
        border: `1px solid ${chargeColor}60`,
        borderRadius: "8px",
        padding: "16px",
        boxShadow: `0 0 20px ${chargeColor}20`,
      }}
    >
      <div
        style={{
          fontSize: "0.6rem",
          letterSpacing: "0.25em",
          fontWeight: 900,
          color: chargeColor,
          textShadow: `0 0 8px ${chargeColor}`,
          marginBottom: "14px",
          textAlign: "center",
        }}
      >
        CHARGER → BATTERY POWER FEED
      </div>

      {/* Charger to battery flow visualization */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "14px",
        }}
      >
        {/* Charger block */}
        <div style={{ textAlign: "center", minWidth: "60px" }}>
          <motion.div
            animate={
              isCharging
                ? {
                    textShadow: [
                      "0 0 8px oklch(0.85 0.18 90)",
                      "0 0 20px oklch(0.85 0.18 90)",
                      "0 0 8px oklch(0.85 0.18 90)",
                    ],
                  }
                : {}
            }
            transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
            style={{ fontSize: "1.4rem", color: "oklch(0.85 0.18 90)" }}
          >
            ⚡
          </motion.div>
          <div
            style={{
              fontSize: "0.4rem",
              letterSpacing: "0.1em",
              color: "oklch(0.5 0.06 100)",
              marginTop: "2px",
            }}
          >
            2,000,000,000W
          </div>
          <div style={{ fontSize: "0.4rem", color: "oklch(0.5 0.06 100)" }}>
            CHARGER
          </div>
        </div>

        {/* Animated flow wire */}
        <div
          style={{
            flex: 1,
            position: "relative",
            height: "20px",
            overflow: "hidden",
          }}
        >
          {/* Base wire */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              height: "3px",
              background: "oklch(0.15 0.02 100)",
              borderRadius: "2px",
              transform: "translateY(-50%)",
            }}
          />
          {/* Flowing charge dots */}
          {isCharging &&
            [0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                animate={{ x: ["0%", "100%"] }}
                transition={{
                  duration: 1.2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.24,
                  ease: "linear",
                }}
                style={{
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: chargeColor,
                  boxShadow: `0 0 6px ${chargeColor}`,
                  left: "-6px",
                }}
              />
            ))}
          {/* Full charge — solid line */}
          {isFull && (
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              style={{
                position: "absolute",
                top: "50%",
                left: 0,
                right: 0,
                height: "3px",
                background: chargeColor,
                boxShadow: `0 0 8px ${chargeColor}`,
                borderRadius: "2px",
                transform: "translateY(-50%)",
              }}
            />
          )}
        </div>

        {/* Battery block */}
        <div style={{ textAlign: "center", minWidth: "60px" }}>
          <div
            style={{
              fontSize: "0.4rem",
              letterSpacing: "0.1em",
              color: chargeColor,
              marginBottom: "3px",
            }}
          >
            {isFull ? "FULL" : `${pct.toFixed(1)}%`}
          </div>
          <div
            style={{
              width: "50px",
              height: "22px",
              border: `2px solid ${chargeColor}`,
              borderRadius: "3px",
              position: "relative",
              overflow: "hidden",
              margin: "0 auto",
            }}
          >
            <motion.div
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.1 }}
              style={{
                height: "100%",
                background: `linear-gradient(90deg, ${chargeColor}80, ${chargeColor})`,
                boxShadow: `0 0 8px ${chargeColor}`,
              }}
            />
            {isCharging && (
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `${chargeColor}20`,
                }}
              />
            )}
          </div>
          <div
            style={{
              fontSize: "0.4rem",
              color: "oklch(0.5 0.06 100)",
              marginTop: "2px",
            }}
          >
            BATTERY
          </div>
        </div>
      </div>

      {/* Watt readout */}
      <div style={{ textAlign: "center" }}>
        <motion.div
          animate={isCharging ? { opacity: [1, 0.7, 1] } : {}}
          transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
          style={{
            fontSize: "clamp(0.6rem, 2vw, 0.8rem)",
            fontWeight: 900,
            letterSpacing: "0.1em",
            color: chargeColor,
            textShadow: `0 0 12px ${chargeColor}`,
          }}
        >
          {formatW(batteryW)}
        </motion.div>
        <div
          style={{
            fontSize: "0.45rem",
            letterSpacing: "0.15em",
            color: "oklch(0.4 0.04 100)",
            marginTop: "4px",
          }}
        >
          {isFull
            ? "BATTERY FULL — 200,000,000W — AMP POWERED"
            : isCharging
              ? "CHARGING FROM 2,000,000,000W CHARGER..."
              : "STANDBY"}
        </div>
        {systemPowered && (
          <div
            style={{
              marginTop: "6px",
              fontSize: "0.45rem",
              letterSpacing: "0.15em",
              color: "oklch(0.75 0.22 142)",
              textShadow: "0 0 8px oklch(0.75 0.22 142)",
            }}
          >
            ✓ AMP ONLINE — SYSTEM POWERED
          </div>
        )}
      </div>
    </div>
  );
}
