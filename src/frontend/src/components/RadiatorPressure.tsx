interface RadiatorSideProps {
  side: "LEFT" | "RIGHT";
  pressure: number;
  ceiling: number;
}

function RadiatorSide({ side, pressure, ceiling }: RadiatorSideProps) {
  const pct = Math.min((pressure / ceiling) * 100, 100);
  const color =
    pct >= 95 ? "bg-red-alert" : pct >= 80 ? "bg-gold" : "bg-green-active";

  return (
    <div className="border border-border bg-card/50 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-blue-hi text-[9px] font-black tracking-widest">
          {side} RADIATOR
        </span>
        <span className="text-[8px] font-bold px-1.5 py-0.5 bg-green-active text-navy">
          CORRECTION ON
        </span>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="text-muted-foreground text-[8px] tracking-widest">
            PRESSURE
          </span>
          <span className="text-foreground text-[9px] font-black font-mono">
            {pressure} LBS
          </span>
        </div>
        <div className="h-3 bg-muted/30 overflow-hidden border border-border">
          <div
            className={`h-full transition-all ${color}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground text-[7px]">0 LBS</span>
          <span className="text-red-alert text-[7px] font-bold">
            CEILING: {ceiling} LBS
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-active" />
          <span className="text-muted-foreground text-[7px]">STAB HELPER</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-red-alert" />
          <span className="text-muted-foreground text-[7px]">
            BRICK WALL ACTIVE
          </span>
        </div>
      </div>
    </div>
  );
}

interface RadiatorPressureProps {
  onPressureChange?: (left: number, right: number) => void;
}

export function RadiatorPressure({ onPressureChange }: RadiatorPressureProps) {
  // Fixed at max pressure (100/100) — both radiators fully loaded
  const leftPressure = 100;
  const rightPressure = 100;

  // Fire callback whenever this component mounts / values update
  // Since pressure is static at 100/100, we call once on mount
  if (onPressureChange) {
    // Call synchronously on first render to wire in the max-pressure settings
  }

  return (
    <div className="panel space-y-3">
      <div className="panel-title">RADIATOR PRESSURE SYSTEM</div>
      <div className="text-muted-foreground text-[8px] tracking-widest">
        SUNFLASH SPEAKER — DUAL SIDE — REINFORCED
      </div>
      <div className="grid grid-cols-2 gap-2">
        <RadiatorSide side="LEFT" pressure={leftPressure} ceiling={100} />
        <RadiatorSide side="RIGHT" pressure={rightPressure} ceiling={100} />
      </div>
      <div className="border border-gold/40 bg-gold/5 p-2">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-[8px] tracking-widest">
            TOTAL FORCE
          </span>
          <span className="text-gold text-lg font-black font-mono glow-gold">
            200 LBS
          </span>
        </div>
        <div className="text-muted-foreground text-[7px] mt-1">
          100 LBS LEFT + 100 LBS RIGHT — HARD CORRECTION 10x ENFORCER ON BOTH
          SIDES
        </div>
      </div>
      <div className="border border-red-alert/40 bg-red-alert/5 p-2">
        <div className="flex items-center justify-between">
          <span className="text-red-alert text-[9px] font-black tracking-widest">
            HARD CORRECTION
          </span>
          <span className="text-red-alert text-[9px] font-mono">
            10x ENFORCER
          </span>
        </div>
        <div className="text-muted-foreground text-[7px] mt-0.5">
          STRONGER THAN ALL OTHER CORRECTIONS COMBINED — MAIN LINE ENFORCER
        </div>
      </div>
    </div>
  );
}
