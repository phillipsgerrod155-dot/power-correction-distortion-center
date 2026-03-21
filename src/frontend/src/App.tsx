import { AmpPanel } from "@/components/AmpPanel";
import { AudioSensor } from "@/components/AudioSensor";
import { BassControl } from "@/components/BassControl";
import { BatteryCharger } from "@/components/BatteryCharger";
import { BookIntro } from "@/components/BookIntro";
import { BullhornMode } from "@/components/BullhornMode";
import { ChannelSwitches } from "@/components/ChannelSwitches";
import { Chips12Status } from "@/components/Chips12Status";
import { CleanSignalDrive } from "@/components/CleanSignalDrive";
import { CorrectionForceDisplay } from "@/components/CorrectionForceDisplay";
import { CorrectionSystem } from "@/components/CorrectionSystem";
import { DbMeter } from "@/components/DbMeter";
import { DbNodeIndicator } from "@/components/DbNodeIndicator";
import { Equalizer } from "@/components/Equalizer";
import { FivePhaseIndicator } from "@/components/FivePhaseIndicator";
import { FrontStageAtmosphere } from "@/components/FrontStageAtmosphere";
import { FuseBoard } from "@/components/FuseBoard";
import { KickDrum } from "@/components/KickDrum";
import { MasterFuse150B } from "@/components/MasterFuse150B";
import { PowerDisplay } from "@/components/PowerDisplay";
import { PowerSwitch } from "@/components/PowerSwitch";
import { RadiatorPressure } from "@/components/RadiatorPressure";
import { SR22Crossover } from "@/components/SR22Crossover";
import { SRS224ProcessorUnit } from "@/components/SRS224ProcessorUnit";
import { SRSSuperChip } from "@/components/SRSSuperChip";
import { SignalTools } from "@/components/SignalTools";
import { SmallSpeakerMode } from "@/components/SmallSpeakerMode";
import { SmartAmpCore } from "@/components/SmartAmpCore";
import { SmartFuseSystem } from "@/components/SmartFuseSystem";
import { SmoothLoudBooster } from "@/components/SmoothLoudBooster";
import { SoundEngines } from "@/components/SoundEngines";
import { SoundMagnet } from "@/components/SoundMagnet";
import { SpeakerAdaptive } from "@/components/SpeakerAdaptive";
import { TitaniumOverdrive } from "@/components/TitaniumOverdrive";
import { Transport } from "@/components/Transport";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAudioEngine } from "@/hooks/useAudioEngine";
import { StoryCreditsPage } from "@/pages/StoryCreditsPage";
import { useCallback, useEffect, useRef, useState } from "react";

const SMOOTH_WARM_PRESET = [0, 2, 2, 3, 0, 1, 2, 2, 1, 2, 1, 2];

const COMBINED_FORCE =
  "34,360,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000";

const AUTOSAVE_KEY = "pcdc_autosave";

function loadSaved<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(AUTOSAVE_KEY);
    if (!raw) return fallback;
    const data = JSON.parse(raw);
    return key in data ? data[key] : fallback;
  } catch {
    return fallback;
  }
}

