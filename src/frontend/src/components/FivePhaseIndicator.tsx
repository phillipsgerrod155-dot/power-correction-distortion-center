const phases = [
  {
    num: 1,
    label: "5 CORRECTIONS",
    desc: "Commander · Gain · Monitor · Stab · Cleaner",
  },
  { num: 2, label: "HARD CORRECTION", desc: "Double knockout compressor" },
  { num: 3, label: "GAIN STABILIZER", desc: "Steady-state gain control" },
  { num: 4, label: "MONITOR STAGE", desc: "Real-time dB analysis" },
  {
    num: 5,
    label: "BRICK WALL + STAB",
    desc: "Final limiter · ceiling enforced",
  },
];

export function FivePhaseIndicator() {
  return (
    <div className="panel space-y-2">
      <div className="panel-title">5 PHASE ATTACK SYSTEM</div>
      <div className="text-muted-foreground text-[8px] mb-2">
        FULL ATTACK ON STATIC · CLIPPING · DISTORTION · NOISE
      </div>

      {phases.map((phase) => (
        <div key={phase.num} className="flex items-stretch gap-2">
          {/* Phase number */}
          <div className="flex-shrink-0 w-6 flex flex-col items-center">
            <div className="w-6 h-6 rounded-full border border-blue-hi bg-blue-hi/10 flex items-center justify-center">
              <span className="text-blue-hi text-[8px] font-bold">
                {phase.num}
              </span>
            </div>
            {phase.num < 5 && (
              <div className="flex-1 w-px bg-blue-hi/30 my-0.5" />
            )}
          </div>

          {/* Phase content */}
          <div className="flex-1 pb-2">
            <div className="h-5 border border-blue-hi/60 bg-blue-hi/10 flex items-center px-2 glow-blue">
              <span className="text-blue-hi text-[9px] font-bold">
                {phase.label}
              </span>
            </div>
            <div className="text-muted-foreground text-[8px] mt-0.5">
              {phase.desc}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
