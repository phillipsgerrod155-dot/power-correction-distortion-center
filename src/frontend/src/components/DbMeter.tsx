import { useEffect, useRef, useState } from "react";

interface DbMeterProps {
  getAnalyserData: () => { live: number; peak: number };
  isPlaying: boolean;
}

export function DbMeter({ getAnalyserData, isPlaying }: DbMeterProps) {
  const [live, setLive] = useState(85);
  const [peak, setPeak] = useState(85);
  const [livePulse, setLivePulse] = useState(false);
  const rafRef = useRef<number>(0);
  const prevLiveRef = useRef<number>(85);
  const prevPulseTimeRef = useRef<number>(0);

  useEffect(() => {
    let lastTs = 0;
    const loop = (ts: number) => {
      rafRef.current = requestAnimationFrame(loop);
      if (ts - lastTs < 16) return;
      lastTs = ts;

      if (!isPlaying) return;

      const data = getAnalyserData();
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

  // Reset meter when playback stops
  useEffect(() => {
    if (!isPlaying) {
      setLive(85);
      setPeak(85);
      setLivePulse(false);
      prevLiveRef.current = 85;
    }
  }, [isPlaying]);

  // Scale: 85–130 dB
  const MIN_DB = 85;
  const MAX_DB = 130;
  const RANGE = MAX_DB - MIN_DB;

  const livePercent = isPlaying
    ? Math.max(0, Math.min(100, ((live - MIN_DB) / RANGE) * 100))
    : 0;
  const peakPercent = isPlaying
    ? Math.max(0, Math.min(100, ((peak - MIN_DB) / RANGE) * 100))
    : 0;

  const barColor =
    live > 120
      ? "oklch(0.6 0.25 25)"
      : live > 105
        ? "oklch(0.85 0.18 90)"
        : "oklch(0.7 0.2 150)";

  const ledColor = isPlaying ? (livePulse ? "#ffffff" : "#00ff88") : "#444";
  const ledGlow = isPlaying
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
          style={{ color: isPlaying ? "#00ff88" : "#555" }}
        >
          {isPlaying ? "LIVE" : "STANDBY"}
        </span>
        <span
          className="text-[8px] font-bold tracking-widest ml-auto"
          style={{ color: isPlaying ? "oklch(0.55 0.12 142)" : "#444" }}
        >
          {isPlaying ? "● CONNECTED" : "○ WAITING"}
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
              color: isPlaying ? barColor : "#555",
              textShadow: isPlaying ? `0 0 8px ${barColor}` : "none",
              transition: "color 0.05s",
            }}
          >
            {isPlaying ? `${live.toFixed(1)} dB` : "-- dB"}
          </div>
        </div>
        <div className="space-y-0.5">
          <div className="text-muted-foreground text-[8px] tracking-widest">
            PEAK
          </div>
          <div
            className="text-sm font-bold font-mono"
            style={{ color: isPlaying ? "#00ff88" : "#555" }}
          >
            {isPlaying ? `${peak.toFixed(1)} dB` : "-- dB"}
          </div>
        </div>
        <div className="space-y-0.5 ml-auto">
          <div className="text-muted-foreground text-[8px] tracking-widest">
            dBFS
          </div>
          <div
            className="text-base font-black font-mono"
            style={{
              color: isPlaying ? barColor : "#555",
              textShadow: isPlaying ? `0 0 12px ${barColor}88` : "none",
            }}
          >
            {isPlaying ? live.toFixed(1) : "--"}
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="relative">
        <div className="h-6 bg-muted/30 rounded-sm overflow-hidden border border-border">
          <div
            className="h-full"
            style={{
              width: `${livePercent}%`,
              background: isPlaying
                ? `linear-gradient(to right, oklch(0.7 0.2 150), ${barColor})`
                : "transparent",
              boxShadow: isPlaying ? `0 0 8px ${barColor}88` : "none",
              transition: "width 0.016s linear",
            }}
          />
        </div>
        {/* Peak marker — only when playing */}
        {isPlaying && (
          <div
            className="absolute top-0 h-6 w-0.5"
            style={{
              left: `${peakPercent}%`,
              background: "#ffffff",
              boxShadow: "0 0 4px #fff",
            }}
          />
        )}
      </div>

      {/* Scale ticks */}
      <div className="flex justify-between">
        {[85, 90, 95, 100, 105, 110, 115, 120, 125, 130].map((v) => (
          <span key={v} className="text-[7px] text-muted-foreground">
            {v}
          </span>
        ))}
      </div>

      <div
        className="text-center text-[8px] font-bold tracking-wider"
        style={{ color: isPlaying ? "#00ff88" : "#555" }}
      >
        {isPlaying
          ? "85–130 dB ● REACTIVE ● LIVE SIGNAL"
          : "85–130 dB ● LOAD AUDIO TO ACTIVATE"}
      </div>
    </div>
  );
}
