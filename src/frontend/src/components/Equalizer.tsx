interface BandDef {
  short: string;
  freq: string;
  hz: number;
  isTreble?: boolean;
  isTweeter?: boolean;
}

const BAND_LABELS: BandDef[] = [
  { short: "SUB", freq: "40Hz", hz: 40 },
  { short: "DEEP", freq: "60Hz", hz: 60 },
  { short: "100Hz", freq: "100Hz", hz: 100 },
  { short: "BASS", freq: "150Hz", hz: 150 },
  { short: "L-MID", freq: "250Hz", hz: 250 },
  { short: "MID", freq: "500Hz", hz: 500 },
  { short: "M-HI", freq: "1kHz", hz: 1000 },
  { short: "PRES", freq: "2kHz", hz: 2000 },
  { short: "HIGHS", freq: "4kHz", hz: 4000 },
  { short: "TREBLE", freq: "8kHz", hz: 8000, isTreble: true },
  { short: "AIR", freq: "16kHz", hz: 16000, isTreble: true },
  { short: "TWEET", freq: "TWEETER", hz: 12000, isTweeter: true },
];

const PRESETS: Record<string, number[]> = {
  "BASS HEAVY": [6, 8, 8, 6, 0, 0, 0, 0, 0, 0, 0, 0],
  THUMP: [4, 6, 10, 6, 0, 0, 0, 0, 0, 0, 0, 0],
  "80Hz DROP": [2, 4, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0],
  "VOCAL CLARITY": [0, 0, 0, 0, 2, 3, 4, 3, 2, 3, 2, 4],
  "TREBLE LIFT": [0, 0, 0, 0, 0, 0, 2, 3, 4, 6, 5, 7],
  FLAT: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  RESET: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
};

interface EqualizerProps {
  enabled: boolean;
  bands: number[];
  onToggle: () => void;
  onBandChange: (i: number, v: number) => void;
  onPreset: (name: string) => void;
  srsChipOn: boolean;
}

