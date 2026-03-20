import { useCallback, useEffect, useState } from "react";

const INSTRUMENTS = ["DRUMS", "GUITAR", "BASS GUITAR", "KEYS", "VOCALS"];
const SPEAKER_TYPES = ["SMALL", "BIG", "CAR", "BLUETOOTH"] as const;
type SpeakerType = (typeof SPEAKER_TYPES)[number];

const DROP_PROGRAMS: Record<SpeakerType, { label: string; color: string }> = {
  SMALL: { label: "LIGHT DROP", color: "text-[oklch(var(--blue-hi))]" },
  BIG: { label: "FULL DROP", color: "text-[oklch(var(--gold))]" },
  CAR: { label: "HEAVY DROP", color: "text-[oklch(var(--green-active))]" },
  BLUETOOTH: { label: "AUTO SIGNAL", color: "text-[oklch(var(--gold))]" },
};

const SENSOR_DOTS = Array.from({ length: 45 }, (_, i) => `sensor-${i}`);

interface SmartAmpCoreProps {
  onSpeakerDetected?: (type: SpeakerType) => void;
  volumeAtCeiling: boolean;
  currentVolume: number;
  dbSuperMonitorOn: boolean;
  onDbSuperMonitorToggle: () => void;
  activeBassNote?: number;
}

function PanelHeader({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[oklch(var(--gold))] text-[9px] tracking-[0.3em] uppercase font-black mb-3 border-b border-border pb-2">
      {children}
    </h3>
  );
}

