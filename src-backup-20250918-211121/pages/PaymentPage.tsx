import Navigation from "@/components/Navigation";
import PaymentForm from "@/components/PaymentForm";

const PaymentPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <PaymentForm />
      </main>
    </div>
  );
};

export default PaymentPage;