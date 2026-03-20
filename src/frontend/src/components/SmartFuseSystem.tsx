import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const BASS_PROFILES = [
  { label: "Sharp Punch", color: "oklch(0.72 0.22 142)", for: "SMALL SPEAKER" },
  { label: "Deep Drop", color: "oklch(0.72 0.22 142)", for: "BIG SPEAKER" },
  { label: "Sub Punch", color: "oklch(0.72 0.22 142)", for: "CAR SPEAKER" },
  { label: "Warm Low", color: "oklch(0.72 0.22 142)", for: "BLUETOOTH" },
];

function useCycleValue<T>(values: T[], intervalMs: number) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % values.length),
      intervalMs,
    );
    return () => clearInterval(id);
  }, [values.length, intervalMs]);
  return values[index];
}

function useOscillatingHz(
  min: number,
  max: number,
  periodMs: number,
  onHzChange?: (hz: number) => void,
) {
  const [hz, setHz] = useState(min);
  const [locked, setLocked] = useState(false);
  const dirRef = useRef(1);
  const lockedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setHz((prev) => {
        const step = ((max - min) / periodMs) * 120;
        let next = prev + step * dirRef.current;
        if (next >= max) {
          next = max;
          dirRef.current = -1;
        } else if (next <= min) {
          next = min;
          dirRef.current = 1;
        }
        const rounded = Math.round(next);
        onHzChange?.(rounded);
        return rounded;
      });
      setLocked(false);
      if (lockedTimerRef.current) clearTimeout(lockedTimerRef.current);
      lockedTimerRef.current = setTimeout(() => setLocked(true), 800);
    }, 120);
    return () => clearInterval(id);
  }, [min, max, periodMs, onHzChange]);

  return { hz, locked };
}

function useOscillatingLoad(
  min: number,
  max: number,
  periodMs: number,
  onLoadChange?: (load: number) => void,
) {
  const [load, setLoad] = useState(min);
  const dirRef = useRef(1);
  useEffect(() => {
    const id = setInterval(() => {
      setLoad((prev) => {
        const step = ((max - min) / periodMs) * 80;
        let next = prev + step * dirRef.current;
        if (next >= max) {
          next = max;
          dirRef.current = -1;
        } else if (next <= min) {
          next = min;
          dirRef.current = 1;
        }
        onLoadChange?.(next);
        return next;
      });
    }, 80);
    return () => clearInterval(id);
  }, [min, max, periodMs, onLoadChange]);
  return load;
}

interface FuseLowPanelProps {
  onLowLoad?: (load: number) => void;
}

