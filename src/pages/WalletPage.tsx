import Navigation from "@/components/Navigation";
import WalletBalance from "@/components/WalletBalance";

const WalletPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <WalletBalance />
      </main>
    </div>
  );
};

export default WalletPage;