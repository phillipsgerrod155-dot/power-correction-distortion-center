interface SmallSpeakerModeProps {
  enabled: boolean;
  onToggle: () => void;
}

export function SmallSpeakerMode({ enabled, onToggle }: SmallSpeakerModeProps) {
  return (
    <div className="panel space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">📱</span>
          <div className="panel-title">SMALL SPEAKER MODE</div>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className={`w-10 h-5 rounded-full relative transition-colors ${enabled ? "bg-blue-hi" : "bg-muted"}`}
          data-ocid="small_speaker.toggle"
        >
          <div
            className="absolute top-0.5 w-4 h-4 rounded-full bg-navy transition-all"
            style={{ left: enabled ? "calc(100% - 18px)" : "2px" }}
          />
        </button>
      </div>

      <div className="text-muted-foreground text-[8px] leading-relaxed">
        Optimizes audio for small Bluetooth speakers and phone speakers. Boosts
        presence and high-mid frequencies for clarity on limited frequency
        response drivers.
      </div>

      {enabled && (
        <div className="border border-blue-hi/40 bg-blue-hi/5 p-2">
          <div className="text-blue-hi text-[8px] font-bold">
            PRESENCE BOOST ACTIVE
          </div>
          <div className="text-muted-foreground text-[8px] mt-0.5">
            +3dB @ 2kHz · +2dB @ 4kHz · Low rolloff below 80Hz
          </div>
        </div>
      )}
    </div>
  );
}
