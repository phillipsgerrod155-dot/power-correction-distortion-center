import { useState } from "react";

interface AmpPanelProps {
  loudnessSafety: boolean;
  onLoudnessSafetyToggle: () => void;
  rockConcert: boolean;
  onRockConcertToggle: () => void;
  ampPowerDrive: number;
  onAmpPowerDriveChange: (v: number) => void;
}

const CHANNELS = ["CH1 - TWEETER", "CH2 - MIDS", "CH3 - HIGHS", "CH4 - BASS"];
// Amp gets 2x 150W fuses
const AMP_FUSES = [1, 2];

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

  const driveMultiplier = (3.5 + (ampPowerDrive / 100) * 4.5).toFixed(1);

  return (
    <div className="panel space-y-2">
      {/* Header badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="bg-gold text-navy text-[9px] font-black px-2 py-0.5 tracking-widest">
          HBS
        </span>
        <span className="text-foreground text-[9px] tracking-widest">
          SERIES
        </span>
        <span className="text-muted-foreground text-[9px]">
          12-SOURCE POWER
        </span>
        <button
          type="button"
          className="ml-auto bg-blue-hi/20 border border-blue-hi text-blue-hi text-[9px] px-2 py-0.5 tracking-wide hover:bg-blue-hi/30 transition-colors"
        >
          MULTI-SRC
        </button>
      </div>

      {/* Main title */}
      <div className="border-t border-border pt-2">
        <div className="text-gold text-2xl font-black tracking-widest">
          SRS2202
        </div>
        <div className="text-foreground text-xs font-bold tracking-[0.3em]">
          DB AMPLIFIER
        </div>
        <div className="text-muted-foreground text-[9px] tracking-widest">
          GP / AUDIO DESIGNER
        </div>
      </div>

      {/* Power specs */}
      <div className="flex gap-3 flex-wrap">
        <span className="text-gold text-[10px] font-bold">
          60,000,000W SAFT
        </span>
        <span className="text-foreground text-[9px]">
          10,000W / 4CH | HEADROOM 9,000W
        </span>
      </div>

      {/* SAFT banner */}
      <div className="bg-blue-hi/10 border border-blue-hi px-3 py-1.5 text-center">
        <span className="text-blue-hi text-[9px] font-bold tracking-widest">
          SAFT MODE ACTIVE — REGULATED 120 dB CEILING
        </span>
      </div>

      {/* Channels */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {CHANNELS.map((ch) => (
          <div key={ch} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-hi glow-blue led-pulse" />
            <span className="text-foreground text-[9px]">{ch}</span>
          </div>
        ))}
      </div>

      {/* Fuses — 2x 150W */}
      <div className="border-t border-border pt-2">
        <div className="text-muted-foreground text-[8px] mb-1 tracking-widest">
          AMP FUSES — 150W
        </div>
        <div className="grid grid-cols-2 gap-2">
          {AMP_FUSES.map((n) => (
            <div key={n} className="flex flex-col items-center gap-0.5">
              <div className="w-full h-2 bg-red-alert/80 rounded-sm" />
              <span className="text-[8px] text-red-alert">150W</span>
            </div>
          ))}
        </div>
      </div>

      {/* Loudness Safety */}
      <div className="border border-gold/30 bg-gold/5 p-2 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-gold text-[9px] font-bold tracking-widest">
            LOUDNESS SAFETY EXTREME
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

      {/* Rock Concert */}
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
        <span className="text-muted-foreground text-[8px]">
          BASS / CAR DROP 80 HZ
        </span>
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
          STANDBY
        </button>
      </div>

      {/* Power status */}
      <div className="border-t border-border pt-2 space-y-0.5">
        <div className="text-blue-hi text-[9px]">
          AUTO-SENSOR REGULATED — 10,000W / 4CH / 9,000W HEADROOM
        </div>
        <div className="text-muted-foreground text-[9px]">0W DELIVERING</div>
      </div>

      {/* Power indicator */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-green-active glow-green" />
          <span className="text-green-active text-[9px] font-bold">
            POWER ON
          </span>
        </div>
        <div className="w-8 h-8 rounded-full border-2 border-blue-hi bg-blue-hi/10 glow-blue flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-blue-hi/40" />
        </div>
        <span className="text-blue-hi text-[9px] font-bold tracking-wider">
          SRS-2202
        </span>
      </div>

      {/* Battery */}
      <div className="border border-green-active/40 bg-green-active/5 p-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px]">⚡</span>
          <span className="text-muted-foreground text-[8px] tracking-widest">
            BATTERY
          </span>
          <div className="flex-1 h-2.5 bg-green-active/20 rounded-sm overflow-hidden">
            <div className="h-full w-full bg-green-active transition-all" />
          </div>
          <span className="text-green-active text-[8px] font-bold">
            FULLY CHARGED
          </span>
          <button
            type="button"
            className="text-[8px] border border-green-active/50 text-green-active px-1.5 py-0.5 hover:bg-green-active/10 transition-colors"
          >
            SAVE
          </button>
        </div>
      </div>

      {/* Hidden reveal trigger */}
      <div className="flex justify-center pt-1">
        <button
          type="button"
          onClick={() => setHiddenVisible((v) => !v)}
          className="text-[8px] text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors tracking-[0.4em] select-none cursor-default"
          data-ocid="amp.open_modal_button"
          title=""
        >
          · · ·
        </button>
      </div>

      {/* Hidden AMP POWER DRIVE panel */}
      <div
        style={{
          maxHeight: hiddenVisible ? 280 : 0,
          overflow: "hidden",
          transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div
          className="rounded-sm p-3 space-y-3"
          style={{
            background: "rgba(0,0,0,0.7)",
            border: "1px solid rgba(212,175,55,0.18)",
          }}
          data-ocid="amp.panel"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <span
              style={{
                color: "rgba(212,175,55,0.55)",
                fontSize: 8,
                letterSpacing: "0.35em",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              ◈ AMP POWER DRIVE
            </span>
            <span
              style={{
                color: "rgba(212,175,55,0.3)",
                fontSize: 7,
                letterSpacing: "0.2em",
              }}
            >
              [HIDDEN]
            </span>
          </div>

          {/* Drive multiplier display */}
          <div
            style={{
              color: "rgba(212,175,55,0.8)",
              fontSize: 14,
              fontWeight: 900,
              letterSpacing: "0.1em",
              textAlign: "center",
              textShadow:
                ampPowerDrive > 0 ? "0 0 12px rgba(212,175,55,0.4)" : "none",
            }}
          >
            {driveMultiplier}x AMP DRIVE
          </div>

          {/* Vertical slider */}
          <div className="flex flex-col items-center gap-2">
            <div
              className="relative flex flex-col items-center"
              style={{ height: 80 }}
            >
              <input
                type="range"
                min={0}
                max={100}
                value={ampPowerDrive}
                onChange={(e) => onAmpPowerDriveChange(Number(e.target.value))}
                className="w-4 cursor-pointer"
                style={{
                  writingMode: "vertical-lr",
                  direction: "rtl",
                  height: 80,
                  accentColor: "rgba(212,175,55,0.8)",
                }}
                data-ocid="amp.toggle"
              />
            </div>
            <div
              style={{
                color: "rgba(212,175,55,0.4)",
                fontSize: 7,
                letterSpacing: "0.15em",
              }}
            >
              {ampPowerDrive}%
            </div>
          </div>

          {/* Instruction text */}
          <div
            style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: 7,
              letterSpacing: "0.18em",
              textAlign: "center",
              lineHeight: 1.7,
            }}
          >
            POWER BEHIND THE MUSIC
            <br />
            STRONG CLEAR INSTRUCTION
          </div>

          {/* Active indicator */}
          {ampPowerDrive > 0 && (
            <div
              className="flex items-center justify-center gap-2"
              data-ocid="amp.success_state"
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  background: "rgba(74,222,128,0.6)",
                  boxShadow: "0 0 6px rgba(74,222,128,0.4)",
                  animation: "pulse 2.5s ease-in-out infinite",
                }}
              />
              <span
                style={{
                  color: "rgba(74,222,128,0.5)",
                  fontSize: 7,
                  letterSpacing: "0.25em",
                }}
              >
                AMP POWER ACTIVE
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
