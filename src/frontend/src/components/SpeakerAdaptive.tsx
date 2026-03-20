import type { Preset } from "@/backend";
import { useActor } from "@/hooks/useActor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

interface SpeakerAdaptiveProps {
  eqBands: number[];
  boostLevel: number;
}

export function SpeakerAdaptive({ eqBands, boostLevel }: SpeakerAdaptiveProps) {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();
  const [presetName, setPresetName] = useState("");

  const presetsQuery = useQuery<Preset[]>({
    queryKey: ["presets"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPresets();
    },
    enabled: !!actor && !isFetching,
  });

  const saveMutation = useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("No actor");
      const preset: Preset = {
        name,
        eqSettings: JSON.stringify(eqBands),
        correctionSettings: "{}",
        boostLevel: BigInt(Math.round(boostLevel)),
      };
      await actor.savePreset(name, preset);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["presets"] });
      setPresetName("");
      toast.success("Preset saved");
    },
    onError: () => toast.error("Failed to save preset"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (deviceId: string) => {
      if (!actor) throw new Error("No actor");
      await actor.deletePreset(deviceId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["presets"] });
      toast.success("Preset deleted");
    },
    onError: () => toast.error("Failed to delete preset"),
  });

  const presets = presetsQuery.data ?? [];

  return (
    <div className="panel space-y-3">
      <div className="panel-title">SPEAKER ADAPTIVE SYSTEM</div>

      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-blue-hi" />
        <span className="text-foreground text-[9px]">
          SPEAKER: DEFAULT OUTPUT
        </span>
        <span className="text-muted-foreground text-[8px] ml-auto">
          NO DEVICE ID
        </span>
      </div>

      <div className="space-y-1.5">
        <input
          type="text"
          placeholder="Preset name..."
          value={presetName}
          onChange={(e) => setPresetName(e.target.value)}
          className="w-full bg-muted/30 border border-border text-foreground text-[9px] px-2 py-1.5 outline-none focus:border-blue-hi font-mono"
          data-ocid="speaker.input"
        />
        <button
          type="button"
          onClick={() =>
            presetName.trim() && saveMutation.mutate(presetName.trim())
          }
          disabled={!presetName.trim() || saveMutation.isPending}
          className="w-full bg-blue-hi/20 border border-blue-hi text-blue-hi text-[9px] font-bold py-1.5 hover:bg-blue-hi/30 transition-colors disabled:opacity-40"
          data-ocid="speaker.submit_button"
        >
          {saveMutation.isPending
            ? "SAVING..."
            : "SAVE PRESET FOR THIS SPEAKER"}
        </button>
      </div>

      {presetsQuery.isLoading ? (
        <div
          className="text-muted-foreground text-[8px] text-center py-2"
          data-ocid="speaker.loading_state"
        >
          Loading presets...
        </div>
      ) : presets.length === 0 ? (
        <div
          className="border border-border/50 p-3 text-center"
          data-ocid="speaker.empty_state"
        >
          <div className="text-muted-foreground text-[8px]">
            NO PRESETS SAVED YET
          </div>
        </div>
      ) : (
        <div className="space-y-1">
          {presets.map((p, i) => (
            <div
              key={p.name}
              className="flex items-center gap-2 border border-border/50 px-2 py-1.5"
              data-ocid={`speaker.item.${i + 1}`}
            >
              <span className="text-foreground text-[9px] flex-1">
                {p.name}
              </span>
              <span className="text-muted-foreground text-[8px] font-mono">
                +{p.boostLevel.toString()}%
              </span>
              <button
                type="button"
                onClick={() => deleteMutation.mutate(p.name)}
                className="text-red-alert text-[8px] hover:bg-red-alert/10 px-1 py-0.5 transition-colors"
                data-ocid={`speaker.delete_button.${i + 1}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
