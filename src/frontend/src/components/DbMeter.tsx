import { useEffect, useRef, useState } from "react";

interface DbMeterProps {
  getAnalyserData: () => { live: number; peak: number };
  isPlaying: boolean;
}

export function DbMeter({ getAnalyserData, isPlaying }: DbMeterProps) {
  const [live, setLive] = useState(0);
  const [peak, setPeak] = useState(0);
  const [livePulse, setLivePulse] = useState(false);
  const rafRef = useRef<number>(0);
  const prevLiveRef = useRef<number>(0);
  const prevPulseTimeRef = useRef<number>(0);

  useEffect(() => {
    let lastTs = 0;
    const loop = (ts: number) => {
      rafRef.current = requestAnimationFrame(loop);
      if (ts - lastTs < 16) return;
      lastTs = ts;

      // Hard block: no movement when not playing
      if (!isPlaying) return;

      const data = getAnalyserData();

      // Only update if we have real audio signal above noise floor
      const hasSignal = data.live > 60;
      if (!hasSignal) return;

      setLive(data.live);
      setPeak(data.peak);

      const swing = Math.abs(data.live - prevLiveRef.current);
      if (swing > 3 && ts - prevPulseTimeRef.current > 80) {
        setLivePulse(true);
        prevPulseTimeRef.current = ts;
        setTimeout(() => setLivePulse(false), 100);
      }
      prevLiveRef.current = data.live;
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [getAnalyserData, isPlaying]);

  // Hard reset to zero when playback stops
  useEffect(() => {
    if (!isPlaying) {
      setLive(0);
      setPeak(0);
      setLivePulse(false);
      prevLiveRef.current = 0;
    }
  }, [isPlaying]);

  const MIN_DB = 85;
  const MAX_DB = 130;
  const RANGE = MAX_DB - MIN_DB;

  const livePercent =
    isPlaying && live > 0
      ? Math.max(0, Math.min(100, ((live - MIN_DB) / RANGE) * 100))
      : 0;
  const peakPercent =
    isPlaying && peak > 0
      ? Math.max(0, Math.min(100, ((peak - MIN_DB) / RANGE) * 100))
      : 0;

  // TRUE GREEN ONLY — red only when hitting max 130
  const isAtMax = live >= 128;
  const barColor = isAtMax ? "#ff2244" : "#00ff88";
  const barGlow = isAtMax
    ? "0 0 12px #ff2244, 0 0 24px rgba(255,34,68,0.5)"
    : "0 0 8px #00ff88, 0 0 16px rgba(0,255,136,0.3)";

  const ledColor =
    isPlaying && live > 0 ? (livePulse ? "#ffffff" : "#00ff88") : "#1a1a1a";
  const ledGlow =
    isPlaying && live > 0
      ? livePulse
        ? "0 0 10px #fff, 0 0 20px #00ff88"
        : "0 0 6px #00ff88"
      : "none";

  return (
    <div className="panel space-y-2">
      <div className="panel-title">REAL-TIME DB METER</div>

      {/* Status row */}
      <div className="flex items-center gap-2 mb-1">
        <div
          className="w-2 h-2 rounded-full"
          style={{
            background: ledColor,
            boxShadow: ledGlow,
            transition: "background 0.06s, box-shadow 0.06s",
          }}
        />
        <span
          className="text-[8px] font-bold tracking-widest"
          style={{ color: isPlaying && live > 0 ? "#00ff88" : "#444" }}
        >
          {isPlaying && live > 0 ? "LIVE" : "STANDBY"}
        </span>
        <span
          className="text-[8px] font-bold tracking-widest ml-auto"
          style={{ color: isPlaying && live > 0 ? "#00aa55" : "#333" }}
        >
          {isPlaying && live > 0 ? "● SIGNAL ACTIVE" : "○ WAITING"}
        </span>
      </div>

      {/* Readouts */}
      <div className="flex gap-4 items-end">
        <div className="space-y-0.5">
          <div className="text-muted-foreground text-[8px] tracking-widest">
            LIVE
          </div>
          <div
            className="text-sm font-bold font-mono"
            style={{
              color: isPlaying && live > 0 ? barColor : "#444",
              textShadow:
                isPlaying && live > 0 ? `0 0 8px ${barColor}` : "none",
              transition: "color 0.05s",
            }}
          >
            {isPlaying && live > 0 ? `${live.toFixed(1)} dB` : "0.0 dB"}
          </div>
        </div>
        <div className="space-y-0.5">
          <div className="text-muted-foreground text-[8px] tracking-widest">
            PEAK
          </div>
          <div
            className="text-sm font-bold font-mono"
            style={{ color: isPlaying && peak > 0 ? "#00ff88" : "#444" }}
          >
            {isPlaying && peak > 0 ? `${peak.toFixed(1)} dB` : "0.0 dB"}
          </div>
        </div>
      </div>

      {/* Main bar — always starts at zero */}
      <div
        className="relative rounded overflow-hidden"
        style={{
          height: "16px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${livePercent}%`,
            background: barColor,
            boxShadow: livePercent > 0 ? barGlow : "none",
            transition: "width 0.04s, background 0.1s",
            borderRadius: "2px",
          }}
        />
        {/* Peak marker */}
        {peakPercent > 0 && (
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${peakPercent}%`,
              width: "2px",
              background: "#00ff88",
              boxShadow: "0 0 4px #00ff88",
              transition: "left 0.1s",
            }}
          />
        )}
      </div>

      {/* Scale */}
      <div className="flex justify-between">
        {[85, 95, 105, 115, 125, 130].map((v) => (
          <span
            key={v}
            className="text-[7px] font-mono"
            style={{ color: v >= 128 ? "#ff2244" : "#444" }}
          >
            {v}
          </span>
        ))}
      </div>

      {/* Silence indicator */}
      {!isPlaying || live === 0 ? (
        <div
          style={{
            textAlign: "center",
            fontSize: "8px",
            color: "#333",
            letterSpacing: "0.2em",
            padding: "4px 0",
          }}
          data-ocid="dbmeter.standby_state"
        >
          ▬▬▬ SILENCE · ZERO SIGNAL ▬▬▬
        </div>
      ) : null}
    </div>
  );
}
