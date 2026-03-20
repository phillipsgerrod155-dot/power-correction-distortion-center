import re

with open('useAudioEngine.ts', 'r') as f:
    code = f.read()

# Fix 1a: Add noiseReducerRef and signalDriveBoostRef after smoothBoostGainRef declaration
code = code.replace(
    'const smoothBoostGainRef = useRef<GainNode | null>(null);',
    'const smoothBoostGainRef = useRef<GainNode | null>(null);\n  const noiseReducerRef = useRef<DynamicsCompressorNode | null>(null);\n  const signalDriveBoostRef = useRef<GainNode | null>(null);'
)

# Fix 4+5: In ensureContext, after smoothBoostGain creation + wiring, add noiseReducer + signalDriveBoost
# and wire them. Currently: gainBoost.connect(gainAmp); // amp stage (after volume)
# Change to: gainBoost.connect(signalDriveBoost); signalDriveBoost.connect(gainAmp);
code = code.replace(
    '      gainBoost.connect(gainAmp); // amp stage (after volume)',
    '      const signalDriveBoost = ctx.createGain();\n      signalDriveBoost.gain.value = 1.0;\n      signalDriveBoostRef.current = signalDriveBoost;\n      gainBoost.connect(signalDriveBoost); // signal drive booster\n      signalDriveBoost.connect(gainAmp); // amp stage (after volume)'
)

# Fix 4: Add noiseReducer node creation and wiring in ensureContext
# Add it just before the smoothBoostGain creation block
code = code.replace(
    '      // SMOOTH BOOST GAIN',
    '      // SUPER STRONG NOISE REDUCER — kills background hiss/crackle before signal chain\n      const noiseReducer = ctx.createDynamicsCompressor();\n      noiseReducer.threshold.value = -50;\n      noiseReducer.knee.value = 0;\n      noiseReducer.ratio.value = 20;\n      noiseReducer.attack.value = 0.0001;\n      noiseReducer.release.value = 0.01;\n      noiseReducerRef.current = noiseReducer;\n      // Wire noiseReducer to all 3 split inputs\n      noiseReducer.connect(splitGainBass);\n      noiseReducer.connect(splitGainMids);\n      noiseReducer.connect(splitGainHighs);\n\n      // SMOOTH BOOST GAIN'
)

# Fix 4: In play(), connect source to noiseReducer instead of directly to splits
code = code.replace(
    '    source.connect(splitGainBassRef.current ?? gainEngineRef.current!);\n    source.connect(splitGainMidsRef.current ?? gainEngineRef.current!);\n    source.connect(splitGainHighsRef.current ?? gainEngineRef.current!);',
    '    // Source flows through noiseReducer first, which fans out to all 3 split inputs\n    source.connect(noiseReducerRef.current ?? splitGainBassRef.current ?? gainEngineRef.current!);'
)

# Fix 1b: setAmpPowerDrive — remove gainAmpRef write, tighten commanderComp ratio instead
old_setAmpPowerDrive = '''  // setAmpPowerDrive — only function (besides setSpeakerProfile) that writes to gainAmpRef.
  // Level 0 → gainAmp=1.0 (neutral).  Level 100 → gainAmp=2.2 (full power drive).
  const setAmpPowerDrive = useCallback(
    (level: number) => {
      ensureContext();
      ampPowerDriveRef.current = level;
      if (gainAmpRef.current)
        gainAmpRef.current.gain.value = 1.0 + (level / 100) * 1.2;
      if (hardCorrRef.current)
        hardCorrRef.current.threshold.value = -24 + (level / 100) * -4;
      if (srsPresenceRef.current) {
        const basePresence = srsPresenceRef.current.gain.value > 0 ? 3 : 0;
        srsPresenceRef.current.gain.value = basePresence + (level / 100) * 2;
      }
    },
    [ensureContext],
  );'''

