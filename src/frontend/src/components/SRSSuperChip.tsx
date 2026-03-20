const ELIMINATIONS = [
  { key: "clipping", label: "CLIPPING" },
  { key: "distortion", label: "DISTORTION" },
  { key: "noise", label: "BACKGROUND NOISE" },
  { key: "overbarring", label: "OVERBARRING MUSIC" },
];

interface SRSSuperChipProps {
  srsChipOn: boolean;
  onToggle: () => void;
}

export function SRSSuperChip({ srsChipOn, onToggle }: SRSSuperChipProps) {
  return (
    <div className="panel space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="panel-title">SRS SUPER SOUND QUALITY CHIP</div>
          <div className="text-muted-foreground text-[8px] tracking-widest mt-0.5">
            MASSIVE SIGNAL — 100% CLEAN — SMOOTH NATURAL TWEETERS
          </div>
        </div>
        <button
          type="button"
          onClick={onToggle}
          data-ocid="srschip.toggle"
          className={`text-[9px] font-black px-2 py-1 tracking-widest transition-colors ${
            srsChipOn
              ? "bg-gold text-navy"
              : "bg-muted/50 text-muted-foreground border border-border"
          }`}
        >
          {srsChipOn ? "CHIP ON" : "CHIP OFF"}
        </button>
      </div>

      {/* Elimination indicators */}
      <div className="grid grid-cols-2 gap-2">
        {ELIMINATIONS.map((item) => (
          <div
            key={item.key}
            className={`border p-2 flex items-center gap-2 transition-all ${
              srsChipOn
                ? "border-gold/50 bg-gold/5"
                : "border-border bg-muted/5"
            }`}
          >
            <span
              className={`text-[10px] font-black transition-colors ${
                srsChipOn ? "text-gold" : "text-muted-foreground"
              }`}
            >
              {srsChipOn ? "✓" : "—"}
            </span>
            <div>
              <div
                className={`text-[8px] font-black tracking-wide transition-colors ${
                  srsChipOn ? "text-gold" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </div>
              <div className="text-muted-foreground text-[7px]">
                {srsChipOn ? "ELIMINATED" : "UNPROCESSED"}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Signal purity meter */}
      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="text-muted-foreground text-[8px] tracking-widest">
            SIGNAL PURITY
          </span>
          <span
            className={`text-[9px] font-black font-mono ${
              srsChipOn ? "text-gold" : "text-muted-foreground"
            }`}
          >
            {srsChipOn ? "100%" : "---"}
          </span>
        </div>
        <div className="h-3 bg-muted/30 overflow-hidden border border-border">
          <div
            className={`h-full transition-all duration-700 ${
              srsChipOn ? "bg-gold" : "bg-muted/20"
            }`}
            style={{ width: srsChipOn ? "100%" : "0%" }}
          />
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <div
          className={`px-2 py-1 border text-[8px] font-black tracking-widest transition-all ${
            srsChipOn
              ? "border-gold bg-gold/10 text-gold"
              : "border-border text-muted-foreground"
          }`}
        >
          100% CLEAN SIGNAL
        </div>
        <div
          className={`px-2 py-1 border text-[8px] font-black tracking-widest transition-all ${
            srsChipOn
              ? "border-blue-hi/50 bg-blue-hi/10 text-blue-hi"
              : "border-border text-muted-foreground"
          }`}
        >
          TWEETER: SMOOTH &amp; NATURAL
        </div>
      </div>
    </div>
  );
}
