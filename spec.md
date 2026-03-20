# Power Correction Distortion Center

## Current State
Version 41 deployed. Deploy 1 complete: phantom gain stripped, 4 gauge wire, 250W correction fuses, 2x150W amp fuses, super strong noise reducer, Clean Signal Drive per-mode boosters, DB meter fixed (flat in silence).

## Requested Changes (Diff)

### Add
- Nothing new to add

### Modify
- **Deploy 2 - Fix 7:** DB Node Indicator fully live -- wire it to the real-time analyser so distortion, clipping, and noise floor values react to every beat
- **Deploy 2 - Fix 8:** Corrections scale pushed all the way to 150 -- ensure correction scale and 150 Billion fuse milestones climb to full 150, not stopping at 110 or 130
- **Deploy 2 - Fix 9:** Kick Drum sliders fully wired -- Thump, Kick dB, and 80Hz SAFT Drop sliders fully send their values to the audio engine in real time

### Remove
- Nothing

## Implementation Plan
1. Wire DbNodeIndicator to live analyser data (distortion RMS, clipping detection, noise floor)
2. Fix CorrectionForceDisplay and MasterFuse150B so correction scale and 150B fuse milestones climb all the way to 150 based on volume and liveDb
3. Verify KickDrum component's sliders (thump, kick, drop) fully fire audioEngine.setKickThump, setKickKick, setKickDrop on every change
