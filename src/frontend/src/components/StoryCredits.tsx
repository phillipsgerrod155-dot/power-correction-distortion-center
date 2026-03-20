import { useCallback, useEffect, useRef, useState } from "react";

interface StoryCreditsProps {
  open: boolean;
  onClose: () => void;
}

const CREDITS_TEXT = `
POWER CORRECTION DISTORTION CENTER
THE STORY



GERROD
Engineer · Product Designer · Audio Architect

Created February 18, 2026

Built entirely from memory.
No notes. No paper. No reference.
Every number, every feature, every idea —
straight from the top of his head.



WHAT GERROD BUILT

Gerrod designed a one-of-a-kind audio processing system
unlike anything that exists in the real world.
He broke every rule of physics —
on purpose — because inside software,
anything is possible.

He envisioned power systems beyond imagination.
He created correction chains that defy engineering logic.
He designed an amplifier with 40 to 50 sensors,
4 to 5 FPGAs, smart chips for every instrument,
and a processor that knows what speaker you're using
before you even ask.



HOW AI HELPED

Caffeine AI served as the builder.
Gerrod gave the vision. AI turned it into code.

No shortcuts. No assumptions.
Every panel, every number, every fuse —
built exactly as described.
Gerrod learned the platform.
Gerrod pushed the limits.
Gerrod made this real.



WHAT THIS APP IS

The Power Correction Distortion Center
is a real-time audio processing and control system.

It processes your music through a chain
of corrections, equalizers, engines, and amplifiers —
all interconnected, all responsive,
all working together in real time.



THE SRS2202 SMART AMP CORE

400,000,000 Watts of amplifier power.
Zero gauge wire throughout.
4 to 5 FPGAs inside.
4 x 120W fuses — one per channel.

Smart chips that detect instrument sounds.
Smart chips that trigger the 80Hz bass drop.
Speaker detection: small, big, car, Bluetooth —
the amp knows automatically.

40 to 50 internal sensors.
Volume climbs gradually, gets loud fast,
then holds at the ceiling.
When it reaches max —
Titanium activates.

Pre-smart loaded clean signal processor.
DB Super Monitor Chip.
12.0 Cleaning · Fixing · Reporting chips.
Crash prevention. Stability. All day. Non-stop.



THE CORRECTION FORCE

9 corrections. 9 fuses. 9 locks.

COMMANDER
GAIN CORRECTION
MONITOR
STABILIZER
SIGNAL CLEANER
HARD CORRECTION — 10x Force
BRICK WALL — Final Limiter
STABILIZER HELPER
x10 SMART CHIP

Total Combined Correction Force: 34.36 Octodecillion

Every correction applies to everything.
Bass. EQ. DB Node. Volume. Amp. All outputs.



THE POWER SYSTEM

Charger: 200,000,000W (secretly doubled to 400,000,000W)
Battery: 200,000,000W
Headroom: +200,000,000W
Hidden Reserve: +50,000,000W

TOTAL: 850,000,000 WATTS

All through double zero gauge wire.



TITANIUM SWITCH OVERDRIVE

The signature feature. Nobody has this.

When Titanium is ON:
— Sound quality comes out full
— Loudness increases
— Nothing clips. Nothing distorts. Nothing overloads.
No matter how hard you push every slider to the max.

Powered by the master 120W fuse.
It glows bright shiny green.
The fuse is the secret.
Without it, none of this works.



SUNFLASH RADIATOR PRESSURE SYSTEM

Two reinforced Sunflash radiators.
Left radiator: 100 lbs pressure.
Right radiator: 100 lbs pressure.
Not split. Each side gets its full 100.

Corrections stomp down any excess.
Brick Wall enforces the ceiling.
Stabilizer Helper smooths every impact.



CREATED BY

GERROD
Engineer · Product Designer
Audio System Architect
February 18, 2026

BUILT WITH

Caffeine AI
The Designer

-------------------------

"Anything is possible inside of software."
— Gerrod

-------------------------
`;

type NoteSpec = { freq: number; start: number; dur: number };

