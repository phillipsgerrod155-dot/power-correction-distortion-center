interface BullhornModeProps {
  enabled: boolean;
  onToggle: () => void;
}

export function BullhornMode({ enabled, onToggle }: BullhornModeProps) {
  return (
    <div className="panel space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">📢</span>
          <div className="panel-title">BULLHORN MODE</div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-[8px] font-bold px-1.5 py-0.5 ${
              enabled
                ? "bg-gold text-navy"
                : "bg-muted/50 text-muted-foreground"
            }`}
          >
            {enabled ? "ON" : "OFF"}
          </span>
          <button
            type="button"
            onClick={onToggle}
            className={`w-10 h-5 rounded-full relative transition-colors ${
              enabled ? "bg-gold" : "bg-muted"
            }`}
            data-ocid="bullhorn.toggle"
          >
            <div
              className="absolute top-0.5 w-4 h-4 rounded-full bg-navy transition-all"
              style={{ left: enabled ? "calc(100% - 18px)" : "2px" }}
            />
          </button>
        </div>
      </div>

      <div className="text-muted-foreground text-[8px] leading-relaxed">
        Stadium PA projection mode. Boosts presence and mid frequencies for
        maximum throw distance and intelligibility in large spaces.
      </div>

      {enabled && (
        <div className="border border-gold/40 bg-gold/5 p-2">
          <div className="text-gold text-[8px] font-bold">
            SIGNAL CHAIN ACTIVE
          </div>
          <div className="text-muted-foreground text-[8px] mt-0.5">
            Vol → +6dB Presence → +4dB Mids → Stadium EQ → Out
          </div>
        </div>
      )}
    </div>
  );
}
