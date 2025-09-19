import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Zap, Shield, Brain, Headphones, ArrowRight, Play, Menu, X, CheckCircle, Star, Users, TrendingUp } from "lucide-react";

const RushLandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDemoActive, setIsDemoActive] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "DeFi Trader",
      avatar: "SC",
      rating: 5,
      text: "RUSH solved my failed swap in 30 seconds. The voice interface made it so natural - no more confusing documentation!"
    },
    {
      name: "Marcus Rodriguez",
      role: "NFT Creator", 
      avatar: "MR",
      rating: 5,
      text: "When my NFT minting failed, RUSH not only diagnosed the issue but minted a compensation NFT immediately. Incredible!"
    },
    {
      name: "Alex Thompson",
      role: "Web3 Developer",
      avatar: "AT", 
      rating: 5,
      text: "The multi-agent coordination is brilliant. Watching the AI agents work together to solve my wallet issues was fascinating."
    }
  ];

  const startDemo = () => {
    setIsDemoActive(true);
    setDemoStep(1);
    
    const steps = [
      { delay: 1000, step: 2, message: "Listening..." },
      { delay: 3000, step: 3, message: "Analyzing: 'My NFT transaction failed'" },
      { delay: 5000, step: 4, message: "Checking blockchain & minting compensation NFT..." },
      { delay: 7000, step: 5, message: "Complete! Check your wallet for the resolution NFT." }
    ];

    steps.forEach(({ delay, step, message }) => {
      setTimeout(() => setDemoStep(step), delay);
    });

    setTimeout(() => {
      setIsDemoActive(false);
      setDemoStep(0);
    }, 9000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Mic className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                RUSH
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-gray-300 hover:text-white transition-colors">Features</Link>
              <Link to="/voice-agent" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
              <Link to="/marketplace" className="text-gray-300 hover:text-white transition-colors">Agents</Link>
              <Link to="/docs" className="text-gray-300 hover:text-white transition-colors">Docs</Link>
              <Button variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10">
                Connect Wallet
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 py-4 border-t border-white/10">
              <div className="flex flex-col gap-4">
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">Features</Link>
                <Link to="/voice-agent" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
                <Link to="/marketplace" className="text-gray-300 hover:text-white transition-colors">Agents</Link>
                <Link to="/docs" className="text-gray-300 hover:text-white transition-colors">Docs</Link>
                <Button variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 w-fit">
                  Connect Wallet
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-6 border-purple-500/50 text-purple-400">
                🚀 Revolutionary Web3 Support
              </Badge>
              <h1 className="text-6xl lg:text-7xl font-bold mb-6">
                Speak Your{" "}
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                  Web3 Problems
                </span>{" "}
                Away
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                RUSH transforms Web3 customer support with voice-first AI agents that understand, 
                analyze, and resolve blockchain issues in real-time through natural conversation.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/voice-agent">
                  <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    Start Voice Support
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={startDemo}
                  disabled={isDemoActive}
                  className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                >
                  <Play className="w-5 h-5 mr-2" />
                  {isDemoActive ? "Running Demo..." : "Try Voice Demo"}
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-bold text-green-400">98%</div>
                  <div className="text-sm text-gray-400">Resolution Rate</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-400">30s</div>
                  <div className="text-sm text-gray-400">Avg Response</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400">24/7</div>
                  <div className="text-sm text-gray-400">AI Availability</div>
                </div>
              </div>
            </div>

            {/* Interactive Demo Panel */}
            <div className="lg:block">
              <Card className="bg-black/40 border-white/10 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mic className="w-5 h-5 text-blue-400" />
                    Live Voice Demo
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-6">
                    <div 
                      className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                        isDemoActive 
                          ? "bg-red-500 shadow-lg shadow-red-500/25 animate-pulse" 
                          : "bg-gradient-to-br from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-purple-500/25"
                      }`}
                      onClick={startDemo}
                    >
                      {isDemoActive ? (
                        <div className="w-8 h-8 bg-white rounded-sm" />
                      ) : (
                        <Mic className="w-8 h-8" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {demoStep >= 1 && (
                      <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <div className="flex items-center gap-2 text-blue-400 text-sm">
                          <Headphones className="w-4 h-4" />
                          {demoStep === 1 ? "Recording..." : "Speech processed"}
                        </div>
                      </div>
                    )}
                    
                    {demoStep >= 3 && (
                      <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                        <div className="flex items-center gap-2 text-orange-400 text-sm">
                          <Brain className="w-4 h-4" />
                          Issue analyzed: Failed NFT transaction
                        </div>
                      </div>
                    )}
                    
                    {demoStep >= 4 && (
                      <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                        <div className="flex items-center gap-2 text-green-400 text-sm">
                          <Zap className="w-4 h-4" />
                          Compensation NFT minted successfully!
                        </div>
                      </div>
                    )}
                  </div>

                  {demoStep === 0 && !isDemoActive && (
                    <p className="text-gray-400 text-sm mt-4">
                      Click the microphone to experience RUSH in action
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Why Choose RUSH for{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Web3 Support?
              </span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Experience the future of Web3 customer support with AI-powered voice assistance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-black/40 border-white/10 backdrop-blur-md hover:border-blue-500/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Mic className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">Voice-First Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  Natural conversation replaces complex forms and documentation. Just speak your problem.
                </p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    95%+ speech recognition accuracy
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Multilingual support (12 languages)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Real-time voice responses
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-white/10 backdrop-blur-md hover:border-purple-500/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">Multi-Agent Intelligence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  Specialized AI agents coordinate to provide comprehensive Web3 support.
                </p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Listener Agent for voice processing
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Brain Agent for problem analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Executor Agent for blockchain actions
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-white/10 backdrop-blur-md hover:border-green-500/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">Real Blockchain Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  Don't just get advice - get actual solutions with blockchain transactions.
                </p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Automatic NFT compensation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Transaction verification & retry
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Multi-chain support
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">How RUSH Works</h2>
            <p className="text-gray-300 text-lg">Three AI agents working in perfect harmony</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Headphones className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-blue-400">1. Listener Agent</h3>
              <p className="text-gray-300">
                Captures and processes your voice input using advanced speech recognition technology
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-orange-400">2. Brain Agent</h3>
              <p className="text-gray-300">
                Analyzes your request, understands the context, and formulates the optimal solution strategy
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-green-400">3. Executor Agent</h3>
              <p className="text-gray-300">
                Takes action on the blockchain to resolve your issue and provides confirmation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">What Users Say</h2>
            <p className="text-gray-300 text-lg">Real feedback from the Web3 community</p>
          </div>

          <Card className="max-w-4xl mx-auto bg-black/40 border-white/10 backdrop-blur-md">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-xl text-gray-200 mb-6 italic">
                  "{testimonials[currentTestimonial].text}"
                </blockquote>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold">
                    {testimonials[currentTestimonial].avatar}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">{testimonials[currentTestimonial].name}</div>
                    <div className="text-sm text-gray-400">{testimonials[currentTestimonial].role}</div>
                  </div>
                </div>
                
                <div className="flex justify-center gap-2 mt-6">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentTestimonial ? 'bg-purple-500' : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-6">
            Ready to Experience the Future of{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Web3 Support?
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of Web3 users who've discovered the power of voice-first AI assistance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/voice-agent">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                Start Free Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/docs">
              <Button size="lg" variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Mic className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold">RUSH</span>
              </div>
              <p className="text-gray-400 text-sm">
                Rapid User Support Hub - Voice-First Web3 Customer Support
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <Link to="/voice-agent" className="block hover:text-white transition-colors">Dashboard</Link>
                <Link to="/history" className="block hover:text-white transition-colors">Support History</Link>
                <Link to="/marketplace" className="block hover:text-white transition-colors">Agent Marketplace</Link>
                <Link to="/analytics" className="block hover:text-white transition-colors">Analytics</Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <Link to="/docs" className="block hover:text-white transition-colors">Documentation</Link>
                <a href="#" className="block hover:text-white transition-colors">API Reference</a>
                <a href="#" className="block hover:text-white transition-colors">Tutorials</a>
                <a href="#" className="block hover:text-white transition-colors">Community</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <a href="#" className="block hover:text-white transition-colors">About</a>
                <a href="#" className="block hover:text-white transition-colors">Careers</a>
                <a href="#" className="block hover:text-white transition-colors">Privacy</a>
                <a href="#" className="block hover:text-white transition-colors">Terms</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>© 2024 RUSH. All rights reserved. Powered by ElevenLabs, Mistral AI, and Crossmint.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RushLandingPage;