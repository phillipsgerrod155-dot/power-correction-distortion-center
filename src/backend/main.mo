import Text "mo:core/Text";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";

actor {
  type Preset = {
    name : Text;
    eqSettings : Text; // JSON representation of EQ settings
    boostLevel : Nat;
    correctionSettings : Text; // JSON representation of correction settings
  };

  module Preset {
    public func compareByName(p1 : Preset, p2 : Preset) : Order.Order {
      Text.compare(p1.name, p2.name);
    };
  };

  let presets = Map.empty<Text, Preset>();

  public shared ({ caller }) func savePreset(deviceId : Text, preset : Preset) : async () {
    presets.add(deviceId, preset);
  };

  public query ({ caller }) func loadPreset(deviceId : Text) : async Preset {
    switch (presets.get(deviceId)) {
      case (null) { Runtime.trap("Preset not found") };
      case (?preset) { preset };
    };
  };

  public query ({ caller }) func getAllPresets() : async [Preset] {
    presets.values().toArray().sort(Preset.compareByName);
  };

  public shared ({ caller }) func deletePreset(deviceId : Text) : async () {
    if (not presets.containsKey(deviceId)) {
      Runtime.trap("Preset does not exist");
    };
    presets.remove(deviceId);
  };
};
