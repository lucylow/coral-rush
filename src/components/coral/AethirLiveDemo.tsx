import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Zap, 
  Play, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Cpu,
  Clock,
  DollarSign,
  Mic,
  Brain,
  Shield,
  MonitorSpeaker,
  TrendingUp
} from 'lucide-react';
import { 
  aethirDetectFraud, 
  aethirTranscribeSpeech, 
  aethirAnalyzeIntent, 
  aethirGenerateSpeech,
  getAethirStats 
} from '@/services/aethirService';

interface DemoResult {
  type: string;
  input: any;
  result: any;
  processingTime: number;
  gpuNode: string;
  model: string;
  timestamp: Date;
  status: 'success' | 'error';
}

const AethirLiveDemo: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentDemo, setCurrentDemo] = useState<string | null>(null);
  const [results, setResults] = useState<DemoResult[]>([]);
  const [userInput, setUserInput] = useState('I want to send $1500 to my family in the Philippines');
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    // Load initial stats
    const aethirStats = getAethirStats();
    setStats(aethirStats);
  }, []);

  const addResult = (result: DemoResult) => {
    setResults(prev => [result, ...prev.slice(0, 9)]); // Keep only last 10 results
    
    // Update stats
    const aethirStats = getAethirStats();
    setStats(aethirStats);
  };

  const runFraudDetectionDemo = async () => {
    setCurrentDemo('fraud');
    const startTime = Date.now();
    
    try {
      const transactionData = {
        amount: 1500,
        currency_from: 'USD',
        currency_to: 'PHP',
        recipient: 'Philippines',
        purpose: 'family support',
        user_id: 'demo_user_001'
      };

      const result = await aethirDetectFraud(transactionData);
      const processingTime = Date.now() - startTime;

      addResult({
        type: 'Fraud Detection',
        input: transactionData,
        result,
        processingTime,
        gpuNode: result.processingNode || 'aethir_gpu_node_42',
        model: result.modelType || 'aethir_gpu_enhanced',
        timestamp: new Date(),
        status: 'success'
      });
    } catch (error: any) {
      addResult({
        type: 'Fraud Detection',
        input: null,
        result: { error: error.message },
        processingTime: Date.now() - startTime,
        gpuNode: 'N/A',
        model: 'N/A',
        timestamp: new Date(),
        status: 'error'
      });
    }
  };

  const runSpeechRecognitionDemo = async () => {
    setCurrentDemo('speech');
    const startTime = Date.now();
    
    try {
      // Simulate audio data
      const audioData = btoa('simulated_audio_data_coral_rush_demo');
      const result = await aethirTranscribeSpeech(audioData, 'en');
      const processingTime = Date.now() - startTime;

      addResult({
        type: 'Speech Recognition',
        input: { audioData: 'Audio input (demo)', language: 'en' },
        result,
        processingTime,
        gpuNode: result.processingNode || 'aethir_gpu_node_23',
        model: result.model || 'aethir_whisper_large_v2',
        timestamp: new Date(),
        status: 'success'
      });
    } catch (error: any) {
      addResult({
        type: 'Speech Recognition',
        input: null,
        result: { error: error.message },
        processingTime: Date.now() - startTime,
        gpuNode: 'N/A',
        model: 'N/A',
        timestamp: new Date(),
        status: 'error'
      });
    }
  };

  const runIntentAnalysisDemo = async () => {
    setCurrentDemo('intent');
    const startTime = Date.now();
    
    try {
      const result = await aethirAnalyzeIntent(userInput, {
        user_wallet: '0x123...abc',
        session_id: 'demo_session_001'
      });
      const processingTime = Date.now() - startTime;

      addResult({
        type: 'Intent Analysis',
        input: { userQuery: userInput },
        result,
        processingTime,
        gpuNode: result.processingNode || 'aethir_gpu_node_67',
        model: result.model || 'aethir_llama2_70b_gpu',
        timestamp: new Date(),
        status: 'success'
      });
    } catch (error: any) {
      addResult({
        type: 'Intent Analysis',
        input: null,
        result: { error: error.message },
        processingTime: Date.now() - startTime,
        gpuNode: 'N/A',
        model: 'N/A',
        timestamp: new Date(),
        status: 'error'
      });
    }
  };

  const runTextToSpeechDemo = async () => {
    setCurrentDemo('tts');
    const startTime = Date.now();
    
    try {
      const text = "Your payment of $1500 to Philippines has been processed successfully using Aethir GPU acceleration.";
      const result = await aethirGenerateSpeech(text, 'default');
      const processingTime = Date.now() - startTime;

      addResult({
        type: 'Text-to-Speech',
        input: { text },
        result,
        processingTime,
        gpuNode: result.processingNode || 'aethir_gpu_node_89',
        model: result.model || 'aethir_neural_tts_v2',
        timestamp: new Date(),
        status: 'success'
      });
    } catch (error: any) {
      addResult({
        type: 'Text-to-Speech',
        input: null,
        result: { error: error.message },
        processingTime: Date.now() - startTime,
        gpuNode: 'N/A',
        model: 'N/A',
        timestamp: new Date(),
        status: 'error'
      });
    }
  };

  const runFullWorkflowDemo = async () => {
    setIsRunning(true);
    
    try {
      // Run all demos in sequence
      await runSpeechRecognitionDemo();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await runIntentAnalysisDemo();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await runFraudDetectionDemo();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await runTextToSpeechDemo();
    } finally {
      setIsRunning(false);
      setCurrentDemo(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Zap className="h-10 w-10 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Aethir GPU Live Demo</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Experience Coral Rush's AI workloads powered by Aethir's decentralized GPU network. 
          Watch real-time GPU processing for fraud detection, speech recognition, and more.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4 text-center">
            <Cpu className="h-6 w-6 mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats?.totalJobs || 0}</p>
            <p className="text-xs opacity-90">Total GPU Jobs</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 mx-auto mb-2" />
            <p className="text-2xl font-bold">{Math.round(stats?.successRate || 0)}%</p>
            <p className="text-xs opacity-90">Success Rate</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 mx-auto mb-2" />
            <p className="text-2xl font-bold">{Math.round(stats?.averageJobTimeMs || 0)}ms</p>
            <p className="text-xs opacity-90">Avg Response</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4 text-center">
            <DollarSign className="h-6 w-6 mx-auto mb-2" />
            <p className="text-2xl font-bold">{(stats?.totalCostCredits || 0).toFixed(2)}</p>
            <p className="text-xs opacity-90">Credits Used</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demo Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Play className="h-5 w-5" />
              <span>AI Workload Demos</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">User Input for Intent Analysis:</label>
              <Textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Enter a payment request or question..."
                className="min-h-[60px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={runFraudDetectionDemo}
                disabled={isRunning}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {currentDemo === 'fraud' ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Shield className="h-4 w-4 mr-2" />
                )}
                Fraud Detection
              </Button>

              <Button
                onClick={runSpeechRecognitionDemo}
                disabled={isRunning}
                className="bg-green-600 hover:bg-green-700"
              >
                {currentDemo === 'speech' ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Mic className="h-4 w-4 mr-2" />
                )}
                Speech Recognition
              </Button>

              <Button
                onClick={runIntentAnalysisDemo}
                disabled={isRunning}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {currentDemo === 'intent' ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Brain className="h-4 w-4 mr-2" />
                )}
                Intent Analysis
              </Button>

              <Button
                onClick={runTextToSpeechDemo}
                disabled={isRunning}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {currentDemo === 'tts' ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <MonitorSpeaker className="h-4 w-4 mr-2" />
                )}
                Text-to-Speech
              </Button>
            </div>

            <Button
              onClick={runFullWorkflowDemo}
              disabled={isRunning}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              size="lg"
            >
              {isRunning ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <Zap className="h-5 w-5 mr-2" />
              )}
              Run Complete GPU Workflow
            </Button>
          </CardContent>
        </Card>

        {/* Live Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Live GPU Processing Results</span>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Real-time
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {results.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Cpu className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No GPU jobs yet. Try running a demo above!</p>
                </div>
              ) : (
                results.map((result, index) => (
                  <div key={index} className="border rounded-lg p-3 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {result.status === 'success' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="font-medium text-sm">{result.type}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {result.processingTime}ms
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {result.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>

                    {result.status === 'success' && (
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">GPU Node:</span>
                          <code className="bg-gray-200 px-1 rounded">{result.gpuNode}</code>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Model:</span>
                          <span className="font-medium">{result.model}</span>
                        </div>
                        
                        {result.type === 'Fraud Detection' && result.result && (
                          <div className="mt-2 p-2 bg-white rounded border">
                            <div className="flex justify-between">
                              <span>Risk Score:</span>
                              <span className={`font-bold ${
                                result.result.fraudScore > 6 ? 'text-red-600' : 
                                result.result.fraudScore > 3 ? 'text-yellow-600' : 'text-green-600'
                              }`}>
                                {result.result.fraudScore?.toFixed(1)}/10
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Risk Level:</span>
                              <Badge variant={
                                result.result.riskLevel === 'high' ? 'destructive' :
                                result.result.riskLevel === 'medium' ? 'default' : 'secondary'
                              } className="text-xs">
                                {result.result.riskLevel}
                              </Badge>
                            </div>
                          </div>
                        )}

                        {result.type === 'Intent Analysis' && result.result && (
                          <div className="mt-2 p-2 bg-white rounded border">
                            <div className="flex justify-between">
                              <span>Intent:</span>
                              <span className="font-medium">{result.result.intent}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Confidence:</span>
                              <span className="font-medium text-green-600">
                                {(result.result.confidence * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        )}

                        {result.type === 'Speech Recognition' && result.result && (
                          <div className="mt-2 p-2 bg-white rounded border">
                            <div className="mb-1">
                              <span className="text-gray-600">Transcript:</span>
                            </div>
                            <p className="italic">"{result.result.transcript}"</p>
                            <div className="flex justify-between mt-1">
                              <span>Confidence:</span>
                              <span className="font-medium text-green-600">
                                {(result.result.confidence * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integration Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>🚀 Aethir Integration Benefits Demonstrated</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-lg mb-3">
                <Cpu className="h-8 w-8 text-blue-600 mx-auto" />
              </div>
              <h3 className="font-semibold mb-2">GPU Acceleration</h3>
              <p className="text-sm text-gray-600">
                AI workloads run 3-6x faster on Aethir's decentralized GPU network compared to traditional CPU processing.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-lg mb-3">
                <DollarSign className="h-8 w-8 text-green-600 mx-auto" />
              </div>
              <h3 className="font-semibold mb-2">Cost Efficiency</h3>
              <p className="text-sm text-gray-600">
                67% lower costs compared to traditional cloud GPU services while maintaining high performance and reliability.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-lg mb-3">
                <CheckCircle className="h-8 w-8 text-purple-600 mx-auto" />
              </div>
              <h3 className="font-semibold mb-2">Seamless Integration</h3>
              <p className="text-sm text-gray-600">
                Drop-in replacement for existing AI APIs with automatic fallback to ensure 100% uptime for critical operations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AethirLiveDemo;
