import Navigation from "@/components/Navigation";
import TransactionHistory from "@/components/TransactionHistory";

const HistoryPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <TransactionHistory />
      </main>
    </div>
  );
};

export default HistoryPage;