function FuseLowPanel({ onLowLoad }: FuseLowPanelProps) {
  const profile = useCycleValue(BASS_PROFILES, 3200);
  const load = useOscillatingLoad(30, 78, 4000, onLowLoad);

  return (
    <div
      style={{
        background: "oklch(0.11 0.02 142 / 0.35)",
        border: "1px solid oklch(0.72 0.22 142 / 0.45)",
        borderRadius: "8px",
        padding: "16px",
        boxShadow:
          "0 0 18px oklch(0.72 0.22 142 / 0.12), inset 0 1px 0 oklch(0.72 0.22 142 / 0.08)",
        flex: 1,
        minWidth: 0,
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "oklch(0.72 0.22 142)",
            boxShadow:
              "0 0 10px 3px oklch(0.72 0.22 142 / 0.8), 0 0 20px oklch(0.72 0.22 142 / 0.4)",
          }}
        />
        <span
          style={{
            fontSize: "9px",
            letterSpacing: "0.22em",
            color: "oklch(0.72 0.22 142)",
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
          }}
        >
          250A SMART FUSE
        </span>
      </div>

      <div
        style={{
          fontSize: "10px",
          color: "oklch(0.72 0.22 142)",
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 800,
          letterSpacing: "0.15em",
          marginBottom: 2,
        }}
      >
        4Ω LOWS
      </div>
      <div
        style={{
          fontSize: "7px",
          color: "oklch(0.55 0.12 142)",
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: "0.1em",
          marginBottom: 12,
          lineHeight: 1.4,
        }}
      >
        MONITORS 4 OHM LOAD
        <br />
        CONTROLS 80Hz AGGRESSION
      </div>

      <div
        style={{
          background: "oklch(0.72 0.22 142 / 0.1)",
          border: "1px solid oklch(0.72 0.22 142 / 0.4)",
          borderRadius: 4,
          padding: "4px 8px",
          marginBottom: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontSize: "8px",
            color: "oklch(0.72 0.22 142)",
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.12em",
          }}
        >
          80Hz MODE
        </span>
        <motion.span
          key={profile.label}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontSize: "9px",
            color: "oklch(0.85 0.22 142)",
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
            letterSpacing: "0.08em",
          }}
        >
          {profile.label}
        </motion.span>
      </div>
      <div
        style={{
          fontSize: "7px",
          color: "oklch(0.45 0.08 142)",
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: "0.1em",
          marginBottom: 10,
        }}
      >
        AUTO: {profile.for}
      </div>

      <div style={{ marginBottom: 6 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 3,
          }}
        >
          <span
            style={{
              fontSize: "7px",
              color: "oklch(0.55 0.12 142)",
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.1em",
            }}
          >
            4Ω LOAD
          </span>
          <span
            style={{
              fontSize: "7px",
              color: "oklch(0.72 0.22 142)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {Math.round(load)}%
          </span>
        </div>
        <div
          style={{
            height: 6,
            background: "oklch(0.15 0.03 142 / 0.5)",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <motion.div
            animate={{ width: `${load}%` }}
            transition={{ duration: 0.08, ease: "linear" }}
            style={{
              height: "100%",
              background:
                "linear-gradient(90deg, oklch(0.55 0.18 142), oklch(0.72 0.22 142))",
              borderRadius: 3,
              boxShadow: "0 0 6px oklch(0.72 0.22 142 / 0.6)",
            }}
          />
        </div>
        <div style={{ position: "relative", height: 2, marginTop: 1 }}>
          <div
            style={{
              position: "absolute",
              left: "80%",
              top: 0,
              width: 1,
              height: "100%",
              background: "oklch(0.85 0.22 142)",
              boxShadow: "0 0 4px oklch(0.85 0.22 142)",
            }}
          />
          <span
            style={{
              position: "absolute",
              left: "82%",
              top: "-2px",
              fontSize: "6px",
              color: "oklch(0.85 0.22 142)",
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.05em",
            }}
          >
            CEILING
          </span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
        <span
          style={{
            fontSize: "8px",
            color: "oklch(0.72 0.22 142)",
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textShadow: "0 0 8px oklch(0.72 0.22 142 / 0.8)",
          }}
        >
          ARMED
        </span>
        <span
          style={{
            fontSize: "7px",
            background: "oklch(0.72 0.22 142 / 0.15)",
            border: "1px solid oklch(0.72 0.22 142 / 0.5)",
            borderRadius: 3,
            padding: "1px 5px",
            color: "oklch(0.72 0.22 142)",
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.1em",
          }}
        >
          4Ω SAFE
        </span>
      </div>
      <div
        style={{
          marginTop: 8,
          fontSize: "7px",
          color: "oklch(0.45 0.08 142)",
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: "0.08em",
          lineHeight: 1.4,
        }}
      >
        KEEPS BASS DEEP &amp; SAFE
        <br />
        AUTO ONLY
      </div>
    </div>
  );
}

interface FuseMidsPanelProps {
  onMidsHz?: (hz: number) => void;
}

function FuseMidsPanel({ onMidsHz }: FuseMidsPanelProps) {
  const { hz, locked } = useOscillatingHz(200, 4000, 5000, onMidsHz);

  return (
    <div
      style={{
        background: "oklch(0.11 0.02 80 / 0.35)",
        border: "1px solid oklch(0.80 0.18 80 / 0.45)",
        borderRadius: "8px",
        padding: "16px",
        boxShadow:
          "0 0 18px oklch(0.80 0.18 80 / 0.12), inset 0 1px 0 oklch(0.80 0.18 80 / 0.08)",
        flex: 1,
        minWidth: 0,
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "oklch(0.80 0.18 80)",
            boxShadow:
              "0 0 10px 3px oklch(0.80 0.18 80 / 0.8), 0 0 20px oklch(0.80 0.18 80 / 0.4)",
          }}
        />
        <span
          style={{
            fontSize: "9px",
            letterSpacing: "0.22em",
            color: "oklch(0.80 0.18 80)",
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
          }}
        >
          MIDS AUTO-TUNE
        </span>
      </div>

      <div
        style={{
          fontSize: "10px",
          color: "oklch(0.80 0.18 80)",
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 800,
          letterSpacing: "0.15em",
          marginBottom: 2,
        }}
      >
        SMART FUSE
      </div>
      <div
        style={{
          fontSize: "7px",
          color: "oklch(0.58 0.10 80)",
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: "0.1em",
          marginBottom: 12,
          lineHeight: 1.4,
        }}
      >
        LISTENS TO SONG
        <br />
        PICKS ITS OWN Hz
      </div>

      <div
        style={{
          background: "oklch(0.08 0.01 80 / 0.8)",
          border: "1px solid oklch(0.80 0.18 80 / 0.35)",
          borderRadius: 6,
          padding: "10px 12px",
          marginBottom: 10,
          textAlign: "center",
        }}
      >
        <motion.div
          key={hz}
          animate={{ opacity: [0.7, 1] }}
          transition={{ duration: 0.1 }}
          style={{
            fontSize: "22px",
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 800,
            color: "oklch(0.88 0.18 80)",
            letterSpacing: "0.05em",
            lineHeight: 1,
            textShadow: "0 0 12px oklch(0.80 0.18 80 / 0.7)",
          }}
        >
          {hz.toLocaleString()}
        </motion.div>
        <div
          style={{
            fontSize: "8px",
            color: "oklch(0.58 0.10 80)",
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.18em",
            marginTop: 2,
          }}
        >
          Hz
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          padding: "5px 0",
          marginBottom: 10,
        }}
      >
        <AnimatePresence mode="wait">
          {locked ? (
            <motion.span
              key="locked"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                fontSize: "9px",
                color: "oklch(0.88 0.18 80)",
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 800,
                letterSpacing: "0.15em",
                textShadow: "0 0 8px oklch(0.80 0.18 80 / 0.9)",
              }}
            >
              ■ LOCKED
            </motion.span>
          ) : (
            <motion.span
              key="tuning"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.5 }}
              exit={{ opacity: 0 }}
              style={{
                fontSize: "9px",
                color: "oklch(0.65 0.14 80)",
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                letterSpacing: "0.15em",
              }}
            >
              ◈ TUNING...
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div
        style={{
          height: 5,
          background: "oklch(0.15 0.03 80 / 0.5)",
          borderRadius: 3,
          overflow: "hidden",
          marginBottom: 8,
        }}
      >
        <motion.div
          animate={{ width: `${((hz - 200) / 3800) * 100}%` }}
          transition={{ duration: 0.12, ease: "linear" }}
          style={{
            height: "100%",
            background:
              "linear-gradient(90deg, oklch(0.55 0.14 80), oklch(0.80 0.18 80))",
            borderRadius: 3,
            boxShadow: "0 0 6px oklch(0.80 0.18 80 / 0.6)",
          }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span
          style={{
            fontSize: "6px",
            color: "oklch(0.45 0.08 80)",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          200Hz
        </span>
        <span
          style={{
            fontSize: "6px",
            color: "oklch(0.45 0.08 80)",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          4000Hz
        </span>
      </div>

      <div
        style={{
          marginTop: 10,
          fontSize: "7px",
          color: "oklch(0.45 0.08 80)",
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: "0.08em",
          lineHeight: 1.4,
        }}
      >
        AUTO-ADJUSTS TO MUSIC QUALITY
        <br />
        NO INPUT NEEDED
      </div>
    </div>
  );
}

interface FuseHighsPanelProps {
  onHighsLoad?: (load: number) => void;
}

function FuseHighsPanel({ onHighsLoad }: FuseHighsPanelProps) {
  const trebleLevel = useOscillatingLoad(55, 78, 3500, onHighsLoad);
  const ceilingAt = 80;

  return (
    <div
      style={{
        background: "oklch(0.11 0.02 210 / 0.35)",
        border: "1px solid oklch(0.72 0.18 210 / 0.45)",
        borderRadius: "8px",
        padding: "16px",
        boxShadow:
          "0 0 18px oklch(0.72 0.18 210 / 0.12), inset 0 1px 0 oklch(0.72 0.18 210 / 0.08)",
        flex: 1,
        minWidth: 0,
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "oklch(0.72 0.18 210)",
            boxShadow:
              "0 0 10px 3px oklch(0.72 0.18 210 / 0.8), 0 0 20px oklch(0.72 0.18 210 / 0.4)",
          }}
        />
        <span
          style={{
            fontSize: "9px",
            letterSpacing: "0.22em",
            color: "oklch(0.72 0.18 210)",
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
          }}
        >
          100A SMART FUSE
        </span>
      </div>

      <div
        style={{
          fontSize: "10px",
          color: "oklch(0.72 0.18 210)",
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 800,
          letterSpacing: "0.15em",
          marginBottom: 2,
        }}
      >
        HIGHS &amp; TREBLE
      </div>
      <div
        style={{
          fontSize: "7px",
          color: "oklch(0.52 0.10 210)",
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: "0.1em",
          marginBottom: 12,
          lineHeight: 1.4,
        }}
      >
        TREBLE CEILING LOCKED
        <br />
        NOTHING GETS PAST
      </div>

      <div style={{ marginBottom: 12 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 3,
          }}
        >
          <span
            style={{
              fontSize: "7px",
              color: "oklch(0.52 0.10 210)",
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.1em",
            }}
          >
            TREBLE PUSH
          </span>
          <span
            style={{
              fontSize: "7px",
              color: "oklch(0.72 0.18 210)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {Math.round(trebleLevel)}%
          </span>
        </div>

        <div
          style={{
            position: "relative",
            height: 20,
            background: "oklch(0.10 0.02 210 / 0.6)",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <motion.div
            animate={{ width: `${Math.min(trebleLevel, ceilingAt)}%` }}
            transition={{ duration: 0.08, ease: "linear" }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              background:
                "linear-gradient(90deg, oklch(0.45 0.14 210), oklch(0.72 0.18 210))",
              boxShadow: "0 0 8px oklch(0.72 0.18 210 / 0.6)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: `${ceilingAt}%`,
              top: 0,
              width: 2,
              height: "100%",
              background: "oklch(0.88 0.18 210)",
              boxShadow: "0 0 6px 2px oklch(0.88 0.18 210 / 0.9)",
            }}
          />
          {trebleLevel > ceilingAt - 5 && (
            <motion.div
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.3 }}
              style={{
                position: "absolute",
                left: `${ceilingAt}%`,
                top: 0,
                width: "20%",
                height: "100%",
                background:
                  "linear-gradient(90deg, oklch(0.88 0.18 210 / 0.4), transparent)",
              }}
            />
          )}
          <div
            style={{
              position: "absolute",
              left: `${ceilingAt + 1}%`,
              top: 3,
              fontSize: "6px",
              color: "oklch(0.88 0.18 210)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            WALL
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 6,
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontSize: "8px",
            color: "oklch(0.72 0.18 210)",
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 800,
            letterSpacing: "0.12em",
            textShadow: "0 0 8px oklch(0.72 0.18 210 / 0.9)",
          }}
        >
          CEILING HELD
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          background: "oklch(0.08 0.01 210 / 0.8)",
          border: "1px solid oklch(0.72 0.18 210 / 0.3)",
          borderRadius: 4,
          padding: "5px 8px",
          marginBottom: 8,
        }}
      >
        <div
          style={{
            flex: 1,
            height: 2,
            background: "oklch(0.72 0.18 210 / 0.4)",
          }}
        />
        <div
          style={{
            width: 16,
            height: 8,
            borderRadius: 2,
            border: "1.5px solid oklch(0.72 0.18 210)",
            background: "oklch(0.72 0.18 210 / 0.2)",
            boxShadow: "0 0 6px oklch(0.72 0.18 210 / 0.7)",
          }}
        />
        <div
          style={{
            flex: 1,
            height: 2,
            background: "oklch(0.72 0.18 210 / 0.4)",
          }}
        />
        <span
          style={{
            fontSize: "7px",
            color: "oklch(0.72 0.18 210)",
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.1em",
          }}
        >
          100A
        </span>
      </div>

      <div
        style={{
          fontSize: "7px",
          color: "oklch(0.45 0.08 210)",
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: "0.08em",
          lineHeight: 1.4,
        }}
      >
        100A BARRIER
        <br />
        HIGHS CANNOT OVERBARRIER
      </div>
    </div>
  );
}

interface SmartFuseSystemProps {
  onLowLoad?: (load: number) => void;
  onMidsHz?: (hz: number) => void;
  onHighsLoad?: (load: number) => void;
}

export function SmartFuseSystem({
  onLowLoad,
  onMidsHz,
  onHighsLoad,
}: SmartFuseSystemProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      data-ocid="smart_fuse.panel"
      style={{
        background: "oklch(0.10 0.015 142 / 0.5)",
        border: "1px solid oklch(0.72 0.22 142 / 0.3)",
        borderRadius: 10,
        overflow: "hidden",
        boxShadow: open
          ? "0 0 32px oklch(0.72 0.22 142 / 0.12), 0 0 32px oklch(0.80 0.18 80 / 0.06), 0 0 32px oklch(0.72 0.18 210 / 0.06)"
          : "0 0 12px oklch(0.72 0.22 142 / 0.08)",
        transition: "box-shadow 0.4s ease",
      }}
    >
      <button
        type="button"
        data-ocid="smart_fuse.toggle"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          background: open
            ? "oklch(0.13 0.02 142 / 0.8)"
            : "oklch(0.10 0.015 142 / 0.7)",
          border: "none",
          cursor: "pointer",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          transition: "background 0.2s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <motion.div
            animate={{
              boxShadow: [
                "0 0 6px 2px oklch(0.72 0.22 142 / 0.6)",
                "0 0 12px 4px oklch(0.72 0.22 142 / 0.9)",
                "0 0 6px 2px oklch(0.72 0.22 142 / 0.6)",
              ],
            }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "oklch(0.72 0.22 142)",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: "10px",
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 800,
              letterSpacing: "0.2em",
              color: "oklch(0.88 0.20 142)",
              textShadow: "0 0 10px oklch(0.72 0.22 142 / 0.5)",
            }}
          >
            ⚡ SMART FUSE SYSTEM
          </span>
          <span
            style={{
              fontSize: "8px",
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.12em",
              color: "oklch(0.60 0.14 142)",
            }}
          >
            3-TIER AUTO PROTECTION
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {!open && (
            <span
              style={{
                fontSize: "7px",
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.1em",
                color: "oklch(0.55 0.10 80)",
              }}
            >
              250A LOWS · MIDS AUTO · 100A HIGHS — ALL SYSTEMS ARMED
            </span>
          )}
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            style={{
              color: "oklch(0.72 0.22 142)",
              fontSize: 14,
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            ▾
          </motion.div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="fuse-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                padding: "14px 14px 16px",
                display: "flex",
                flexDirection: "row",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <FuseLowPanel onLowLoad={onLowLoad} />
              <FuseMidsPanel onMidsHz={onMidsHz} />
              <FuseHighsPanel onHighsLoad={onHighsLoad} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
