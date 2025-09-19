import Navigation from "@/components/Navigation";
import LiveDemo from "@/components/LiveDemo";

const LiveDemoPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <LiveDemo />
      </main>
    </div>
  );
};

export default LiveDemoPage;