export function Equalizer({
  enabled,
  bands,
  onToggle,
  onBandChange,
  onPreset,
  srsChipOn,
}: EqualizerProps) {
  return (
    <div className="panel space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="panel-title">12-BAND EQUALIZER</div>
        <button
          type="button"
          onClick={onToggle}
          className={`text-[8px] font-bold px-2 py-0.5 transition-colors ${
            enabled
              ? "bg-green-active text-navy"
              : "bg-muted/50 text-muted-foreground border border-border"
          }`}
          data-ocid="eq.toggle"
        >
          EQ {enabled ? "ON" : "OFF"}
        </button>
      </div>

      {/* SRS Clarity Banner */}
      <div
        className={`border px-3 py-1.5 text-center transition-all duration-500 ${
          srsChipOn
            ? "border-[oklch(var(--gold))] bg-[oklch(var(--gold)/0.1)] animate-pulse"
            : "border-border bg-muted/30 opacity-40"
        }`}
      >
        <span
          className={`text-[9px] font-black tracking-[0.2em] ${srsChipOn ? "text-[oklch(var(--gold))]" : "text-muted-foreground"}`}
        >
          {srsChipOn
            ? "✦ SRS CHIP ACTIVE — CLARITY ON — SIGNAL 100% CLEAN ✦"
            : "SRS CHIP INACTIVE — CLARITY OFF"}
        </span>
      </div>

      {/* Preset buttons */}
      <div className="flex gap-1 flex-wrap">
        {Object.keys(PRESETS).map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onPreset(preset)}
            className="text-[8px] px-1.5 py-0.5 border border-blue-hi/40 text-blue-hi hover:bg-blue-hi/10 transition-colors"
            data-ocid="eq.tab"
          >
            {preset}
          </button>
        ))}
      </div>

      {/* Section label */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-border" />
        <span className="text-[7px] text-muted-foreground tracking-widest">
          BASS / MIDS
        </span>
        <div className="flex-1 h-px bg-border" />
        <span className="text-[7px] text-[oklch(var(--gold))] tracking-widest font-bold">
          TREBLE
        </span>
        <div className="flex-1 h-px bg-[oklch(var(--gold)/0.4)]" />
        <span className="text-[7px] text-red-alert tracking-widest font-bold">
          TWEETER
        </span>
        <div className="flex-1 h-px bg-red-alert/40" />
      </div>

      {/* Vertical sliders — 12 bands */}
      <div className="flex justify-around items-end gap-0.5 px-1">
        {BAND_LABELS.map((band, i) => {
          const val = bands[i] ?? 0;
          const isActive = val !== 0;
          const isHot = val === 12;
          return (
            <div
              key={band.short}
              className={`flex flex-col items-center gap-0.5 ${
                band.isTweeter
                  ? "border-2 border-red-alert/70 bg-red-alert/5 px-0.5 pb-0.5 rounded"
                  : band.isTreble
                    ? "border border-[oklch(var(--gold)/0.4)] bg-[oklch(var(--gold)/0.04)] px-0.5 pb-0.5 rounded"
                    : ""
              }`}
            >
              <span
                className={`text-[8px] font-bold font-mono ${
                  isHot
                    ? "text-red-alert"
                    : band.isTweeter && isActive
                      ? "text-red-alert"
                      : band.isTreble && isActive
                        ? "text-[oklch(var(--gold))]"
                        : isActive
                          ? "text-gold"
                          : "text-blue-hi"
                }`}
              >
                {val > 0 ? `+${val}` : val}
              </span>

              <input
                type="range"
                className="vertical-slider"
                min={-12}
                max={12}
                step={0.5}
                value={val}
                disabled={!enabled}
                onChange={(e) => onBandChange(i, Number(e.target.value))}
                data-ocid={`eq.input.${i + 1}`}
                style={
                  band.isTweeter && isActive
                    ? { accentColor: "oklch(var(--red-alert))" }
                    : band.isTreble && isActive
                      ? { accentColor: "oklch(var(--gold))" }
                      : {}
                }
              />

              <span
                className={`text-[7px] font-bold text-center ${
                  band.isTweeter
                    ? "text-red-alert"
                    : band.isTreble
                      ? "text-[oklch(var(--gold))]"
                      : "text-muted-foreground"
                }`}
              >
                {band.short}
              </span>
              <span
                className={`text-[6px] text-center leading-none ${
                  band.isTweeter
                    ? "text-red-alert/80"
                    : band.isTreble
                      ? "text-[oklch(var(--gold)/0.8)]"
                      : "text-muted-foreground"
                }`}
              >
                {band.freq}
              </span>
            </div>
          );
        })}
      </div>

      {/* Tweeter status row */}
      <div className="border border-red-alert/30 bg-red-alert/5 p-2">
        <div className="flex items-center justify-between">
          <span className="text-red-alert text-[9px] font-bold tracking-widest">
            TWEETER CHANNEL
          </span>
          <span
            className={`text-[8px] font-bold px-1.5 py-0.5 ${
              (bands[11] ?? 0) !== 0
                ? "bg-red-alert text-navy"
                : "bg-muted/50 text-muted-foreground"
            }`}
          >
            {(bands[11] ?? 0) !== 0 ? "ACTIVE" : "FLAT"}
          </span>
        </div>
        <div className="text-muted-foreground text-[8px] mt-0.5">
          12kHz highshelf — SRS correction applied — smooth natural output
        </div>
      </div>

      {/* Status row */}
      <div className="grid grid-cols-3 gap-1">
        {["EQ-CMD", "EQ-GAIN", "EQ-MON"].map((label) => (
          <div
            key={label}
            className="border border-blue-hi/30 bg-blue-hi/5 p-1 text-center"
          >
            <div className="text-[7px] text-muted-foreground">{label}</div>
            <div className="text-blue-hi text-[8px] font-mono">
              9,000,000,000
            </div>
            <div className="text-green-active text-[7px] font-bold">ACTIVE</div>
          </div>
        ))}
      </div>
    </div>
  );
}
