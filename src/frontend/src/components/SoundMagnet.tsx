import { useEffect, useRef } from "react";

const RING_RADII = [40, 80, 120];

interface SoundMagnetProps {
  enabled: boolean;
  onToggle: () => void;
}

export function SoundMagnet({ enabled, onToggle }: SoundMagnetProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const angleRef = useRef<number>(0);
  const pulseRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const SIZE = 300;
    canvas.width = SIZE;
    canvas.height = SIZE;
    const cx = SIZE / 2;
    const cy = SIZE / 2;

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      if (enabled) {
        angleRef.current += 0.02;
        pulseRef.current += 0.05;
      }

      ctx.clearRect(0, 0, SIZE, SIZE);
      ctx.fillStyle = "oklch(0.1 0.02 250)";
      ctx.beginPath();
      ctx.arc(cx, cy, SIZE / 2 - 2, 0, Math.PI * 2);
      ctx.fill();

      for (const r of RING_RADII) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = enabled
          ? "oklch(0.5 0.2 140 / 0.4)"
          : "oklch(0.4 0.05 250 / 0.2)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      if (enabled) {
        const sweepLen = 140;
        const sweepGrad = ctx.createLinearGradient(
          cx,
          cy,
          cx + Math.cos(angleRef.current) * sweepLen,
          cy + Math.sin(angleRef.current) * sweepLen,
        );
        sweepGrad.addColorStop(0, "oklch(0.65 0.25 140 / 0.9)");
        sweepGrad.addColorStop(1, "oklch(0.65 0.25 140 / 0.0)");
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(
          cx + Math.cos(angleRef.current) * sweepLen,
          cy + Math.sin(angleRef.current) * sweepLen,
        );
        ctx.strokeStyle = sweepGrad;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      const pulseSize = enabled ? 4 + Math.sin(pulseRef.current) * 2 : 4;
      ctx.beginPath();
      ctx.arc(cx, cy, pulseSize, 0, Math.PI * 2);
      ctx.fillStyle = enabled ? "oklch(0.65 0.25 140)" : "oklch(0.4 0.05 250)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, SIZE / 2 - 2, 0, Math.PI * 2);
      ctx.strokeStyle = enabled
        ? "oklch(0.5 0.2 140 / 0.6)"
        : "oklch(0.3 0.05 250 / 0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [enabled]);

  return (
    <div className="panel space-y-2">
      <div className="flex items-center justify-between">
        <div className="panel-title">SOUND MAGNET ENVIRONMENTAL MIX</div>
        <button
          type="button"
          onClick={onToggle}
          className={`text-[8px] font-bold px-2 py-0.5 transition-colors ${
            enabled
              ? "bg-green-active text-navy"
              : "bg-muted/50 text-muted-foreground border border-border"
          }`}
          data-ocid="soundmagnet.toggle"
        >
          {enabled ? "ON" : "OFF"}
        </button>
      </div>

      <div className="flex flex-col items-center gap-2">
        <canvas
          ref={canvasRef}
          className="rounded-full border border-blue-hi/30"
          style={{ width: "200px", height: "200px" }}
        />
        <div
          className={`text-[9px] tracking-widest font-bold ${
            enabled ? "text-green-active" : "text-muted-foreground"
          }`}
        >
          {enabled ? "ROOM FILL ACTIVE — 3dB BLEND" : "0% ROOM FILL"}
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              enabled ? "bg-green-active glow-green" : "bg-blue-hi/50"
            } led-pulse`}
          />
          <span className="text-muted-foreground text-[8px] tracking-wider">
            AUDIO SENSOR 2022 · {enabled ? "ACTIVE" : "STANDBY"}
          </span>
        </div>
      </div>
    </div>
  );
}
