import Navigation from "@/components/Navigation";
import VoiceAgentLayout from "@/components/VoiceAgentLayout";

const VoiceAgentPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="flex-1">
        <VoiceAgentLayout />
      </div>
    </div>
  );
};

export default VoiceAgentPage;