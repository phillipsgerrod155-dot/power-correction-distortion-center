interface AudioSensorProps {
  enabled: boolean;
  onToggle: () => void;
}

export function AudioSensor({ enabled, onToggle }: AudioSensorProps) {
  const features = [
    "Smart frequency detection on every sample",
    "Automatic speaker profiling and adaptation",
    "Real-time environmental noise measurement",
    "Dynamic room fill calculation",
    "Sub-millisecond response to transients",
  ];

  return (
    <div className="panel space-y-3">
      <div className="flex items-center justify-between">
        <div className="panel-title text-gold">AUDIO SENSOR 2022</div>
        <button
          type="button"
          onClick={onToggle}
          className={`text-[8px] font-bold px-2 py-0.5 transition-colors ${
            enabled
              ? "bg-green-active text-navy"
              : "bg-muted/50 text-muted-foreground border border-border"
          }`}
          data-ocid="audiosensor.toggle"
        >
          {enabled ? "ACTIVE" : "STANDBY"}
        </button>
      </div>

      <ul className="space-y-1.5">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <div
              className={`w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0 ${
                enabled ? "bg-green-active" : "bg-blue-hi"
              }`}
            />
            <span className="text-foreground text-[9px] leading-relaxed">
              {f}
            </span>
          </li>
        ))}
      </ul>

      {enabled && (
        <div className="border border-green-active/40 bg-green-active/5 p-2">
          <div className="text-green-active text-[8px] font-bold">
            SIGNAL CHAIN ACTIVE
          </div>
          <div className="text-muted-foreground text-[8px] mt-0.5">
            8:1 compressor · -24dB threshold · 0.5ms attack · 50ms release
          </div>
        </div>
      )}

      <div className="border-t border-border pt-2 space-y-1">
        <div className="text-[9px]">
          <span className="text-muted-foreground">Spread: </span>
          <span style={{ color: "oklch(0.7 0.2 30)" }} className="font-bold">
            WIDE — FULL ROOM
          </span>
        </div>
        <div className="text-muted-foreground text-[8px]">
          Stereo mix · Spatial enhancement · Phase-coherent output
        </div>
      </div>
    </div>
  );
}
