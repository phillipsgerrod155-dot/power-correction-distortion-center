const engineColors = [
  "oklch(0.65 0.2 250)",
  "oklch(0.65 0.2 250)",
  "oklch(0.65 0.2 250)",
  "oklch(0.85 0.18 90)",
];

const ENGINE_LABELS = ["A+", "B+", "C+", "D+"];
const ENGINE_JOBS = [
  "PRESENCE BOOST · 2.5kHz",
  "LOW-MID STOMP · 200–500Hz",
  "MID CLARITY · 2kHz",
  "BASS SHELF · 80Hz",
];

interface SoundEnginesProps {
  engines: boolean[];
  onToggle: (i: number) => void;
}

export function SoundEngines({ engines, onToggle }: SoundEnginesProps) {
  const activeNames = ENGINE_LABELS.filter((_, i) => engines[i]).join(" + ");

  return (
    <div className="panel space-y-2">
      <div className="panel-title">SOUND ENGINES</div>

      <div className="grid grid-cols-2 gap-2">
        {ENGINE_LABELS.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => onToggle(i)}
            className={`border p-3 text-center transition-all ${
              i === 3
                ? "border-gold/60 bg-gold/5"
                : "border-blue-hi/40 bg-blue-hi/5"
            } ${engines[i] ? "opacity-100" : "opacity-40"} hover:opacity-100`}
            style={{
              boxShadow: engines[i] ? `0 0 8px ${engineColors[i]}40` : "none",
            }}
            data-ocid={`engines.toggle.${i + 1}`}
          >
            <div
              className="text-xl font-black mb-1"
              style={{ color: engineColors[i] }}
            >
              {label}
            </div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <div
                className={`w-1.5 h-1.5 rounded-full ${engines[i] ? "bg-green-active" : "bg-muted-foreground"}`}
              />
              <span
                className={`text-[8px] font-bold ${engines[i] ? "text-green-active" : "text-muted-foreground"}`}
              >
                {engines[i] ? "ACTIVE" : "OFF"}
              </span>
            </div>
            <div className="text-muted-foreground text-[7px] font-bold tracking-wide">
              {ENGINE_JOBS[i]}
            </div>
            <div
              className="h-0.5 mt-1 rounded-full"
              style={{ background: engineColors[i] }}
            />
          </button>
        ))}
      </div>

      {/* Active engine description bar */}
      <div className="border border-blue-hi/20 bg-blue-hi/5 px-2 py-1.5 text-center">
        {activeNames ? (
          <span className="text-blue-hi text-[9px] font-bold tracking-widest">
            ACTIVE: {activeNames}
          </span>
        ) : (
          <span className="text-muted-foreground text-[9px]">
            ALL ENGINES OFF
          </span>
        )}
      </div>

      <div className="text-muted-foreground text-[8px] text-center">
        Click engines to toggle • All output routed to Bluetooth &amp; phone
        speakers
      </div>
    </div>
  );
}
