// src/pages/MultiAgentDemo.tsx
import React from 'react';
import VoiceAgent from '@/components/VoiceAgent';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function MultiAgentDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Coral Rush Multi-Agent System
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            Powered by Swarms AI with On-Chain Decision Logging
          </p>
          
          {/* Wallet Connection */}
          <div className="flex justify-center mb-6">
            <WalletMultiButton />
          </div>
          
          {/* System Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Research Agent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl">🔍</div>
                <CardDescription>Analyzes data and trends</CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Summarizer Agent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl">📝</div>
                <CardDescription>Creates actionable insights</CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Decision Agent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl">🗳️</div>
                <CardDescription>Makes recommendations</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Multi-Agent Interface */}
        <VoiceAgent />
        
        {/* Footer Info */}
        <div className="text-center mt-12 text-gray-600 dark:text-gray-400">
          <p className="text-sm">
            All agent decisions are logged transparently on Solana blockchain
          </p>
        </div>
      </div>
    </div>
  );
}