function GreenLed({ pulse = false }: { pulse?: boolean }) {
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full bg-[oklch(var(--green-active))] ${pulse ? "led-pulse" : ""}`}
      style={{ boxShadow: "0 0 4px oklch(var(--green-active))" }}
    />
  );
}

// Volume Engine Panel
function VolumeEnginePanel({ currentVolume }: { currentVolume: number }) {
  const loudnessOutput =
    Math.round(((currentVolume / 100) ** 2.8 * 120 + 10) * 10) / 10;

  const points = Array.from({ length: 40 }, (_, i) => {
    const x = (i / 39) * 200;
    const y = 60 - (i / 39) ** 2.8 * 58;
    return `${x},${y}`;
  }).join(" ");

  const cursorX = (currentVolume / 100) * 200;
  const cursorY = 60 - (currentVolume / 100) ** 2.8 * 58;

  return (
    <div className="bg-card border border-border rounded p-3">
      <PanelHeader>AMP VOLUME ENGINE</PanelHeader>
      <p className="text-[8px] text-[oklch(var(--gold))] tracking-widest mb-2">
        EXPONENTIAL POWER CURVE — GRADUAL CLIMB, MASSIVE GAIN
      </p>
      <svg
        width="100%"
        viewBox="0 0 200 65"
        className="mb-3"
        role="img"
        aria-label="Exponential power curve graph"
      >
        <title>Exponential Power Curve</title>
        <polyline
          points={points}
          fill="none"
          stroke="oklch(var(--green-active))"
          strokeWidth="1.5"
          style={{ filter: "drop-shadow(0 0 2px oklch(var(--green-active)))" }}
        />
        <circle
          cx={cursorX}
          cy={cursorY}
          r="3"
          fill="oklch(var(--gold))"
          style={{ filter: "drop-shadow(0 0 3px oklch(var(--gold)))" }}
        />
        <line
          x1="0"
          y1="62"
          x2="200"
          y2="62"
          stroke="oklch(var(--border))"
          strokeWidth="0.5"
        />
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="62"
          stroke="oklch(var(--border))"
          strokeWidth="0.5"
        />
        <text x="2" y="60" fill="oklch(var(--muted-foreground))" fontSize="5">
          0
        </text>
        <text x="180" y="60" fill="oklch(var(--muted-foreground))" fontSize="5">
          100
        </text>
        <text x="2" y="5" fill="oklch(var(--muted-foreground))" fontSize="5">
          MAX
        </text>
      </svg>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-background border border-border rounded p-2">
          <div className="text-[7px] text-muted-foreground tracking-widest">
            VOLUME INPUT
          </div>
          <div className="text-[oklch(var(--gold))] text-sm font-black">
            {currentVolume}
          </div>
        </div>
        <div className="bg-background border border-border rounded p-2">
          <div className="text-[7px] text-muted-foreground tracking-widest">
            LOUDNESS OUTPUT
          </div>
          <div className="text-[oklch(var(--green-active))] text-sm font-black">
            {loudnessOutput} dB
          </div>
        </div>
      </div>
    </div>
  );
}

// Amp Internals Panel
function AmpInternalsPanel() {
  return (
    <div className="bg-card border border-border rounded p-3">
      <PanelHeader>AMP INTERNALS</PanelHeader>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <GreenLed />
          <span className="text-[9px] text-foreground tracking-widest">
            ZERO GAUGE WIRE — DOUBLE
          </span>
          <span className="text-[oklch(var(--green-active))] text-[9px] font-black">
            ✓
          </span>
        </div>
        <div>
          <div className="text-[8px] text-muted-foreground tracking-widest mb-2">
            FPGA CHIPS
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="flex flex-col items-center gap-1">
                <div
                  className="w-8 h-8 bg-background border border-[oklch(var(--green-active))] rounded flex items-center justify-center"
                  style={{ boxShadow: "0 0 4px oklch(var(--green-active))" }}
                >
                  <span className="text-[7px] text-[oklch(var(--green-active))] font-black">
                    FPGA
                  </span>
                </div>
                <GreenLed pulse />
                <span className="text-[6px] text-muted-foreground">{n}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[8px] text-muted-foreground tracking-widest mb-2">
            120W FUSES
          </div>
          <div className="flex gap-2">
            {["A", "B", "C", "D"].map((letter) => (
              <div key={letter} className="flex flex-col items-center gap-1">
                <div
                  className="w-10 h-5 bg-background border border-[oklch(var(--green-active))] rounded-sm flex items-center justify-center"
                  style={{ boxShadow: "0 0 6px oklch(var(--green-active))" }}
                >
                  <span className="text-[7px] text-[oklch(var(--green-active))] font-black">
                    120W
                  </span>
                </div>
                <span className="text-[6px] text-muted-foreground">
                  FUSE-{letter}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 4-Channel Isolator Panel
function ChannelIsolatorPanel() {
  const channels = [
    { label: "HIGHS", color: "text-[oklch(var(--blue-hi))]" },
    { label: "MIDS", color: "text-[oklch(var(--green-active))]" },
    { label: "LOWS", color: "text-[oklch(var(--gold))]" },
    { label: "BASS", color: "text-orange-400" },
  ];
  return (
    <div className="bg-card border border-border rounded p-3">
      <PanelHeader>4-CHANNEL ISOLATOR</PanelHeader>
      <p className="text-[7px] text-muted-foreground tracking-widest mb-3">
        CHANNELS DO NOT MIX — ISOLATED SIGNAL PATH
      </p>
      <div className="flex gap-2">
        {channels.map((ch) => (
          <div
            key={ch.label}
            className="flex-1 bg-background border border-border rounded p-2 flex flex-col items-center gap-2"
          >
            <div
              className="w-2 h-16 rounded-full"
              style={{
                background:
                  "linear-gradient(to top, oklch(var(--border)) 0%, currentColor 100%)",
                opacity: 0.8,
              }}
            />
            <GreenLed />
            <span
              className={`text-[7px] font-black tracking-widest ${ch.color}`}
            >
              {ch.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Smart Instrument Chip Panel
function SmartInstrumentChipPanel() {
  const [detected, setDetected] = useState(0);
  const [blinking, setBlinking] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setDetected((prev) => (prev + 1) % INSTRUMENTS.length);
      setBlinking(true);
      setTimeout(() => setBlinking(false), 200);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-card border border-border rounded p-3">
      <PanelHeader>SMART INSTRUMENT CHIP</PanelHeader>
      <p className="text-[7px] text-muted-foreground tracking-widest mb-3">
        INSTRUMENT DETECTION ACTIVE
      </p>
      <div className="space-y-1">
        {INSTRUMENTS.map((inst, i) => (
          <div key={inst} className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{
                background:
                  detected === i
                    ? "oklch(var(--green-active))"
                    : "oklch(var(--border))",
                boxShadow:
                  detected === i && !blinking
                    ? "0 0 6px oklch(var(--green-active))"
                    : "none",
                transition: "all 0.3s",
              }}
            />
            <span
              className={`text-[9px] tracking-widest ${
                detected === i
                  ? "text-[oklch(var(--green-active))] font-black"
                  : "text-muted-foreground"
              }`}
            >
              {inst}
            </span>
            {detected === i && (
              <span className="text-[7px] text-[oklch(var(--gold))] ml-auto">
                ◄ DETECTED
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// 80Hz Smart Drop Chip Panel
function HzDropChipPanel({
  autoDetectedType,
}: { autoDetectedType?: SpeakerType }) {
  const [speakerType, setSpeakerType] = useState<SpeakerType>("CAR");
  useEffect(() => {
    if (autoDetectedType) setSpeakerType(autoDetectedType);
  }, [autoDetectedType]);
  const program = DROP_PROGRAMS[speakerType];

  return (
    <div className="bg-card border border-border rounded p-3">
      <PanelHeader>80Hz SMART DROP CHIP</PanelHeader>
      <div className="space-y-2 mb-3">
        {SPEAKER_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setSpeakerType(type)}
            data-ocid={`smartamp.speaker_type.${type.toLowerCase()}.toggle`}
            className={`w-full text-left flex items-center gap-2 px-2 py-1 rounded border text-[9px] tracking-widest transition-colors ${
              speakerType === type
                ? "border-[oklch(var(--green-active))] bg-[oklch(var(--green-active)/0.1)]"
                : "border-border bg-background hover:border-muted-foreground"
            }`}
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{
                background:
                  speakerType === type
                    ? "oklch(var(--green-active))"
                    : "oklch(var(--border))",
                boxShadow:
                  speakerType === type
                    ? "0 0 4px oklch(var(--green-active))"
                    : "none",
              }}
            />
            {type} SPEAKER
            {autoDetectedType === type && (
              <span className="ml-auto text-[6px] font-black bg-[oklch(var(--gold)/0.2)] text-[oklch(var(--gold))] px-1 rounded">
                AUTO
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="bg-background border border-border rounded p-2 text-center">
        <div className="text-[7px] text-muted-foreground tracking-widest">
          ACTIVE PROGRAM
        </div>
        <div className={`text-sm font-black tracking-widest ${program.color}`}>
          {program.label}
        </div>
        <div className="text-[7px] text-muted-foreground mt-1">
          80Hz DROP — {speakerType}
        </div>
        {autoDetectedType && (
          <div className="text-[6px] text-[oklch(var(--gold))] tracking-widest mt-1 font-bold">
            AUTO-PROGRAMMED BY SENSOR
          </div>
        )}
      </div>
    </div>
  );
}

// Speaker Sensor Array Panel
function SpeakerSensorPanel({
  onSpeakerDetected,
}: { onSpeakerDetected?: (type: SpeakerType) => void }) {
  const [detectedType, setDetectedType] = useState<SpeakerType>("CAR");
  const [activeSensors, setActiveSensors] = useState(45);
  const [status, setStatus] = useState<string>("AMP PROGRAMMED — CAR");

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSensors(Math.floor(Math.random() * 5) + 41);
      const types: SpeakerType[] = ["SMALL", "BIG", "CAR", "BLUETOOTH"];
      const newType = types[Math.floor(Math.random() * types.length)];
      setDetectedType(newType);
      setStatus("PROGRAMMING AMP...");
      onSpeakerDetected?.(newType);
      setTimeout(() => setStatus(`AMP PROGRAMMED — ${newType}`), 1000);
    }, 3000);
    return () => clearInterval(interval);
  }, [onSpeakerDetected]);

  return (
    <div className="bg-card border border-border rounded p-3">
      <PanelHeader>SPEAKER SENSOR ARRAY</PanelHeader>
      <div className="flex items-center gap-2 mb-2">
        <GreenLed pulse />
        <span className="text-[9px] text-[oklch(var(--green-active))] font-black">
          {activeSensors} SENSORS ACTIVE
        </span>
      </div>
      <div
        className="grid gap-[2px] mb-3"
        style={{ gridTemplateColumns: "repeat(9, minmax(0, 1fr))" }}
      >
        {SENSOR_DOTS.map((dotId, i) => (
          <span
            key={dotId}
            className="w-2 h-2 rounded-full"
            style={{
              background:
                i < activeSensors
                  ? "oklch(var(--green-active))"
                  : "oklch(var(--border))",
              boxShadow:
                i < activeSensors
                  ? "0 0 2px oklch(var(--green-active))"
                  : "none",
            }}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {SPEAKER_TYPES.map((type) => (
          <div
            key={type}
            className={`flex items-center gap-1 px-2 py-1 rounded border text-[8px] tracking-widest ${
              detectedType === type
                ? "border-[oklch(var(--gold))] text-[oklch(var(--gold))]"
                : "border-border text-muted-foreground"
            }`}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background:
                  detectedType === type
                    ? "oklch(var(--gold))"
                    : "oklch(var(--border))",
              }}
            />
            {type}
          </div>
        ))}
      </div>
      <div
        className={`mt-2 px-2 py-1 rounded text-[7px] font-black tracking-widest text-center border ${
          status.startsWith("PROGRAMMING")
            ? "border-[oklch(var(--gold))] text-[oklch(var(--gold))] bg-[oklch(var(--gold)/0.1)] animate-pulse"
            : "border-[oklch(var(--green-active))] text-[oklch(var(--green-active))] bg-[oklch(var(--green-active)/0.1)]"
        }`}
      >
        {status}
      </div>
      {detectedType === "BLUETOOTH" && (
        <div className="mt-2 p-2 bg-[oklch(var(--blue-hi)/0.1)] border border-[oklch(var(--blue-hi))] rounded text-[7px] text-[oklch(var(--blue-hi))] tracking-widest">
          BT AUTO: BASS SIGNAL + HIGHS/MIDS/LOWS BALANCE SET
        </div>
      )}
    </div>
  );
}

// Clean Signal Processor Panel
function CleanSignalProcessorPanel() {
  const chain = [
    "INPUT",
    "FPGA PRE-SMART",
    "SRS CHIP",
    "CORRECTION",
    "EQ",
    "CHANNEL SPLIT",
    "OUTPUT",
  ];
  return (
    <div className="bg-card border border-border rounded p-3">
      <PanelHeader>CLEAN SIGNAL PROCESSOR</PanelHeader>
      <div className="flex items-center gap-2 mb-2">
        <GreenLed pulse />
        <span className="text-[9px] text-foreground tracking-widest">
          PRE-SMART LOADED — STATUS:{" "}
          <span className="text-[oklch(var(--green-active))] font-black">
            ACTIVE
          </span>
        </span>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[8px] text-muted-foreground">SIGNAL CLEAN:</span>
        <span className="text-[oklch(var(--green-active))] text-[10px] font-black">
          100%
        </span>
      </div>
      <div className="overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {chain.map((node, i) => (
            <div key={node} className="flex items-center gap-1">
              <div className="bg-background border border-[oklch(var(--green-active))] rounded px-2 py-1">
                <span className="text-[7px] text-[oklch(var(--green-active))] tracking-widest whitespace-nowrap">
                  {node}
                </span>
              </div>
              {i < chain.length - 1 && (
                <span className="text-[oklch(var(--gold))] text-[10px]">→</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Volume Ceiling Sensor Panel
function VolumeCeilingSensorPanel({
  volumeAtCeiling,
  currentVolume,
}: {
  volumeAtCeiling: boolean;
  currentVolume: number;
}) {
  return (
    <div className="bg-card border border-border rounded p-3">
      <PanelHeader>VOLUME CEILING SENSOR</PanelHeader>
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[8px] text-muted-foreground tracking-widest">
            CURRENT VOLUME
          </span>
          <span className="text-[oklch(var(--gold))] font-black text-sm">
            {currentVolume}
          </span>
        </div>
        <div className="w-full bg-background border border-border rounded-full h-2 overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${currentVolume}%`,
              background: volumeAtCeiling
                ? "oklch(var(--destructive))"
                : "oklch(var(--green-active))",
              boxShadow: volumeAtCeiling
                ? "0 0 6px oklch(var(--destructive))"
                : "0 0 4px oklch(var(--green-active))",
            }}
          />
        </div>
      </div>
      <div
        className={`p-2 rounded border text-center transition-all ${
          volumeAtCeiling
            ? "border-[oklch(var(--gold))] bg-[oklch(var(--gold)/0.1)]"
            : "border-border bg-background"
        }`}
      >
        {volumeAtCeiling ? (
          <>
            <div
              className="text-[oklch(var(--gold))] text-[9px] font-black tracking-widest led-pulse"
              data-ocid="smartamp.volume_ceiling.success_state"
            >
              ⚡ CEILING REACHED
            </div>
            <div className="text-[8px] text-foreground tracking-widest mt-1">
              VOLUME HELD — TITANIUM ACTIVATING
            </div>
          </>
        ) : (
          <div
            className="text-[8px] text-muted-foreground tracking-widest"
            data-ocid="smartamp.volume_ceiling.loading_state"
          >
            MONITORING — VOLUME BELOW CEILING
          </div>
        )}
      </div>
    </div>
  );
}

