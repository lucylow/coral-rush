import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, Play, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white">
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-slate-900/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold">RUSH</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/features" className="text-slate-300 hover:text-white transition-colors">Features</Link>
              <Link to="/dashboard" className="text-slate-300 hover:text-white transition-colors">Dashboard</Link>
              <Link to="/agents" className="text-slate-300 hover:text-white transition-colors">Agents</Link>
              <Link to="/docs" className="text-slate-300 hover:text-white transition-colors">Docs</Link>
              <Button variant="outline" className="border-slate-700 hover:border-slate-600">
                Connect
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-200px)]">
          
          {/* Left Side - Hero Content */}
          <div className="space-y-8">
            <Badge variant="outline" className="inline-flex items-center gap-2 px-4 py-2 border-blue-500/50 text-blue-400 bg-blue-500/10">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              🚀 Revolutionary Web3 Support
            </Badge>

            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Speak Your{" "}
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                  Web3 Problems
                </span>{" "}
                Away
              </h1>

              <p className="text-xl text-slate-300 leading-relaxed max-w-2xl">
                RUSH transforms Web3 customer support with voice-first AI agents that understand, analyze, and resolve blockchain issues in real-time through natural conversation.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/voice-agent">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-medium"
                >
                  Start Voice Support
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-slate-700 hover:border-slate-600 hover:bg-slate-800/50 px-8 py-4 text-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Try Voice Demo
              </Button>
            </div>
          </div>

          {/* Right Side - Live Demo */}
          <div className="flex justify-center lg:justify-end">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm p-8 w-full max-w-md">
              <CardContent className="text-center space-y-6">
                <div className="flex items-center justify-center gap-2 text-slate-300 mb-4">
                  <Mic className="w-5 h-5" />
                  <span className="text-lg font-medium">Live Voice Demo</span>
                </div>

                <div 
                  className={`relative w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center cursor-pointer transition-all duration-300 ${
                    isHovered ? 'scale-110 shadow-2xl shadow-blue-500/25' : 'scale-100'
                  }`}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <Mic className="w-12 h-12 text-white" />
                  <div className={`absolute inset-0 rounded-full border-4 border-blue-400/30 ${isHovered ? 'animate-ping' : ''}`} />
                </div>

                <p className="text-slate-400 text-sm">
                  Click the microphone to experience RUSH in action
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 pt-16 border-t border-slate-800/50">
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold text-green-400">98%</div>
            <div className="text-slate-400">Resolution Rate</div>
          </div>
          
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold text-blue-400">30s</div>
            <div className="text-slate-400">Avg Response</div>
          </div>
          
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold text-purple-400">24/7</div>
            <div className="text-slate-400">AI Availability</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;