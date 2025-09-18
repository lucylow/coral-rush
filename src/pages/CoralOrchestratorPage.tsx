import Navigation from "@/components/Navigation";
import CoralOrchestrator from "@/components/coral/CoralOrchestrator";

const CoralOrchestratorPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Coral Protocol
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {" "}Multi-Agent Orchestrator
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the power of coordinated AI agents working together to solve Web3 support challenges. 
              Watch as Listener, Brain, and Executor agents collaborate seamlessly.
            </p>
          </div>

          <CoralOrchestrator />
        </div>
      </div>
    </div>
  );
};

export default CoralOrchestratorPage;