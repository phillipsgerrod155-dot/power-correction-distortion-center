interface TransportProps {
  onLoadAudio: (file: File) => void;
  onPlay: () => void;
  onPause: () => void;
  isPlaying: boolean;
  volume: number;
  onVolumeChange: (v: number) => void;
  onSmoothWarm: () => void;
  onSave?: () => void;
}

export function Transport({
  onLoadAudio,
  onPlay,
  onPause,
  isPlaying,
  volume,
  onVolumeChange,
  onSmoothWarm,
  onSave,
}: TransportProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onLoadAudio(file);
  };

  return (
    <div className="panel space-y-3">
      <div className="panel-title">TRANSPORT</div>

      <div className="flex gap-2 flex-wrap">
        <label
          className="bg-blue-hi/20 border border-blue-hi text-blue-hi text-[9px] font-bold px-3 py-1.5 hover:bg-blue-hi/30 transition-colors cursor-pointer"
          data-ocid="transport.upload_button"
        >
          LOAD AUDIO
          <input
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        <button
          type="button"
          onClick={isPlaying ? onPause : onPlay}
          className={`text-[9px] font-bold px-3 py-1.5 border transition-colors ${
            isPlaying
              ? "bg-gold/20 border-gold text-gold hover:bg-gold/30"
              : "bg-green-active/20 border-green-active text-green-active hover:bg-green-active/30"
          }`}
          data-ocid="transport.primary_button"
        >
          {isPlaying ? "⏸ PAUSE" : "▶ PLAY"}
        </button>

        <button
          type="button"
          onClick={onSave}
          className="text-[9px] font-bold px-3 py-1.5 border border-muted text-muted-foreground hover:bg-muted/20 transition-colors"
          data-ocid="transport.save_button"
        >
          SAVE
        </button>

        <button
          type="button"
          onClick={onSmoothWarm}
          className="text-[9px] font-bold px-3 py-1.5 border border-blue-hi/50 text-blue-hi hover:bg-blue-hi/10 transition-colors"
          data-ocid="transport.secondary_button"
        >
          SMOOTH WARM
        </button>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-[9px] tracking-widest">
            VOLUME
          </span>
          <span className="text-gold text-[11px] font-bold">{volume}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          className="w-full h-1.5"
          data-ocid="transport.input"
        />
      </div>
    </div>
  );
}
