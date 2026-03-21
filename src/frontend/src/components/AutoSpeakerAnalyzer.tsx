import { useEffect, useRef, useState } from "react";

const STAGES = [
  "Signal Scan",
  "Impedance Check",
  "Frequency Range",
  "Bass Response",
  "Mid Clarity",
  "Treble Sensitivity",
  "Power Handling",
  "Phase Alignment",
  "Rating Compile",
];

const TOTAL_DELAY_MS = 2100;
const STAGE_DELAY = TOTAL_DELAY_MS / STAGES.length;

export function AutoSpeakerAnalyzer() {
  const [currentStage, setCurrentStage] = useState(-1);
  const [complete, setComplete] = useState(false);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runAnalysis = () => {
    setComplete(false);
    setCurrentStage(0);
    setRunning(true);
  };

  useEffect(() => {
    if (!running || currentStage < 0) return;
    if (currentStage >= STAGES.length) {
      setComplete(true);
      setRunning(false);
      return;
    }
    timerRef.current = setTimeout(() => {
      setCurrentStage((s) => s + 1);
    }, STAGE_DELAY);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [running, currentStage]);

  const progress = complete
    ? 100
    : currentStage < 0
      ? 0
      : Math.round((currentStage / STAGES.length) * 100);

  return (
    <div
      style={{
        background: "rgba(0,0,0,0.5)",
        border: "1px solid rgba(0,255,136,0.25)",
        borderRadius: "6px",
        padding: "14px",
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "9px",
              fontWeight: 900,
              letterSpacing: "0.3em",
              color: "#00ff88",
              textShadow: "0 0 8px #00ff88",
            }}
          >
            AUTO SPEAKER ANALYZER
          </div>
          <div
            style={{
              fontSize: "7px",
              color: "rgba(0,255,136,0.5)",
              letterSpacing: "0.15em",
              marginTop: "2px",
            }}
          >
            9 STAGES · 2.1s DELAY · MIN 12.1 RATING
          </div>
        </div>
        <button
          type="button"
          data-ocid="analyzer.primary_button"
          onClick={runAnalysis}
          disabled={running}
          style={{
            fontSize: "8px",
            fontWeight: 900,
            letterSpacing: "0.2em",
            padding: "4px 10px",
            borderRadius: "3px",
            background: running
              ? "rgba(0,255,136,0.1)"
              : "rgba(0,255,136,0.15)",
            border: "1px solid rgba(0,255,136,0.5)",
            color: running ? "rgba(0,255,136,0.5)" : "#00ff88",
            cursor: running ? "not-allowed" : "pointer",
            textShadow: running ? "none" : "0 0 6px #00ff88",
          }}
        >
          {running ? "ANALYZING..." : complete ? "RE-ANALYZE" : "RUN ANALYSIS"}
        </button>
      </div>

      {/* ONN RUGGED locked badge */}
      <div
        style={{
          background: "rgba(0,168,255,0.08)",
          border: "1px solid rgba(0,168,255,0.3)",
          borderRadius: "4px",
          padding: "6px 10px",
          marginBottom: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontSize: "9px",
            fontWeight: 900,
            color: "#00a8ff",
            letterSpacing: "0.2em",
            textShadow: "0 0 6px #00a8ff",
          }}
        >
          ONN RUGGED
        </span>
        <span
          style={{
            fontSize: "8px",
            color: "rgba(0,168,255,0.7)",
            letterSpacing: "0.15em",
          }}
        >
          LOCKED · 4Ω PROFILE
        </span>
      </div>

      {/* Progress bar */}
      <div
        style={{
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "4px",
          }}
        >
          <span
            style={{
              fontSize: "7px",
              color: "rgba(0,255,136,0.6)",
              letterSpacing: "0.15em",
            }}
          >
            PROGRESS
          </span>
          <span
            style={{
              fontSize: "7px",
              color: "#00ff88",
              fontWeight: 700,
            }}
          >
            {progress}%
          </span>
        </div>
        <div
          style={{
            height: "6px",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "3px",
            border: "1px solid rgba(0,255,136,0.15)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: complete
                ? "linear-gradient(90deg, #00ff88, #00ffcc)"
                : "linear-gradient(90deg, #00ff88, #00e8a0)",
              boxShadow: "0 0 8px #00ff88",
              borderRadius: "3px",
              transition: "width 0.25s ease",
            }}
          />
        </div>
      </div>

      {/* Stage grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "4px",
          marginBottom: "10px",
        }}
      >
        {STAGES.map((stage, i) => {
          const done = complete || (running && i < currentStage);
          const active = running && i === currentStage;
          return (
            <div
              key={stage}
              style={{
                background: done
                  ? "rgba(0,255,136,0.12)"
                  : active
                    ? "rgba(0,255,136,0.08)"
                    : "rgba(0,0,0,0.3)",
                border: `1px solid ${
                  done
                    ? "rgba(0,255,136,0.4)"
                    : active
                      ? "rgba(0,255,136,0.3)"
                      : "rgba(255,255,255,0.06)"
                }`,
                borderRadius: "3px",
                padding: "5px 6px",
                animation: active
                  ? "stagePulse 0.5s ease-in-out infinite"
                  : "none",
              }}
            >
              <div
                style={{
                  fontSize: "6px",
                  color: done
                    ? "#00ff88"
                    : active
                      ? "rgba(0,255,136,0.7)"
                      : "#555",
                  letterSpacing: "0.1em",
                  marginBottom: "1px",
                }}
              >
                {done ? "✓" : active ? "▶" : String(i + 1).padStart(2, "0")}
              </div>
              <div
                style={{
                  fontSize: "7px",
                  fontWeight: 700,
                  color: done
                    ? "#00ff88"
                    : active
                      ? "rgba(0,255,136,0.8)"
                      : "#444",
                  letterSpacing: "0.05em",
                  textShadow: done ? "0 0 4px #00ff88" : "none",
                }}
              >
                {stage}
              </div>
            </div>
          );
        })}
      </div>

      {/* Result */}
      {complete && (
        <div
          style={{
            background: "rgba(0,255,136,0.08)",
            border: "2px solid rgba(0,255,136,0.5)",
            borderRadius: "4px",
            padding: "10px",
            textAlign: "center",
            animation: "ratingGlow 1.5s ease-in-out infinite",
          }}
        >
          <div
            style={{
              fontSize: "18px",
              fontWeight: 900,
              color: "#00ff88",
              textShadow: "0 0 20px #00ff88, 0 0 40px rgba(0,255,136,0.5)",
              letterSpacing: "0.1em",
            }}
          >
            RATING: 12.1
          </div>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 900,
              color: "#00ffcc",
              letterSpacing: "0.3em",
              marginTop: "4px",
              textShadow: "0 0 10px #00ffcc",
            }}
          >
            ✓ CLEARED — READY TO PLAY
          </div>
        </div>
      )}

      {!complete && !running && currentStage < 0 && (
        <div
          style={{
            textAlign: "center",
            fontSize: "8px",
            color: "rgba(0,255,136,0.4)",
            letterSpacing: "0.2em",
            padding: "8px 0",
          }}
        >
          PRESS RUN ANALYSIS TO BEGIN
        </div>
      )}

      {running && currentStage >= 0 && currentStage < STAGES.length && (
        <div
          style={{
            textAlign: "center",
            fontSize: "9px",
            fontWeight: 700,
            color: "rgba(0,255,136,0.8)",
            letterSpacing: "0.25em",
            padding: "6px 0",
            animation: "stagePulse 0.6s ease-in-out infinite",
          }}
        >
          ▶ {STAGES[currentStage].toUpperCase()}...
        </div>
      )}

      <style>{`
        @keyframes stagePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes ratingGlow {
          0%, 100% { box-shadow: 0 0 10px rgba(0,255,136,0.3); }
          50% { box-shadow: 0 0 25px rgba(0,255,136,0.6); }
        }
      `}</style>
    </div>
  );
}
