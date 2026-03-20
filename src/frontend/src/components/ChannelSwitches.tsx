const CHANNELS = [
  { key: "highs" as const, label: "HIGHS", freq: "4kHz–20kHz" },
  { key: "mids" as const, label: "MIDS", freq: "300Hz–4kHz" },
  { key: "bass" as const, label: "BASS", freq: "20Hz–300Hz" },
  { key: "tweeters" as const, label: "TWEETERS", freq: "10kHz–20kHz" },
];

interface ChannelState {
  highs: boolean;
  mids: boolean;
  bass: boolean;
  tweeters: boolean;
}

interface ChannelSwitchesProps {
  channels: ChannelState;
  onChange: (key: string, value: boolean) => void;
}

export function ChannelSwitches({ channels, onChange }: ChannelSwitchesProps) {
  return (
    <div className="panel space-y-3">
      <div className="panel-title">CHANNEL CONTROL SWITCHES</div>
      <div className="text-muted-foreground text-[8px] tracking-widest">
        4 INDEPENDENT CHANNELS — EACH CONTROLLED SEPARATELY
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {CHANNELS.map((ch, idx) => {
          const on = channels[ch.key];
          return (
            <div
              key={ch.key}
              className={`border p-3 space-y-2 transition-all ${
                on
                  ? "border-green-active/60 bg-green-active/5"
                  : "border-red-alert/40 bg-red-alert/5"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[9px] font-black tracking-widest ${
                    on ? "text-green-active" : "text-red-alert"
                  }`}
                >
                  {ch.label}
                </span>
                {/* LED */}
                <div
                  className={`w-3 h-3 rounded-full ${
                    on ? "bg-green-active glow-green" : "bg-red-alert"
                  }`}
                />
              </div>
              <div className="text-muted-foreground text-[7px]">{ch.freq}</div>
              <button
                type="button"
                onClick={() => onChange(ch.key, !on)}
                data-ocid={`channel.toggle.${idx + 1}`}
                className={`w-full text-[8px] font-black py-1 tracking-widest transition-colors ${
                  on
                    ? "bg-green-active text-navy"
                    : "bg-red-alert/20 text-red-alert border border-red-alert/40"
                }`}
              >
                {on ? "ON" : "OFF"}
              </button>
            </div>
          );
        })}
      </div>

      <div className="border border-border bg-card/30 p-2">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-[8px] tracking-widest">
            CHANNELS ACTIVE
          </span>
          <span className="text-gold text-[10px] font-black font-mono">
            {Object.values(channels).filter(Boolean).length} / 4
          </span>
        </div>
      </div>
    </div>
  );
}
