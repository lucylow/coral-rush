import Navigation from "@/components/Navigation";
import OrgoTokenPanel from "@/components/OrgoTokenPanel";

const OrgoUtilityPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <OrgoTokenPanel />
      </main>
    </div>
  );
};

export default OrgoUtilityPage;