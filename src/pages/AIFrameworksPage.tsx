import React from 'react';
import { Helmet } from 'react-helmet-async';
import AIFrameworksShowcase from '../components/AIFrameworksShowcase';

const AIFrameworksPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>AI Frameworks Integration - Coral Rush</title>
        <meta name="description" content="Explore the integrated AI frameworks powering Coral Rush: Solana Agent Kit, Código AI, Noah AI, Rig Framework, ZerePy, and Eliza Framework" />
        <meta name="keywords" content="AI frameworks, Solana, Web3, smart contracts, autonomous agents, conversational AI" />
      </Helmet>
      
      <AIFrameworksShowcase />
    </>
  );
};

export default AIFrameworksPage;
