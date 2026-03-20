import { motion } from "motion/react";

interface SRS224ProcessorUnitProps {
  active?: boolean;
}

const UNITS = [
  { name: "SRS224 PROCESSOR", id: "srs224" },
  { name: "5 CHIP CONTROLLER", id: "chip5" },
  { name: "FPGA COMMANDER", id: "fpga" },
  { name: "MONITOR", id: "monitor" },
  { name: "GAIN CORRECTION", id: "gain" },
  { name: "SIGNAL POWER CONTROLLER", id: "signal" },
  { name: "STABILIZER", id: "stab" },
];

export function SRS224ProcessorUnit({
  active = true,
}: SRS224ProcessorUnitProps) {
  return (
    <div
      data-ocid="srs224.panel"
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        background: "oklch(0.1 0.02 120)",
        border: `1px solid ${active ? "oklch(0.75 0.22 142 / 0.6)" : "oklch(0.3 0.04 100 / 0.4)"}`,
        borderRadius: "6px",
        padding: "16px",
        boxShadow: active
          ? "0 0 24px oklch(0.75 0.22 142 / 0.25), 0 0 48px oklch(0.85 0.18 90 / 0.1)"
          : "none",
        transition: "all 0.4s ease",
      }}
    >
      {/* Header */}
      <div
        style={{
          fontSize: "0.65rem",
          fontWeight: 900,
          letterSpacing: "0.2em",
          color: active ? "oklch(0.85 0.18 90)" : "oklch(0.45 0.05 100)",
          textShadow: active ? "0 0 12px oklch(0.85 0.18 90 / 0.8)" : "none",
          marginBottom: "12px",
          textAlign: "center",
          borderBottom: `1px solid ${active ? "oklch(0.75 0.22 142 / 0.3)" : "oklch(0.2 0.02 100 / 0.3)"}`,
          paddingBottom: "10px",
        }}
      >
        SRS224 UNIFIED PROCESSOR UNIT — ALL SYSTEMS ONE
      </div>

      {/* Unit list */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          marginBottom: "14px",
        }}
      >
        {UNITS.map((unit, i) => (
          <motion.div
            key={unit.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07, duration: 0.3 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "5px 8px",
              background: active
                ? "oklch(0.13 0.03 142 / 0.4)"
                : "oklch(0.1 0.01 100 / 0.2)",
              borderRadius: "3px",
              border: `1px solid ${active ? "oklch(0.75 0.22 142 / 0.2)" : "oklch(0.2 0.02 100 / 0.2)"}`,
            }}
          >
            {/* Glowing dot */}
            <motion.div
              animate={
                active
                  ? { opacity: [1, 0.5, 1], scale: [1, 1.2, 1] }
                  : { opacity: 0.3 }
              }
              transition={{
                duration: 1.8,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.15,
              }}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                flexShrink: 0,
                backgroundColor: active
                  ? "oklch(0.75 0.22 142)"
                  : "oklch(0.4 0.05 100)",
                boxShadow: active
                  ? "0 0 8px 2px oklch(0.75 0.22 142 / 0.8)"
                  : "none",
              }}
            />
            {/* Name */}
            <span
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.18em",
                color: active ? "oklch(0.88 0.08 142)" : "oklch(0.45 0.04 100)",
                flex: 1,
              }}
            >
              {unit.name}
            </span>
            {/* STOMPING badge */}
            {active && (
              <motion.span
                animate={{ opacity: [1, 0.6, 1] }}
                transition={{
                  duration: 1.2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.1,
                }}
                style={{
                  fontSize: "0.5rem",
                  letterSpacing: "0.2em",
                  fontWeight: 900,
                  color: "oklch(0.75 0.22 142)",
                  textShadow: "0 0 6px oklch(0.75 0.22 142 / 0.9)",
                  background: "oklch(0.75 0.22 142 / 0.12)",
                  border: "1px solid oklch(0.75 0.22 142 / 0.3)",
                  borderRadius: "2px",
                  padding: "1px 5px",
                  flexShrink: 0,
                }}
              >
                ATTACKING
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Combined status bar */}
      <motion.div
        animate={active ? { opacity: [1, 0.8, 1] } : { opacity: 0.5 }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        style={{
          fontSize: "0.5rem",
          letterSpacing: "0.15em",
          fontWeight: 700,
          textAlign: "center",
          padding: "8px",
          background: active
            ? "oklch(0.12 0.04 142 / 0.5)"
            : "oklch(0.1 0.01 100 / 0.3)",
          border: `1px solid ${active ? "oklch(0.75 0.22 142 / 0.4)" : "oklch(0.25 0.03 100 / 0.3)"}`,
          borderRadius: "3px",
          color: active ? "oklch(0.9 0.18 142)" : "oklch(0.4 0.04 100)",
          textShadow: active ? "0 0 8px oklch(0.9 0.18 142 / 0.7)" : "none",
          lineHeight: 1.8,
          boxShadow: active
            ? "inset 0 0 16px oklch(0.75 0.22 142 / 0.08)"
            : "none",
        }}
      >
        <div style={{ marginBottom: "4px" }}>
          ALL 5 CORRECTORS + TITANIUM 400,000 — COMBINED ATTACK FORCE:
        </div>
        <div
          style={{
            wordBreak: "break-all",
            overflowWrap: "break-word",
            fontSize: "clamp(5px, 0.8vw, 8px)",
          }}
        >
          34,360,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000
        </div>
      </motion.div>
    </div>
  );
}
