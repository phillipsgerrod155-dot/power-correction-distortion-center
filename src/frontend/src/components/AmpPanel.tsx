import { useState } from "react";

interface AmpPanelProps {
  loudnessSafety: boolean;
  onLoudnessSafetyToggle: () => void;
  rockConcert: boolean;
  onRockConcertToggle: () => void;
  ampPowerDrive: number;
  onAmpPowerDriveChange: (v: number) => void;
}

export function AmpPanel({
  loudnessSafety,
  onLoudnessSafetyToggle,
  rockConcert,
  onRockConcertToggle,
  ampPowerDrive,
  onAmpPowerDriveChange,
}: AmpPanelProps) {
  const [standby, setStandby] = useState(false);
  const [hiddenVisible, setHiddenVisible] = useState(false);

  const isOn = !standby;

  return (
    <div
      className="panel space-y-3"
      style={{
        boxShadow: isOn
          ? "0 0 30px rgba(0,168,255,0.25), inset 0 0 20px rgba(0,168,255,0.05)"
          : "0 0 8px rgba(0,0,0,0.3)",
        border: isOn
          ? "1px solid rgba(0,168,255,0.35)"
          : "1px solid rgba(80,80,80,0.3)",
        transition: "all 0.4s ease",
      }}
    >
      {/* GP Badge row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            style={{
              background: "linear-gradient(135deg, #d4af37, #ffd700, #c8a000)",
              color: "#000",
              fontSize: "10px",
              fontWeight: 900,
              padding: "3px 8px",
              borderRadius: "3px",
              letterSpacing: "0.15em",
              boxShadow:
                "0 0 10px rgba(212,175,55,0.6), 0 0 20px rgba(212,175,55,0.3)",
            }}
          >
            GP
          </span>
          <span className="text-[9px] text-muted-foreground tracking-widest">
            CLASS A+ | B+ | C+D
          </span>
        </div>
        <div
          style={{
            background: isOn ? "rgba(0,168,255,0.15)" : "rgba(80,80,80,0.1)",
            border: `1px solid ${isOn ? "rgba(0,168,255,0.5)" : "rgba(80,80,80,0.3)"}`,
            borderRadius: "3px",
            padding: "2px 8px",
            fontSize: "8px",
            color: isOn ? "#00a8ff" : "#555",
            letterSpacing: "0.2em",
            fontWeight: 700,
          }}
        >
          {isOn ? "● ONLINE" : "○ STANDBY"}
        </div>
      </div>

      {/* Main title */}
      <div className="text-center py-2">
        <div
          className="font-black tracking-[0.2em] mb-1"
          style={{
            fontSize: "clamp(14px, 3vw, 20px)",
            color: isOn ? "#00a8ff" : "#555",
            textShadow: isOn
              ? "0 0 20px #00a8ff, 0 0 40px rgba(0,168,255,0.5), 0 0 80px rgba(0,168,255,0.2)"
              : "none",
            transition: "all 0.4s ease",
          }}
        >
          TITANIUM POWER INDUSTRY AMP
        </div>
        <div
          className="text-[9px] tracking-[0.35em]"
          style={{ color: isOn ? "rgba(0,168,255,0.6)" : "#444" }}
        >
          SRS2202 — 4-CHANNEL DRIVE SYSTEM
        </div>
      </div>

      {/* 16 Heatsink Fins */}
      <div
        className="flex items-end justify-center gap-0.5 py-2"
        style={{
          background: isOn ? "rgba(0,168,255,0.03)" : "rgba(0,0,0,0.2)",
          borderRadius: "4px",
          border: `1px solid ${isOn ? "rgba(0,168,255,0.15)" : "rgba(80,80,80,0.1)"}`,
        }}
      >
        {([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] as const).map(
          (i) => {
            const height = 20 + Math.sin((i / 15) * Math.PI) * 14;
            return (
              <div
                key={i}
                style={{
                  width: "6px",
                  height: `${height}px`,
                  background: isOn
                    ? "linear-gradient(to top, rgba(0,168,255,0.9), rgba(0,168,255,0.2))"
                    : "rgba(80,80,80,0.3)",
                  borderRadius: "1px",
                  boxShadow: isOn ? "0 0 6px rgba(0,168,255,0.7)" : "none",
                  animation: isOn
                    ? `finPulse ${1.2 + i * 0.08}s ease-in-out infinite`
                    : "none",
                  transition: "all 0.3s ease",
                }}
              />
            );
          },
        )}
        <span
          style={{
            fontSize: "7px",
            color: isOn ? "rgba(0,168,255,0.5)" : "#444",
            letterSpacing: "0.15em",
            marginLeft: "6px",
            alignSelf: "center",
          }}
        >
          16 FINS
        </span>
      </div>

      {/* Wattage formula display */}
      <div
        style={{
          background: isOn ? "rgba(0,168,255,0.06)" : "rgba(0,0,0,0.3)",
          border: `1px solid ${isOn ? "rgba(0,168,255,0.25)" : "rgba(80,80,80,0.1)"}`,
          borderRadius: "4px",
          padding: "8px 10px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "clamp(9px, 1.8vw, 12px)",
            fontWeight: 900,
            color: isOn ? "#00a8ff" : "#555",
            letterSpacing: "0.12em",
            textShadow: isOn ? "0 0 12px #00a8ff" : "none",
          }}
        >
          BASE: 70,000W × 90 = 6,300,000W TOTAL
        </div>
      </div>

      {/* 4-channel display */}
      <div className="grid grid-cols-2 gap-2">
        {[
          ["CH1", "BASS", "1,575,000W"],
          ["CH2", "MIDS", "1,575,000W"],
          ["CH3", "HIGHS", "1,575,000W"],
          ["CH4", "TWEETER", "1,575,000W"],
        ].map(([ch, label, watts]) => (
          <div
            key={ch}
            className="rounded p-2"
            style={{
              background: "rgba(0,0,0,0.3)",
              border: `1px solid ${isOn ? "rgba(0,168,255,0.2)" : "rgba(80,80,80,0.08)"}`,
            }}
          >
            <div
              style={{
                fontSize: "7px",
                color: isOn ? "rgba(0,168,255,0.6)" : "#444",
                letterSpacing: "0.15em",
                marginBottom: "2px",
              }}
            >
              {ch} — {label}
            </div>
            <div
              style={{
                fontSize: "10px",
                fontWeight: 900,
                color: isOn ? "#00a8ff" : "#555",
                textShadow: isOn ? "0 0 6px #00a8ff" : "none",
              }}
            >
              {watts}
            </div>
            <div
              style={{
                height: "3px",
                background: isOn ? "rgba(0,168,255,0.3)" : "rgba(80,80,80,0.2)",
                borderRadius: "1px",
                marginTop: "4px",
                boxShadow: isOn ? "0 0 4px rgba(0,168,255,0.4)" : "none",
              }}
            />
          </div>
        ))}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2">
        {[
          ["BASE POWER", "70,000W"],
          ["MULTIPLIER", "90x"],
          ["TOTAL OUTPUT", "6,300,000W"],
          ["BATTERY INPUT", "80,000W"],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded p-1.5"
            style={{
              background: "rgba(0,0,0,0.3)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="text-[7px] text-muted-foreground tracking-widest">
              {label}
            </div>
            <div
              className="text-[10px] font-black tracking-wider mt-0.5"
              style={{ color: isOn ? "#00a8ff" : "#555" }}
            >
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* AMP DRIVE */}
      <div
        className="rounded p-2"
        style={{
          background: "rgba(0,0,0,0.3)",
          border: "1px solid rgba(0,168,255,0.15)",
        }}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-[8px] text-muted-foreground tracking-widest">
            AMP DRIVE
          </span>
          <span
            className="text-[11px] font-black"
            style={{ color: isOn ? "#00a8ff" : "#555" }}
          >
            {ampPowerDrive > 0 ? ampPowerDrive : 72}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={ampPowerDrive > 0 ? ampPowerDrive : 72}
          onChange={(e) => onAmpPowerDriveChange(Number(e.target.value))}
          className="w-full cursor-pointer"
          style={{ accentColor: "#00a8ff" }}
          data-ocid="amp.toggle"
        />
      </div>

      {/* Channel fuses */}
      <div>
        <div className="text-[8px] text-muted-foreground tracking-widest mb-2">
          AMP FUSES — 2 × 150W
        </div>
        <div className="grid grid-cols-4 gap-1">
          {["CH1\nBASS", "CH2\nMIDS", "CH3\nHIGHS", "CH4\nTWEET"].map((ch) => (
            <div key={ch} className="flex flex-col items-center gap-0.5">
              <div
                className="w-full h-2 rounded-sm"
                style={{
                  background: isOn ? "#00a8ff" : "#444",
                  boxShadow: isOn ? "0 0 4px #00a8ff" : "none",
                }}
              />
              <span
                className="text-[7px]"
                style={{ color: isOn ? "#00a8ff" : "#555" }}
              >
                150W
              </span>
              <span className="text-[6px] text-muted-foreground text-center whitespace-pre-line leading-tight">
                {ch}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Loudness Safety */}
      <div className="border border-gold/30 bg-gold/5 p-2 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-gold text-[9px] font-bold tracking-widest">
            LOUDNESS SAFETY
          </span>
          <button
            type="button"
            onClick={onLoudnessSafetyToggle}
            className={`text-[9px] px-2 py-0.5 font-bold transition-colors ${
              loudnessSafety
                ? "bg-green-active text-navy"
                : "bg-muted text-muted-foreground"
            }`}
            data-ocid="amp.loudness_toggle"
          >
            {loudnessSafety ? "ON" : "OFF"}
          </button>
        </div>
        <div className="text-muted-foreground text-[8px] tracking-wide">
          MAX LOUD · ZERO DISTORTION · SUPER CLEAN
        </div>
      </div>

      {/* Rock Concert + Standby row */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={onRockConcertToggle}
          className={`text-[9px] px-2 py-0.5 border transition-colors ${
            rockConcert
              ? "border-green-active text-green-active bg-green-active/10"
              : "border-border text-muted-foreground"
          }`}
          data-ocid="amp.rock_concert_toggle"
        >
          ROCK CONCERT
        </button>
        <button
          type="button"
          onClick={() => setStandby((s) => !s)}
          className={`ml-auto text-[9px] px-2 py-0.5 border transition-colors ${
            standby
              ? "border-gold text-gold bg-gold/10"
              : "border-border text-muted-foreground"
          }`}
          data-ocid="amp.standby_button"
        >
          {standby ? "STANDBY" : "ACTIVE"}
        </button>
      </div>

      {/* PREAMP note */}
      <div
        className="rounded p-2 text-center"
        style={{
          background: "rgba(0,168,255,0.04)",
          border: "1px solid rgba(0,168,255,0.12)",
        }}
      >
        <div
          className="text-[8px] tracking-widest"
          style={{ color: "rgba(0,168,255,0.6)" }}
        >
          PREAMP CONTROLS: Bass / Mids / Treble — linked to EQ
        </div>
      </div>

      {/* Hidden reveal */}
      <div className="flex justify-center pt-1">
        <button
          type="button"
          onClick={() => setHiddenVisible((v) => !v)}
          className="text-[8px] text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors tracking-[0.4em] select-none cursor-default"
          data-ocid="amp.open_modal_button"
        >
          · · ·
        </button>
      </div>

      {hiddenVisible && (
        <div
          className="rounded-sm p-3"
          style={{
            background: "rgba(0,0,0,0.7)",
            border: "1px solid rgba(0,168,255,0.18)",
          }}
          data-ocid="amp.panel"
        >
          <div
            className="text-[8px] text-center tracking-[0.25em] mb-2"
            style={{ color: "rgba(0,168,255,0.6)" }}
          >
            ◈ TITANIUM POWER DRIVE — HIDDEN
          </div>
          <div
            className="text-[11px] font-black text-center mb-2"
            style={{ color: "#00a8ff" }}
          >
            {ampPowerDrive}% DRIVE
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={ampPowerDrive}
            onChange={(e) => onAmpPowerDriveChange(Number(e.target.value))}
            className="w-full cursor-pointer"
            style={{ accentColor: "#00a8ff" }}
          />
        </div>
      )}

      <style>{`
        @keyframes finPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
      `}</style>
    </div>
  );
}
