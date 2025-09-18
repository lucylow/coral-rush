import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ComputerScreenProps {
  vmId: string;
  isActive: boolean;
  operation: string;
}

export default function ComputerScreen({ vmId, isActive, operation }: ComputerScreenProps) {
  const [currentScreen, setCurrentScreen] = useState("desktop");
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (!isActive) {
      setCurrentScreen("desktop");
      setProgress(0);
      setLogs([]);
      return;
    }

    // Simulate computer operation sequence
    const sequence = getOperationSequence(vmId);
    let step = 0;

    const interval = setInterval(() => {
      if (step < sequence.length) {
        setCurrentScreen(sequence[step].screen);
        setProgress((step / sequence.length) * 100);
        
        if (sequence[step].log) {
          setLogs(prev => [...prev.slice(-4), sequence[step].log].filter(Boolean));
        }
        
        step++;
      } else {
        clearInterval(interval);
        setProgress(100);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [isActive, vmId]);

  const getOperationSequence = (vmId: string) => {
    switch (vmId) {
      case "routing-optimizer":
        return [
          { screen: "terminal", log: "$ orgo-router --analyze-networks" },
          { screen: "browser", log: "Loading Solana network data..." },
          { screen: "charts", log: "Comparing fees: SOL 0.00025 vs ETH 0.005" },
          { screen: "terminal", log: "✅ Optimal route: Solana saves $12.50" }
        ];
      case "risk-management":
        return [
          { screen: "monitoring", log: "🔍 Scanning transaction patterns" },
          { screen: "ai-analysis", log: "Claude AI analyzing behavioral data..." },
          { screen: "alerts", log: "Risk score calculated: 15.2/100" },
          { screen: "terminal", log: "✅ Threat assessment complete" }
        ];
      case "treasury-management":
        return [
          { screen: "defi", log: "📊 Querying DeFi protocols..." },
          { screen: "ai-analysis", log: "Claude optimizing yield strategy..." },
          { screen: "charts", log: "Current APY: 18.3% → Target: 22.1%" },
          { screen: "terminal", log: "✅ Portfolio rebalanced" }
        ];
      default:
        return [
          { screen: "browser", log: "🔧 Processing compliance checks..." },
          { screen: "terminal", log: "✅ Operation completed" }
        ];
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "terminal":
        return (
          <div className="bg-black text-green-400 p-3 font-mono text-xs h-full overflow-hidden">
            <div className="mb-2">orgo@vm-{vmId}:~$ </div>
            {logs.map((log, i) => (
              <div key={i} className="animate-pulse">{log}</div>
            ))}
            <div className="animate-pulse">▊</div>
          </div>
        );

      case "browser":
        return (
          <div className="bg-white h-full">
            <div className="bg-gray-200 p-1 text-xs flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
              <div className="bg-white px-2 py-1 rounded text-gray-600">orgo.ai/dashboard</div>
            </div>
            <div className="p-3 space-y-2">
              <div className="h-2 bg-blue-200 rounded animate-pulse"></div>
              <div className="h-2 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-2 bg-blue-200 rounded animate-pulse w-3/4"></div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="h-6 bg-purple-200 rounded animate-pulse"></div>
                <div className="h-6 bg-green-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        );

      case "charts":
        return (
          <div className="bg-gray-900 text-white p-3 h-full">
            <div className="text-xs mb-2">📈 ORGO Network Analysis</div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Solana</span>
                <span className="text-green-400">0.00025 SOL</span>
              </div>
              <div className="h-1 bg-green-400 rounded animate-pulse"></div>
              <div className="flex justify-between text-xs">
                <span>Ethereum</span>
                <span className="text-red-400">0.005 ETH</span>
              </div>
              <div className="h-1 bg-red-400 rounded animate-pulse"></div>
              <div className="mt-2 text-xs text-blue-400 animate-pulse">
                🎯 Savings: $12.50 • Speed: 0.3s
              </div>
            </div>
          </div>
        );

      case "ai-analysis":
        return (
          <div className="bg-gradient-to-br from-purple-900 to-blue-900 text-white p-3 h-full">
            <div className="text-xs mb-2">🧠 Claude AI Analysis</div>
            <div className="space-y-1 text-xs">
              <div className="animate-pulse">Analyzing market data...</div>
              <div className="animate-pulse">Processing 1,247 data points</div>
              <div className="animate-pulse">Confidence: 94.7%</div>
              <div className="flex items-center gap-1 animate-pulse">
                <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        );

      case "monitoring":
        return (
          <div className="bg-red-950 text-red-200 p-3 h-full">
            <div className="text-xs mb-2">🛡️ Security Monitor</div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between animate-pulse">
                <span>Threats Blocked</span>
                <span>3</span>
              </div>
              <div className="flex justify-between animate-pulse">
                <span>Risk Score</span>
                <span className="text-green-400">15.2/100</span>
              </div>
              <div className="animate-pulse">🔍 Scanning patterns...</div>
            </div>
          </div>
        );

      case "alerts":
        return (
          <div className="bg-yellow-900 text-yellow-200 p-3 h-full">
            <div className="text-xs mb-2">⚠️ Alert System</div>
            <div className="space-y-1 text-xs animate-pulse">
              <div>✅ Transaction verified</div>
              <div>✅ Geolocation match</div>
              <div>✅ Device recognized</div>
              <div className="text-green-400">🔒 Security: HIGH</div>
            </div>
          </div>
        );

      case "defi":
        return (
          <div className="bg-green-950 text-green-200 p-3 h-full">
            <div className="text-xs mb-2">🌾 DeFi Protocols</div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between animate-pulse">
                <span>Solend</span>
                <span>19.2% APY</span>
              </div>
              <div className="flex justify-between animate-pulse">
                <span>Marinade</span>
                <span>7.4% APY</span>
              </div>
              <div className="flex justify-between animate-pulse">
                <span>Meteora</span>
                <span>15.8% APY</span>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-blue-100 h-full flex items-center justify-center">
            <div className="text-blue-600 text-xs">🖥️ ORGO Computer Ready</div>
          </div>
        );
    }
  };

  return (
    <Card className="w-full h-32 overflow-hidden border-2 border-gray-300 bg-gray-100">
      <div className="bg-gray-800 text-white px-2 py-1 text-xs flex items-center justify-between">
        <span>ORGO VM - {vmId}</span>
        <div className="flex gap-1">
          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
          <Badge variant="outline" className="text-xs px-1 py-0">
            {progress.toFixed(0)}%
          </Badge>
        </div>
      </div>
      <div className="h-full">
        {renderScreen()}
      </div>
    </Card>
  );
}