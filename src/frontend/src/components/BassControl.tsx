import { useEffect, useRef, useState } from "react";

interface BassControlProps {
  bassLevel: number;
  onLevelChange: (v: number) => void;
  hz80Drop: number;
  onHz80DropChange: (v: number) => void;
  correctionForce?: string;
}

export function BassControl({
  bassLevel,
  onLevelChange,
  hz80Drop,
  onHz80DropChange,
  correctionForce,
}: BassControlProps) {
  const [pulse, setPulse] = useState(false);
  const pulseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pulse indicator when bass + 80Hz are both active
  useEffect(() => {
    if (bassLevel > 60 && hz80Drop > 0) {
      const interval = setInterval(
        () => {
          setPulse(true);
          pulseTimer.current = setTimeout(() => setPulse(false), 150);
        },
        Math.max(100, 600 - bassLevel * 3),
      );
      return () => {
        clearInterval(interval);
        if (pulseTimer.current) clearTimeout(pulseTimer.current);
      };
    }
    setPulse(false);
  }, [bassLevel, hz80Drop]);

  return (
    <div className="panel space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="panel-title">BASS CONTROL — FULL RELEASE</div>
          <div className="text-muted-foreground text-[8px] tracking-widest mt-0.5">
            BASS HITS FULL AND HARD — CORRECTIONS KEEP IT ON THE LINE
          </div>
        </div>
        <div
          className={`text-[8px] font-black px-2 py-1 border tracking-widest transition-all ${
            bassLevel >= 60
              ? "border-green-active text-green-active bg-green-active/10"
              : "border-border text-muted-foreground"
          }`}
        >
          ON LINE
        </div>
      </div>

      {/* Bass hit indicator */}
      <div
        className={`border-2 p-3 text-center transition-all duration-100 ${
          pulse
            ? "border-gold bg-gold/20"
            : bassLevel > 60
              ? "border-gold/30 bg-gold/5"
              : "border-border bg-muted/5"
        }`}
        style={{ boxShadow: pulse ? "0 0 20px rgba(212,175,55,0.6)" : "none" }}
      >
        <div
          className={`text-[11px] font-black tracking-widest transition-colors ${pulse ? "text-gold" : "text-muted-foreground"}`}
        >
          {pulse
            ? "◉ 80Hz KICKING"
            : hz80Drop > 0
              ? "◎ 80Hz ARMED"
              : "○ 80Hz SILENT"}
        </div>
        <div className="text-[8px] text-muted-foreground mt-0.5">
          80Hz CORE —{" "}
          {hz80Drop > 0
            ? `LEVEL ${hz80Drop}`
            : "OFF — TOUCH SLIDER TO ACTIVATE"}
        </div>
      </div>

      {/* Bass level slider */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground text-[8px] tracking-widest">
            BASS OUTPUT LEVEL
          </span>
          <span className="text-gold text-[10px] font-black font-mono">
            {bassLevel}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={bassLevel}
          onChange={(e) => onLevelChange(Number(e.target.value))}
          data-ocid="bass.input"
          className="w-full h-1 accent-yellow-500"
        />
        <div className="h-2 bg-muted/30 overflow-hidden border border-border">
          <div
            className={`h-full transition-all duration-100 ${bassLevel > 80 ? "bg-red-alert" : bassLevel > 60 ? "bg-gold" : "bg-blue-hi"}`}
            style={{ width: `${bassLevel}%` }}
          />
        </div>
      </div>

      {/* 80Hz DROP PROGRAM — slider only, starts at 0, silent until touched */}
      <div className="border border-border bg-card/30 p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-foreground text-[9px] font-black tracking-widest">
              80Hz DROP PROGRAM
            </div>
            <div className="text-muted-foreground text-[7px]">
              {hz80Drop === 0
                ? "SILENT — MOVE SLIDER TO WAKE IT UP"
                : "THUMPING — KICKING HARD"}
            </div>
          </div>
          <div
            className={`text-[8px] font-black px-2 py-0.5 tracking-widest ${hz80Drop > 0 ? "bg-gold text-navy" : "bg-muted/50 text-muted-foreground border border-border"}`}
          >
            {hz80Drop > 0 ? `+${hz80Drop}dB` : "OFF"}
          </div>
        </div>
        <input
          type="range"
          min={0}
          max={12}
          value={hz80Drop}
          onChange={(e) => onHz80DropChange(Number(e.target.value))}
          data-ocid="bass.hz80drop"
          className="w-full h-1 accent-yellow-500"
        />
        <div className="h-1.5 bg-muted/30 overflow-hidden border border-border">
          <div
            className={`h-full transition-all duration-100 ${hz80Drop > 8 ? "bg-gold" : "bg-blue-hi"}`}
            style={{ width: `${(hz80Drop / 12) * 100}%` }}
          />
        </div>
      </div>

      {/* Correction stomp indicator */}
      {bassLevel > 60 && (
        <div className="border border-red-alert/50 bg-red-alert/5 p-2 space-y-1 overflow-hidden">
          <div className="text-red-alert text-[9px] font-black tracking-widest">
            CORRECTIONS ACTIVE: STOMPING DOWN HARD
          </div>
          <div className="text-muted-foreground text-[7px]">
            FULL CORRECTION FORCE APPLIED — LOUD AS HELL — ALWAYS CONTROLLED
          </div>
          {correctionForce && correctionForce !== "0" && (
            <div className="border border-red-alert/30 bg-red-alert/5 p-1.5 mt-1 overflow-hidden">
              <div
                className="text-red-alert font-black tracking-wider"
                style={{
                  fontSize: "clamp(6px, 1vw, 9px)",
                  wordBreak: "break-all",
                  overflowWrap: "break-word",
                  lineHeight: 1.4,
                  maxWidth: "100%",
                }}
              >
                FORCE: {correctionForce}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