new_setAmpPowerDrive = '''  // setAmpPowerDrive — tightens corrections proportionally. gainAmpRef stays at 1.0 always.
  // No raw gain written to amp. Corrections stomp harder as drive level increases.
  const setAmpPowerDrive = useCallback(
    (level: number) => {
      ensureContext();
      ampPowerDriveRef.current = level;
      // gainAmpRef is LOCKED at 1.0 — never written here.
      const strength = level / 100;
      if (hardCorrRef.current) {
        hardCorrRef.current.threshold.value = -24 + strength * -4;
      }
      if (commanderCompRef.current) {
        // Tighten commander ratio proportionally — up to 20:1 at full drive
        commanderCompRef.current.ratio.value = 14 + strength * 6;
      }
      if (srsPresenceRef.current) {
        const basePresence = srsPresenceRef.current.gain.value > 0 ? 3 : 0;
        srsPresenceRef.current.gain.value = basePresence + strength * 2;
      }
    },
    [ensureContext],
  );'''

code = code.replace(old_setAmpPowerDrive, new_setAmpPowerDrive)

# Fix 1c: setSpeakerProfile — remove all ga.gain.value = ... lines
old_setSpeakerProfile = '''  // setSpeakerProfile — intentional user-profile overrides.
  // Only this function and setAmpPowerDrive may write to gainAmpRef.
  const setSpeakerProfile = useCallback(
    (type: "SMALL" | "BIG" | "CAR" | "BLUETOOTH") => {
      const sp = srsPresenceRef.current;
      const sc = srsCompRef.current;
      const bs = bassShelfRef.current;
      const ga = gainAmpRef.current;
      const sbg = splitGainBassRef.current;
      if (type === "SMALL") {
        if (sbg) sbg.gain.value = 0.6;
        if (sp) sp.gain.value = 4;
        if (ga) ga.gain.value = 1.0;
      } else if (type === "BIG") {
        if (sbg) sbg.gain.value = 1.0;
        if (bs) bs.gain.value = 4;
        if (sp) sp.gain.value = 0;
        if (ga) ga.gain.value = 1.2;
      } else if (type === "CAR") {
        if (sbg) sbg.gain.value = 1.0;
        if (bs) bs.gain.value = 4;
        if (ga) ga.gain.value = 1.2;
      } else if (type === "BLUETOOTH") {
        if (sbg) sbg.gain.value = 0.8;
        if (sp) sp.gain.value = 3;
        if (sc) sc.ratio.value = 6;
        if (ga) ga.gain.value = 1.0;
      }
    },
    [],
  );'''

new_setSpeakerProfile = '''  // setSpeakerProfile — intentional user-profile overrides.
  // gainAmpRef stays at 1.0. Only speaker tone/presence/bass adjustments applied.
  const setSpeakerProfile = useCallback(
    (type: "SMALL" | "BIG" | "CAR" | "BLUETOOTH") => {
      const sp = srsPresenceRef.current;
      const sc = srsCompRef.current;
      const bs = bassShelfRef.current;
      const sbg = splitGainBassRef.current;
      // gainAmpRef is LOCKED at 1.0 — never written here.
      if (type === "SMALL") {
        if (sbg) sbg.gain.value = 0.6;
        if (sp) sp.gain.value = 4;
      } else if (type === "BIG") {
        if (sbg) sbg.gain.value = 1.0;
        if (bs) bs.gain.value = 4;
        if (sp) sp.gain.value = 0;
      } else if (type === "CAR") {
        if (sbg) sbg.gain.value = 1.0;
        if (bs) bs.gain.value = 4;
      } else if (type === "BLUETOOTH") {
        if (sbg) sbg.gain.value = 0.8;
        if (sp) sp.gain.value = 3;
        if (sc) sc.ratio.value = 6;
      }
    },
    [],
  );'''

code = code.replace(old_setSpeakerProfile, new_setSpeakerProfile)

# Fix 5: In setBoost, add signalDriveBoost per mode at end of each branch
old_setBoost_signal = '''      if (mode === "SIGNAL") {
        // Tighten hardCorr threshold so corrections stomp harder → naturally louder
        if (hardCorrRef.current) {
          hardCorrRef.current.threshold.value =
            hardCorrBaseThresholdRef.current - strength * 6;
        }
      } else if (mode === "DYNAMIC") {'''

