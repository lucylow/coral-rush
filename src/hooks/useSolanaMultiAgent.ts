// src/hooks/useSolanaMultiAgent.ts
import { useState, useCallback } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import axios from 'axios';

interface MultiAgentExecutionOptions {
  command: string;
  useOnChainLog?: boolean;
  timeout?: number;
}

interface MultiAgentResult {
  success: boolean;
  agents: Record<string, any>;
  decision: string;
  txSignature?: string;
  explorerUrl?: string;
  timestamp: string;
  processingTimeMs?: number;
}

interface SolanaTransactionStatus {
  signature: string;
  confirmed: boolean;
  slot?: number;
  blockTime?: number | null;
  err?: any;
}

export function useSolanaMultiAgent() {
  const { publicKey, connected, signTransaction } = useWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<MultiAgentResult | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

  const executeMultiAgent = useCallback(async (options: MultiAgentExecutionOptions) => {
    setLoading(true);
    try {
      const payload = {
        command: options.command,
        userWallet: publicKey?.toBase58(),
        useOnChainLog: options.useOnChainLog ?? true
      };

      const response = await axios.post(`${API_BASE_URL}/api/ai/execute`, payload, {
        timeout: options.timeout || 60000, // 1 minute default
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result: MultiAgentResult = response.data;
      setLastResult(result);
      return result;

    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Multi-agent execution failed';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [publicKey, API_BASE_URL]);

  const checkTransactionStatus = useCallback(async (signature: string): Promise<SolanaTransactionStatus> => {
    if (!connection) {
      throw new Error('Solana connection not available');
    }

    try {
      const status = await connection.getSignatureStatus(signature, {
        searchTransactionHistory: true
      });

      const confirmed = status.value?.confirmationStatus === 'confirmed' || 
                       status.value?.confirmationStatus === 'finalized';

      let blockTime: number | null = null;
      let slot: number | undefined = undefined;

      if (confirmed && status.value?.slot) {
        slot = status.value.slot;
        blockTime = await connection.getBlockTime(slot);
      }

      return {
        signature,
        confirmed,
        slot,
        blockTime,
        err: status.value?.err || null
      };
    } catch (error) {
      throw new Error(`Failed to check transaction status: ${error.message}`);
    }
  }, [connection]);

  const getAccountTransactions = useCallback(async (address?: string, limit: number = 10) => {
    if (!connection) {
      throw new Error('Solana connection not available');
    }

    const targetAddress = address ? new PublicKey(address) : publicKey;
    if (!targetAddress) {
      throw new Error('No address provided and wallet not connected');
    }

    try {
      const signatures = await connection.getSignaturesForAddress(
        targetAddress,
        { limit },
        'confirmed'
      );

      const transactions = await Promise.all(
        signatures.map(async (sig) => {
          try {
            const tx = await connection.getTransaction(sig.signature, {
              maxSupportedTransactionVersion: 0
            });
            return {
              signature: sig.signature,
              slot: sig.slot,
              blockTime: sig.blockTime,
              err: sig.err,
              transaction: tx
            };
          } catch (error) {
            return {
              signature: sig.signature,
              slot: sig.slot,
              blockTime: sig.blockTime,
              err: sig.err || error.message,
              transaction: null
            };
          }
        })
      );

      return transactions;
    } catch (error) {
      throw new Error(`Failed to fetch account transactions: ${error.message}`);
    }
  }, [connection, publicKey]);

  const checkBackendHealth = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/health`, {
        timeout: 5000
      });
      return response.data;
    } catch (error) {
      throw new Error(`Backend health check failed: ${error.message}`);
    }
  }, [API_BASE_URL]);

  return {
    // State
    loading,
    connected,
    publicKey,
    lastResult,

    // Multi-agent functions
    executeMultiAgent,

    // Solana functions  
    checkTransactionStatus,
    getAccountTransactions,

    // Utility functions
    checkBackendHealth,

    // Helper computed values
    walletAddress: publicKey?.toBase58() || null,
    isConfigured: connected && !!API_BASE_URL
  };
}
