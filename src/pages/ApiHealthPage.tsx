import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ApiHealthDashboard from '@/components/ApiHealthDashboard';
import { Settings, Activity, Zap } from 'lucide-react';

const ApiHealthPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">🌊 Coral Protocol API Health & Configuration</h1>
          <p className="text-muted-foreground">
            Monitor and test all API integrations for your voice agents system
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Voice APIs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              ElevenLabs Speech-to-Text & Text-to-Speech
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI APIs</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Mistral AI, AIML API, Nebius AI
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total APIs</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              Active edge functions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* API Health Dashboard */}
      <ApiHealthDashboard />

      {/* Configuration Info */}
      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Voice Processing APIs</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>ElevenLabs:</strong> Speech-to-text and text-to-speech conversion</li>
                <li>• <strong>Models:</strong> eleven_multilingual_v2 for optimal performance</li>
                <li>• <strong>Features:</strong> Multiple voice options, diarization support, noise reduction</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">AI Analysis APIs</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Mistral AI:</strong> Intent and emotion analysis, sentiment scoring</li>
                <li>• <strong>AIML API:</strong> Primary AI assistant with GPT-4o model</li>
                <li>• <strong>Nebius AI:</strong> Fallback assistant with Llama-3.1-70B model</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Error Handling & Fallbacks</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Graceful degradation:</strong> Fallback responses when APIs fail</li>
                <li>• <strong>Retry logic:</strong> Automatic retries with exponential backoff</li>
                <li>• <strong>Monitoring:</strong> Real-time health checks and performance metrics</li>
                <li>• <strong>Logging:</strong> Comprehensive error logging and debugging</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiHealthPage;