// DB Super Monitor Chip Panel
function DbSuperMonitorChipPanel({
  on,
  onToggle,
}: { on: boolean; onToggle: () => void }) {
  const stressReduction = on ? 94 : 0;
  const reductions = [
    "DB READINGS",
    "HARSH SOUND",
    "AMP LOAD",
    "HIGHS STRESS",
    "MIDS STRESS",
    "LOWS STRESS",
  ];

  return (
    <div className="bg-card border border-border rounded p-3">
      <PanelHeader>DB SUPER MONITOR CHIP</PanelHeader>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[9px] text-foreground tracking-widest">
          SUPER MONITOR
        </span>
        <button
          type="button"
          onClick={onToggle}
          data-ocid="smartamp.db_super_monitor.toggle"
          className={`px-3 py-1 rounded text-[9px] font-black tracking-widest border transition-all ${
            on
              ? "border-[oklch(var(--green-active))] text-[oklch(var(--green-active))] bg-[oklch(var(--green-active)/0.1)]"
              : "border-border text-muted-foreground bg-background hover:border-muted-foreground"
          }`}
          style={on ? { boxShadow: "0 0 8px oklch(var(--green-active))" } : {}}
        >
          {on ? "ON" : "OFF"}
        </button>
      </div>
      {on && (
        <div
          className="text-center text-[oklch(var(--gold))] text-[9px] font-black tracking-widest mb-2 led-pulse"
          data-ocid="smartamp.db_super_monitor.success_state"
        >
          ⚡ INNER POWER RELEASED
        </div>
      )}
      <div className="mb-2">
        <div className="flex justify-between text-[7px] text-muted-foreground mb-1">
          <span>STRESS REDUCTION</span>
          <span>{stressReduction}%</span>
        </div>
        <div className="w-full bg-background border border-border rounded-full h-2 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${stressReduction}%`,
              background: "oklch(var(--green-active))",
              boxShadow: on ? "0 0 4px oklch(var(--green-active))" : "none",
            }}
          />
        </div>
      </div>
      <div className="space-y-1">
        {reductions.map((item) => (
          <div key={item} className="flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: on
                  ? "oklch(var(--green-active))"
                  : "oklch(var(--border))",
                boxShadow: on ? "0 0 3px oklch(var(--green-active))" : "none",
              }}
            />
            <span
              className={`text-[7px] tracking-widest ${on ? "text-foreground" : "text-muted-foreground"}`}
            >
              STRESS OFF: {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// App 12.0 System Status Panel
function App120StatusPanel() {
  const statuses = [
    { id: "cleaning", label: "CLEANING 12.0", status: "ACTIVE" },
    { id: "crash_fix", label: "CRASH FIX 12.0", status: "ACTIVE" },
    { id: "chip_work", label: "CHIP WORKING 12.0", status: "NON-STOP" },
    { id: "smart_live", label: "SMART LIVE 12.0", status: "ALL DAY" },
    { id: "stable", label: "STABLE RATE 12.0", status: "LOCKED" },
  ];

  return (
    <div className="bg-card border border-border rounded p-3">
      <PanelHeader>APP 12.0 SYSTEM STATUS</PanelHeader>
      <div className="space-y-2">
        {statuses.map((s) => (
          <div
            key={s.id}
            className="flex items-center gap-3 p-2 bg-background border border-border rounded"
            data-ocid={`smartamp.app120.${s.id}.success_state`}
          >
            <GreenLed pulse />
            <span className="text-[9px] text-foreground tracking-widest flex-1">
              {s.label}
            </span>
            <span className="text-[oklch(var(--green-active))] text-[8px] font-black tracking-widest">
              {s.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SmartAmpCore({
  volumeAtCeiling,
  currentVolume,
  dbSuperMonitorOn,
  onDbSuperMonitorToggle,
  onSpeakerDetected,
  activeBassNote = 80,
}: SmartAmpCoreProps) {
  const [detectedSpeakerType, setDetectedSpeakerType] = useState<
    SpeakerType | undefined
  >(undefined);

  const handleSpeakerDetected = useCallback(
    (type: SpeakerType) => {
      setDetectedSpeakerType(type);
      onSpeakerDetected?.(type);
    },
    [onSpeakerDetected],
  );

  return (
    <div className="space-y-4" data-ocid="smartamp.panel">
      {/* Bass Note Tracker */}
      <div className="border border-gold/50 bg-gold/10 p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full bg-gold"
            style={{ animation: "pulse 1s infinite" }}
          />
          <span className="text-muted-foreground text-[9px] tracking-widest">
            AMP BASS TRACKING
          </span>
        </div>
        <span className="text-gold text-[10px] font-black tracking-widest font-mono">
          BASS NOTE: {activeBassNote}Hz — ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <VolumeEnginePanel currentVolume={currentVolume} />
        <AmpInternalsPanel />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChannelIsolatorPanel />
        <SmartInstrumentChipPanel />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <HzDropChipPanel autoDetectedType={detectedSpeakerType} />
        <SpeakerSensorPanel onSpeakerDetected={handleSpeakerDetected} />
      </div>
      <CleanSignalProcessorPanel />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <VolumeCeilingSensorPanel
          volumeAtCeiling={volumeAtCeiling}
          currentVolume={currentVolume}
        />
        <DbSuperMonitorChipPanel
          on={dbSuperMonitorOn}
          onToggle={onDbSuperMonitorToggle}
        />
      </div>
      <App120StatusPanel />
    </div>
  );
}
