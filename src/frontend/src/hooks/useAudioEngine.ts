import { useCallback, useRef, useState } from "react";

export interface AudioEngineAPI {
  isPlaying: boolean;
  loadAudio: (file: File) => Promise<void>;
  play: () => void;
  pause: () => void;
  fireKick: () => void;
  setVolume: (v: number) => void;
  setBoost: (v: number) => void;
  setDriveMode: (mode: "SIGNAL" | "DYNAMIC" | "PRESENCE") => void;
  setBrickWall: (threshold: number) => void;
  setEqBand: (band: number, gainDb: number) => void;
  setEqEnabled: (enabled: boolean, bands: number[]) => void;
  getAnalyserData: () => { live: number; peak: number };
  getNodeData: () => {
    distortion: number;
    clipping: number;
    noiseFloor: number;
  };
  setTitaniumOn: (on: boolean) => void;
  setFrontStageOn: (on: boolean, intensity: number) => void;
  setChannels: (
    highs: boolean,
    mids: boolean,
    bass: boolean,
    tweeters: boolean,
  ) => void;
  setSRSChipOn: (on: boolean) => void;
  setBassLevel: (level: number) => void;
  setActiveCorrectionCount: (count: number) => void;
  setBullhornOn: (on: boolean) => void;
  setSmallSpeakerOn: (on: boolean) => void;
  setSoundMagnetOn: (on: boolean) => void;
  setAudioSensorOn: (on: boolean) => void;
  setAmpPowerDrive: (level: number) => void;
  setSpeakerProfile: (type: "SMALL" | "BIG" | "CAR" | "BLUETOOTH") => void;
  setCrossoverBassNote: (hz: number) => void;
  setEngineOn: (index: number, on: boolean) => void;
  setKickThump: (db: number) => void;
  setKickKick: (db: number) => void;
  setKickDrop: (db: number) => void;
  setHz80Drop: (db: number) => void;
  setRadiatorPressure: (left: number, right: number) => void;
  setSmartFuseLow: (load: number) => void;
  setSmartFuseMids: (hz: number) => void;
  setSmartFuseHighs: (load: number) => void;
  setSmoothWarmLow: () => void;
  setVolumeSmooth: (dbLevel: number) => void;
  setLowShelfGain: (gainDb: number) => void;
  setSmoothBoost: (multiplier: number) => void;
}

