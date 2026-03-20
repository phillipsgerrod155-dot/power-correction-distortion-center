interface SliderRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  isRed?: boolean;
  ocid: string;
}

function SliderRow({
  label,
  value,
  min,
  max,
  onChange,
  isRed,
  ocid,
}: SliderRowProps) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between">
        <span
          className={`text-[9px] ${isRed ? "text-red-alert font-bold" : "text-muted-foreground"}`}
        >
          {label}
        </span>
        <span className="text-blue-hi text-[9px] font-mono">
          {value > 0 ? `+${value}` : value} dB
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={0.5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1"
        data-ocid={ocid}
      />
    </div>
  );
}

interface KickDrumProps {
  onFire: () => void;
  thump: number;
  kick: number;
  drop: number;
  onThumpChange: (v: number) => void;
  onKickChange: (v: number) => void;
  onDropChange: (v: number) => void;
}

export function KickDrum({
  onFire,
  thump,
  kick,
  drop,
  onThumpChange,
  onKickChange,
  onDropChange,
}: KickDrumProps) {
  return (
    <div className="panel space-y-3">
      <div className="panel-title">KICK DRUM SYSTEM</div>

      <div className="flex gap-4 items-center">
        <button
          type="button"
          onClick={onFire}
          className="flex-shrink-0 w-28 h-28 rounded-full border-4 border-blue-hi bg-blue-hi/10 hover:bg-blue-hi/20 active:scale-95 transition-all glow-blue flex items-center justify-center"
          data-ocid="kick.primary_button"
          style={{
            boxShadow:
              "0 0 20px oklch(0.65 0.2 250 / 0.4), 0 0 40px oklch(0.65 0.2 250 / 0.2)",
          }}
        >
          <span className="text-blue-hi text-lg font-black tracking-widest">
            KICK
          </span>
        </button>

        <div className="space-y-1">
          <div className="text-muted-foreground text-[9px]">TAP TO FIRE</div>
          <div className="text-muted-foreground text-[9px]">TOUCH / CLICK</div>
          <div className="text-blue-hi text-[9px] font-bold">READY</div>
          <div className="text-muted-foreground text-[8px]">
            150Hz → 40Hz drop
          </div>
        </div>
      </div>

      <SliderRow
        label="THUMP — 60 Hz"
        value={thump}
        min={-12}
        max={12}
        onChange={onThumpChange}
        ocid="kick.input"
      />
      <SliderRow
        label="KICK — 100 Hz"
        value={kick}
        min={-12}
        max={12}
        onChange={onKickChange}
        ocid="kick.secondary_button"
      />

      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="text-red-alert text-[9px] font-bold">
            80 HZ SAFT DROP
          </span>
          <span className="text-blue-hi text-[9px] font-mono">
            {drop === 0 ? "FLAT" : `${drop} dB`}
          </span>
        </div>
        <input
          type="range"
          min={-18}
          max={0}
          step={0.5}
          value={drop}
          onChange={(e) => onDropChange(Number(e.target.value))}
          className="w-full h-1"
          data-ocid="kick.drop_input"
        />
        <div className="flex justify-between text-[7px] text-muted-foreground">
          <span>FLAT (0 dB)</span>
          <span>SAFT MODE — max -18 dB</span>
          <span>MAX DROP (-18 dB)</span>
        </div>
      </div>
    </div>
  );
}
