const LEFT_ARROWS = [
  { op: "opacity-20", size: 8 },
  { op: "opacity-40", size: 11 },
  { op: "opacity-70", size: 14 },
  { op: "opacity-100", size: 17 },
];

const RIGHT_ARROWS = [
  { op: "opacity-100", size: 14 },
  { op: "opacity-70", size: 11 },
  { op: "opacity-40", size: 8 },
  { op: "opacity-20", size: 5 },
];

interface FrontStageAtmosphereProps {
  frontStageOn: boolean;
  intensity: number;
  onToggle: () => void;
  onIntensityChange: (v: number) => void;
}

export function FrontStageAtmosphere({
  frontStageOn,
  intensity,
  onToggle,
  onIntensityChange,
}: FrontStageAtmosphereProps) {
  return (
    <div className="panel space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="panel-title">FRONT STAGE ATMOSPHERE</div>
          <div className="text-muted-foreground text-[8px] tracking-widest mt-0.5">
            PROJECTS MUSIC FORWARD IN THE AIR — INTIMATE PRESENCE, NO SPACEY
            DIFFUSION
          </div>
        </div>
        <button
          type="button"
          onClick={onToggle}
          data-ocid="frontstage.toggle"
          className={`text-[9px] font-black px-2 py-1 tracking-widest transition-colors ${
            frontStageOn
              ? "bg-blue-hi text-navy"
              : "bg-muted/50 text-muted-foreground border border-border"
          }`}
        >
          {frontStageOn ? "ON" : "OFF"}
        </button>
      </div>

      {/* Forward projection arrows */}
      <div className="border border-border bg-card/40 p-3 flex items-center justify-center gap-2">
        <div className="flex items-center gap-0.5">
          {LEFT_ARROWS.map((arrow) => (
            <span
              key={arrow.size}
              className={`text-blue-hi font-black ${
                frontStageOn ? arrow.op : "opacity-10"
              } transition-opacity`}
              style={{ fontSize: `${arrow.size}px` }}
            >
              ▶
            </span>
          ))}
        </div>
        <div
          className={`border px-3 py-2 ${
            frontStageOn
              ? "border-blue-hi/60 bg-blue-hi/10"
              : "border-border bg-muted/10"
          } transition-all`}
        >
          <span
            className={`text-[10px] font-black tracking-widest ${
              frontStageOn ? "text-blue-hi" : "text-muted-foreground"
            }`}
          >
            🎵 IN THE AIR
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          {RIGHT_ARROWS.map((arrow) => (
            <span
              key={arrow.size}
              className={`text-blue-hi font-black ${
                frontStageOn ? arrow.op : "opacity-10"
              } transition-opacity`}
              style={{ fontSize: `${arrow.size}px` }}
            >
              ◀
            </span>
          ))}
        </div>
      </div>

      {/* Intensity slider */}
      {frontStageOn && (
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground text-[8px] tracking-widest">
              FORWARD INTENSITY
            </span>
            <span className="text-blue-hi text-[9px] font-black font-mono">
              {intensity}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={intensity}
            onChange={(e) => onIntensityChange(Number(e.target.value))}
            data-ocid="frontstage.input"
            className="w-full h-1 accent-blue-500"
          />
          <div className="flex justify-between text-muted-foreground text-[7px]">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
      )}

      <div
        className={`border p-2 ${
          frontStageOn
            ? "border-blue-hi/40 bg-blue-hi/5"
            : "border-border bg-muted/5"
        } transition-all`}
      >
        <div
          className={`text-[9px] font-black tracking-widest ${
            frontStageOn ? "text-blue-hi" : "text-muted-foreground"
          }`}
        >
          SIGNAL PROJECTED FORWARD — NOT SPREAD
        </div>
        <div className="text-muted-foreground text-[7px] mt-0.5">
          MUSIC SOUNDS LIKE IT IS FLOATING OUT IN FRONT OF YOU — INTIMATE &
          CONTROLLED
        </div>
      </div>
    </div>
  );
}