function AppMain() {
  const audioEngine = useAudioEngine();
  const [introComplete, setIntroComplete] = useState(false);
  const [rechargeWarning, setRechargeWarning] = useState(false);
  const [rechargeCountdown, setRechargeCountdown] = useState(900);
  const [systemPowered, setSystemPowered] = useState(() =>
    loadSaved("systemPowered", false),
  );
  const [batteryW, setBatteryW] = useState(() => loadSaved("batteryW", 0));
  const [autoSaveFlash, setAutoSaveFlash] = useState(false);
  const [autoSetFlash, setAutoSetFlash] = useState(false);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  const [volume, setVolume] = useState(() => loadSaved("volume", 91));
  const [boostLevel, setBoostLevel] = useState(() =>
    loadSaved("boostLevel", 0),
  );
  const [driveMode, setDriveMode] = useState<"SIGNAL" | "DYNAMIC" | "PRESENCE">(
    () => loadSaved("driveMode", "SIGNAL"),
  );
  const [smoothBoost, setSmoothBoost] = useState(() =>
    loadSaved("smoothBoost", 0),
  );
  const [brickWall, setBrickWall] = useState(() =>
    loadSaved("brickWall", -1.0),
  );
  const [eqBands, setEqBands] = useState<number[]>(() => {
    const flatDefault = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const saved = loadSaved("eqBands", flatDefault);
    if (Array.isArray(saved) && saved.length !== 12) {
      return flatDefault;
    }
    return saved;
  });
  const [eqEnabled, setEqEnabled] = useState(() =>
    loadSaved("eqEnabled", true),
  );
  const [engines, setEngines] = useState<boolean[]>(() =>
    loadSaved("engines", [true, true, true, true]),
  );
  const [corrections, setCorrections] = useState(() =>
    loadSaved("corrections", [
      { name: "EASY LIMITOR", strength: "0.1dB — ALWAYS ON", on: true },
      {
        name: "SYSTEM CLEAN DRIVE",
        strength: "0.1dB DEFAULT — SLIDER",
        on: true,
      },
      { name: "STABILIZER", strength: "34.36 Octodecillion XP", on: true },
      {
        name: "STABILIZER HELPER",
        strength: "34.36 Octodecillion XP",
        on: true,
      },
      { name: "MONITOR", strength: "34.36 Octodecillion XP", on: true },
      { name: "COMMANDER", strength: "34.36 Octodecillion XP", on: true },
      {
        name: "BRICK WALL HELPER",
        strength: "34.36 Octodecillion XP",
        on: true,
      },
      { name: "BRICK WALL", strength: "FINAL CEILING", on: true },
      {
        name: "TITANIUM OVERDRIVE",
        strength: "150,000,000,000 BI FUSE — COMMANDS ALL",
        on: true,
      },
    ]),
  );
  const [kickThump, setKickThump] = useState(() => loadSaved("kickThump", 0));
  const [kickKick, setKickKick] = useState(() => loadSaved("kickKick", 0));
  const [kickDrop, setKickDrop] = useState(() => loadSaved("kickDrop", 0));
  const [signalBassThump, setSignalBassThump] = useState(() =>
    loadSaved("signalBassThump", 9),
  );
  const [signalKick, setSignalKick] = useState(() =>
    loadSaved("signalKick", 0),
  );
  const [signalDrop, setSignalDrop] = useState(() =>
    loadSaved("signalDrop", 0),
  );
  const [noiseGate, setNoiseGate] = useState(() =>
    loadSaved("noiseGate", true),
  );
  const [bullhorn, setBullhorn] = useState(() => loadSaved("bullhorn", false));
  const [smallSpeaker, setSmallSpeaker] = useState(() =>
    loadSaved("smallSpeaker", false),
  );
  const [soundMagnet, setSoundMagnet] = useState(() =>
    loadSaved("soundMagnet", false),
  );
  const [audioSensor, setAudioSensor] = useState(() =>
    loadSaved("audioSensor", false),
  );
  const [loudnessSafety, setLoudnessSafety] = useState(() =>
    loadSaved("loudnessSafety", true),
  );
  const [rockConcert, setRockConcert] = useState(() =>
    loadSaved("rockConcert", false),
  );
  const [xoverBass, setXoverBass] = useState(() => loadSaved("xoverBass", 0));
  const [xoverKick, setXoverKick] = useState(() => loadSaved("xoverKick", 0));
  const [activeBassNote, setActiveBassNote] = useState(() =>
    loadSaved("activeBassNote", 80),
  );
  const [titaniumOn, setTitaniumOn] = useState(() =>
    loadSaved("titaniumOn", false),
  );
  const [frontStageOn, setFrontStageOn] = useState(() =>
    loadSaved("frontStageOn", false),
  );
  const [frontStageIntensity, setFrontStageIntensity] = useState(() =>
    loadSaved("frontStageIntensity", 75),
  );
  const [channelStates, setChannelStates] = useState(() =>
    loadSaved("channelStates", {
      highs: true,
      mids: true,
      bass: true,
      tweeters: true,
    }),
  );
  const [srsChipOn, setSrsChipOn] = useState(() =>
    loadSaved("srsChipOn", false),
  );
  const [bassLevel, setBassLevel] = useState(() => loadSaved("bassLevel", 80));
  const [hz80Drop, setHz80Drop] = useState(() => loadSaved("hz80Drop", 0));
  const [sunflashActive, setSunflashActive] = useState(() =>
    loadSaved("sunflashActive", false),
  );
  const [ampPowerDrive, setAmpPowerDrive] = useState(() =>
    loadSaved("ampPowerDrive", 0),
  );
  const [dbSuperMonitorOn, setDbSuperMonitorOn] = useState(() =>
    loadSaved("dbSuperMonitorOn", false),
  );
  const [lowGain, setLowGain] = useState<number>(() => loadSaved("lowGain", 4));

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [liveDb, setLiveDb] = useState(0);
  const rafLiveDbRef = useRef<number | null>(null);

  useEffect(() => {
    let active = true;
    const tick = () => {
      if (!active) return;
      const { live } = audioEngine.getAnalyserData();
      setLiveDb(live);
      audioEngine.setVolumeSmooth(live);
      rafLiveDbRef.current = requestAnimationFrame(tick);
    };
    rafLiveDbRef.current = requestAnimationFrame(tick);
    return () => {
      active = false;
      if (rafLiveDbRef.current !== null)
        cancelAnimationFrame(rafLiveDbRef.current);
    };
  }, [audioEngine.getAnalyserData, audioEngine.setVolumeSmooth]);

  // ── Auto-save every state change ──
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const snapshot = {
      volume,
      boostLevel,
      brickWall,
      eqBands,
      eqEnabled,
      engines,
      corrections,
      kickThump,
      kickKick,
      kickDrop,
      signalBassThump,
      signalKick,
      signalDrop,
      noiseGate,
      bullhorn,
      smallSpeaker,
      soundMagnet,
      audioSensor,
      loudnessSafety,
      rockConcert,
      xoverBass,
      xoverKick,
      activeBassNote,
      titaniumOn,
      frontStageOn,
      frontStageIntensity,
      channelStates,
      srsChipOn,
      bassLevel,
      hz80Drop,
      sunflashActive,
      ampPowerDrive,
      dbSuperMonitorOn,
      lowGain,
      batteryW,
      systemPowered,
      driveMode,
      smoothBoost,
    };
    try {
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(snapshot));
    } catch {
      /* quota */
    }
    setAutoSaveFlash(true);
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => setAutoSaveFlash(false), 1000);
  }, [
    volume,
    boostLevel,
    brickWall,
    eqBands,
    eqEnabled,
    engines,
    corrections,
    kickThump,
    kickKick,
    kickDrop,
    signalBassThump,
    signalKick,
    signalDrop,
    noiseGate,
    bullhorn,
    smallSpeaker,
    soundMagnet,
    audioSensor,
    loudnessSafety,
    rockConcert,
    xoverBass,
    xoverKick,
    activeBassNote,
    titaniumOn,
    frontStageOn,
    frontStageIntensity,
    channelStates,
    srsChipOn,
    bassLevel,
    hz80Drop,
    sunflashActive,
    ampPowerDrive,
    dbSuperMonitorOn,
    lowGain,
    batteryW,
    systemPowered,
    driveMode,
    smoothBoost,
  ]);

  useEffect(() => {
    audioEngine.setActiveCorrectionCount(9);
  }, [audioEngine]);

  // ── Battery charging simulation — runs after book intro ──
  useEffect(() => {
    if (!introComplete) return;

    // Already powered from saved state — skip charge animation
    if (systemPowered) {
      setBatteryW(2_000_000_000);
      audioEngine.setActiveCorrectionCount(9);
      return;
    }

    let frame: number;
    const start = performance.now();
    const duration = 3000;
    const maxW = 2_000_000_000;
    const threshold = 50_000;
    let powered = false;
    const animate = (now: number) => {
      const pct = Math.min(1, (now - start) / duration);
      const w = Math.round(pct * maxW);
      setBatteryW(w);
      if (!powered && w >= threshold) {
        powered = true;
        setSystemPowered(true);
        audioEngine.setActiveCorrectionCount(9);
      }
      if (pct < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [introComplete, audioEngine, systemPowered]);

  // AUTO SET flash -- fires on any user input/change/pointerdown
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const handleAnyInput = () => {
      setAutoSetFlash(true);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => setAutoSetFlash(false), 500);
    };
    document.addEventListener("input", handleAnyInput);
    document.addEventListener("change", handleAnyInput);
    document.addEventListener("pointerdown", handleAnyInput);
    return () => {
      document.removeEventListener("input", handleAnyInput);
      document.removeEventListener("change", handleAnyInput);
      document.removeEventListener("pointerdown", handleAnyInput);
      if (timer) clearTimeout(timer);
    };
  }, []);

  const handleLoadAudio = useCallback(
    async (file: File) => {
      await audioEngine.loadAudio(file);
    },
    [audioEngine],
  );

  const handleVolumeChange = useCallback(
    (v: number) => {
      setVolume(v);
      audioEngine.setVolume(v);
      audioEngine.setActiveCorrectionCount(9);
      if (v >= 100 && !titaniumOn) {
        setTitaniumOn(true);
        audioEngine.setTitaniumOn(true);
      }
    },
    [audioEngine, titaniumOn],
  );

  const handleBoostChange = useCallback(
    (v: number) => {
      setBoostLevel(v);
      audioEngine.setBoost(v);
    },
    [audioEngine],
  );

  const handleDriveModeChange = useCallback(
    (mode: "SIGNAL" | "DYNAMIC" | "PRESENCE") => {
      setDriveMode(mode);
      audioEngine.setDriveMode(mode);
    },
    [audioEngine],
  );

  const handleBrickWallChange = useCallback(
    (v: number) => {
      setBrickWall(v);
      audioEngine.setBrickWall(v);
    },
    [audioEngine],
  );

  const handleSmoothBoostChange = useCallback(
    (v: number) => {
      setSmoothBoost(v);
      const multiplier = 1.0 + (v / 50) * 0.5;
      if (audioEngine.setSmoothBoost) audioEngine.setSmoothBoost(multiplier);
    },
    [audioEngine],
  );

  const handleEqBandChange = useCallback(
    (i: number, v: number) => {
      setEqBands((prev) => {
        const next = [...prev];
        next[i] = v;
        audioEngine.setEqBand(i, eqEnabled ? v : 0);
        return next;
      });
    },
    [audioEngine, eqEnabled],
  );

  const handleEqToggle = useCallback(() => {
    setEqEnabled((prev) => {
      const next = !prev;
      audioEngine.setEqEnabled(next, eqBands);
      return next;
    });
  }, [audioEngine, eqBands]);

  const handleEqPreset = useCallback(
    (name: string) => {
      const presets: Record<string, number[]> = {
        "BASS HEAVY": [6, 8, 8, 6, 0, 0, 0, 0, 0, 0, 0, 0],
        THUMP: [4, 6, 10, 6, 0, 0, 0, 0, 0, 0, 0, 0],
        "80Hz DROP": [2, 4, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0],
        "VOCAL CLARITY": [0, 0, 0, 0, 2, 3, 4, 3, 2, 3, 2, 4],
        "TREBLE LIFT": [0, 0, 0, 0, 0, 0, 2, 3, 4, 6, 5, 7],
        FLAT: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        RESET: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      };
      const bands = presets[name];
      if (bands) {
        setEqBands(bands);
        bands.forEach((v, i) => audioEngine.setEqBand(i, eqEnabled ? v : 0));
      }
    },
    [audioEngine, eqEnabled],
  );

  const handleSmoothWarm = useCallback(() => {
    setEqBands(SMOOTH_WARM_PRESET);
    SMOOTH_WARM_PRESET.forEach((v, i) =>
      audioEngine.setEqBand(i, eqEnabled ? v : 0),
    );
  }, [audioEngine, eqEnabled]);

  const handleSaveSettings = useCallback(() => {
    const settings = {
      volume,
      eqBands,
      eqEnabled,
      titaniumOn,
      corrections,
      engines,
      srsChipOn,
      frontStageOn,
      bullhorn,
      smallSpeaker,
      soundMagnet,
      audioSensor,
      channelStates,
      dbSuperMonitorOn,
      lowGain,
      batteryW,
      systemPowered,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(settings, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pcdc-settings-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [
    volume,
    eqBands,
    eqEnabled,
    titaniumOn,
    corrections,
    engines,
    srsChipOn,
    frontStageOn,
    bullhorn,
    smallSpeaker,
    soundMagnet,
    audioSensor,
    channelStates,
    dbSuperMonitorOn,
    lowGain,
    batteryW,
    systemPowered,
  ]);

  const handleEngineToggle = useCallback(
    (i: number) => {
      setEngines((prev) => {
        const next = [...prev];
        next[i] = !next[i];
        audioEngine.setEngineOn(i, next[i]);
        return next;
      });
    },
    [audioEngine],
  );

  const handleCorrectionToggle = useCallback(
    (i: number) => {
      setCorrections((prev) => {
        const next = [...prev];
        next[i] = { ...next[i], on: !next[i].on };
        audioEngine.setActiveCorrectionCount(next.filter((c) => c.on).length);
        return next;
      });
    },
    [audioEngine],
  );

  const handleSignalChange = useCallback(
    (key: string, value: number | boolean) => {
      if (key === "noiseGate") setNoiseGate(value as boolean);
      else if (key === "bassThump") setSignalBassThump(value as number);
      else if (key === "kick") setSignalKick(value as number);
      else if (key === "drop") setSignalDrop(value as number);
    },
    [],
  );

  const handleXoverChange = useCallback((key: string, v: number) => {
    if (key === "bassThump") setXoverBass(v);
    else if (key === "kick") setXoverKick(v);
  }, []);

  const handleTitaniumToggle = useCallback(() => {
    setTitaniumOn((prev) => {
      const next = !prev;
      audioEngine.setTitaniumOn(next);
      return next;
    });
  }, [audioEngine]);

  const handleFrontStageToggle = useCallback(() => {
    setFrontStageOn((prev) => {
      const next = !prev;
      audioEngine.setFrontStageOn(next, frontStageIntensity);
      return next;
    });
  }, [audioEngine, frontStageIntensity]);

  const handleFrontStageIntensity = useCallback(
    (v: number) => {
      setFrontStageIntensity(v);
      if (frontStageOn) audioEngine.setFrontStageOn(true, v);
    },
    [audioEngine, frontStageOn],
  );

  const handleChannelChange = useCallback(
    (key: string, value: boolean) => {
      setChannelStates((prev) => {
        const next = { ...prev, [key]: value };
        audioEngine.setChannels(
          next.highs,
          next.mids,
          next.bass,
          next.tweeters,
        );
        return next;
      });
    },
    [audioEngine],
  );

  const handleSrsChipToggle = useCallback(() => {
    setSrsChipOn((prev) => {
      const next = !prev;
      audioEngine.setSRSChipOn(next);
      return next;
    });
  }, [audioEngine]);

  const handleBassLevelChange = useCallback(
    (v: number) => {
      setBassLevel(v);
      audioEngine.setBassLevel(v);
    },
    [audioEngine],
  );

  const handleHz80DropChange = useCallback(
    (v: number) => {
      setHz80Drop(v);
      audioEngine.setHz80Drop(v);
    },
    [audioEngine],
  );

  const handleSunflashActivate = useCallback(() => {
    setSunflashActive(true);
    audioEngine.setSpeakerProfile("BLUETOOTH");
    audioEngine.setActiveCorrectionCount(9);
  }, [audioEngine]);

  const handleAmpPowerDrive = useCallback(
    (v: number) => {
      setAmpPowerDrive(v);
      audioEngine.setAmpPowerDrive(v);
    },
    [audioEngine],
  );

  const handleBullhornToggle = useCallback(() => {
    setBullhorn((prev) => {
      const next = !prev;
      audioEngine.setBullhornOn(next);
      return next;
    });
  }, [audioEngine]);

  const handleSmallSpeakerToggle = useCallback(() => {
    setSmallSpeaker((prev) => {
      const next = !prev;
      audioEngine.setSmallSpeakerOn(next);
      return next;
    });
  }, [audioEngine]);

  const handleSoundMagnetToggle = useCallback(() => {
    setSoundMagnet((prev) => {
      const next = !prev;
      audioEngine.setSoundMagnetOn(next);
      return next;
    });
  }, [audioEngine]);

  const handleAudioSensorToggle = useCallback(() => {
    setAudioSensor((prev) => {
      const next = !prev;
      audioEngine.setAudioSensorOn(next);
      return next;
    });
  }, [audioEngine]);

  const handleSpeakerDetected = useCallback(
    (type: "SMALL" | "BIG" | "CAR" | "BLUETOOTH") => {
      audioEngine.setSpeakerProfile(type);
    },
    [audioEngine],
  );

  const handleDbSuperMonitorToggle = useCallback(() => {
    setDbSuperMonitorOn((prev) => !prev);
  }, []);

  const _handleLowGainChange = useCallback(
    (v: number) => {
      setLowGain(v);
      audioEngine.setLowShelfGain(v);
    },
    [audioEngine],
  );

  const handleShutdown = useCallback(() => {
    audioEngine.setVolume(5);
    setVolume(5);
  }, [audioEngine]);

  // ── Recharge countdown effect ──
  useEffect(() => {
    if (!rechargeWarning) return;
    setRechargeCountdown(900);
    const interval = setInterval(() => {
      setRechargeCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setRechargeWarning(false);
          return 900;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [rechargeWarning]);

  // ── Power Switch: manual override ──
  const handlePowerSwitchToggle = useCallback(() => {
    if (systemPowered) {
      setSystemPowered(false);
      audioEngine.setVolume(0);
      setVolume(0);
      setRechargeWarning(true);
    } else {
      if (batteryW >= 50_000) {
        setSystemPowered(true);
        setRechargeWarning(false);
        audioEngine.setActiveCorrectionCount(9);
      }
    }
  }, [systemPowered, batteryW, audioEngine]);

  const activeCorrectionCount = corrections.filter((c) => c.on).length;
  const correctionForce = activeCorrectionCount > 0 ? COMBINED_FORCE : "0";

  return (
    <div
      className="min-h-screen bg-background font-mono overflow-x-hidden"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      {!introComplete && (
        <BookIntro onComplete={() => setIntroComplete(true)} />
      )}

      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-screen-xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-active glow-green" />
            <span className="text-gold text-xs font-black tracking-[0.3em]">
              POWER CORRECTION DISTORTION CENTER
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                const base = window.location.href.split("?")[0].split("#")[0];
                window.open(`${base}?page=custom`, "_blank");
              }}
              data-ocid="story.open_modal_button"
              style={{
                background: "transparent",
                border: "1px solid oklch(0.85 0.18 90 / 0.35)",
                color: "oklch(0.85 0.18 90)",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.25em",
                padding: "4px 12px",
                cursor: "pointer",
                textTransform: "uppercase",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 0 12px oklch(0.85 0.18 90 / 0.5)";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "oklch(0.85 0.18 90 / 0.8)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "oklch(0.85 0.18 90 / 0.35)";
              }}
            >
              ✦ THE STORY
            </button>
            <span className="text-muted-foreground text-[8px] tracking-widest">
              SRS2202 SYSTEM
            </span>
            <div
              data-ocid="autoset.success_state"
              className="flex items-center gap-1"
              title="Auto-Set mode: every control fires instantly"
            >
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: autoSetFlash
                    ? "oklch(0.78 0.25 142)"
                    : "oklch(0.6 0.18 142)",
                  boxShadow: autoSetFlash
                    ? "0 0 12px 4px oklch(0.78 0.25 142 / 0.95)"
                    : "0 0 5px 2px oklch(0.6 0.18 142 / 0.5)",
                  transition:
                    "background-color 0.1s ease, box-shadow 0.1s ease",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "7px",
                  letterSpacing: "0.15em",
                  color: autoSetFlash
                    ? "oklch(0.82 0.25 142)"
                    : "oklch(0.65 0.16 142)",
                  transition: "color 0.1s ease",
                  userSelect: "none",
                  fontWeight: autoSetFlash ? "bold" : "normal",
                }}
              >
                AUTO SET ✓
              </span>
            </div>
            <div
              data-ocid="autosave.success_state"
              className="flex items-center gap-1"
              title="All changes automatically saved"
            >
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: autoSaveFlash
                    ? "oklch(0.75 0.22 142)"
                    : "oklch(0.55 0.14 142)",
                  boxShadow: autoSaveFlash
                    ? "0 0 8px 2px oklch(0.75 0.22 142 / 0.9)"
                    : "0 0 3px 1px oklch(0.55 0.14 142 / 0.4)",
                  transition:
                    "background-color 0.15s ease, box-shadow 0.15s ease",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "7px",
                  letterSpacing: "0.15em",
                  color: autoSaveFlash
                    ? "oklch(0.75 0.22 142)"
                    : "oklch(0.45 0.08 142)",
                  transition: "color 0.15s ease",
                  userSelect: "none",
                }}
              >
                AUTO SAVED
              </span>
            </div>
            <div className="w-2 h-2 rounded-full bg-blue-hi glow-blue led-pulse" />
          </div>
        </div>
      </header>

      {/* Recharge warning banner */}
      {rechargeWarning && (
        <div
          style={{
            position: "fixed",
            top: "49px",
            left: 0,
            right: 0,
            zIndex: 60,
            background: "rgba(255,170,0,0.95)",
            color: "#000",
            textAlign: "center",
            padding: "10px",
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 900,
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
          }}
        >
          ⚠ 15-MINUTE RECHARGE REQUIRED — BATTERY CHARGING &nbsp;|&nbsp;{" "}
          {Math.floor(rechargeCountdown / 60)}:
          {String(rechargeCountdown % 60).padStart(2, "0")} REMAINING
        </div>
      )}

      <main
        className="max-w-screen-xl mx-auto px-4 overflow-x-hidden"
        style={{ position: "relative" }}
      >
        {/* Dark overlay when powered off (after intro) */}
        {introComplete && !systemPowered && batteryW >= 50_000 && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              top: "49px",
              zIndex: 40,
              background: "rgba(0,0,0,0.88)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "clamp(14px, 3vw, 22px)",
                fontWeight: 900,
                letterSpacing: "0.3em",
                color: "oklch(0.75 0.22 142)",
                textShadow: "0 0 20px oklch(0.75 0.22 142)",
                textAlign: "center",
                padding: "0 20px",
              }}
            >
              🟢 FLIP POWER SWITCH TO ACTIVATE
            </div>
            <div
              style={{
                fontSize: "0.55rem",
                letterSpacing: "0.2em",
                color: "oklch(0.5 0.08 142)",
              }}
            >
              BATTERY CHARGED — SYSTEM READY
            </div>
          </div>
        )}
        {/* System Power Gate Overlay */}
        {introComplete && !systemPowered && batteryW < 50_000 && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              top: "49px",
              zIndex: 45,
              background: "rgba(0,0,0,0.92)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "24px",
            }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "2.5rem",
                  marginBottom: "8px",
                  filter: "drop-shadow(0 0 20px #ffd700)",
                }}
              >
                ⚡
              </div>
              <div
                style={{
                  fontSize: "1.4rem",
                  fontWeight: 900,
                  letterSpacing: "0.3em",
                  color: "#ffd700",
                  textShadow: "0 0 24px #ffd700, 0 0 48px rgba(255,215,0,0.4)",
                  marginBottom: "6px",
                }}
              >
                SYSTEM OFFLINE
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  letterSpacing: "0.25em",
                  color: "rgba(255,215,0,0.65)",
                  marginBottom: "32px",
                }}
              >
                BATTERY CHARGING...
              </div>
              <div style={{ width: "340px", maxWidth: "80vw" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.6rem",
                    letterSpacing: "0.15em",
                    color: "rgba(255,215,0,0.5)",
                    marginBottom: "8px",
                  }}
                >
                  <span>0W</span>
                  <span style={{ color: "#00ff88" }}>
                    {batteryW.toLocaleString()}W
                  </span>
                  <span>50,000W THRESHOLD</span>
                </div>
                <div
                  style={{
                    height: "14px",
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: "7px",
                    overflow: "hidden",
                    border: "1px solid rgba(255,215,0,0.2)",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.min(100, (batteryW / 50_000) * 100)}%`,
                      background: "linear-gradient(90deg, #d4af37, #00ff88)",
                      boxShadow: "0 0 12px #00ff88",
                      borderRadius: "7px",
                      transition: "width 0.05s linear",
                    }}
                  />
                </div>
                <div
                  style={{
                    marginTop: "16px",
                    fontSize: "0.6rem",
                    letterSpacing: "0.2em",
                    color: "rgba(0,255,136,0.6)",
                  }}
                >
                  AMP ACTIVATES AT 50,000W
                </div>
              </div>
            </div>
          </div>
        )}

        <Tabs defaultValue="main" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b border-border bg-card sticky top-[49px] z-40 h-auto p-0 gap-0 flex-wrap">
            {(
              [
                ["main", "MAIN"],
                ["engines", "ENGINES & SIGNAL"],
                ["eq", "EQUALIZER & SOUND"],
                ["correction", "CORRECTION FORCE"],
                ["power", "POWER SYSTEM"],
                ["smartamp", "SMART AMP CORE"],
              ] as [string, string][]
            ).map(([value, label]) => (
              <TabsTrigger
                key={value}
                value={value}
                data-ocid={`nav.${value}.tab`}
                className="rounded-none border-b-2 border-transparent px-4 py-2.5 text-[10px] tracking-widest uppercase font-mono text-muted-foreground data-[state=active]:border-[oklch(var(--gold))] data-[state=active]:text-[oklch(var(--gold))] data-[state=active]:bg-transparent hover:text-[oklch(var(--gold))] transition-colors bg-transparent shadow-none"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ── TAB 1: MAIN ── */}
          <TabsContent value="main" className="pt-4 space-y-3">
            <Transport
              onLoadAudio={handleLoadAudio}
              onPlay={audioEngine.play}
              onPause={audioEngine.pause}
              isPlaying={audioEngine.isPlaying}
              volume={volume}
              onVolumeChange={handleVolumeChange}
              onSmoothWarm={handleSmoothWarm}
              onSave={handleSaveSettings}
            />
            <Equalizer
              enabled={eqEnabled}
              bands={eqBands}
              onToggle={handleEqToggle}
              onBandChange={handleEqBandChange}
              onPreset={handleEqPreset}
              srsChipOn={srsChipOn}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <AmpPanel
                loudnessSafety={loudnessSafety}
                onLoudnessSafetyToggle={() => setLoudnessSafety((v) => !v)}
                rockConcert={rockConcert}
                onRockConcertToggle={() => setRockConcert((v) => !v)}
                ampPowerDrive={ampPowerDrive}
                onAmpPowerDriveChange={handleAmpPowerDrive}
              />
              <div className="space-y-3">
                <DbMeter
                  getAnalyserData={audioEngine.getAnalyserData}
                  isPlaying={audioEngine.isPlaying}
                />
                <DbNodeIndicator getNodeData={audioEngine.getNodeData} />
              </div>
              <div className="space-y-3">
                <CorrectionSystem
                  corrections={corrections}
                  onToggle={handleCorrectionToggle}
                  correctionForce={correctionForce}
                />
                <FivePhaseIndicator />
              </div>
            </div>
          </TabsContent>

          {/* ── TAB 2: ENGINES & SIGNAL ── */}
          <TabsContent value="engines" className="pt-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <SoundEngines engines={engines} onToggle={handleEngineToggle} />
              <KickDrum
                onFire={audioEngine.fireKick}
                thump={kickThump}
                kick={kickKick}
                drop={kickDrop}
                onThumpChange={(v) => {
                  setKickThump(v);
                  audioEngine.setKickThump(v);
                }}
                onKickChange={(v) => {
                  setKickKick(v);
                  audioEngine.setKickKick(v);
                }}
                onDropChange={(v) => {
                  setKickDrop(v);
                  audioEngine.setKickDrop(v);
                }}
              />
              <SignalTools
                noiseGate={noiseGate}
                bassThump={signalBassThump}
                kick={signalKick}
                drop={signalDrop}
                onChange={handleSignalChange}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <SR22Crossover
                bassThump={xoverBass}
                kick={xoverKick}
                activeBassNote={activeBassNote}
                onChange={handleXoverChange}
                onBassNoteChange={(hz) => {
                  setActiveBassNote(hz);
                  audioEngine.setCrossoverBassNote(hz);
                }}
              />
              <CleanSignalDrive
                driveLevel={boostLevel}
                driveMode={driveMode}
                brickWall={brickWall}
                onDriveLevelChange={handleBoostChange}
                onDriveModeChange={handleDriveModeChange}
                onBrickWallChange={handleBrickWallChange}
              />
              <div className="space-y-3">
                <BullhornMode
                  enabled={bullhorn}
                  onToggle={handleBullhornToggle}
                />
                <SmallSpeakerMode
                  enabled={smallSpeaker}
                  onToggle={handleSmallSpeakerToggle}
                />
              </div>
            </div>
            <SmartFuseSystem
              onLowLoad={(load) => audioEngine.setSmartFuseLow(load)}
              onMidsHz={(hz) => audioEngine.setSmartFuseMids(hz)}
              onHighsLoad={(load) => audioEngine.setSmartFuseHighs(load)}
            />
          </TabsContent>

          {/* ── TAB 3: EQUALIZER & SOUND ── */}
          <TabsContent value="eq" className="pt-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Equalizer
                enabled={eqEnabled}
                bands={eqBands}
                onToggle={handleEqToggle}
                onBandChange={handleEqBandChange}
                onPreset={handleEqPreset}
                srsChipOn={srsChipOn}
              />
              <SRSSuperChip
                srsChipOn={srsChipOn}
                onToggle={handleSrsChipToggle}
              />
            </div>
            <SmoothLoudBooster
              boostLevel={smoothBoost}
              onBoostChange={handleSmoothBoostChange}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <SoundMagnet
                enabled={soundMagnet}
                onToggle={handleSoundMagnetToggle}
              />
              <AudioSensor
                enabled={audioSensor}
                onToggle={handleAudioSensorToggle}
              />
              <SpeakerAdaptive eqBands={eqBands} boostLevel={boostLevel} />
            </div>
            <FrontStageAtmosphere
              frontStageOn={frontStageOn}
              intensity={frontStageIntensity}
              onToggle={handleFrontStageToggle}
              onIntensityChange={handleFrontStageIntensity}
            />
            <ChannelSwitches
              channels={channelStates}
              onChange={handleChannelChange}
            />
            <BassControl
              bassLevel={bassLevel}
              onLevelChange={handleBassLevelChange}
              hz80Drop={hz80Drop}
              onHz80DropChange={handleHz80DropChange}
              correctionForce={correctionForce}
            />
          </TabsContent>

          {/* ── TAB 4: CORRECTION FORCE ── */}
          <TabsContent value="correction" className="pt-4 space-y-3">
            <SRS224ProcessorUnit active={true} />
            <CorrectionForceDisplay liveDb={liveDb} volume={volume} />
            <MasterFuse150B
              liveDb={liveDb}
              volume={volume}
              onShutdown={handleShutdown}
            />
            <RadiatorPressure
              onPressureChange={(l, r) => audioEngine.setRadiatorPressure(l, r)}
            />
            <TitaniumOverdrive
              titaniumOn={titaniumOn}
              onToggle={handleTitaniumToggle}
            />
            <FuseBoard
              corrections={corrections}
              activeCorrectionCount={activeCorrectionCount}
            />
          </TabsContent>

          {/* ── TAB 5: POWER SYSTEM ── */}
          <TabsContent value="power" className="pt-4">
            <div className="max-w-2xl mx-auto space-y-4">
              <PowerSwitch
                batteryW={batteryW}
                systemPowered={systemPowered}
                onToggle={handlePowerSwitchToggle}
              />
              <BatteryCharger
                batteryW={batteryW}
                systemPowered={systemPowered}
                rechargeWarning={rechargeWarning}
              />
              <PowerDisplay batteryW={batteryW} systemPowered={systemPowered} />
            </div>
          </TabsContent>

          {/* ── TAB 6: SMART AMP CORE ── */}
          <TabsContent value="smartamp" className="pt-4 space-y-4">
            <SmartAmpCore
              volumeAtCeiling={volume >= 100}
              currentVolume={volume}
              dbSuperMonitorOn={dbSuperMonitorOn}
              onDbSuperMonitorToggle={handleDbSuperMonitorToggle}
              onSpeakerDetected={handleSpeakerDetected}
            />
            <details className="panel mt-4">
              <summary className="panel-title cursor-pointer select-none text-xs tracking-widest">
                ▶ 12.0 LIVE CHIP STATUS
              </summary>
              <div className="mt-3">
                <Chips12Status liveDb={liveDb} />
              </div>
            </details>

            <details className="panel mt-4" open>
              <summary className="panel-title cursor-pointer select-none text-xs tracking-widest">
                ▶ SUNFLASH BLUETOOTH — NO HARDWARE LIMITING
              </summary>
              <div className="mt-3 space-y-3">
                <div className="text-[9px] tracking-widest text-muted-foreground uppercase">
                  SUNFLASH SPEAKER PROFILE — FULL OUTPUT, NO HARDWARE CAPS, ALL
                  CORRECTIONS APPLIED
                </div>
                <p className="text-[8px] text-muted-foreground leading-relaxed">
                  The SUNFLASH Bluetooth speaker profile bypasses hardware
                  output limitations. All 9 corrections + Titanium 400,000
                  strength are applied directly to the output signal. The amp
                  pushes full safety power. Nothing caps or limits the audio
                  chain — the system commands every frequency band at full
                  corrected strength.
                </p>
                {sunflashActive ? (
                  <div
                    className="text-[10px] font-black tracking-widest text-center py-2 px-3 rounded"
                    style={{
                      color: "oklch(0.85 0.22 145)",
                      textShadow:
                        "0 0 12px oklch(0.7 0.25 145), 0 0 24px oklch(0.6 0.3 145)",
                      background: "oklch(0.12 0.05 145 / 0.4)",
                      border: "1px solid oklch(0.5 0.2 145 / 0.6)",
                    }}
                    data-ocid="sunflash.success_state"
                  >
                    ◉ SUNFLASH ACTIVE — FULL POWER — CORRECTIONS APPLIED TO
                    OUTPUT
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleSunflashActivate}
                    className="w-full py-2 px-3 text-[10px] font-black tracking-widest rounded transition-all"
                    style={{
                      background: "oklch(0.18 0.06 220 / 0.8)",
                      border: "1px solid oklch(0.5 0.15 220 / 0.7)",
                      color: "oklch(0.8 0.18 220)",
                      textShadow: "0 0 8px oklch(0.6 0.2 220)",
                    }}
                    data-ocid="sunflash.primary_button"
                  >
                    ⚡ ACTIVATE SUNFLASH PROFILE
                  </button>
                )}
                <div className="text-[7px] text-muted-foreground tracking-wider opacity-60">
                  SUNFLASH PROFILE: BLUETOOTH FULL RANGE · BASS BLOCKERS ON
                  MIDS/HIGHS · 80Hz ARMED · HARD CORRECTION 985B · TITANIUM 400K
                  · ALL CORRECTIONS RIDING OUTPUT
                </div>
              </div>
            </details>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-border mt-8">
        <div className="max-w-screen-xl mx-auto px-4 py-3 text-center">
          <span className="text-muted-foreground text-[8px]">
            &copy; {new Date().getFullYear()}. Built with ❤ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-hi hover:underline"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </footer>

      <Toaster />
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
      />
    </div>
  );
}

export default function App() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("page") === "custom") {
    return <StoryCreditsPage />;
  }
  return <AppMain />;
}
