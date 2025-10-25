// backend/solanaClient.js
import 'dotenv/config';
import bs58 from 'bs58';
import { Connection, Keypair, Transaction, clusterApiUrl, SystemProgram } from '@solana/web3.js';
import { createMemoInstruction } from '@solana/spl-memo';

const RPC_URL = process.env.SOLANA_RPC_URL || clusterApiUrl('devnet');
const connection = new Connection(RPC_URL, 'confirmed');

// Keypair of logger (use env private key; DO NOT COMMIT)
const KEYPAIR_B58 = process.env.SOLANA_LOGGING_KEYPAIR; // base58 secret key
const CLUSTER = process.env.SOLANA_CLUSTER || 'devnet';
const EXPLORER_BASE_URL = process.env.SOLANA_EXPLORER_URL || 'https://explorer.solana.com';

if (!KEYPAIR_B58) {
  console.warn('⚠️ SOLANA_LOGGING_KEYPAIR not set; on-chain logging disabled');
}

function getKeypairFromEnv() {
  if (!KEYPAIR_B58) return null;
  
  try {
    // Handle both raw base58 and JSON format
    let secretKey;
    if (KEYPAIR_B58.startsWith('[') && KEYPAIR_B58.endsWith(']')) {
      // JSON array format [1,2,3,...]
      secretKey = new Uint8Array(JSON.parse(KEYPAIR_B58));
    } else {
      // Base58 string format
      secretKey = bs58.decode(KEYPAIR_B58);
    }
    
    const keypair = Keypair.fromSecretKey(secretKey);
    console.log(`🔑 Solana logging keypair loaded: ${keypair.publicKey.toBase58()}`);
    return keypair;
  } catch (error) {
    console.error('❌ Failed to load Solana keypair:', error.message);
    return null;
  }
}

async function logToSolanaMemo(textPayload) {
  const keypair = getKeypairFromEnv();
  if (!keypair) {
    throw new Error('No keypair configured for on-chain logging');
  }

  try {
    console.log(`🔗 Preparing Solana memo transaction (${textPayload.length} bytes)`);
    
    // Check if payload is too long for memo (limit ~1232 bytes for safety)
    if (textPayload.length > 1200) {
      // Hash large payloads instead of storing full text
      const crypto = await import('crypto');
      const hash = crypto.createHash('sha256').update(textPayload).digest('hex');
      textPayload = JSON.stringify({
        type: 'coral_rush_ai_log_hash',
        hash: hash,
        original_size: textPayload.length,
        timestamp: new Date().toISOString()
      });
      console.log(`📦 Payload too large, storing hash instead: ${hash.slice(0, 16)}...`);
    }

    // Create memo instruction
    const memoInstruction = createMemoInstruction(textPayload, [keypair.publicKey]);

    // Get recent blockhash
    const { blockhash } = await connection.getLatestBlockhash('confirmed');
    
    // Create transaction
    const transaction = new Transaction({
      feePayer: keypair.publicKey,
      recentBlockhash: blockhash
    });
    
    transaction.add(memoInstruction);

    // Send and confirm transaction
    console.log(`📡 Sending memo transaction...`);
    const signature = await connection.sendTransaction(transaction, [keypair], {
      skipPreflight: false,
      preflightCommitment: 'confirmed'
    });

    console.log(`⏳ Confirming transaction: ${signature}`);
    const confirmation = await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight: (await connection.getLatestBlockhash()).lastValidBlockHeight
    }, 'confirmed');

    if (confirmation.value.err) {
      throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`);
    }

    const explorerUrl = `${EXPLORER_BASE_URL}/tx/${signature}?cluster=${CLUSTER}`;
    
    console.log(`✅ Solana memo logged successfully: ${signature}`);
    
    return { 
      signature, 
      explorerUrl,
      cluster: CLUSTER,
      keypair_address: keypair.publicKey.toBase58(),
      payload_size: textPayload.length
    };

  } catch (error) {
    console.error('❌ Solana memo logging failed:', error);
    throw new Error(`On-chain logging failed: ${error.message}`);
  }
}

// Helper function to check Solana connection and balance
async function checkSolanaStatus() {
  try {
    const keypair = getKeypairFromEnv();
    if (!keypair) {
      return { configured: false, error: 'No keypair configured' };
    }

    const balance = await connection.getBalance(keypair.publicKey);
    const version = await connection.getVersion();
    
    return {
      configured: true,
      address: keypair.publicKey.toBase58(),
      balance_sol: balance / 1e9, // Convert lamports to SOL
      cluster: CLUSTER,
      rpc_url: RPC_URL,
      solana_version: version['solana-core']
    };
  } catch (error) {
    return {
      configured: false,
      error: error.message
    };
  }
}

export { logToSolanaMemo, checkSolanaStatus };
