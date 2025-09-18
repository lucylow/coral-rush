import Navigation from "@/components/Navigation";
import VisualFraudDashboard from "@/components/VisualFraudDashboard";

const FraudDetectionPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <VisualFraudDashboard />
      </main>
    </div>
  );
};

export default FraudDetectionPage;