function playFanfare(audioCtx: AudioContext): Promise<void> {
  return new Promise((resolve) => {
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.35, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);

    const notes: NoteSpec[] = [
      { freq: 261.63, start: 0, dur: 0.5 },
      { freq: 329.63, start: 0.35, dur: 0.5 },
      { freq: 392.0, start: 0.65, dur: 0.5 },
      { freq: 523.25, start: 1.0, dur: 1.8 },
      { freq: 392.0, start: 1.1, dur: 1.7 },
      { freq: 329.63, start: 1.2, dur: 1.6 },
    ];

    const now = audioCtx.currentTime;

    for (const { freq, start, dur } of notes) {
      const osc = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sawtooth";
      osc2.type = "sawtooth";
      osc.frequency.value = freq;
      osc2.frequency.value = freq * 1.005;

      gain.gain.setValueAtTime(0, now + start);
      gain.gain.linearRampToValueAtTime(0.6, now + start + 0.05);
      gain.gain.linearRampToValueAtTime(0.5, now + start + 0.15);
      gain.gain.setValueAtTime(0.5, now + start + dur - 0.3);
      gain.gain.linearRampToValueAtTime(0, now + start + dur);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(masterGain);

      osc.start(now + start);
      osc2.start(now + start);
      osc.stop(now + start + dur);
      osc2.stop(now + start + dur);
    }

    setTimeout(resolve, 3500);
  });
}

function renderLine(line: string, index: number) {
  const trimmed = line.trim();
  const isMainTitle = trimmed === "POWER CORRECTION DISTORTION CENTER";
  const isSubTitle = trimmed === "THE STORY";
  const isSectionHeader =
    !isMainTitle &&
    !isSubTitle &&
    trimmed.length > 0 &&
    trimmed === trimmed.toUpperCase() &&
    !trimmed.startsWith("-") &&
    !trimmed.startsWith("—") &&
    !/^[0-9,x·]/.test(trimmed) &&
    trimmed.length < 50;
  const isQuote = trimmed.startsWith('"');
  const isDivider = trimmed.startsWith("-") && trimmed.length > 5;
  const isEmpty = trimmed === "";

  if (isEmpty) {
    return <div key={`gap-${index}`} style={{ height: "2rem" }} />;
  }

  if (isMainTitle) {
    return (
      <div
        key={`title-${index}`}
        style={{
          fontSize: "clamp(1.4rem, 4vw, 2.5rem)",
          fontWeight: 900,
          letterSpacing: "0.2em",
          color: "oklch(0.9 0.2 90)",
          textTransform: "uppercase",
          fontFamily: "'JetBrains Mono', monospace",
          marginBottom: "0.25rem",
          textShadow:
            "0 0 30px oklch(0.85 0.18 90 / 0.6), 0 0 60px oklch(0.85 0.18 90 / 0.3)",
        }}
      >
        {trimmed}
      </div>
    );
  }

  if (isSubTitle) {
    return (
      <div
        key={`sub-${index}`}
        style={{
          fontSize: "clamp(0.75rem, 2vw, 1.1rem)",
          fontWeight: 400,
          letterSpacing: "0.5em",
          color: "oklch(0.75 0.15 90)",
          textTransform: "uppercase",
          fontFamily: "'JetBrains Mono', monospace",
          marginBottom: "3rem",
        }}
      >
        {trimmed}
      </div>
    );
  }

  if (isSectionHeader) {
    return (
      <div
        key={`hd-${index}`}
        style={{
          fontSize: "clamp(0.8rem, 2.5vw, 1.3rem)",
          fontWeight: 800,
          letterSpacing: "0.3em",
          color: "oklch(0.88 0.2 90)",
          textTransform: "uppercase",
          fontFamily: "'JetBrains Mono', monospace",
          marginTop: "0.5rem",
          marginBottom: "1rem",
          textShadow: "0 0 20px oklch(0.85 0.18 90 / 0.4)",
        }}
      >
        {trimmed}
      </div>
    );
  }

  if (isDivider) {
    return (
      <div
        key={`div-${index}`}
        style={{
          color: "oklch(0.55 0.12 90)",
          letterSpacing: "0.1em",
          margin: "1.5rem 0",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.9rem",
        }}
      >
        {trimmed}
      </div>
    );
  }

  if (isQuote) {
    return (
      <div
        key={`q-${index}`}
        style={{
          fontSize: "clamp(0.85rem, 2vw, 1.15rem)",
          fontStyle: "italic",
          color: "oklch(0.82 0.16 90)",
          letterSpacing: "0.05em",
          fontFamily: "'JetBrains Mono', monospace",
          margin: "0.4rem 0",
          textShadow: "0 0 15px oklch(0.85 0.18 90 / 0.3)",
        }}
      >
        {trimmed}
      </div>
    );
  }

  return (
    <div
      key={`ln-${index}`}
      style={{
        fontSize: "clamp(0.7rem, 1.8vw, 0.95rem)",
        color: "oklch(0.78 0.1 90)",
        letterSpacing: "0.04em",
        lineHeight: 1.9,
        fontFamily: "'JetBrains Mono', monospace",
        margin: "0.1rem 0",
      }}
    >
      {trimmed}
    </div>
  );
}

