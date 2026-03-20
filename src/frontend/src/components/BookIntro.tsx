import { useEffect, useState } from "react";

interface BookIntroProps {
  onComplete: () => void;
}

export function BookIntro({ onComplete }: BookIntroProps) {
  const [phase, setPhase] = useState<"closed" | "opening" | "open" | "done">(
    "closed",
  );

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("opening"), 800);
    const t2 = setTimeout(() => setPhase("open"), 2200);
    const t3 = setTimeout(() => setPhase("done"), 3600);
    const t4 = setTimeout(() => onComplete(), 4000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  if (phase === "done") return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at center, #0a0a0f 0%, #000000 100%)",
        transition: "opacity 0.4s ease",
        opacity: phase === "open" ? 0 : 1,
      }}
    >
      {/* Ambient glow behind book */}
      <div
        className="absolute"
        style={{
          width: 600,
          height: 400,
          background:
            "radial-gradient(ellipse, rgba(212,175,55,0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
          transition: "opacity 1s ease",
          opacity: phase === "closed" ? 0 : 1,
        }}
      />

      {/* Book container */}
      <div
        style={{
          width: 520,
          height: 340,
          position: "relative",
          perspective: 1200,
          overflow: "hidden",
        }}
      >
        {/* Book spine / back cover */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, #0d0d14 0%, #1a1a2e 40%, #0d0d14 100%)",
            border: "1px solid rgba(212,175,55,0.3)",
            borderRadius: 4,
            boxShadow:
              "0 0 60px rgba(212,175,55,0.08), inset 0 0 40px rgba(0,0,0,0.8)",
          }}
        />

        {/* Left page */}
        <div
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            right: "50%",
            bottom: 8,
            background: "linear-gradient(135deg, #0d0d14 0%, #111128 100%)",
            border: "1px solid rgba(212,175,55,0.15)",
            borderRadius: "4px 0 0 4px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            opacity: phase === "opening" || phase === "open" ? 1 : 0,
            transition: "opacity 0.6s ease 0.4s",
          }}
        >
          <div
            style={{
              width: "60%",
              height: 1,
              background: "rgba(212,175,55,0.4)",
              marginBottom: 16,
            }}
          />
          <div
            style={{
              color: "rgba(212,175,55,0.5)",
              fontSize: 8,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              fontFamily: "'JetBrains Mono', monospace",
              marginBottom: 8,
            }}
          >
            System v1.0
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.15)",
              fontSize: 7,
              letterSpacing: "0.2em",
              fontFamily: "'JetBrains Mono', monospace",
              textAlign: "center",
              lineHeight: 2,
            }}
          >
            POWER CORRECTION
            <br />
            DISTORTION CENTER
            <br />
            SRS2202
          </div>
          <div
            style={{
              width: "60%",
              height: 1,
              background: "rgba(212,175,55,0.4)",
              marginTop: 16,
            }}
          />
        </div>

        {/* Right page */}
        <div
          style={{
            position: "absolute",
            top: 8,
            left: "50%",
            right: 8,
            bottom: 8,
            background: "linear-gradient(135deg, #111128 0%, #0d0d14 100%)",
            border: "1px solid rgba(212,175,55,0.15)",
            borderRadius: "0 4px 4px 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            opacity: phase === "opening" || phase === "open" ? 1 : 0,
            transition: "opacity 0.6s ease 0.6s",
          }}
        >
          <div
            style={{
              color: "rgba(212,175,55,0.6)",
              fontSize: 7,
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              fontFamily: "'JetBrains Mono', monospace",
              marginBottom: 12,
            }}
          >
            Created By
          </div>

          <div
            style={{
              color: "#d4af37",
              fontSize: 18,
              fontWeight: 900,
              letterSpacing: "0.15em",
              fontFamily: "'JetBrains Mono', monospace",
              textShadow:
                "0 0 20px rgba(212,175,55,0.6), 0 0 40px rgba(212,175,55,0.3)",
              marginBottom: 4,
              textAlign: "center",
            }}
          >
            GERROD
          </div>

          <div
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: 8,
              letterSpacing: "0.25em",
              fontFamily: "'JetBrains Mono', monospace",
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            ENGINEER / PRODUCT DESIGNER
          </div>

          <div
            style={{
              width: "80%",
              height: 1,
              background:
                "linear-gradient(to right, transparent, rgba(212,175,55,0.5), transparent)",
              marginBottom: 16,
            }}
          />

          <div
            style={{
              color: "rgba(212,175,55,0.5)",
              fontSize: 7,
              letterSpacing: "0.3em",
              fontFamily: "'JetBrains Mono', monospace",
              marginBottom: 4,
            }}
          >
            CREATED
          </div>

          <div
            style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.2em",
              fontFamily: "'JetBrains Mono', monospace",
              textShadow: "0 0 10px rgba(255,255,255,0.2)",
              marginBottom: 16,
            }}
          >
            FEBRUARY 18, 2026
          </div>

          {/* Fine print -- Gerrod / AI The Designer */}
          <div
            style={{
              color: "rgba(255,255,255,0.25)",
              fontSize: 6,
              letterSpacing: "0.2em",
              fontFamily: "'JetBrains Mono', monospace",
              textAlign: "center",
              lineHeight: 1.8,
            }}
          >
            Gerrod / AI The Designer
          </div>
        </div>

        {/* Front cover -- flips open */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: "left center",
            transform:
              phase === "closed" ? "rotateY(0deg)" : "rotateY(-175deg)",
            transition: "transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
            transformStyle: "preserve-3d",
            borderRadius: 4,
            zIndex: 10,
          }}
        >
          {/* Front face */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, #0d0d14 0%, #1a1a2e 50%, #0d0d14 100%)",
              border: "1px solid rgba(212,175,55,0.4)",
              borderRadius: 4,
              backfaceVisibility: "hidden",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 40,
              boxShadow:
                "4px 0 30px rgba(0,0,0,0.8), inset 0 0 60px rgba(0,0,0,0.5)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 1,
                  background: "rgba(212,175,55,0.4)",
                }}
              />
              <div
                style={{
                  width: 6,
                  height: 6,
                  background: "rgba(212,175,55,0.6)",
                  transform: "rotate(45deg)",
                }}
              />
              <div
                style={{
                  width: 40,
                  height: 1,
                  background: "rgba(212,175,55,0.4)",
                }}
              />
            </div>

            <div
              style={{
                color: "rgba(212,175,55,0.4)",
                fontSize: 7,
                letterSpacing: "0.5em",
                textTransform: "uppercase",
                fontFamily: "'JetBrains Mono', monospace",
                marginBottom: 12,
              }}
            >
              Original Creation
            </div>

            <div
              style={{
                color: "#d4af37",
                fontSize: 22,
                fontWeight: 900,
                letterSpacing: "0.2em",
                fontFamily: "'JetBrains Mono', monospace",
                textShadow:
                  "0 0 30px rgba(212,175,55,0.8), 0 0 60px rgba(212,175,55,0.4)",
                textAlign: "center",
                lineHeight: 1.3,
                marginBottom: 8,
              }}
            >
              POWER CORRECTION
              <br />
              DISTORTION CENTER
            </div>

            <div
              style={{
                color: "rgba(255,255,255,0.3)",
                fontSize: 8,
                letterSpacing: "0.4em",
                fontFamily: "'JetBrains Mono', monospace",
                marginBottom: 20,
              }}
            >
              SRS2202 — HBS SERIES
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 1,
                  background: "rgba(212,175,55,0.4)",
                }}
              />
              <div
                style={{
                  width: 6,
                  height: 6,
                  background: "rgba(212,175,55,0.6)",
                  transform: "rotate(45deg)",
                }}
              />
              <div
                style={{
                  width: 40,
                  height: 1,
                  background: "rgba(212,175,55,0.4)",
                }}
              />
            </div>

            {/* Fine print on front cover */}
            <div
              style={{
                color: "rgba(255,255,255,0.2)",
                fontSize: 6,
                letterSpacing: "0.2em",
                fontFamily: "'JetBrains Mono', monospace",
                textAlign: "center",
              }}
            >
              Gerrod / AI The Designer
            </div>
          </div>

          {/* Back face of cover */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "#0a0a12",
              border: "1px solid rgba(212,175,55,0.2)",
              borderRadius: 4,
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          />
        </div>
      </div>

      {/* Fine print below the book */}
      <div
        style={{
          marginTop: 24,
          color: "rgba(255,255,255,0.18)",
          fontSize: 6,
          letterSpacing: "0.25em",
          fontFamily: "'JetBrains Mono', monospace",
          textAlign: "center",
          opacity: phase === "opening" || phase === "open" ? 1 : 0,
          transition: "opacity 0.8s ease 1s",
        }}
      >
        Gerrod / AI The Designer &nbsp;&bull;&nbsp; Power Correction Distortion
        Center &nbsp;&bull;&nbsp; February 18, 2026
      </div>
    </div>
  );
}
