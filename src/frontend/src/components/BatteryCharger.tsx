import { motion } from "motion/react";

interface BatteryChargerProps {
  batteryW: number;
  systemPowered: boolean;
  rechargeWarning?: boolean;
}

export function BatteryCharger({
  batteryW,
  systemPowered,
  rechargeWarning = false,
}: BatteryChargerProps) {
  const maxW = 2_000_000_000;
  const pct = Math.min(100, (batteryW / maxW) * 100);
  const isCharging = batteryW < maxW;
  const isFull = batteryW >= maxW;

  // Also trigger warning internally if battery < 10%
  const showWarning = rechargeWarning || (!isFull && pct < 10);

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

      {/* 15-min recharge warning */}
      {showWarning && (
        <motion.div
          animate={{
            opacity: [1, 0.6, 1],
            boxShadow: [
              "0 0 8px rgba(255,165,0,0.4)",
              "0 0 20px rgba(255,165,0,0.7)",
              "0 0 8px rgba(255,165,0,0.4)",
            ],
          }}
          transition={{ duration: 1.0, repeat: Number.POSITIVE_INFINITY }}
          style={{
            background: "rgba(255,140,0,0.12)",
            border: "1px solid rgba(255,165,0,0.6)",
            borderRadius: "4px",
            padding: "6px 10px",
            textAlign: "center",
            marginBottom: "12px",
          }}
          data-ocid="battery.warning_state"
        >
          <span
            style={{
              fontSize: "9px",
              fontWeight: 900,
              letterSpacing: "0.2em",
              color: "#ff9500",
              textShadow: "0 0 10px rgba(255,149,0,0.8)",
            }}
          >
            ⚠️ RECHARGE IN 15 MIN
          </span>
        </motion.div>
      )}

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
              animate={isCharging ? { opacity: [0.7, 1, 0.7] } : { opacity: 1 }}
              transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: `${pct}%`,
                background: chargeColor,
                boxShadow: `0 0 8px ${chargeColor}`,
              }}
            />
          </div>
          <div
            style={{
              fontSize: "0.4rem",
              letterSpacing: "0.1em",
              color: chargeColor,
              marginTop: "3px",
            }}
          >
            {formatW(batteryW)}
          </div>
        </div>
      </div>

      {/* Details row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "6px",
        }}
      >
        {[
          ["BATTERY", "200bi W"],
          ["HEADROOM", "+50M W"],
          ["WIRE", "4 GAUGE"],
        ].map(([label, value]) => (
          <div
            key={label}
            style={{
              background: "rgba(0,0,0,0.3)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "3px",
              padding: "4px 6px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "0.4rem",
                color: "oklch(0.4 0.04 100)",
                letterSpacing: "0.1em",
              }}
            >
              {label}
            </div>
            <div
              style={{
                fontSize: "0.5rem",
                fontWeight: 700,
                color: chargeColor,
                marginTop: "1px",
              }}
            >
              {value}
            </div>
          </div>
        ))}
      </div>

      {systemPowered && (
        <div
          style={{
            marginTop: "10px",
            textAlign: "center",
            fontSize: "0.45rem",
            letterSpacing: "0.2em",
            color: "oklch(0.65 0.22 220)",
            textShadow: "0 0 8px oklch(0.65 0.22 220)",
          }}
        >
          ⚡ AMP RECEIVING POWER
        </div>
      )}
    </div>
  );
}