export function StoryCredits({ open, onClose }: StoryCreditsProps) {
  const [phase, setPhase] = useState<"idle" | "glow" | "scrolling">("idle");
  const [paused, setPaused] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const [scrollPos, setScrollPos] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const scrollPosRef = useRef<number>(0);
  const pausedRef = useRef<boolean>(false);
  const voiceStartedRef = useRef<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const stopVoice = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    voiceStartedRef.current = false;
  }, []);

  const startVoice = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(CREDITS_TEXT);
    utterance.rate = 0.85;
    utterance.pitch = 0.9;
    utterance.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) =>
        v.name.includes("Google US English") ||
        v.name.includes("Microsoft David") ||
        v.name.includes("Alex") ||
        v.lang === "en-US",
    );
    if (preferred) utterance.voice = preferred;
    window.speechSynthesis.speak(utterance);
    voiceStartedRef.current = true;
  }, []);

  const startScrollAnimation = useCallback(() => {
    const textEl = textRef.current;
    const containerEl = containerRef.current;
    if (!textEl || !containerEl) return;

    const totalHeight = textEl.scrollHeight + containerEl.clientHeight;
    const pxPerMs = totalHeight / 120000;

    const animate = (ts: number) => {
      if (pausedRef.current) {
        lastTimeRef.current = ts;
        rafRef.current = requestAnimationFrame(animate);
        return;
      }
      if (lastTimeRef.current === 0) lastTimeRef.current = ts;
      const delta = ts - lastTimeRef.current;
      lastTimeRef.current = ts;
      scrollPosRef.current += delta * pxPerMs;
      if (scrollPosRef.current >= totalHeight) {
        scrollPosRef.current = 0;
      }
      setScrollPos(scrollPosRef.current);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  const cleanup = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    lastTimeRef.current = 0;
    scrollPosRef.current = 0;
    setScrollPos(0);
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    voiceStartedRef.current = false;
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    setPhase("idle");
    setPaused(false);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally run only when open changes
  useEffect(() => {
    if (!open) {
      cleanup();
      return;
    }

    setPhase("glow");
    scrollPosRef.current = 0;
    setScrollPos(0);
    setPaused(false);
    voiceStartedRef.current = false;

    const ctx = new AudioContext();
    audioCtxRef.current = ctx;

    playFanfare(ctx).then(() => {
      setPhase("scrolling");
      startScrollAnimation();
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = () => startVoice();
      } else {
        startVoice();
      }
    });

    return () => {
      cleanup();
    };
  }, [open]);

  const handlePauseResume = useCallback(() => {
    setPaused((prev) => {
      const next = !prev;
      pausedRef.current = next;
      if (next) {
        if (window.speechSynthesis) window.speechSynthesis.pause();
      } else {
        if (window.speechSynthesis) window.speechSynthesis.resume();
        lastTimeRef.current = 0;
      }
      return next;
    });
  }, []);

  const handleVoiceToggle = useCallback(() => {
    setVoiceOn((prev) => {
      const next = !prev;
      if (!next) {
        stopVoice();
      } else {
        startVoice();
      }
      return next;
    });
  }, [stopVoice, startVoice]);

  const handleClose = useCallback(() => {
    cleanup();
    onClose();
  }, [cleanup, onClose]);

  if (!open && phase === "idle") return null;

  const lines = CREDITS_TEXT.split("\n");

  return (
    <div
      className="fixed inset-0 z-[200] overflow-hidden"
      style={{ background: "#020408" }}
      data-ocid="story.modal"
    >
      {/* Starfield */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={`star-${i}-${(i * 137.5) % 100}`}
            className="absolute rounded-full"
            style={{
              width: i % 7 === 0 ? "2px" : "1px",
              height: i % 7 === 0 ? "2px" : "1px",
              background: "oklch(0.9 0.05 90 / 0.7)",
              left: `${(i * 137.5) % 100}%`,
              top: `${(i * 97.3) % 100}%`,
              animation: `star-twinkle ${2 + (i % 5) * 0.7}s ease-in-out infinite`,
              animationDelay: `${(i * 0.31) % 3}s`,
            }}
          />
        ))}
      </div>

      {/* Watermark */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none"
        style={{ opacity: 0.07 }}
      >
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "clamp(2.5rem, 8vw, 7rem)",
            fontWeight: 900,
            letterSpacing: "0.15em",
            color: "oklch(0.85 0.18 90)",
            lineHeight: 1.15,
            textAlign: "center",
            textTransform: "uppercase",
          }}
        >
          <div>AUDIO TECHNIQUE</div>
          <div>by GERROD</div>
          <div style={{ fontSize: "0.5em", letterSpacing: "0.3em" }}>
            February 19, 2026
          </div>
        </div>
      </div>

      {/* Glow sweep on open */}
      {phase === "glow" && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, oklch(0.85 0.18 90 / 0.25) 0%, transparent 70%)",
            animation: "glow-sweep 1.2s ease-out forwards",
          }}
        />
      )}

      {/* Scrolling text */}
      <div
        ref={containerRef}
        className="absolute inset-0 flex justify-center overflow-hidden"
        style={{ paddingBottom: "80px" }}
      >
        <div
          ref={textRef}
          style={{
            transform: `translateY(${-scrollPos + (containerRef.current?.clientHeight ?? 800)}px)`,
            willChange: "transform",
            textAlign: "center",
            maxWidth: "680px",
            width: "90%",
            paddingTop: "60px",
            paddingBottom: "200px",
          }}
        >
          {lines.map((line, i) => renderLine(line, i))}
        </div>
      </div>

      {/* Top fade */}
      <div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, #020408 0%, transparent 100%)",
        }}
      />

      {/* Bottom fade */}
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          bottom: "72px",
          height: "80px",
          background: "linear-gradient(to top, #020408 0%, transparent 100%)",
        }}
      />

      {/* Controls */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-3 px-4 py-4"
        style={{
          background: "oklch(0.07 0.02 250 / 0.95)",
          borderTop: "1px solid oklch(0.85 0.18 90 / 0.2)",
          backdropFilter: "blur(12px)",
        }}
      >
        <button
          type="button"
          onClick={handlePauseResume}
          data-ocid="story.toggle"
          style={{
            background: paused ? "oklch(0.85 0.18 90 / 0.15)" : "transparent",
            border: "1px solid oklch(0.85 0.18 90 / 0.4)",
            color: "oklch(0.85 0.18 90)",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            padding: "8px 18px",
            cursor: "pointer",
            textTransform: "uppercase",
            transition: "all 0.2s",
          }}
        >
          {paused ? "RESUME" : "PAUSE"}
        </button>

        <button
          type="button"
          onClick={handleVoiceToggle}
          data-ocid="story.voice_toggle"
          style={{
            background: !voiceOn ? "oklch(0.6 0.25 25 / 0.15)" : "transparent",
            border: `1px solid ${
              voiceOn ? "oklch(0.85 0.18 90 / 0.4)" : "oklch(0.6 0.25 25 / 0.5)"
            }`,
            color: voiceOn ? "oklch(0.85 0.18 90)" : "oklch(0.6 0.25 25)",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            padding: "8px 18px",
            cursor: "pointer",
            textTransform: "uppercase",
            transition: "all 0.2s",
          }}
        >
          {voiceOn ? "VOICE ON" : "VOICE OFF"}
        </button>

        <button
          type="button"
          onClick={handleClose}
          data-ocid="story.close_button"
          style={{
            background: "transparent",
            border: "1px solid oklch(0.55 0.07 250 / 0.5)",
            color: "oklch(0.55 0.07 250)",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            padding: "8px 18px",
            cursor: "pointer",
            textTransform: "uppercase",
            transition: "all 0.2s",
          }}
        >
          CLOSE
        </button>
      </div>

      <style>{`
        @keyframes star-twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        @keyframes glow-sweep {
          0% { opacity: 0; }
          20% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