new_setBoost_signal = '''      if (mode === "SIGNAL") {
        // Tighten hardCorr threshold so corrections stomp harder → naturally louder
        if (hardCorrRef.current) {
          hardCorrRef.current.threshold.value =
            hardCorrBaseThresholdRef.current - strength * 6;
        }
        // Clean signal drive booster for SIGNAL mode
        if (signalDriveBoostRef.current)
          signalDriveBoostRef.current.gain.value = 1.0 + strength * 0.15;
      } else if (mode === "DYNAMIC") {'''

code = code.replace(old_setBoost_signal, new_setBoost_signal)

old_setBoost_dynamic = '''      } else if (mode === "DYNAMIC") {
        // Tighten monitorComp attack/release for pump-free perceived loudness
        if (monitorCompRef.current) {
          monitorCompRef.current.attack.value = Math.max(
            0.0005,
            0.001 - strength * 0.0005,
          );
          monitorCompRef.current.release.value = Math.max(
            0.05,
            0.1 - strength * 0.05,
          );
        }
      } else if (mode === "PRESENCE") {'''

new_setBoost_dynamic = '''      } else if (mode === "DYNAMIC") {
        // Tighten monitorComp attack/release for pump-free perceived loudness
        if (monitorCompRef.current) {
          monitorCompRef.current.attack.value = Math.max(
            0.0005,
            0.001 - strength * 0.0005,
          );
          monitorCompRef.current.release.value = Math.max(
            0.05,
            0.1 - strength * 0.05,
          );
        }
        // Clean signal drive booster for DYNAMIC mode
        if (signalDriveBoostRef.current)
          signalDriveBoostRef.current.gain.value = 1.0 + strength * 0.1;
      } else if (mode === "PRESENCE") {'''

code = code.replace(old_setBoost_dynamic, new_setBoost_dynamic)

old_setBoost_presence = '''      } else if (mode === "PRESENCE") {
        // Boost engineAPresence and engineCPresence for mid-range clarity
        if (engineAPresenceRef.current)
          engineAPresenceRef.current.gain.value = strength * 5;
        if (engineCPresenceRef.current)
          engineCPresenceRef.current.gain.value = strength * 4;
      }'''

new_setBoost_presence = '''      } else if (mode === "PRESENCE") {
        // Boost engineAPresence and engineCPresence for mid-range clarity
        if (engineAPresenceRef.current)
          engineAPresenceRef.current.gain.value = strength * 5;
        if (engineCPresenceRef.current)
          engineCPresenceRef.current.gain.value = strength * 4;
        // Clean signal drive booster for PRESENCE mode
        if (signalDriveBoostRef.current)
          signalDriveBoostRef.current.gain.value = 1.0 + strength * 0.12;
      }'''

code = code.replace(old_setBoost_presence, new_setBoost_presence)

# Fix 5: In setDriveMode, reset signalDriveBoostRef to 1.0
old_setDriveMode = '''      driveModeRef.current = mode;
      // Reset previous mode effects back to baseline
      if (hardCorrRef.current)
        hardCorrRef.current.threshold.value = hardCorrBaseThresholdRef.current;
      if (monitorCompRef.current) {
        monitorCompRef.current.attack.value = 0.001;
        monitorCompRef.current.release.value = 0.1;
      }
      // Don't reset engineAPresence/C if engines are on — setBoost will re-apply'''

new_setDriveMode = '''      driveModeRef.current = mode;
      // Reset previous mode effects back to baseline
      if (hardCorrRef.current)
        hardCorrRef.current.threshold.value = hardCorrBaseThresholdRef.current;
      if (monitorCompRef.current) {
        monitorCompRef.current.attack.value = 0.001;
        monitorCompRef.current.release.value = 0.1;
      }
      // Reset signal drive booster to neutral when switching modes
      if (signalDriveBoostRef.current)
        signalDriveBoostRef.current.gain.value = 1.0;
      // Don't reset engineAPresence/C if engines are on — setBoost will re-apply'''

code = code.replace(old_setDriveMode, new_setDriveMode)

with open('useAudioEngine.ts', 'w') as f:
    f.write(code)

print("Done")
