import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Preset {
    name: string;
    eqSettings: string;
    correctionSettings: string;
    boostLevel: bigint;
}
export interface backendInterface {
    deletePreset(deviceId: string): Promise<void>;
    getAllPresets(): Promise<Array<Preset>>;
    loadPreset(deviceId: string): Promise<Preset>;
    savePreset(deviceId: string, preset: Preset): Promise<void>;
}
