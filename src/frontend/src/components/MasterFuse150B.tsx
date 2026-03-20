import { motion } from "motion/react";
import { useEffect, useRef } from "react";

interface MasterFuse150BProps {
  liveDb: number;
  volume?: number;
  onShutdown: () => void;
}

const DB_MILESTONES = [50, 80, 100, 110, 120, 130, 140, 150];

export function MasterFuse150B({
  liveDb,
  volume,
  onShutdown,
}: MasterFuse150BProps) {
  const shutdownFiredRef = useRef(false);
  const displayDb = Math.max(liveDb, 85 + ((volume || 0) / 100) * 65);
  const isTripped = displayDb > 150;
  const isWarning = displayDb >= 148 && !isTripped;
  const brickWallActive = displayDb >= 120;
  const limiterWatching = displayDb >= 100;

  useEffect(() => {
    if (isTripped && !shutdownFiredRef.current) {
      shutdownFiredRef.current = true;
      onShutdown();
    }
    if (!isTripped) shutdownFiredRef.current = false;
  }, [isTripped, onShutdown]);

  const fuseColor = isTripped
    ? "oklch(0.65 0.22 25)"
    : isWarning
      ? "oklch(0.75 0.18 55)"
      : "oklch(0.75 0.22 142)";

  const fuseShadow = isTripped
    ? "0 0 30px oklch(0.65 0.22 25 / 0.7), 0 0 60px oklch(0.65 0.22 25 / 0.4)"
    : "0 0 30px oklch(0.75 0.22 142 / 0.6), 0 0 60px oklch(0.85 0.18 90 / 0.2)";

  return (
    <div
      data-ocid="masterfuse.panel"
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        background: "oklch(0.09 0.02 120)",
        border: `2px solid ${fuseColor}`,
        borderRadius: "6px",
        padding: "20px",
        boxShadow: fuseShadow,
        transition: "all 0.3s ease",
      }}
    >
      {/* Title */}
      <div
        style={{
          fontSize: "0.6rem",
          letterSpacing: "0.25em",
          fontWeight: 900,
          color: fuseColor,
          textShadow: `0 0 10px ${fuseColor}`,
          textAlign: "center",
          marginBottom: "16px",
        }}
      >
        MASTER FUSE — LAST STAND PROTECTION
      </div>

      {/* Warning banner at 148dB */}
      {isWarning && (
        <motion.div
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 0.4, repeat: Number.POSITIVE_INFINITY }}
          style={{
            textAlign: "center",
            marginBottom: "14px",
            padding: "8px 12px",
            background: "oklch(0.75 0.18 55 / 0.15)",
            border: "2px solid oklch(0.75 0.18 55 / 0.8)",
            borderRadius: "4px",
            fontSize: "0.6rem",
            letterSpacing: "0.15em",
            fontWeight: 900,
            color: "oklch(0.75 0.18 55)",
            textShadow: "0 0 10px oklch(0.75 0.18 55 / 0.9)",
            boxShadow: "0 0 20px oklch(0.75 0.18 55 / 0.3)",
          }}
        >
          ⚠ FUSE GETTING HOT — BACK OFF OR LIMITER JUMPS IN
        </motion.div>
      )}

      {/* Big fuse number */}
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <motion.div
          animate={
            isTripped ? { scale: [1, 1.05, 1] } : { opacity: [1, 0.85, 1] }
          }
          transition={{
            duration: isTripped ? 0.4 : 1.5,
            repeat: Number.POSITIVE_INFINITY,
          }}
          style={{
            fontSize: "clamp(1rem, 3vw, 1.6rem)",
            fontWeight: 900,
            letterSpacing: "0.08em",
            color: fuseColor,
            textShadow: `0 0 20px ${fuseColor}, 0 0 40px ${fuseColor}80`,
          }}
        >
          150,000,000,000
        </motion.div>
        <div
          style={{
            fontSize: "0.5rem",
            letterSpacing: "0.2em",
            color: "oklch(0.5 0.06 100)",
            marginTop: "4px",
          }}
        >
          ONE HUNDRED FIFTY BILLION WATTS — MASTER FUSE
        </div>
      </div>

      {/* Fuse indicator pulsing */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "16px",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <motion.div
          animate={{
            boxShadow: isTripped
              ? [
                  "0 0 12px 4px oklch(0.65 0.22 25 / 0.9)",
                  "0 0 24px 8px oklch(0.65 0.22 25 / 0.5)",
                  "0 0 12px 4px oklch(0.65 0.22 25 / 0.9)",
                ]
              : [
                  "0 0 12px 4px oklch(0.75 0.22 142 / 0.8)",
                  "0 0 20px 6px oklch(0.75 0.22 142 / 0.4)",
                  "0 0 12px 4px oklch(0.75 0.22 142 / 0.8)",
                ],
          }}
          transition={{
            duration: isTripped ? 0.3 : 1.2,
            repeat: Number.POSITIVE_INFINITY,
          }}
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            backgroundColor: fuseColor,
          }}
        />
        <div
          style={{
            fontSize: "0.55rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            color: fuseColor,
            textShadow: `0 0 8px ${fuseColor}`,
          }}
        >
          {isTripped ? "⚠ FUSE TRIPPED — OVERPOWER" : "FUSE ARMED — INTACT"}
        </div>
      </div>

      {/* dB milestone scale — full 0→150 */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          marginBottom: "14px",
          justifyContent: "center",
        }}
      >
        {DB_MILESTONES.map((milestone) => {
          const lit = displayDb >= milestone;
          const isLast = milestone === 150;
          const milestoneColor = isLast
            ? "oklch(0.65 0.22 25)"
            : milestone >= 130
              ? "oklch(0.72 0.20 35)"
              : "oklch(0.75 0.22 142)";
          return (
            <motion.div
              key={milestone}
              animate={lit ? { opacity: [1, 0.7, 1] } : { opacity: 1 }}
              transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "6px 4px",
                background: lit
                  ? `${milestoneColor}22`
                  : "oklch(0.12 0.02 120 / 0.5)",
                border: `1px solid ${lit ? milestoneColor : "oklch(0.25 0.03 100 / 0.4)"}`,
                borderRadius: "3px",
                boxShadow: lit ? `0 0 10px ${milestoneColor}60` : "none",
                transition: "all 0.2s ease",
              }}
            >
              <div
                style={{
                  fontSize: "0.55rem",
                  fontWeight: 700,
                  color: lit ? milestoneColor : "oklch(0.35 0.04 100)",
                  textShadow: lit ? `0 0 6px ${milestoneColor}` : "none",
                  letterSpacing: "0.1em",
                }}
              >
                {milestone}
              </div>
              <div
                style={{
                  fontSize: "0.4rem",
                  color: lit ? milestoneColor : "oklch(0.3 0.03 100)",
                  letterSpacing: "0.1em",
                }}
              >
                dB
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── BRICK WALL + LIMITER NEW JOBS ─────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          marginBottom: "12px",
        }}
      >
        {/* Brick Wall — Job 1: watching, Job 2: block max 150 */}
        <div
          style={{
            padding: "8px",
            background: brickWallActive
              ? "oklch(0.12 0.06 25 / 0.4)"
              : "oklch(0.11 0.02 120 / 0.4)",
            border: `1px solid ${brickWallActive ? "oklch(0.65 0.22 25 / 0.6)" : "oklch(0.3 0.04 100 / 0.3)"}`,
            borderRadius: "3px",
            transition: "all 0.3s ease",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "3px",
            }}
          >
            <motion.div
              animate={{ opacity: brickWallActive ? [1, 0.5, 1] : 1 }}
              transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY }}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                flexShrink: 0,
                backgroundColor: brickWallActive
                  ? "oklch(0.65 0.22 25)"
                  : "oklch(0.75 0.22 142)",
                boxShadow: brickWallActive
                  ? "0 0 8px oklch(0.65 0.22 25 / 0.9)"
                  : "0 0 5px oklch(0.75 0.22 142 / 0.7)",
              }}
            />
            <span
              style={{
                fontSize: "0.55rem",
                fontWeight: 900,
                letterSpacing: "0.18em",
                color: brickWallActive
                  ? "oklch(0.65 0.22 25)"
                  : "oklch(0.75 0.22 142)",
                textShadow: `0 0 6px ${brickWallActive ? "oklch(0.65 0.22 25)" : "oklch(0.75 0.22 142)"}`,
              }}
            >
              BRICK WALL
            </span>
            <span
              style={{
                marginLeft: "auto",
                fontSize: "0.45rem",
                letterSpacing: "0.15em",
                color: brickWallActive
                  ? "oklch(0.65 0.22 25)"
                  : "oklch(0.55 0.08 142)",
              }}
            >
              {brickWallActive ? "● CLAMPING" : "◎ WATCHING"}
            </span>
          </div>
          <div
            style={{
              fontSize: "0.45rem",
              letterSpacing: "0.12em",
              color: "oklch(0.5 0.06 100)",
              paddingLeft: "16px",
            }}
          >
            JOB 1: WATCHING SIGNAL ALL THE WAY UP — JOB 2: BLOCKING MAX 150
          </div>
        </div>

        {/* Limiter — Job 1: watching, Job 2: block max 150 */}
        <div
          style={{
            padding: "8px",
            background: limiterWatching
              ? "oklch(0.12 0.04 55 / 0.3)"
              : "oklch(0.11 0.02 120 / 0.4)",
            border: `1px solid ${limiterWatching ? "oklch(0.72 0.18 55 / 0.5)" : "oklch(0.3 0.04 100 / 0.3)"}`,
            borderRadius: "3px",
            transition: "all 0.3s ease",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "3px",
            }}
          >
            <motion.div
              animate={{ opacity: limiterWatching ? [1, 0.5, 1] : 1 }}
              transition={{ duration: 0.9, repeat: Number.POSITIVE_INFINITY }}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                flexShrink: 0,
                backgroundColor: limiterWatching
                  ? "oklch(0.72 0.18 55)"
                  : "oklch(0.75 0.22 142)",
                boxShadow: limiterWatching
                  ? "0 0 8px oklch(0.72 0.18 55 / 0.9)"
                  : "0 0 5px oklch(0.75 0.22 142 / 0.7)",
              }}
            />
            <span
              style={{
                fontSize: "0.55rem",
                fontWeight: 900,
                letterSpacing: "0.18em",
                color: limiterWatching
                  ? "oklch(0.72 0.18 55)"
                  : "oklch(0.75 0.22 142)",
                textShadow: `0 0 6px ${limiterWatching ? "oklch(0.72 0.18 55)" : "oklch(0.75 0.22 142)"}`,
              }}
            >
              EASY LIMITER — 1dB EASE
            </span>
            <span
              style={{
                marginLeft: "auto",
                fontSize: "0.45rem",
                letterSpacing: "0.15em",
                color: limiterWatching
                  ? "oklch(0.72 0.18 55)"
                  : "oklch(0.55 0.08 142)",
              }}
            >
              {isTripped
                ? "● JUMPING IN"
                : limiterWatching
                  ? "◉ ON GUARD"
                  : "◎ WATCHING"}
            </span>
          </div>
          <div
            style={{
              fontSize: "0.45rem",
              letterSpacing: "0.12em",
              color: "oklch(0.5 0.06 100)",
              paddingLeft: "16px",
            }}
          >
            JOB 1: LETS LOUDNESS THROUGH — JOB 2: BLOCKS FROM HITTING MAX 150 —
            +2dB EASE ACTIVE
          </div>
        </div>
      </div>

      {/* Status message */}
      <motion.div
        animate={isTripped ? { opacity: [1, 0.4, 1] } : { opacity: 1 }}
        transition={{
          duration: 0.4,
          repeat: isTripped ? Number.POSITIVE_INFINITY : 0,
        }}
        style={{
          fontSize: "0.55rem",
          fontWeight: 700,
          letterSpacing: "0.18em",
          textAlign: "center",
          padding: "10px",
          background: isTripped
            ? "oklch(0.12 0.04 25 / 0.5)"
            : "oklch(0.12 0.04 142 / 0.4)",
          border: `1px solid ${fuseColor}40`,
          borderRadius: "3px",
          color: fuseColor,
          textShadow: `0 0 8px ${fuseColor}80`,
          marginBottom: "10px",
        }}
      >
        {isTripped
          ? "⚠ ABOVE 150 dB — LIMITER EASING VOLUME DOWN"
          : "FUSE ARMED — SYSTEM PROTECTED — EASY LIMITER ACTIVE"}
      </motion.div>

      {/* Footer label */}
      <div
        style={{
          fontSize: "0.45rem",
          letterSpacing: "0.18em",
          textAlign: "center",
          color: "oklch(0.45 0.06 100)",
        }}
      >
        FUSE TAKING THE STRESS — AMP PUSHING WITH FULL SAFETY — CORRECTIONS ALL
        THE WAY TO 150
      </div>
    </div>
  );
}
