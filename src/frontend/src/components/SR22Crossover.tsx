interface SR22CrossoverProps {
  bassThump: number;
  kick: number;
  activeBassNote: number;
  onChange: (key: string, v: number) => void;
  onBassNoteChange: (hz: number) => void;
}

const BASS_NOTES = [
  { hz: 40, label: "40Hz", desc: "Sub Bass" },
  { hz: 60, label: "60Hz", desc: "Deep Bass" },
  { hz: 80, label: "80Hz", desc: "Bass Drop" },
  { hz: 100, label: "100Hz", desc: "Punchy Bass" },
  { hz: 120, label: "120Hz", desc: "Upper Bass" },
  { hz: 150, label: "150Hz", desc: "Warm Bass" },
];

export function SR22Crossover({
  bassThump,
  kick,
  activeBassNote,
  onChange,
  onBassNoteChange,
}: SR22CrossoverProps) {
  return (
    <div className="panel space-y-3">
      <div className="panel-title">SR22 CROSSOVER SYSTEM</div>

      {/* Smooth Warm Low — always on status */}
      <div
        className="border rounded p-2 space-y-1"
        style={{
          borderColor: "oklch(0.68 0.22 142)",
          background: "oklch(0.68 0.22 142 / 0.05)",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full led-pulse"
            style={{
              background: "oklch(0.68 0.22 142)",
              boxShadow: "0 0 6px oklch(0.68 0.22 142)",
            }}
          />
          <span
            className="text-[9px] font-black tracking-widest"
            style={{ color: "oklch(0.68 0.22 142)" }}
          >
            SMOOTH WARM LOW — AUTO ACTIVE
          </span>
        </div>
        <div
          className="text-[8px] leading-relaxed"
          style={{ color: "oklch(0.68 0.22 142 / 0.8)" }}
        >
          Amp generating warm 120Hz smooth low frequency automatically. No input
          required. Always on when powered.
        </div>
      </div>

      {/* Super Chip box */}
      <div className="border border-red-alert bg-red-alert/5 p-2 space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-alert led-pulse" />
          <span className="text-red-alert text-[9px] font-bold tracking-widest">
            SUPER CHIP — SPEAKER DETECTION ACTIVE
          </span>
        </div>
        <div className="text-red-alert text-sm font-black tracking-[0.3em]">
          XXXX
        </div>
        <div className="text-muted-foreground text-[8px]">HARD CORR</div>
        <ul className="space-y-0.5">
          {[
            "Frequency-aware speaker routing",
            "Auto cross detection 80–200 Hz",
            "Bass isolation enforced",
          ].map((item) => (
            <li key={item} className="flex items-start gap-1">
              <span className="text-red-alert text-[8px]">•</span>
              <span className="text-muted-foreground text-[8px]">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Bass Note Selector */}
      <div className="border border-gold/40 bg-gold/5 p-2 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gold led-pulse" />
          <span className="text-gold text-[9px] font-bold tracking-widest">
            BASS NOTE SELECTOR — CROSSOVER FREQUENCY
          </span>
        </div>
        <div className="text-muted-foreground text-[8px]">
          SELECT BASS FREQUENCY — AMP SWITCHES NOTE IN REAL TIME
        </div>
        <div className="grid grid-cols-3 gap-1">
          {BASS_NOTES.map((note) => {
            const active = activeBassNote === note.hz;
            return (
              <button
                key={note.hz}
                type="button"
                onClick={() => onBassNoteChange(note.hz)}
                data-ocid={`crossover.bass_note.${note.hz}`}
                className={`p-1.5 text-center transition-all border ${
                  active
                    ? "bg-gold text-navy border-gold font-black"
                    : "bg-transparent border-gold/30 text-gold/70 hover:border-gold/60"
                }`}
              >
                <div className="text-[10px] font-black">{note.label}</div>
                <div className="text-[7px]">{note.desc}</div>
                {active && (
                  <div className="text-[7px] mt-0.5 font-bold">● ACTIVE</div>
                )}
              </button>
            );
          })}
        </div>
        <div className="border border-gold/20 bg-gold/10 p-1.5 text-center">
          <span className="text-gold text-[9px] font-black tracking-widest">
            CURRENT: {activeBassNote}Hz —{" "}
            {BASS_NOTES.find(
              (n) => n.hz === activeBassNote,
            )?.desc?.toUpperCase() ?? "BASS DROP"}
          </span>
        </div>
      </div>

      {/* Frequency split */}
      <div className="grid grid-cols-3 gap-1">
        {[
          { label: "BASS", hz: "20–200 Hz" },
          { label: "MID", hz: "200–4k Hz" },
          { label: "HIGH", hz: "4k–20k Hz" },
        ].map((band) => (
          <div
            key={band.label}
            className="border border-blue-hi/30 bg-blue-hi/5 p-2 text-center"
          >
            <div className="text-blue-hi text-[9px] font-bold">
              {band.label}
            </div>
            <div className="text-muted-foreground text-[7px]">{band.hz}</div>
          </div>
        ))}
      </div>

      <div className="text-center text-blue-hi text-[8px]">
        Bass cannot enter highs. Single speaker supported.
      </div>

      {/* Sliders */}
      <div className="space-y-2">
        <div className="space-y-0.5">
          <div className="flex justify-between">
            <span className="text-muted-foreground text-[9px]">BASS THUMP</span>
            <span className="text-blue-hi text-[9px] font-mono">
              {bassThump > 0 ? `+${bassThump}` : bassThump} dB
            </span>
          </div>
          <input
            type="range"
            min={-12}
            max={12}
            step={0.5}
            value={bassThump}
            onChange={(e) => onChange("bassThump", Number(e.target.value))}
            className="w-full h-1"
            data-ocid="crossover.bass_input"
          />
        </div>
        <div className="space-y-0.5">
          <div className="flex justify-between">
            <span className="text-muted-foreground text-[9px]">KICK</span>
            <span className="text-blue-hi text-[9px] font-mono">
              {kick > 0 ? `+${kick}` : kick} dB
            </span>
          </div>
          <input
            type="range"
            min={-12}
            max={12}
            step={0.5}
            value={kick}
            onChange={(e) => onChange("kick", Number(e.target.value))}
            className="w-full h-1"
            data-ocid="crossover.kick_input"
          />
        </div>
      </div>
    </div>
  );
}