export function useAudioEngine(): AudioEngineAPI {
  const [isPlaying, setIsPlaying] = useState(false);

  const ctxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // VOLUME NODE — written ONLY by setVolume(). Nothing else touches this.
  // Battery does NOT write here. Amp does NOT write here.
  const gainVolumeRef = useRef<GainNode | null>(null);
  // EASY LIMITER +1dB — sits right after volume, written only by setBoost()
  const gainBoostRef = useRef<GainNode | null>(null);

  const gainEngineRef = useRef<GainNode | null>(null);

  // AMP STAGE — final output node, wired AFTER gainBoost (after volume stage).
  // Default: 1.0 (neutral). Written ONLY by setAmpPowerDrive() and setSpeakerProfile().
  // Battery NEVER writes here. Corrections NEVER write here.
  const gainAmpRef = useRef<GainNode | null>(null);
  const ampPowerDriveRef = useRef<number>(0);
  const smoothBoostGainRef = useRef<GainNode | null>(null);
  const noiseReducerRef = useRef<DynamicsCompressorNode | null>(null);
  const signalDriveBoostRef = useRef<GainNode | null>(null);

  const hardCorrRef = useRef<DynamicsCompressorNode | null>(null);
  const brickWallRef = useRef<DynamicsCompressorNode | null>(null);
  const titaniumLimiterRef = useRef<DynamicsCompressorNode | null>(null);
  const eqBandsRef = useRef<BiquadFilterNode[]>([]);
  const lowShelfRef = useRef<BiquadFilterNode | null>(null);
  const highShelfSmoothRef = useRef<BiquadFilterNode | null>(null);
  const autoToneCompRef = useRef<DynamicsCompressorNode | null>(null);

  const splitGainBassRef = useRef<GainNode | null>(null);
  const splitGainMidsRef = useRef<GainNode | null>(null);
  const splitGainHighsRef = useRef<GainNode | null>(null);

  const bassIsoLP1Ref = useRef<BiquadFilterNode | null>(null);
  const bassIsoLP2Ref = useRef<BiquadFilterNode | null>(null);
  const kickThumpFilterRef = useRef<BiquadFilterNode | null>(null);
  const kickKickFilterRef = useRef<BiquadFilterNode | null>(null);
  const kickDropFilterRef = useRef<BiquadFilterNode | null>(null);
  const hz80DropFilterRef = useRef<BiquadFilterNode | null>(null);
  const radiatorLowpassRef = useRef<BiquadFilterNode | null>(null);
  const bassShelfRef = useRef<BiquadFilterNode | null>(null);
  const channelBassRef = useRef<BiquadFilterNode | null>(null);
  const commanderCompRef = useRef<DynamicsCompressorNode | null>(null);
  const gainCorrectionGainRef = useRef<GainNode | null>(null);
  const crossoverLowpassRef = useRef<BiquadFilterNode | null>(null);
  const gainBassOutRef = useRef<GainNode | null>(null);

  const midsIsoHPRef = useRef<BiquadFilterNode | null>(null);
  const midsIsoLPRef = useRef<BiquadFilterNode | null>(null);
  const channelMidsRef = useRef<BiquadFilterNode | null>(null);
  const smartFuseMidRef = useRef<BiquadFilterNode | null>(null);
  const monitorCompRef = useRef<DynamicsCompressorNode | null>(null);
  const stabilizerFilterRef = useRef<BiquadFilterNode | null>(null);
  const gainMidsOutRef = useRef<GainNode | null>(null);

  const highsIsoHP1Ref = useRef<BiquadFilterNode | null>(null);
  const highsIsoHP2Ref = useRef<BiquadFilterNode | null>(null);
  const channelHighsRef = useRef<BiquadFilterNode | null>(null);
  const channelTweetersRef = useRef<BiquadFilterNode | null>(null);
  const srsCompRef = useRef<DynamicsCompressorNode | null>(null);
  const srsPresenceRef = useRef<BiquadFilterNode | null>(null);
  const srsBassCleanRef = useRef<BiquadFilterNode | null>(null);
  const frontstageRef = useRef<BiquadFilterNode | null>(null);
  const bullhornBandpassRef = useRef<BiquadFilterNode | null>(null);
  const bullhornPresenceRef = useRef<BiquadFilterNode | null>(null);
  const smallSpeakerHPRef = useRef<BiquadFilterNode | null>(null);
  const smallSpeakerPresRef = useRef<BiquadFilterNode | null>(null);
  const soundMagnetRef = useRef<BiquadFilterNode | null>(null);
  const audioSensorCompRef = useRef<DynamicsCompressorNode | null>(null);
  const engineAPresenceRef = useRef<BiquadFilterNode | null>(null);
  const engineBCompRef = useRef<DynamicsCompressorNode | null>(null);
  const engineCPresenceRef = useRef<BiquadFilterNode | null>(null);
  const engineDFilterRef = useRef<BiquadFilterNode | null>(null);
  const signalCleanerHPRef = useRef<BiquadFilterNode | null>(null);
  const gainHighsOutRef = useRef<GainNode | null>(null);

  const hardCorrBaseThresholdRef = useRef<number>(-24);
  const noiseFloorBufferRef = useRef<number[]>([]);
  const bassLevelRef = useRef<number>(80);
  const titaniumOnRef = useRef<boolean>(false);
  const pauseOffsetRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const peakRef = useRef<number>(85);
  const peakDecayRef = useRef<number>(0);
  const engineStatesRef = useRef<boolean[]>([false, false, false, false]);
  const _bassD4Ref = useRef<number>(0);
  const warmLowShelfRef = useRef<BiquadFilterNode | null>(null);
  const warmLowWiredRef = useRef<boolean>(false);
  const srsHarshnessNotchRef = useRef<BiquadFilterNode | null>(null);

  const ensureContext = useCallback(() => {
    if (!ctxRef.current) {
      const ctx = new AudioContext();
      ctxRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.6;

      const gainEngine = ctx.createGain();
      gainEngine.gain.value = 0.35;

      // Hard Correction 985 billion — stomps first in chain
      const hardCorr = ctx.createDynamicsCompressor();
      hardCorr.threshold.value = -28;
      hardCorr.knee.value = 0;
      hardCorr.ratio.value = 20;
      hardCorr.attack.value = 0.001;
      hardCorr.release.value = 0.05;

      // Brick Wall — holds ceiling, Stabilizer Helper smooths it
      const brickWall = ctx.createDynamicsCompressor();
      brickWall.threshold.value = -1.0;
      brickWall.knee.value = 0;
      brickWall.ratio.value = 20;
      brickWall.attack.value = 0.001;
      brickWall.release.value = 0.1;

      // Titanium Limiter — lets loudness through, blocks at max
      const titaniumLimiter = ctx.createDynamicsCompressor();
      titaniumLimiter.threshold.value = -0.1;
      titaniumLimiter.knee.value = 0;
      titaniumLimiter.ratio.value = 20;
      titaniumLimiter.attack.value = 0.001;
      titaniumLimiter.release.value = 0.05;

      const highShelfSmooth = ctx.createBiquadFilter();
      highShelfSmooth.type = "peaking";
      highShelfSmooth.frequency.value = 11000;
      highShelfSmooth.Q.value = 0.6;
      highShelfSmooth.gain.value = -2;

      const autoToneComp = ctx.createDynamicsCompressor();
      autoToneComp.threshold.value = -6;
      autoToneComp.knee.value = 20;
      autoToneComp.ratio.value = 1.2;
      autoToneComp.attack.value = 0.003;
      autoToneComp.release.value = 0.15;

      // USER VOLUME — written ONLY by setVolume().
      // v=0→0, v=30≈0.117, v=50≈0.30, v=75≈0.62, v=100→1.0
      const gainVol = ctx.createGain();
      gainVol.gain.value = 0.3 ** 1.7;

      // Easy Limiter +1dB — lets loudness through, written only by setBoost()
      const gainBoost = ctx.createGain();
      gainBoost.gain.value = 1.122;

      // AMP STAGE — final output, wired AFTER gainBoost.
      // Default 1.0 (neutral). Only setAmpPowerDrive / setSpeakerProfile write here.
      // Battery NEVER writes here.
      const gainAmp = ctx.createGain();
      gainAmp.gain.value = 1.0;

      const freqs = [
        40, 60, 100, 150, 250, 500, 1000, 2000, 4000, 8000, 16000, 12000,
      ];
      const eqs = freqs.map((freq, idx) => {
        const f = ctx.createBiquadFilter();
        f.type = "peaking";
        f.frequency.value = freq;
        f.Q.value = idx <= 4 ? 1.4 : idx <= 8 ? 1.2 : 0.6;
        f.gain.value = 0;
        return f;
      });

      const lowShelf = ctx.createBiquadFilter();
      lowShelf.type = "lowshelf";
      lowShelf.frequency.value = 80;
      lowShelf.gain.value = 1.5;

      const splitGainBass = ctx.createGain();
      splitGainBass.gain.value = 1.0;
      const splitGainMids = ctx.createGain();
      splitGainMids.gain.value = 1.0;
      const splitGainHighs = ctx.createGain();
      splitGainHighs.gain.value = 1.0;

      const bassIsoLP1 = ctx.createBiquadFilter();
      bassIsoLP1.type = "lowpass";
      bassIsoLP1.frequency.value = 200;
      bassIsoLP1.Q.value = 2.0;
      const bassIsoLP2 = ctx.createBiquadFilter();
      bassIsoLP2.type = "lowpass";
      bassIsoLP2.frequency.value = 200;
      bassIsoLP2.Q.value = 2.0;

      const kickThumpFilter = ctx.createBiquadFilter();
      kickThumpFilter.type = "lowshelf";
      kickThumpFilter.frequency.value = 60;
      kickThumpFilter.gain.value = 0;
      const kickKickFilter = ctx.createBiquadFilter();
      kickKickFilter.type = "peaking";
      kickKickFilter.frequency.value = 100;
      kickKickFilter.Q.value = 1.2;
      kickKickFilter.gain.value = 0;
      const kickDropFilter = ctx.createBiquadFilter();
      kickDropFilter.type = "peaking";
      kickDropFilter.frequency.value = 80;
      kickDropFilter.Q.value = 1.0;
      kickDropFilter.gain.value = 0;

      // 80Hz DROP PROGRAM — silent until user moves slider
      const hz80DropFilter = ctx.createBiquadFilter();
      hz80DropFilter.type = "peaking";
      hz80DropFilter.frequency.value = 80;
      hz80DropFilter.Q.value = 1.2;
      hz80DropFilter.gain.value = 0;

      const radiatorLowpass = ctx.createBiquadFilter();
      radiatorLowpass.type = "lowshelf";
      radiatorLowpass.frequency.value = 120;
      radiatorLowpass.gain.value = 0;
      const bassShelf = ctx.createBiquadFilter();
      bassShelf.type = "lowshelf";
      bassShelf.frequency.value = 150;
      bassShelf.gain.value = 0;
      const channelBass = ctx.createBiquadFilter();
      channelBass.type = "lowpass";
      channelBass.frequency.value = 200;
      channelBass.Q.value = 1.0;
      const crossoverLowpass = ctx.createBiquadFilter();
      crossoverLowpass.type = "lowpass";
      crossoverLowpass.frequency.value = 80;
      crossoverLowpass.Q.value = 1.5;

      const commanderComp = ctx.createDynamicsCompressor();
      commanderComp.threshold.value = -28;
      commanderComp.knee.value = 4;
      commanderComp.ratio.value = 14;
      commanderComp.attack.value = 0.002;
      commanderComp.release.value = 0.15;
      const gainCorrectionGain = ctx.createGain();
      gainCorrectionGain.gain.value = 1.0;
      const gainBassOut = ctx.createGain();
      gainBassOut.gain.value = 1.0;

      const midsIsoHP = ctx.createBiquadFilter();
      midsIsoHP.type = "highpass";
      midsIsoHP.frequency.value = 200;
      midsIsoHP.Q.value = 2.0;
      const midsIsoLP = ctx.createBiquadFilter();
      midsIsoLP.type = "lowpass";
      midsIsoLP.frequency.value = 4000;
      midsIsoLP.Q.value = 2.0;
      const channelMids = ctx.createBiquadFilter();
      channelMids.type = "peaking";
      channelMids.frequency.value = 1000;
      channelMids.Q.value = 0.5;
      channelMids.gain.value = 0;
      const smartFuseMid = ctx.createBiquadFilter();
      smartFuseMid.type = "peaking";
      smartFuseMid.frequency.value = 1000;
      smartFuseMid.Q.value = 1.5;
      smartFuseMid.gain.value = 0;
      const monitorComp = ctx.createDynamicsCompressor();
      monitorComp.threshold.value = -22;
      monitorComp.knee.value = 8;
      monitorComp.ratio.value = 10;
      monitorComp.attack.value = 0.001;
      monitorComp.release.value = 0.1;
      const stabilizerFilter = ctx.createBiquadFilter();
      stabilizerFilter.type = "peaking";
      stabilizerFilter.frequency.value = 800;
      stabilizerFilter.Q.value = 2.0;
      stabilizerFilter.gain.value = 0;
      const gainMidsOut = ctx.createGain();
      gainMidsOut.gain.value = 1.0;

      const highsIsoHP1 = ctx.createBiquadFilter();
      highsIsoHP1.type = "highpass";
      highsIsoHP1.frequency.value = 4000;
      highsIsoHP1.Q.value = 2.0;
      const highsIsoHP2 = ctx.createBiquadFilter();
      highsIsoHP2.type = "highpass";
      highsIsoHP2.frequency.value = 4000;
      highsIsoHP2.Q.value = 2.0;
      const channelHighs = ctx.createBiquadFilter();
      channelHighs.type = "highshelf";
      channelHighs.frequency.value = 4000;
      channelHighs.gain.value = 0;
      const channelTweeters = ctx.createBiquadFilter();
      channelTweeters.type = "highshelf";
      channelTweeters.frequency.value = 10000;
      channelTweeters.gain.value = 0;
      const srsComp = ctx.createDynamicsCompressor();
      srsComp.threshold.value = -20;
      srsComp.knee.value = 10;
      srsComp.ratio.value = 1;
      srsComp.attack.value = 0.003;
      srsComp.release.value = 0.1;
      const srsPresence = ctx.createBiquadFilter();
      srsPresence.type = "peaking";
      srsPresence.frequency.value = 6000;
      srsPresence.Q.value = 1.0;
      srsPresence.gain.value = 0;
      const srsHarshnessNotch = ctx.createBiquadFilter();
      srsHarshnessNotch.type = "peaking";
      srsHarshnessNotch.frequency.value = 9000;
      srsHarshnessNotch.Q.value = 2.5;
      srsHarshnessNotch.gain.value = -2;
      const srsBassClean = ctx.createBiquadFilter();
      srsBassClean.type = "highpass";
      srsBassClean.frequency.value = 4000;
      srsBassClean.Q.value = 0.7;
      const frontstage = ctx.createBiquadFilter();
      frontstage.type = "peaking";
      frontstage.frequency.value = 5000;
      frontstage.Q.value = 0.8;
      frontstage.gain.value = 0;
      const bullhornBandpass = ctx.createBiquadFilter();
      bullhornBandpass.type = "peaking";
      bullhornBandpass.frequency.value = 5000;
      bullhornBandpass.Q.value = 0.5;
      bullhornBandpass.gain.value = 0;
      const bullhornPresence = ctx.createBiquadFilter();
      bullhornPresence.type = "peaking";
      bullhornPresence.frequency.value = 8000;
      bullhornPresence.Q.value = 1.0;
      bullhornPresence.gain.value = 0;
      const smallSpeakerHP = ctx.createBiquadFilter();
      smallSpeakerHP.type = "highpass";
      smallSpeakerHP.frequency.value = 4000;
      smallSpeakerHP.Q.value = 0.7;
      const smallSpeakerPres = ctx.createBiquadFilter();
      smallSpeakerPres.type = "peaking";
      smallSpeakerPres.frequency.value = 7000;
      smallSpeakerPres.Q.value = 1.2;
      smallSpeakerPres.gain.value = 0;
      const soundMagnet = ctx.createBiquadFilter();
      soundMagnet.type = "peaking";
      soundMagnet.frequency.value = 8000;
      soundMagnet.Q.value = 0.3;
      soundMagnet.gain.value = 0;
      const audioSensorComp = ctx.createDynamicsCompressor();
      audioSensorComp.threshold.value = -30;
      audioSensorComp.knee.value = 6;
      audioSensorComp.ratio.value = 1;
      audioSensorComp.attack.value = 0.0005;
      audioSensorComp.release.value = 0.05;
      const engineAPresence = ctx.createBiquadFilter();
      engineAPresence.type = "peaking";
      engineAPresence.frequency.value = 2500;
      engineAPresence.Q.value = 1.2;
      engineAPresence.gain.value = 0;
      const engineBComp = ctx.createDynamicsCompressor();
      engineBComp.threshold.value = -30;
      engineBComp.knee.value = 4;
      engineBComp.ratio.value = 16;
      engineBComp.attack.value = 0.002;
      engineBComp.release.value = 0.12;
      const engineCPresence = ctx.createBiquadFilter();
      engineCPresence.type = "peaking";
      engineCPresence.frequency.value = 2000;
      engineCPresence.Q.value = 1.0;
      engineCPresence.gain.value = 0;
      const engineDFilter = ctx.createBiquadFilter();
      engineDFilter.type = "peaking";
      engineDFilter.frequency.value = 80;
      engineDFilter.Q.value = 1.2;
      engineDFilter.gain.value = 0;
      const signalCleanerHP = ctx.createBiquadFilter();
      signalCleanerHP.type = "highpass";
      signalCleanerHP.frequency.value = 4000;
      signalCleanerHP.Q.value = 0.5;
      const gainHighsOut = ctx.createGain();
      gainHighsOut.gain.value = 1.0;

      // Store refs
      analyserRef.current = analyser;
      gainVolumeRef.current = gainVol;
      gainBoostRef.current = gainBoost;
      gainEngineRef.current = gainEngine;
      gainAmpRef.current = gainAmp;
      hardCorrRef.current = hardCorr;
      brickWallRef.current = brickWall;
      titaniumLimiterRef.current = titaniumLimiter;
      highShelfSmoothRef.current = highShelfSmooth;
      srsHarshnessNotchRef.current = srsHarshnessNotch;
      autoToneCompRef.current = autoToneComp;
      eqBandsRef.current = eqs;
      lowShelfRef.current = lowShelf;
      splitGainBassRef.current = splitGainBass;
      splitGainMidsRef.current = splitGainMids;
      splitGainHighsRef.current = splitGainHighs;
      bassIsoLP1Ref.current = bassIsoLP1;
      bassIsoLP2Ref.current = bassIsoLP2;
      kickThumpFilterRef.current = kickThumpFilter;
      kickKickFilterRef.current = kickKickFilter;
      kickDropFilterRef.current = kickDropFilter;
      hz80DropFilterRef.current = hz80DropFilter;
      radiatorLowpassRef.current = radiatorLowpass;
      bassShelfRef.current = bassShelf;
      channelBassRef.current = channelBass;
      crossoverLowpassRef.current = crossoverLowpass;
      commanderCompRef.current = commanderComp;
      gainCorrectionGainRef.current = gainCorrectionGain;
      gainBassOutRef.current = gainBassOut;
      midsIsoHPRef.current = midsIsoHP;
      midsIsoLPRef.current = midsIsoLP;
      channelMidsRef.current = channelMids;
      smartFuseMidRef.current = smartFuseMid;
      monitorCompRef.current = monitorComp;
      stabilizerFilterRef.current = stabilizerFilter;
      gainMidsOutRef.current = gainMidsOut;
      highsIsoHP1Ref.current = highsIsoHP1;
      highsIsoHP2Ref.current = highsIsoHP2;
      channelHighsRef.current = channelHighs;
      channelTweetersRef.current = channelTweeters;
      srsCompRef.current = srsComp;
      srsPresenceRef.current = srsPresence;
      srsBassCleanRef.current = srsBassClean;
      frontstageRef.current = frontstage;
      bullhornBandpassRef.current = bullhornBandpass;
      bullhornPresenceRef.current = bullhornPresence;
      smallSpeakerHPRef.current = smallSpeakerHP;
      smallSpeakerPresRef.current = smallSpeakerPres;
      soundMagnetRef.current = soundMagnet;
      audioSensorCompRef.current = audioSensorComp;
      engineAPresenceRef.current = engineAPresence;
      engineBCompRef.current = engineBComp;
      engineCPresenceRef.current = engineCPresence;
      engineDFilterRef.current = engineDFilter;
      signalCleanerHPRef.current = signalCleanerHP;
      gainHighsOutRef.current = gainHighsOut;

      // BASS BAND
      splitGainBass.connect(bassIsoLP1);
      bassIsoLP1.connect(bassIsoLP2);
      bassIsoLP2.connect(kickThumpFilter);
      kickThumpFilter.connect(kickKickFilter);
      kickKickFilter.connect(kickDropFilter);
      kickDropFilter.connect(hz80DropFilter);
      hz80DropFilter.connect(radiatorLowpass);
      radiatorLowpass.connect(bassShelf);
      bassShelf.connect(channelBass);
      channelBass.connect(commanderComp);
      commanderComp.connect(gainCorrectionGain);
      gainCorrectionGain.connect(gainBassOut);
      gainBassOut.connect(gainEngine);

      // MIDS BAND
      splitGainMids.connect(midsIsoHP);
      midsIsoHP.connect(midsIsoLP);
      midsIsoLP.connect(channelMids);
      channelMids.connect(smartFuseMid);
      smartFuseMid.connect(monitorComp);
      monitorComp.connect(stabilizerFilter);
      stabilizerFilter.connect(gainMidsOut);
      gainMidsOut.connect(gainEngine);

      // HIGHS BAND
      splitGainHighs.connect(highsIsoHP1);
      highsIsoHP1.connect(highsIsoHP2);
      highsIsoHP2.connect(channelHighs);
      channelHighs.connect(channelTweeters);
      channelTweeters.connect(srsComp);
      srsComp.connect(srsPresence);
      srsPresence.connect(srsHarshnessNotch);
      srsHarshnessNotch.connect(srsBassClean);
      srsBassClean.connect(frontstage);
      frontstage.connect(bullhornBandpass);
      bullhornBandpass.connect(bullhornPresence);
      bullhornPresence.connect(smallSpeakerHP);
      smallSpeakerHP.connect(smallSpeakerPres);
      smallSpeakerPres.connect(soundMagnet);
      soundMagnet.connect(audioSensorComp);
      audioSensorComp.connect(engineAPresence);
      engineAPresence.connect(engineBComp);
      engineBComp.connect(engineCPresence);
      engineCPresence.connect(engineDFilter);
      engineDFilter.connect(signalCleanerHP);
      signalCleanerHP.connect(gainHighsOut);
      gainHighsOut.connect(gainEngine);

      // MASTER OUTPUT CHAIN
      //
      //  gainEngine (freq bands merge here)
      //    → hardCorr  (Hard Correction 985B)
      //    → EQ bands
      //    → lowShelf
      //    → brickWall  (Brick Wall + Stabilizer Helper)
      //    → autoToneComp
      //    → highShelfSmooth
      //    → titaniumLimiter  (lets loudness through, blocks max)
      //    → gainVol          ← USER SLIDER ONLY — nothing else writes here
      //    → gainBoost        ← Easy Limiter +1dB
      //    → gainAmp          ← AMP STAGE — only setAmpPowerDrive / setSpeakerProfile write here
      //    → analyser
      //    → destination
      //
      //  Battery → powers system/app. Zero connection to gainVol or gainAmp.
      //
      gainEngine.connect(hardCorr);
      hardCorr.connect(eqs[0]);
      for (let i = 0; i < eqs.length - 1; i++) eqs[i].connect(eqs[i + 1]);
      eqs[eqs.length - 1].connect(lowShelf);
      lowShelf.connect(brickWall);
      brickWall.connect(autoToneComp);
      autoToneComp.connect(highShelfSmooth);
      highShelfSmooth.connect(titaniumLimiter);
      titaniumLimiter.connect(gainVol); // volume node starts here
      gainVol.connect(gainBoost); // Easy Limiter +1dB
      const signalDriveBoost = ctx.createGain();
      signalDriveBoost.gain.value = 1.0;
      signalDriveBoostRef.current = signalDriveBoost;
      gainBoost.connect(signalDriveBoost); // signal drive booster
      signalDriveBoost.connect(gainAmp); // amp stage (after volume)

      // SUPER STRONG NOISE REDUCER — kills background hiss/crackle before signal chain
      const noiseReducer = ctx.createDynamicsCompressor();
      noiseReducer.threshold.value = -50;
      noiseReducer.knee.value = 0;
      noiseReducer.ratio.value = 20;
      noiseReducer.attack.value = 0.0001;
      noiseReducer.release.value = 0.01;
      noiseReducerRef.current = noiseReducer;
      // Wire noiseReducer to all 3 split inputs
      noiseReducer.connect(splitGainBass);
      noiseReducer.connect(splitGainMids);
      noiseReducer.connect(splitGainHighs);

      // SMOOTH BOOST GAIN — clean multiplier 1.0x→1.5x, sits after amp before analyser
      const smoothBoostGain = ctx.createGain();
      smoothBoostGain.gain.value = 1.0;
      smoothBoostGainRef.current = smoothBoostGain;

      gainAmp.connect(smoothBoostGain);
      smoothBoostGain.connect(analyser);
      analyser.connect(ctx.destination);
    }
    return ctxRef.current;
  }, []);

  const loadAudio = useCallback(
    async (file: File) => {
      const ctx = ensureContext();
      const arrayBuffer = await file.arrayBuffer();
      bufferRef.current = await ctx.decodeAudioData(arrayBuffer);
      pauseOffsetRef.current = 0;
    },
    [ensureContext],
  );

  const play = useCallback(() => {
    const ctx = ensureContext();
    if (!bufferRef.current) return;
    if (sourceRef.current) {
      sourceRef.current.stop();
      sourceRef.current.disconnect();
    }
    const source = ctx.createBufferSource();
    source.buffer = bufferRef.current;
    source.loop = true;
    // Source flows through noiseReducer first, which fans out to all 3 split inputs
    source.connect(
      noiseReducerRef.current ??
        splitGainBassRef.current ??
        gainEngineRef.current!,
    );
    source.start(0, pauseOffsetRef.current % bufferRef.current.duration);
    startTimeRef.current = ctx.currentTime - pauseOffsetRef.current;
    sourceRef.current = source;
    source.onended = () => setIsPlaying(false);
    setIsPlaying(true);
  }, [ensureContext]);

  const pause = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx || !sourceRef.current) return;
    pauseOffsetRef.current = ctx.currentTime - startTimeRef.current;
    sourceRef.current.stop();
    sourceRef.current = null;
    setIsPlaying(false);
  }, []);

  const fireKick = useCallback(() => {
    const ctx = ensureContext();
    const osc = ctx.createOscillator();
    const kickGain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.5);
    kickGain.gain.setValueAtTime(1.5, ctx.currentTime);
    kickGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.connect(kickGain);
    kickGain.connect(splitGainBassRef.current ?? gainEngineRef.current!);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  }, [ensureContext]);

  // setVolume — THE ONLY writer to gainVolumeRef.
  const setVolume = useCallback(
    (v: number) => {
      ensureContext();
      if (gainVolumeRef.current) {
        gainVolumeRef.current.gain.value = (v / 100) ** 1.7;
      }
    },
    [ensureContext],
  );

  // driveModeRef tracks current drive mode for setBoost
  const driveModeRef = useRef<"SIGNAL" | "DYNAMIC" | "PRESENCE">("SIGNAL");

  // setBoost — CLEAN SIGNAL DRIVE. gainBoostRef is LOCKED at 1.122 (+1dB Easy Limiter).
  // Perceived loudness is achieved by tightening the correction chain, NOT raw gain.
  const setBoost = useCallback(
    (v: number) => {
      ensureContext();
      // gainBoostRef stays LOCKED at 1.122 always. Never change it here.
      // gainBoostRef.current!.gain.value = 1.122; // (already set, never changed)

      const strength = v / 100; // 0.0 – 1.0
      const mode = driveModeRef.current;

      if (mode === "SIGNAL") {
        // Tighten hardCorr threshold so corrections stomp harder → naturally louder
        if (hardCorrRef.current) {
          hardCorrRef.current.threshold.value =
            hardCorrBaseThresholdRef.current - strength * 6;
        }
        // Clean signal drive booster for SIGNAL mode
        if (signalDriveBoostRef.current)
          signalDriveBoostRef.current.gain.value = 1.0 + strength * 0.15;
      } else if (mode === "DYNAMIC") {
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
      } else if (mode === "PRESENCE") {
        // Boost engineAPresence and engineCPresence for mid-range clarity
        if (engineAPresenceRef.current)
          engineAPresenceRef.current.gain.value = strength * 5;
        if (engineCPresenceRef.current)
          engineCPresenceRef.current.gain.value = strength * 4;
        // Clean signal drive booster for PRESENCE mode
        if (signalDriveBoostRef.current)
          signalDriveBoostRef.current.gain.value = 1.0 + strength * 0.12;
      }
    },
    [ensureContext],
  );

  const setDriveMode = useCallback(
    (mode: "SIGNAL" | "DYNAMIC" | "PRESENCE") => {
      ensureContext();
      driveModeRef.current = mode;
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
      // Don't reset engineAPresence/C if engines are on — setBoost will re-apply
    },
    [ensureContext],
  );

  const setBrickWall = useCallback(
    (threshold: number) => {
      ensureContext();
      if (brickWallRef.current)
        brickWallRef.current.threshold.value = threshold;
    },
    [ensureContext],
  );

  const setEqBand = useCallback(
    (band: number, gainDb: number) => {
      ensureContext();
      const eqs = eqBandsRef.current;
      if (eqs[band]) eqs[band].gain.value = gainDb;
    },
    [ensureContext],
  );

  const setEqEnabled = useCallback(
    (enabled: boolean, bands: number[]) => {
      ensureContext();
      eqBandsRef.current.forEach((eq, i) => {
        eq.gain.value = enabled ? (bands[i] ?? 0) : 0;
      });
    },
    [ensureContext],
  );

  const setTitaniumOn = useCallback(
    (on: boolean) => {
      ensureContext();
      titaniumOnRef.current = on;
      if (hardCorrRef.current) hardCorrRef.current.ratio.value = 20;
      if (brickWallRef.current)
        brickWallRef.current.threshold.value = on ? -0.5 : -1.0;
      if (titaniumLimiterRef.current)
        titaniumLimiterRef.current.threshold.value = on ? -0.5 : -0.1;
    },
    [ensureContext],
  );

  const setFrontStageOn = useCallback(
    (on: boolean, intensity: number) => {
      ensureContext();
      if (frontstageRef.current)
        frontstageRef.current.gain.value = on ? (intensity / 100) * 6 : 0;
    },
    [ensureContext],
  );

  const setChannels = useCallback(
    (highs: boolean, mids: boolean, bass: boolean, tweeters: boolean) => {
      ensureContext();
      if (splitGainBassRef.current)
        splitGainBassRef.current.gain.value = bass ? 1.0 : 0.0;
      if (splitGainMidsRef.current)
        splitGainMidsRef.current.gain.value = mids ? 1.0 : 0.0;
      if (splitGainHighsRef.current)
        splitGainHighsRef.current.gain.value = highs || tweeters ? 1.0 : 0.0;
      if (channelTweetersRef.current)
        channelTweetersRef.current.gain.value = tweeters ? 0 : -30;
      if (channelHighsRef.current)
        channelHighsRef.current.gain.value = highs ? 0 : -20;
    },
    [ensureContext],
  );

  const setSRSChipOn = useCallback(
    (on: boolean) => {
      ensureContext();
      if (srsCompRef.current) {
        srsCompRef.current.ratio.value = on ? 4 : 1;
        srsCompRef.current.threshold.value = on ? -18 : -20;
        srsCompRef.current.knee.value = on ? 6 : 10;
      }
      if (srsPresenceRef.current)
        srsPresenceRef.current.gain.value = on ? 3 : 0;
      if (srsBassCleanRef.current)
        srsBassCleanRef.current.frequency.value = on ? 4200 : 4000;
    },
    [ensureContext],
  );

  const setBassLevel = useCallback(
    (level: number) => {
      ensureContext();
      bassLevelRef.current = level;
      if (bassShelfRef.current)
        bassShelfRef.current.gain.value = ((level - 50) / 50) * 6;
    },
    [ensureContext],
  );

  const setSmoothWarmLow = useCallback(() => {
    const ctx = ensureContext();
    if (warmLowWiredRef.current) return;
    if (!gainBassOutRef.current || !gainEngineRef.current) return;
    const warmLow = ctx.createBiquadFilter();
    warmLow.type = "lowshelf";
    warmLow.frequency.value = 120;
    warmLow.gain.value = 2;
    warmLowShelfRef.current = warmLow;
    try {
      gainCorrectionGainRef.current?.disconnect(gainBassOutRef.current);
    } catch (_e) {}
    gainCorrectionGainRef.current?.connect(warmLow);
    warmLow.connect(gainBassOutRef.current);
    warmLowWiredRef.current = true;
  }, [ensureContext]);

  const setLowShelfGain = useCallback(
    (gainDb: number) => {
      ensureContext();
      if (lowShelfRef.current) lowShelfRef.current.gain.value = gainDb;
    },
    [ensureContext],
  );

  const setHz80Drop = useCallback(
    (db: number) => {
      ensureContext();
      if (hz80DropFilterRef.current) hz80DropFilterRef.current.gain.value = db;
    },
    [ensureContext],
  );

  // setVolumeSmooth — tightens corrections as dB climbs.
  // Does NOT write to gainVolumeRef or gainAmpRef.
  const setVolumeSmooth = useCallback((dbLevel: number) => {
    if (!titaniumLimiterRef.current) return;
    if (dbLevel > 125) {
      titaniumLimiterRef.current.threshold.value = -1.0;
      if (brickWallRef.current) brickWallRef.current.threshold.value = -1.5;
      if (commanderCompRef.current)
        commanderCompRef.current.threshold.value = -34;
      if (monitorCompRef.current) monitorCompRef.current.threshold.value = -28;
    } else if (dbLevel > 100) {
      if (brickWallRef.current && !titaniumOnRef.current)
        brickWallRef.current.threshold.value = -1.2;
      titaniumLimiterRef.current.threshold.value = -0.5;
    } else if (dbLevel < 115) {
      titaniumLimiterRef.current.threshold.value = titaniumOnRef.current
        ? -0.5
        : -0.1;
      if (brickWallRef.current && !titaniumOnRef.current)
        brickWallRef.current.threshold.value = -1.0;
      if (commanderCompRef.current)
        commanderCompRef.current.threshold.value = -32;
      if (monitorCompRef.current) monitorCompRef.current.threshold.value = -26;
    }
  }, []);

  // setActiveCorrectionCount — tightens corrections only.
  // Does NOT write to gainAmpRef or gainVolumeRef.
  const setActiveCorrectionCount = useCallback(
    (count: number) => {
      ensureContext();
      const strength = Math.min(count / 9, 1.0);
      if (hardCorrRef.current) {
        hardCorrRef.current.threshold.value = -28 - 8 * strength;
        hardCorrRef.current.knee.value = 0;
        hardCorrRef.current.ratio.value = 20;
        hardCorrRef.current.attack.value = 0.001;
        hardCorrRef.current.release.value = 0.03;
        hardCorrBaseThresholdRef.current = hardCorrRef.current.threshold.value;
      }
      if (brickWallRef.current && !titaniumOnRef.current) {
        brickWallRef.current.threshold.value = -1.0 - strength * 0.5;
        brickWallRef.current.ratio.value = 20;
        brickWallRef.current.knee.value = 0;
      }
      if (count >= 9) {
        if (commanderCompRef.current) {
          commanderCompRef.current.threshold.value = -32;
          commanderCompRef.current.ratio.value = 20;
          commanderCompRef.current.attack.value = 0.001;
          commanderCompRef.current.knee.value = 0;
        }
        if (gainCorrectionGainRef.current)
          gainCorrectionGainRef.current.gain.value = 1.0;
        if (monitorCompRef.current) {
          monitorCompRef.current.threshold.value = -26;
          monitorCompRef.current.ratio.value = 16;
          monitorCompRef.current.attack.value = 0.001;
          monitorCompRef.current.knee.value = 0;
        }
        if (stabilizerFilterRef.current)
          stabilizerFilterRef.current.gain.value = -2;
        if (signalCleanerHPRef.current)
          signalCleanerHPRef.current.frequency.value = 4200;
        if (srsCompRef.current) {
          srsCompRef.current.ratio.value = 6;
          srsCompRef.current.threshold.value = -16;
          srsCompRef.current.attack.value = 0.002;
          srsCompRef.current.release.value = 0.08;
        }
        if (titaniumLimiterRef.current) {
          titaniumLimiterRef.current.threshold.value = -0.5;
          titaniumLimiterRef.current.ratio.value = 20;
          titaniumLimiterRef.current.attack.value = 0.001;
          titaniumLimiterRef.current.release.value = 0.04;
        }
        if (radiatorLowpassRef.current)
          radiatorLowpassRef.current.gain.value = 1;
        setSmoothWarmLow();
      } else {
        if (commanderCompRef.current) {
          commanderCompRef.current.threshold.value = -28;
          commanderCompRef.current.ratio.value = 14;
          commanderCompRef.current.knee.value = 4;
        }
        if (monitorCompRef.current) {
          monitorCompRef.current.threshold.value = -22;
          monitorCompRef.current.ratio.value = 10;
        }
        if (stabilizerFilterRef.current)
          stabilizerFilterRef.current.gain.value = 0;
        if (signalCleanerHPRef.current)
          signalCleanerHPRef.current.frequency.value = 4000;
      }
    },
    [ensureContext, setSmoothWarmLow],
  );

  const setBullhornOn = useCallback(
    (on: boolean) => {
      ensureContext();
      if (bullhornBandpassRef.current)
        bullhornBandpassRef.current.gain.value = on ? 5 : 0;
      if (bullhornPresenceRef.current)
        bullhornPresenceRef.current.gain.value = on ? 6 : 0;
    },
    [ensureContext],
  );

  const setSmallSpeakerOn = useCallback(
    (on: boolean) => {
      ensureContext();
      if (smallSpeakerHPRef.current)
        smallSpeakerHPRef.current.frequency.value = on ? 6000 : 4000;
      if (smallSpeakerPresRef.current)
        smallSpeakerPresRef.current.gain.value = on ? 4 : 0;
    },
    [ensureContext],
  );

  const setSoundMagnetOn = useCallback(
    (on: boolean) => {
      ensureContext();
      if (soundMagnetRef.current)
        soundMagnetRef.current.gain.value = on ? 3 : 0;
    },
    [ensureContext],
  );

  const setAudioSensorOn = useCallback(
    (on: boolean) => {
      ensureContext();
      if (audioSensorCompRef.current) {
        audioSensorCompRef.current.ratio.value = on ? 8 : 1;
        audioSensorCompRef.current.threshold.value = on ? -24 : -30;
      }
    },
    [ensureContext],
  );

  // setAmpPowerDrive — tightens corrections proportionally. gainAmpRef stays at 1.0 always.
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
  );

  const setKickThump = useCallback(
    (db: number) => {
      ensureContext();
      if (kickThumpFilterRef.current)
        kickThumpFilterRef.current.gain.value = db;
    },
    [ensureContext],
  );

  const setKickKick = useCallback(
    (db: number) => {
      ensureContext();
      if (kickKickFilterRef.current) kickKickFilterRef.current.gain.value = db;
    },
    [ensureContext],
  );

  const setKickDrop = useCallback(
    (db: number) => {
      ensureContext();
      if (kickDropFilterRef.current) kickDropFilterRef.current.gain.value = db;
      if (crossoverLowpassRef.current)
        crossoverLowpassRef.current.frequency.value = Math.min(
          200,
          80 + db * 1.5,
        );
    },
    [ensureContext],
  );

  const setRadiatorPressure = useCallback(
    (left: number, right: number) => {
      ensureContext();
      if (radiatorLowpassRef.current)
        radiatorLowpassRef.current.gain.value = (left / 100) * 6;
      if (bassShelfRef.current) {
        const base = ((bassLevelRef.current - 50) / 50) * 6;
        bassShelfRef.current.gain.value = base + (right / 100) * 1;
      }
    },
    [ensureContext],
  );

  // setSmartFuseLow — battery/fuse protection.
  // Only tightens brickWall when corrections are under stress.
  // NEVER writes to gainVolumeRef — battery has zero connection to the volume node.
  const setSmartFuseLow = useCallback(
    (load: number) => {
      ensureContext();
      if (load >= 80 && brickWallRef.current && !titaniumOnRef.current)
        brickWallRef.current.threshold.value = Math.min(
          -0.5,
          brickWallRef.current.threshold.value - 0.01,
        );
    },
    [ensureContext],
  );

  const setSmartFuseMids = useCallback(
    (hz: number) => {
      ensureContext();
      if (smartFuseMidRef.current)
        smartFuseMidRef.current.frequency.value = Math.max(
          200,
          Math.min(4000, hz),
        );
    },
    [ensureContext],
  );

  const setSmartFuseHighs = useCallback(
    (load: number) => {
      ensureContext();
      if (load >= 80 && titaniumLimiterRef.current)
        titaniumLimiterRef.current.threshold.value = Math.max(
          -3,
          titaniumLimiterRef.current.threshold.value - 0.01,
        );
    },
    [ensureContext],
  );

  const getAnalyserData = useCallback((): { live: number; peak: number } => {
    const analyser = analyserRef.current;
    if (!analyser) return { live: 85, peak: 85 };
    const binCount = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(binCount);
    analyser.getByteFrequencyData(dataArray);
    let sumSq = 0;
    let maxBin = 0;
    for (let i = 0; i < binCount; i++) {
      sumSq += dataArray[i] * dataArray[i];
      if (dataArray[i] > maxBin) maxBin = dataArray[i];
    }
    const rms = Math.sqrt(sumSq / binCount);
    const blended = rms * 0.7 + maxBin * 0.3;
    const liveDb = 85 + (blended / 255) * 65;
    const now = Date.now();
    if (liveDb > peakRef.current) {
      peakRef.current = liveDb;
      peakDecayRef.current = now + 2000;
    } else if (now > peakDecayRef.current)
      peakRef.current = Math.max(85, peakRef.current - 0.5);
    return { live: liveDb, peak: peakRef.current };
  }, []);

  const getNodeData = useCallback((): {
    distortion: number;
    clipping: number;
    noiseFloor: number;
  } => {
    const analyser = analyserRef.current;
    if (!analyser) return { distortion: -60, clipping: -60, noiseFloor: -60 };
    const dataArray = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(dataArray);
    let sum = 0;
    let clipping = false;
    for (let i = 0; i < dataArray.length; i++) {
      const v = dataArray[i] / 128.0 - 1.0;
      sum += v * v;
      if (dataArray[i] >= 254) clipping = true;
    }
    const rms = Math.sqrt(sum / dataArray.length);
    const distortionDb =
      rms > 0.7 ? -3.5 : rms > 0.0001 ? 20 * Math.log10(rms) - 6 : -55;
    const clippingDb = clipping ? -0.5 : -12;
    const buf = noiseFloorBufferRef.current;
    buf.push(rms);
    if (buf.length > 10) buf.shift();
    const avgRms = buf.reduce((a, b) => a + b, 0) / buf.length;
    const noiseFloorDb =
      avgRms > 0.0001 ? Math.max(-60, 20 * Math.log10(avgRms) - 12) : -55;
    return {
      distortion: Number(distortionDb.toFixed(1)),
      clipping: Number(clippingDb.toFixed(1)),
      noiseFloor: Number(noiseFloorDb.toFixed(1)),
    };
  }, []);

  // setSpeakerProfile — intentional user-profile overrides.
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
  );

  const setCrossoverBassNote = useCallback((hz: number) => {
    const f = crossoverLowpassRef.current;
    if (f) f.frequency.value = Math.min(200, hz);
  }, []);

  const setEngineOn = useCallback(
    (index: number, on: boolean) => {
      ensureContext();
      engineStatesRef.current[index] = on;
      if (index === 0) {
        if (engineAPresenceRef.current)
          engineAPresenceRef.current.gain.value = on ? 4 : 0;
        if (srsPresenceRef.current)
          srsPresenceRef.current.gain.value = on ? 4 : 0;
      }
      if (index === 1) {
        if (engineBCompRef.current) {
          if (on) {
            engineBCompRef.current.threshold.value = -35;
            engineBCompRef.current.ratio.value = 20;
            engineBCompRef.current.attack.value = 0.001;
          } else {
            engineBCompRef.current.threshold.value = -30;
            engineBCompRef.current.ratio.value = 16;
            engineBCompRef.current.attack.value = 0.002;
          }
        }
      }
      if (index === 2) {
        if (engineCPresenceRef.current)
          engineCPresenceRef.current.gain.value = on ? 5 : 0;
      }
      if (index === 3) {
        // Engine D+ — dedicated 80Hz bass shelf filter node (NOT bassShelf which is the main bass control)
        if (engineDFilterRef.current) {
          engineDFilterRef.current.gain.value = on ? 4 : 0;
        }
      }
    },
    [ensureContext],
  );

  return {
    isPlaying,
    loadAudio,
    play,
    pause,
    fireKick,
    setVolume,
    setBoost,
    setDriveMode,
    setBrickWall,
    setEqBand,
    setEqEnabled,
    getAnalyserData,
    getNodeData,
    setTitaniumOn,
    setFrontStageOn,
    setChannels,
    setSRSChipOn,
    setBassLevel,
    setActiveCorrectionCount,
    setBullhornOn,
    setSmallSpeakerOn,
    setSoundMagnetOn,
    setAudioSensorOn,
    setAmpPowerDrive,
    setSpeakerProfile,
    setCrossoverBassNote,
    setEngineOn,
    setKickThump,
    setKickKick,
    setKickDrop,
    setHz80Drop,
    setRadiatorPressure,
    setSmartFuseLow,
    setSmartFuseMids,
    setSmartFuseHighs,
    setSmoothWarmLow,
    setVolumeSmooth,
    setLowShelfGain,
    setSmoothBoost: (multiplier: number) => {
      const ctx = ctxRef.current;
      if (!ctx || !smoothBoostGainRef.current) return;
      smoothBoostGainRef.current.gain.setTargetAtTime(
        multiplier,
        ctx.currentTime,
        0.05,
      );
    },
  };
}
