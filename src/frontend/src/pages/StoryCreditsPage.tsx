import { StoryCredits } from "@/components/StoryCredits";

export function StoryCreditsPage() {
  return (
    <StoryCredits
      open={true}
      onClose={() => {
        window.location.href = "/";
      }}
    />
  );
}
