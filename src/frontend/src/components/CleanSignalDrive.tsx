interface CleanSignalDriveProps {
  driveLevel: number;
  driveMode: "SIGNAL" | "DYNAMIC" | "PRESENCE";
  brickWall: number;
  onDriveLevelChange: (v: number) => void;
  onDriveModeChange: (m: "SIGNAL" | "DYNAMIC" | "PRESENCE") => void;
  onBrickWallChange: (v: number) => void;
}

const MODE_LABELS: Record<string, string> = {
  SIGNAL: "SIGNAL DRIVE — corrections push DB clean",
  DYNAMIC: "DYNAMIC LOUDNESS — perceived loudness, no peak spike",
  PRESENCE: "PRESENCE LIFT — mid-range clarity, sounds louder",
};

export function CleanSignalDrive({
  driveLevel,
  driveMode,
  brickWall,
  onDriveLevelChange,
  onDriveModeChange,
  onBrickWallChange,
}: CleanSignalDriveProps) {
  return (
    <div className="panel space-y-3">
      <div className="panel-title">CLEAN SIGNAL DRIVE — NO GAIN</div>

      <div className="text-center border border-blue-hi/30 bg-blue-hi/5 p-3">
        <div
          className="text-blue-hi text-3xl font-black font-mono"
          style={{ textShadow: "0 0 12px oklch(0.65 0.2 250)" }}
        >
          {driveLevel}%
        </div>
        <div className="text-muted-foreground text-[8px] tracking-widest mt-1">
          DRIVE LEVEL — GAIN REMOVED
        </div>
      </div>

      {/* Mode selector */}
      <div className="grid grid-cols-3 gap-1">
        {(["SIGNAL", "DYNAMIC", "PRESENCE"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onDriveModeChange(m)}
            className="text-[7px] font-bold tracking-widest py-1.5 px-1 border transition-all"
            style={{
              borderColor:
                driveMode === m
                  ? "oklch(0.65 0.2 250)"
                  : "oklch(0.4 0.05 250 / 0.3)",
              color:
                driveMode === m
                  ? "oklch(0.78 0.18 250)"
                  : "oklch(0.55 0.08 250)",
              background:
                driveMode === m ? "oklch(0.18 0.06 250 / 0.5)" : "transparent",
              boxShadow:
                driveMode === m ? "0 0 8px oklch(0.5 0.2 250 / 0.4)" : "none",
            }}
            data-ocid={`drive.mode_${m.toLowerCase()}_button`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="text-muted-foreground text-[8px] leading-relaxed border border-blue-hi/10 bg-blue-hi/5 px-2 py-1.5">
        {MODE_LABELS[driveMode]}
      </div>

      {/* Drive level */}
      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="text-muted-foreground text-[9px] tracking-widest">
            DRIVE LEVEL
          </span>
          <span className="text-blue-hi text-[9px] font-bold font-mono">
            {driveLevel}%
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={driveLevel}
          onChange={(e) => onDriveLevelChange(Number(e.target.value))}
          className="w-full h-1.5"
          data-ocid="drive.level_input"
        />
        <div className="h-1 bg-muted/30 overflow-hidden rounded-sm">
          <div
            className="h-full transition-all"
            style={{
              width: `${driveLevel}%`,
              background: "oklch(0.65 0.2 250)",
            }}
          />
        </div>
        <div className="text-muted-foreground text-[8px]">
          0% = clean baseline · 100% = maximum signal drive
        </div>
      </div>

      {/* Brick wall */}
      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="text-muted-foreground text-[9px] tracking-widest">
            BRICK WALL CEILING
          </span>
          <span className="text-red-alert text-[9px] font-bold font-mono">
            {brickWall.toFixed(1)} dBFS
          </span>
        </div>
        <input
          type="range"
          min={-3.0}
          max={-0.5}
          step={0.1}
          value={brickWall}
          onChange={(e) => onBrickWallChange(Number(e.target.value))}
          className="w-full h-1.5"
          data-ocid="drive.brick_wall_input"
        />
        <div className="text-muted-foreground text-[8px]">
          Hard ceiling — nothing passes above this
        </div>
      </div>
    </div>
  );
}
