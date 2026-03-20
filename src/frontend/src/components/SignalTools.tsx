interface SignalToolsProps {
  noiseGate: boolean;
  bassThump: number;
  kick: number;
  drop: number;
  onChange: (key: string, value: number | boolean) => void;
}

export function SignalTools({
  noiseGate,
  bassThump,
  kick,
  drop,
  onChange,
}: SignalToolsProps) {
  return (
    <div className="panel space-y-3">
      <div className="panel-title">SIGNAL TOOLS</div>

      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-[9px] tracking-widest">
          NOISE GATE
        </span>
        <button
          type="button"
          onClick={() => onChange("noiseGate", !noiseGate)}
          className={`text-[8px] font-bold px-2 py-0.5 transition-colors ${
            noiseGate
              ? "bg-green-active text-navy"
              : "bg-muted/50 text-muted-foreground border border-border"
          }`}
          data-ocid="signal.noise_gate_toggle"
        >
          {noiseGate ? "ON" : "OFF"}
        </button>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="text-muted-foreground text-[9px]">BASS THUMP</span>
          <span
            className={`text-[9px] font-bold font-mono ${bassThump > 0 ? "text-red-alert" : "text-blue-hi"}`}
          >
            {bassThump > 0 ? `+${bassThump}` : bassThump} dB
          </span>
        </div>
        <input
          type="range"
          min={-6}
          max={12}
          step={0.5}
          value={bassThump}
          onChange={(e) => onChange("bassThump", Number(e.target.value))}
          className="w-full h-1"
          data-ocid="signal.bass_input"
        />
      </div>

      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="text-muted-foreground text-[9px]">KICK</span>
          <span className="text-blue-hi text-[9px] font-mono">
            {kick > 0 ? `+${kick}` : kick} dB
          </span>
        </div>
        <input
          type="range"
          min={-6}
          max={12}
          step={0.5}
          value={kick}
          onChange={(e) => onChange("kick", Number(e.target.value))}
          className="w-full h-1"
          data-ocid="signal.kick_input"
        />
      </div>

      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="text-muted-foreground text-[9px]">DROP</span>
          <span className="text-blue-hi text-[9px] font-mono">
            {drop > 0 ? `+${drop}` : drop} dB
          </span>
        </div>
        <input
          type="range"
          min={-6}
          max={8}
          step={0.5}
          value={drop}
          onChange={(e) => onChange("drop", Number(e.target.value))}
          className="w-full h-1"
          data-ocid="signal.drop_input"
        />
      </div>
    </div>
  );
}
