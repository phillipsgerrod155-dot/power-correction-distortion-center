# Power Correction Distortion Center

## Current State
Version 43 deployed. Contains all major features from the build history including corrections, fuse board, amp, EQ, clean signal drive, etc.

## Requested Changes (Diff)

### Add
- Auto Speaker Analyzer panel: 9 stages, 2.1 second delay, must hit 12.1 rating before music plays, ONN RUGGED locked to 4Ω
- Power switch color update: GREEN = off, BLUE = on
- 15-minute recharge warning in battery/power display
- Titanium amp visual upgrade: 16 animated heatsink fins, GP badge, 70,000W base x 90 multiplier = 6,300,000W total, 4 channels each 1,575,000W
- dB meter fix: TRUE GREEN only, shows zero/flat in silence
- Smooth Loud Booster 3 color zones: green/gold/bright gold
- 12-band EQ extending from 32Hz through 20kHz

### Modify
- Corrections order locked to: Easy Limitor, System Clean Drive, Stabilizer, Stabilizer Helper, Monitor, Commander, Brick Wall Helper, Brick Wall, Titanium Overdrive
- Each correction fuse labeled 250W
- dB meter must show zero/flat in silence (no phantom movement)

### Remove
- Nothing removed

## Implementation Plan
1. Add AutoSpeakerAnalyzer component with 9-stage analysis, 2.1s delay, 12.1 rating threshold, ONN RUGGED 4Ω lock
2. Update PowerSwitch to GREEN=off, BLUE=on
3. Add 15-minute recharge warning to BatteryCharger/PowerDisplay
4. Update AmpPanel with heatsink animation (16 fins), GP badge, correct wattage display
5. Fix DbMeter to show TRUE GREEN only and zero in silence
6. Update SmoothLoudBooster with 3 color zones (green/gold/bright gold)
7. Extend Equalizer to 12 bands: 32Hz, 64Hz, 125Hz, 250Hz, 500Hz, 1kHz, 2kHz, 4kHz, 8kHz, 12kHz, 16kHz, 20kHz
8. Lock correction order display in CorrectionSystem
