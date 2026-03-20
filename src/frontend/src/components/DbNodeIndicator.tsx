import { useEffect, useRef, useState } from "react";

interface NodeData {
  distortion: number;
  clipping: number;
  noiseFloor: number;
}

interface DbNodeIndicatorProps {
  getNodeData?: () => NodeData;
}

function dbToPercent(db: number): number {
  return Math.max(0, Math.min(100, ((db + 60) / 60) * 100));
}

function distortionColor(db: number): string {
  if (db > -3) return "oklch(0.62 0.22 25)";
  if (db > -6) return "oklch(0.72 0.19 55)";
  return "oklch(0.68 0.22 142)";
}

function clippingColor(db: number): string {
  return db > -1 ? "oklch(0.62 0.22 25)" : "oklch(0.68 0.22 142)";
}

function noiseFloorColor(): string {
  return "oklch(0.55 0.14 250)";
}

export function DbNodeIndicator({ getNodeData }: DbNodeIndicatorProps) {
  const [data, setData] = useState<NodeData>({
    distortion: -55,
    clipping: -12,
    noiseFloor: -55,
  });
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number>(0);

  useEffect(() => {
    if (!getNodeData) return;

    const poll = (timestamp: number) => {
      // ~60fps: update every ~16ms for snappy beat-following
      if (timestamp - lastFrameRef.current >= 16) {
        lastFrameRef.current = timestamp;
        setData(getNodeData());
      }
      rafRef.current = requestAnimationFrame(poll);
    };

    rafRef.current = requestAnimationFrame(poll);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [getNodeData]);

  const rows = [
    {
      label: "DISTORTION",
      value: data.distortion,
      color: distortionColor(data.distortion),
      threshold: "> -3 dBFS",
    },
    {
      label: "CLIPPING",
      value: data.clipping,
      color: clippingColor(data.clipping),
      threshold: "> -1 dBFS",
    },
    {
      label: "NOISE FLOOR",
      value: data.noiseFloor,
      color: noiseFloorColor(),
      threshold: "= RMS FLOOR",
    },
  ];

  return (
    <div className="panel space-y-2">
      <div className="panel-title">DB NODE INDICATOR</div>

      {rows.map((row) => (
        <div key={row.label} className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-[9px] tracking-widest">
              {row.label}
            </span>
            <span
              className="text-[9px] font-mono tabular-nums"
              style={{ color: row.color }}
            >
              {row.value.toFixed(1)} dBFS
            </span>
          </div>
          <div className="h-1.5 bg-muted/30 rounded-sm overflow-hidden border border-border">
            <div
              className="h-full rounded-sm"
              style={{
                width: `${dbToPercent(row.value)}%`,
                backgroundColor: row.color,
                boxShadow: `0 0 4px ${row.color}`,
                transition: "width 0.05s ease-out",
              }}
            />
          </div>
        </div>
      ))}

      <div className="border-t border-border pt-2">
        <div className="text-[8px] text-muted-foreground leading-relaxed">
          DISTORTION &gt; -3 dBFS · CLIPPING &gt; -1 dBFS · NOISE = RMS FLOOR
        </div>
      </div>
    </div>
  );
}
