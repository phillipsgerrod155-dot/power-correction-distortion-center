import { useEffect, useRef } from "react";

interface TitaniumOverdriveProps {
  titaniumOn: boolean;
  onToggle: () => void;
}

export function TitaniumOverdrive({
  titaniumOn,
  onToggle,
}: TitaniumOverdriveProps) {
  const fuseGlowRef = useRef(0);
  const animRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!titaniumOn) {
      fuseGlowRef.current = 0;
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }
    let t = 0;
    const animate = () => {
      t += 0.04;
      fuseGlowRef.current = 0.6 + 0.4 * Math.sin(t);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [titaniumOn]);

  const fuseGlow = titaniumOn ? 1 : 0;

  return (
    <div className="panel space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="panel-title">TITANIUM SWITCH OVERDRIVE</div>
          <div className="text-muted-foreground text-[8px] tracking-widest mt-0.5">
            TRIPLE STRENGTH — SOUND QUALITY + LOUDNESS + HOLD
          </div>
        </div>
        <span
          className={`text-[9px] font-black px-2 py-1 tracking-widest ${
            titaniumOn
              ? "bg-green-active text-navy"
              : "bg-muted/50 text-muted-foreground border border-border"
          }`}
        >
          {titaniumOn ? "ENGAGED" : "STANDBY"}
        </span>
      </div>

      {/* Master toggle */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onToggle}
          data-ocid="titanium.toggle"
          className={`relative w-16 h-8 border-2 transition-all duration-300 ${
            titaniumOn
              ? "border-green-active bg-green-active/20"
              : "border-border bg-muted/20"
          }`}
        >
          <div
            className={`absolute top-0.5 w-6 h-6 transition-all duration-300 ${
              titaniumOn
                ? "left-[calc(100%-1.75rem)] bg-green-active"
                : "left-0.5 bg-muted"
            }`}
          />
        </button>
        <span className="text-foreground text-xs font-black tracking-widest">
          {titaniumOn ? "OVERDRIVE ACTIVE" : "OVERDRIVE OFF"}
        </span>
      </div>

      {/* 120W Master Fuse */}
      <div
        ref={canvasRef as any}
        className="border-2 p-3 transition-all duration-300"
        style={{
          borderColor: titaniumOn
            ? `rgba(74,222,128,${fuseGlow})`
            : "rgba(100,100,100,0.3)",
          boxShadow: titaniumOn
            ? `0 0 ${20 * fuseGlow}px rgba(74,222,128,${fuseGlow * 0.8}), inset 0 0 ${10 * fuseGlow}px rgba(74,222,128,${fuseGlow * 0.2})`
            : "none",
          background: titaniumOn
            ? `rgba(74,222,128,${fuseGlow * 0.08})`
            : "rgba(20,20,20,0.3)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 border flex items-center justify-center"
              style={{
                borderColor: titaniumOn
                  ? `rgba(74,222,128,${fuseGlow})`
                  : "rgba(100,100,100,0.3)",
                boxShadow: titaniumOn
                  ? `0 0 ${12 * fuseGlow}px rgba(74,222,128,${fuseGlow})`
                  : "none",
              }}
            >
              <span
                className="text-[7px] font-black"
                style={{
                  color: titaniumOn
                    ? `rgba(74,222,128,${0.6 + fuseGlow * 0.4})`
                    : "rgba(100,100,100,0.5)",
                }}
              >
                ⚡
              </span>
            </div>
            <div>
              <div
                className="text-[10px] font-black tracking-widest"
                style={{
                  color: titaniumOn
                    ? `rgba(74,222,128,${0.8 + fuseGlow * 0.2})`
                    : "rgba(100,100,100,0.6)",
                }}
              >
                120W MASTER FUSE
              </div>
              <div className="text-muted-foreground text-[7px]">
                TITANIUM PROTECTION CORE
              </div>
            </div>
          </div>
          <span
            className="text-[8px] font-black px-2 py-0.5"
            style={{
              background: titaniumOn
                ? `rgba(74,222,128,${fuseGlow * 0.3})`
                : "rgba(100,100,100,0.1)",
              color: titaniumOn
                ? `rgba(74,222,128,${0.7 + fuseGlow * 0.3})`
                : "rgba(100,100,100,0.5)",
              border: `1px solid ${
                titaniumOn
                  ? `rgba(74,222,128,${fuseGlow * 0.6})`
                  : "rgba(100,100,100,0.2)"
              }`,
            }}
          >
            {titaniumOn ? "ACTIVE" : "OFFLINE"}
          </span>
        </div>
      </div>

      {/* Status rows */}
      {titaniumOn && (
        <div className="grid grid-cols-3 gap-2">
          {[
            "NO CLIP — HIGHS",
            "NO CLIP — MIDS",
            "NO CLIP — BASS",
            "NO CLIP — TWEETERS",
            "QUALITY ENHANCED",
            "LOUDNESS BOOSTED",
          ].map((label) => (
            <div
              key={label}
              className="border border-green-active/40 bg-green-active/5 p-1.5 flex items-center gap-1"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-green-active flex-shrink-0" />
              <span className="text-green-active text-[7px] font-bold">
                {label}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-border pt-2 text-muted-foreground text-[7px] tracking-widest">
        NOBODY HAS THIS — GERROD ORIGINAL — DOUBLE TRIPLE TITANIUM STRENGTH
      </div>
    </div>
  );
}
