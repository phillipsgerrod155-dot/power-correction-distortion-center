interface Correction {
  name: string;
  strength: string;
  on: boolean;
}

interface CorrectionSystemProps {
  corrections: Correction[];
  onToggle: (i: number) => void;
  correctionForce: string;
}

export function CorrectionSystem({
  corrections,
  onToggle,
  correctionForce,
}: CorrectionSystemProps) {
  return (
    <div className="panel space-y-2">
      <div className="panel-title">CORRECTION SYSTEM</div>

      {corrections.map((corr, i) => (
        <div key={corr.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-hi flex-shrink-0" />
          <span className="text-foreground text-[9px] flex-1 tracking-wide">
            {corr.name}
          </span>
          <span className="text-blue-hi text-[9px] font-mono w-10 text-right">
            {corr.strength}
          </span>
          <button
            type="button"
            onClick={() => onToggle(i)}
            className={`text-[8px] font-bold px-1.5 py-0.5 transition-colors ${
              corr.on
                ? "bg-green-active text-navy"
                : "bg-muted/50 text-muted-foreground border border-border"
            }`}
            data-ocid={`correction.toggle.${i + 1}`}
          >
            {corr.on ? "ON" : "OFF"}
          </button>
        </div>
      ))}

      <div className="border border-red-alert bg-red-alert/5 p-2 mt-2 overflow-hidden">
        <div className="text-muted-foreground text-[8px] tracking-widest mb-1">
          CORRECTION FORCE
        </div>
        <div
          className="text-red-alert font-black font-mono glow-red"
          style={{
            fontSize: "clamp(7px, 1.1vw, 10px)",
            wordBreak: "break-all",
            overflowWrap: "break-word",
            lineHeight: 1.4,
            maxWidth: "100%",
          }}
        >
          {correctionForce}
        </div>
      </div>

      <div className="border border-blue-hi/40 bg-blue-hi/5 p-2">
        <div className="flex items-center justify-between">
          <span className="text-gold text-[9px] font-bold">x10 SMART CHIP</span>
          <span className="text-blue-hi text-[8px]">MAX DISTORTION KILL</span>
        </div>
        <div className="text-muted-foreground text-[8px] mt-0.5">
          UNIFIED FORCE → LIMITER EASE → BRICK WALL
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-border pt-2">
        <button
          type="button"
          className="text-[8px] font-bold px-2 py-0.5 bg-green-active text-navy"
        >
          STAB ON
        </button>
        <span className="text-muted-foreground text-[8px] flex-1">dBFS</span>
        <span className="text-blue-hi text-[9px] font-mono">-∞ dBFS</span>
      </div>
      <div className="h-1 bg-muted/30 overflow-hidden">
        <div className="h-full w-full bg-green-active/20" />
      </div>
    </div>
  );
}
