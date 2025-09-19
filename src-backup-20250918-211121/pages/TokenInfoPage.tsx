import Navigation from "@/components/Navigation";
import TokenInfo from "@/components/TokenInfo";

const TokenInfoPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <TokenInfo />
      </main>
    </div>
  );
};

export default TokenInfoPage;