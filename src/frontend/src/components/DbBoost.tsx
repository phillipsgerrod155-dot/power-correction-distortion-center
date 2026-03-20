interface DbBoostProps {
  boostLevel: number;
  brickWall: number;
  onBoostChange: (v: number) => void;
  onBrickWallChange: (v: number) => void;
}

export function DbBoost({
  boostLevel,
  brickWall,
  onBoostChange,
  onBrickWallChange,
}: DbBoostProps) {
  const gainMultiplier = (1.0 + (boostLevel / 100) * 2.5).toFixed(2);

  return (
    <div className="panel space-y-3">
      <div className="panel-title">DB BOOST SYSTEM</div>

      {/* Gain display */}
      <div className="text-center border border-gold/30 bg-gold/5 p-3">
        <div className="text-gold text-3xl font-black font-mono glow-gold">
          {gainMultiplier}x
        </div>
        <div className="text-muted-foreground text-[8px] tracking-widest mt-1">
          GAIN
        </div>
      </div>

      {/* Boost level */}
      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="text-muted-foreground text-[9px] tracking-widest">
            BOOST LEVEL
          </span>
          <span className="text-gold text-[9px] font-bold font-mono">
            {boostLevel}%
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={boostLevel}
          onChange={(e) => onBoostChange(Number(e.target.value))}
          className="w-full h-1.5"
          data-ocid="boost.input"
        />
        <div className="h-1 bg-muted/30 overflow-hidden rounded-sm">
          <div
            className="h-full bg-gold/60 transition-all"
            style={{ width: `${boostLevel}%` }}
          />
        </div>
        <div className="text-muted-foreground text-[8px]">
          0% = 1.00x unity · 100% = 3.50x maximum boost
        </div>
      </div>

      {/* Brick wall */}
      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="text-muted-foreground text-[9px] tracking-widest">
            BRICK WALL THRESHOLD
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
          data-ocid="boost.brick_wall_input"
        />
        <div className="text-muted-foreground text-[8px]">
          Hard ceiling — no signal passes above this threshold
        </div>
      </div>
    </div>
  );
}
