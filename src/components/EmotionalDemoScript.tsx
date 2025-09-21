import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw,
  Heart,
  Zap,
  Shield,
  DollarSign,
  Clock,
  User,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from "lucide-react";

interface DemoStep {
  id: string;
  title: string;
  script: string;
  visual: string;
  duration: number;
  emotion: 'problem' | 'solution' | 'result' | 'impact';
  metrics?: {
    time: string;
    cost: string;
    efficiency: string;
  };
}

interface InteractiveStoryDemoProps {
  steps: DemoStep[];
}

const InteractiveStoryDemo: React.FC<InteractiveStoryDemoProps> = ({ steps }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const currentDemoStep = steps[currentStep];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && currentStep < steps.length) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            // Step completed
            setCompletedSteps(prev => [...prev, currentStep]);
            
            // Move to next step
            if (currentStep < steps.length - 1) {
              setCurrentStep(prev => prev + 1);
              return 0;
            } else {
              // Demo completed
              setIsPlaying(false);
              return 100;
            }
          }
          return prev + (100 / (currentDemoStep.duration / 100)); // Update every 100ms
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isPlaying, currentStep, steps.length, currentDemoStep.duration]);

  const startDemo = () => {
    setIsPlaying(true);
    setProgress(0);
    setCurrentStep(0);
    setCompletedSteps([]);
  };

  const pauseDemo = () => {
    setIsPlaying(false);
  };

  const resetDemo = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setProgress(0);
    setCompletedSteps([]);
  };

  const skipToNext = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps(prev => [...prev, currentStep]);
      setCurrentStep(prev => prev + 1);
      setProgress(0);
    }
  };

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'problem':
        return <AlertCircle className="h-6 w-6 text-red-600" />;
      case 'solution':
        return <Zap className="h-6 w-6 text-blue-600" />;
      case 'result':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'impact':
        return <TrendingUp className="h-6 w-6 text-purple-600" />;
      default:
        return <MessageSquare className="h-6 w-6 text-gray-600" />;
    }
  };

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'problem':
        return 'border-red-200 bg-red-50';
      case 'solution':
        return 'border-blue-200 bg-blue-50';
      case 'result':
        return 'border-green-200 bg-green-50';
      case 'impact':
        return 'border-purple-200 bg-purple-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-100 rounded-lg">
            <Play className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-indigo-900">🎭 Interactive Story Demo</h3>
            <p className="text-indigo-700">Emotional user journey that judges will remember</p>
          </div>
        </div>

        {/* Demo Controls */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            onClick={isPlaying ? pauseDemo : startDemo}
            className={`${isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white`}
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause Demo
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Demo
              </>
            )}
          </Button>
          
          <Button
            onClick={skipToNext}
            disabled={currentStep >= steps.length - 1}
            variant="outline"
            className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
          >
            <SkipForward className="h-4 w-4 mr-2" />
            Skip Step
          </Button>
          
          <Button
            onClick={resetDemo}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        {/* Current Step Display */}
        {currentDemoStep && (
          <Card className={`border-2 ${getEmotionColor(currentDemoStep.emotion)} mb-6`}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                {getEmotionIcon(currentDemoStep.emotion)}
                <h4 className="text-xl font-bold text-gray-900">{currentDemoStep.title}</h4>
                <Badge variant="outline" className="text-xs">
                  {currentDemoStep.duration / 1000}s
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Demo Script
                  </h5>
                  <p className="text-gray-700 leading-relaxed">{currentDemoStep.script}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Visual Context
                  </h5>
                  <p className="text-gray-600 text-sm">{currentDemoStep.visual}</p>
                </div>

                {currentDemoStep.metrics && (
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-3 bg-white rounded-lg border border-gray-200 text-center">
                      <Clock className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                      <div className="text-lg font-bold text-blue-600">{currentDemoStep.metrics.time}</div>
                      <div className="text-xs text-gray-600">Resolution Time</div>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-gray-200 text-center">
                      <DollarSign className="h-5 w-5 mx-auto mb-1 text-green-600" />
                      <div className="text-lg font-bold text-green-600">{currentDemoStep.metrics.cost}</div>
                      <div className="text-xs text-gray-600">Cost</div>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-gray-200 text-center">
                      <TrendingUp className="h-5 w-5 mx-auto mb-1 text-purple-600" />
                      <div className="text-lg font-bold text-purple-600">{currentDemoStep.metrics.efficiency}</div>
                      <div className="text-xs text-gray-600">Efficiency Gain</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step Overview */}
        <div className="space-y-2">
          <h5 className="font-semibold text-gray-900 mb-3">Demo Steps Overview</h5>
          <div className="grid gap-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${
                  index === currentStep
                    ? 'border-indigo-300 bg-indigo-50'
                    : completedSteps.includes(index)
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex-shrink-0">
                  {completedSteps.includes(index) ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : index === currentStep ? (
                    <div className="h-5 w-5 rounded-full bg-indigo-600 animate-pulse" />
                  ) : (
                    <div className="h-5 w-5 rounded-full bg-gray-300" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{step.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {step.emotion}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600">{step.script.substring(0, 80)}...</p>
                </div>
                
                <div className="text-xs text-gray-500">
                  {step.duration / 1000}s
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demo Completed */}
        {currentStep >= steps.length - 1 && progress >= 100 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border border-green-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h4 className="font-semibold text-green-900">Demo Completed!</h4>
                <p className="text-sm text-green-700">
                  Sarah's problem was solved in 0.3 seconds with RUSH's voice-first AI support.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const EmotionalDemoScript: React.FC = () => {
  const demoSteps: DemoStep[] = [
    {
      id: '1',
      title: "😰 The Problem",
      script: "Meet Sarah - she just lost $500 in a failed NFT mint. In traditional Web3, she'd wait 3-5 days for support and probably never get her money back. She's frustrated, confused, and losing trust in the platform.",
      visual: "Frustrated user with failed transaction notification on screen",
      duration: 3000,
      emotion: 'problem',
      metrics: {
        time: "3-5 days",
        cost: "$500 lost",
        efficiency: "0%"
      }
    },
    {
      id: '2',
      title: "🎤 RUSH Solution",
      script: "User speaks: 'My NFT mint failed and I lost money' - Sarah's voice is processed by Coral Protocol's multi-agent system in real-time. The system immediately understands her intent and begins coordinating agents.",
      visual: "Voice input processing in real-time with agent coordination visualization",
      duration: 2000,
      emotion: 'solution',
      metrics: {
        time: "0.1s",
        cost: "$0",
        efficiency: "Processing"
      }
    },
    {
      id: '3',
      title: "⚡ Instant Resolution",
      script: "0.3 seconds later: Automatic refund NFT minted to user's wallet. The system detected the failed transaction, verified the issue, and automatically provided compensation - all without human intervention.",
      visual: "Success animation with blockchain confirmation and NFT minting",
      duration: 2500,
      emotion: 'result',
      metrics: {
        time: "0.3s",
        cost: "$500 refunded",
        efficiency: "100%"
      }
    },
    {
      id: '4',
      title: "🎯 Business Impact",
      script: "Cost: $350 → $0.50 | Time: 3 days → 0.3 seconds | Customer satisfaction: Frustrated → Delighted. Sarah now trusts the platform and will continue using it, generating long-term value.",
      visual: "ROI metrics animation showing dramatic improvements",
      duration: 3000,
      emotion: 'impact',
      metrics: {
        time: "10,000x faster",
        cost: "99.9% cheaper",
        efficiency: "700% ROI"
      }
    }
  ];

  return (
    <div className="space-y-6">
      <InteractiveStoryDemo steps={demoSteps} />
      
      {/* 3-Minute Winning Pitch Script */}
      <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-yellow-900">🎤 3-Minute Winning Pitch Script</h3>
              <p className="text-yellow-700">Memorize this emotional story for maximum impact</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-gray-900 mb-2">[0:00-0:20] EMOTIONAL HOOK</h4>
              <p className="text-gray-700">
                "Meet Sarah - she just lost $500 in a failed NFT mint. In traditional Web3, she'd wait 3 days for support and probably never get her money back."
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-2">[0:20-1:00] LIVE DEMO</h4>
              <p className="text-gray-700">
                "[Show actual voice input] 'My NFT mint failed and I need help' [Show real-time Coral Protocol agent coordination] [Show actual NFT minting as compensation] Problem solved in 0.3 seconds with automatic blockchain compensation."
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border border-purple-200">
              <h4 className="font-semibold text-gray-900 mb-2">[1:00-1:40] CORAL PROTOCOL POWER</h4>
              <p className="text-gray-700">
                "This is only possible through Coral Protocol's multi-agent orchestration - the first rentable voice-AI support system for Web3."
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border border-green-200">
              <h4 className="font-semibold text-gray-900 mb-2">[1:40-2:20] BUSINESS IMPACT</h4>
              <p className="text-gray-700">
                "We've solved a $2.4B market problem. Web3 platforms can reduce support costs by 97% and resolution time by 10,000x."
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border border-red-200">
              <h4 className="font-semibold text-gray-900 mb-2">[2:20-3:00] THE ASK</h4>
              <p className="text-gray-700">
                "RUSH is ready to scale across the entire Web3 ecosystem through Coral Registry. Who's ready to transform Web3 support with us?"
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmotionalDemoScript;
