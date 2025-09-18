import Navigation from "@/components/Navigation";
import VMDashboard from "@/components/VMDashboard";

const VMDashboardPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <VMDashboard />
      </main>
    </div>
  );
};

export default VMDashboardPage;