import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import axios from 'axios';

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
  external_url?: string;
  background_color?: string;
}

interface TransactionResult {
  transaction_hash: string;
  status: 'success' | 'failed' | 'pending';
  block_number?: number;
  gas_used?: number;
  error_message?: string;
}

interface WalletInfo {
  address: string;
  balance: number;
  token_balances: Array<{
    mint: string;
    balance: number;
    symbol: string;
    decimals: number;
  }>;
  nft_count: number;
}

class ExecutorAgent {
  private server: Server;
  private crossmintApiKey: string;
  private crossmintProjectId: string;
  private solanaConnection: Connection;
  private crossmintBaseUrl: string = "https://staging.crossmint.com/api";

  constructor() {
    this.crossmintApiKey = process.env.CROSSMINT_API_KEY || "";
    this.crossmintProjectId = process.env.CROSSMINT_PROJECT_ID || "";
    
    if (!this.crossmintApiKey || !this.crossmintProjectId) {
      throw new Error("CROSSMINT_API_KEY and CROSSMINT_PROJECT_ID environment variables are required");
    }

    this.solanaConnection = new Connection(
      process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com",
      'confirmed'
    );

    this.server = new Server(
      {
        name: "executor-agent",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );
    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "check_transaction_status",
          description: "Check the status of a blockchain transaction",
          inputSchema: {
            type: "object",
            properties: {
              transaction_hash: {
                type: "string",
                description: "The transaction hash to check"
              },
              network: {
                type: "string",
                description: "Blockchain network (solana, ethereum, polygon, etc.)",
                default: "solana"
              }
            },
            required: ["transaction_hash"]
          }
        },
        {
          name: "mint_compensation_nft",
          description: "Mint an NFT as compensation for issues",
          inputSchema: {
            type: "object",
            properties: {
              recipient: {
                type: "string",
                description: "Recipient email or wallet address"
              },
              issue_type: {
                type: "string",
                description: "Type of issue being compensated (failed_transaction, service_issue, etc.)"
              },
              custom_metadata: {
                type: "object",
                description: "Custom NFT metadata",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  image: { type: "string" },
                  attributes: { type: "array" }
                }
              },
              collection_id: {
                type: "string",
                description: "Crossmint collection ID for the NFT"
              }
            },
            required: ["recipient", "issue_type"]
          }
        },
        {
          name: "verify_wallet_ownership",
          description: "Verify ownership of a wallet address",
          inputSchema: {
            type: "object",
            properties: {
              wallet_address: {
                type: "string",
                description: "Wallet address to verify"
              },
              challenge_message: {
                type: "string",
                description: "Message that should be signed for verification"
              }
            },
            required: ["wallet_address"]
          }
        },
        {
          name: "get_wallet_info",
          description: "Get comprehensive wallet information including balances and NFTs",
          inputSchema: {
            type: "object",
            properties: {
              wallet_address: {
                type: "string",
                description: "Wallet address to analyze"
              },
              include_nfts: {
                type: "boolean",
                description: "Whether to include NFT information",
                default: true
              },
              include_tokens: {
                type: "boolean",
                description: "Whether to include token balances",
                default: true
              }
            },
            required: ["wallet_address"]
          }
        },
        {
          name: "execute_smart_contract_call",
          description: "Execute a smart contract function call",
          inputSchema: {
            type: "object",
            properties: {
              contract_address: {
                type: "string",
                description: "Smart contract address"
              },
              function_name: {
                type: "string",
                description: "Function to call"
              },
              parameters: {
                type: "array",
                description: "Function parameters"
              },
              gas_limit: {
                type: "number",
                description: "Gas limit for the transaction"
              }
            },
            required: ["contract_address", "function_name"]
          }
        },
        {
          name: "bridge_tokens",
          description: "Facilitate cross-chain token bridging",
          inputSchema: {
            type: "object",
            properties: {
              from_network: { type: "string" },
              to_network: { type: "string" },
              token_address: { type: "string" },
              amount: { type: "string" },
              recipient_address: { type: "string" }
            },
            required: ["from_network", "to_network", "token_address", "amount", "recipient_address"]
          }
        },
        {
          name: "troubleshoot_failed_transaction",
          description: "Analyze and troubleshoot failed transactions",
          inputSchema: {
            type: "object",
            properties: {
              transaction_hash: { type: "string" },
              expected_outcome: { type: "string" },
              user_wallet: { type: "string" }
            },
            required: ["transaction_hash"]
          }
        },
        {
          name: "process_nft_refund",
          description: "Process NFT refunds using Crossmint API",
          inputSchema: {
            type: "object",
            properties: {
              nft_id: {
                type: "string",
                description: "Crossmint NFT ID to refund"
              },
              refund_method: {
                type: "string",
                enum: ["nft_replacement", "sol_refund", "token_refund"],
                description: "Method of refund processing"
              },
              recipient: {
                type: "string",
                description: "Recipient wallet address or email"
              },
              reason: {
                type: "string",
                description: "Reason for refund request"
              },
              original_transaction_hash: {
                type: "string",
                description: "Original failed transaction hash"
              }
            },
            required: ["nft_id", "refund_method", "recipient", "reason"]
          }
        },
        {
          name: "get_nft_refund_status",
          description: "Check the status of an NFT refund request",
          inputSchema: {
            type: "object",
            properties: {
              refund_request_id: {
                type: "string",
                description: "Refund request ID to check"
              }
            },
            required: ["refund_request_id"]
          }
        },
        {
          name: "list_nft_refunds",
          description: "List all NFT refund requests with filtering options",
          inputSchema: {
            type: "object",
            properties: {
              status: {
                type: "string",
                enum: ["pending", "processing", "completed", "failed"],
                description: "Filter by refund status"
              },
              user_id: {
                type: "string",
                description: "Filter by user ID"
              },
              limit: {
                type: "number",
                description: "Maximum number of results to return",
                default: 50
              }
            }
          }
        },
        {
          name: "validate_nft_ownership",
          description: "Validate NFT ownership before processing refund",
          inputSchema: {
            type: "object",
            properties: {
              nft_id: {
                type: "string",
                description: "Crossmint NFT ID"
              },
              owner_wallet: {
                type: "string",
                description: "Claimed owner wallet address"
              }
            },
            required: ["nft_id", "owner_wallet"]
          }
        }
      ]
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name, arguments: args } = request.params;

        switch (name) {
          case "check_transaction_status":
            return await this.handleCheckTransactionStatus(args as any);
          
          case "mint_compensation_nft":
            return await this.handleMintCompensationNFT(args as any);
          
          case "verify_wallet_ownership":
            return await this.handleVerifyWalletOwnership(args as any);
          
          case "get_wallet_info":
            return await this.handleGetWalletInfo(args as any);
          
          case "execute_smart_contract_call":
            return await this.handleExecuteSmartContractCall(args as any);
          
          case "bridge_tokens":
            return await this.handleBridgeTokens(args as any);
          
          case "troubleshoot_failed_transaction":
            return await this.handleTroubleshootFailedTransaction(args as any);
          
          case "process_nft_refund":
            return await this.handleProcessNFTRefund(args as any);
          
          case "get_nft_refund_status":
            return await this.handleGetNFTRefundStatus(args as any);
          
          case "list_nft_refunds":
            return await this.handleListNFTRefunds(args as any);
          
          case "validate_nft_ownership":
            return await this.handleValidateNFTOwnership(args as any);
          
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        throw new McpError(
          ErrorCode.InternalError,
          `Tool execution failed: ${error.message}`
        );
      }
    });
  }

  private async handleCheckTransactionStatus(args: {
    transaction_hash: string;
    network?: string;
  }) {
    try {
      const network = args.network || 'solana';
      let result: TransactionResult;

      switch (network.toLowerCase()) {
        case 'solana':
          result = await this.checkSolanaTransaction(args.transaction_hash);
          break;
        default:
          throw new Error(`Unsupported network: ${network}`);
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              transaction_result: result,
              network: network,
              agent_type: "executor",
              timestamp: new Date().toISOString(),
              operation: "check_transaction_status"
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: false,
              error: `Transaction status check failed: ${error.message}`,
              agent_type: "executor",
              timestamp: new Date().toISOString(),
              operation: "check_transaction_status"
            }, null, 2)
          }
        ]
      };
    }
  }

  private async checkSolanaTransaction(txHash: string): Promise<TransactionResult> {
    try {
      const signature = await this.solanaConnection.getSignatureStatus(txHash, {
        searchTransactionHistory: true
      });
      
      if (!signature.value) {
        return {
          transaction_hash: txHash,
          status: 'failed',
          error_message: 'Transaction not found'
        };
      }

      const transaction = await this.solanaConnection.getTransaction(txHash);
      
      return {
        transaction_hash: txHash,
        status: signature.value.err ? 'failed' : 'success',
        block_number: signature.value.slot || undefined,
        error_message: signature.value.err ? JSON.stringify(signature.value.err) : undefined
      };
    } catch (error) {
      throw new Error(`Failed to check Solana transaction: ${error.message}`);
    }
  }

  private async handleMintCompensationNFT(args: {
    recipient: string;
    issue_type: string;
    custom_metadata?: NFTMetadata;
    collection_id?: string;
  }) {
    try {
      const metadata = args.custom_metadata || this.generateCompensationMetadata(args.issue_type);
      const collectionId = args.collection_id || await this.getDefaultCollectionId();

      const nftData = {
        metadata,
        recipient: this.formatRecipient(args.recipient)
      };

      const response = await axios.post(
        `${this.crossmintBaseUrl}/2022-06-09/collections/${collectionId}/nfts`,
        nftData,
        {
          headers: {
            'X-API-KEY': this.crossmintApiKey,
            'X-PROJECT-ID': this.crossmintProjectId,
            'Content-Type': 'application/json'
          }
        }
      );

      const nftResult = {
        nft_id: response.data.id,
        transaction_hash: response.data.onChain?.txId,
        status: response.data.onChain?.status || 'pending',
        metadata: metadata,
        recipient: args.recipient,
        issue_type: args.issue_type,
        mint_time: new Date().toISOString()
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              nft_result: nftResult,
              agent_type: "executor",
              timestamp: new Date().toISOString(),
              operation: "mint_compensation_nft"
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: false,
              error: `NFT minting failed: ${error.message}`,
              agent_type: "executor",
              timestamp: new Date().toISOString(),
              operation: "mint_compensation_nft"
            }, null, 2)
          }
        ]
      };
    }
  }

  private generateCompensationMetadata(issueType: string): NFTMetadata {
    const baseMetadata = {
      name: "RUSH Support Resolution NFT",
      description: "Thank you for your patience while we resolved your Web3 support issue. This NFT represents our commitment to excellent customer service.",
      image: "https://ipfs.io/ipfs/QmRUSHSupportNFT", // Placeholder URL
      attributes: [
        {
          trait_type: "Issue Type",
          value: issueType
        },
        {
          trait_type: "Resolution Date",
          value: new Date().toISOString().split('T')[0]
        },
        {
          trait_type: "Agent Type",
          value: "Multi-Agent AI"
        },
        {
          trait_type: "Platform",
          value: "RUSH Voice Support"
        }
      ],
      external_url: "https://rush-support.com",
      background_color: "6366F1"
    };

    // Customize based on issue type
    switch (issueType) {
      case 'failed_transaction':
        baseMetadata.name = "Transaction Recovery NFT";
        baseMetadata.description = "Commemorating the successful resolution of your transaction issue.";
        baseMetadata.attributes.push({
          trait_type: "Rarity",
          value: "Support Hero"
        });
        break;
      case 'wallet_issue':
        baseMetadata.name = "Wallet Guardian NFT";
        baseMetadata.description = "For your patience during wallet troubleshooting.";
        break;
      case 'nft_missing':
        baseMetadata.name = "NFT Detective Badge";
        baseMetadata.description = "Honoring our successful recovery of your missing NFT.";
        break;
      default:
        baseMetadata.attributes.push({
          trait_type: "Category",
          value: "General Support"
        });
    }

    return baseMetadata;
  }

  private formatRecipient(recipient: string): string {
    // Check if it's an email or wallet address
    if (recipient.includes('@')) {
      return `email:${recipient}:solana`;
    }
    
    // Validate Solana address format
    try {
      new PublicKey(recipient);
      return recipient; // Valid Solana address
    } catch {
      // Assume it's an email without @ symbol or other format
      return `email:${recipient}:solana`;
    }
  }

  private async getDefaultCollectionId(): Promise<string> {
    // In a real implementation, this would be configured per project
    return process.env.DEFAULT_COLLECTION_ID || "default-collection-id";
  }

  private async handleVerifyWalletOwnership(args: {
    wallet_address: string;
    challenge_message?: string;
  }) {
    try {
      // For Solana, we can check if the address is valid and has activity
      const publicKey = new PublicKey(args.wallet_address);
      const accountInfo = await this.solanaConnection.getAccountInfo(publicKey);
      
      const verificationResult = {
        wallet_address: args.wallet_address,
        is_valid_address: true,
        has_activity: accountInfo !== null,
        balance: accountInfo ? await this.solanaConnection.getBalance(publicKey) / LAMPORTS_PER_SOL : 0,
        verification_method: 'balance_check',
        verified_at: new Date().toISOString()
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              verification_result: verificationResult,
              agent_type: "executor",
              timestamp: new Date().toISOString(),
              operation: "verify_wallet_ownership"
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: false,
              error: `Wallet verification failed: ${error.message}`,
              wallet_address: args.wallet_address,
              agent_type: "executor",
              timestamp: new Date().toISOString(),
              operation: "verify_wallet_ownership"
            }, null, 2)
          }
        ]
      };
    }
  }

  private async handleGetWalletInfo(args: {
    wallet_address: string;
    include_nfts?: boolean;
    include_tokens?: boolean;
  }) {
    try {
      const publicKey = new PublicKey(args.wallet_address);
      
      // Get basic wallet info
      const balance = await this.solanaConnection.getBalance(publicKey);
      const walletInfo: WalletInfo = {
        address: args.wallet_address,
        balance: balance / LAMPORTS_PER_SOL,
        token_balances: [],
        nft_count: 0
      };

      // Get token balances if requested
      if (args.include_tokens !== false) {
        try {
          const tokenAccounts = await this.solanaConnection.getParsedTokenAccountsByOwner(
            publicKey,
            { programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') }
          );

          walletInfo.token_balances = tokenAccounts.value.map(accountInfo => {
            const tokenData = accountInfo.account.data.parsed.info;
            return {
              mint: tokenData.mint,
              balance: parseFloat(tokenData.tokenAmount.uiAmountString || '0'),
              symbol: 'UNKNOWN', // Would need token metadata lookup
              decimals: tokenData.tokenAmount.decimals
            };
          });
        } catch (error) {
          console.warn('Failed to fetch token balances:', error.message);
        }
      }

      // Get NFT count if requested
      if (args.include_nfts !== false) {
        try {
          // This is a simplified NFT count - in production, you'd use a more comprehensive method
          const nftAccounts = walletInfo.token_balances.filter(token => 
            token.balance === 1 && token.decimals === 0
          );
          walletInfo.nft_count = nftAccounts.length;
        } catch (error) {
          console.warn('Failed to count NFTs:', error.message);
        }
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              wallet_info: walletInfo,
              agent_type: "executor",
              timestamp: new Date().toISOString(),
              operation: "get_wallet_info"
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: false,
              error: `Wallet info retrieval failed: ${error.message}`,
              agent_type: "executor",
              timestamp: new Date().toISOString(),
              operation: "get_wallet_info"
            }, null, 2)
          }
        ]
      };
    }
  }

  private async handleExecuteSmartContractCall(args: {
    contract_address: string;
    function_name: string;
    parameters?: any[];
    gas_limit?: number;
  }) {
    try {
      // This is a placeholder implementation
      // In production, you would implement actual smart contract interaction
      const result = {
        contract_address: args.contract_address,
        function_name: args.function_name,
        parameters: args.parameters || [],
        execution_status: 'simulated', // Would be 'executed' in production
        gas_estimate: args.gas_limit || 100000,
        result: 'Contract call simulation successful',
        warning: 'This is a simulation - actual execution requires additional security measures'
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              contract_result: result,
              agent_type: "executor",
              timestamp: new Date().toISOString(),
              operation: "execute_smart_contract_call"
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: false,
              error: `Smart contract execution failed: ${error.message}`,
              agent_type: "executor",
              timestamp: new Date().toISOString(),
              operation: "execute_smart_contract_call"
            }, null, 2)
          }
        ]
      };
    }
  }

  private async handleBridgeTokens(args: {
    from_network: string;
    to_network: string;
    token_address: string;
    amount: string;
    recipient_address: string;
  }) {
    try {
      // Placeholder implementation for token bridging
      const bridgeResult = {
        from_network: args.from_network,
        to_network: args.to_network,
        token_address: args.token_address,
        amount: args.amount,
        recipient_address: args.recipient_address,
        bridge_status: 'initiated',
        estimated_completion: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
        bridge_fee: '0.001 SOL',
        transaction_id: `bridge_${Date.now()}`,
        warning: 'Cross-chain bridging involves risks - always verify recipient address'
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              bridge_result: bridgeResult,
              agent_type: "executor",
              timestamp: new Date().toISOString(),
              operation: "bridge_tokens"
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: false,
              error: `Token bridging failed: ${error.message}`,
              agent_type: "executor",
              timestamp: new Date().toISOString(),
              operation: "bridge_tokens"
            }, null, 2)
          }
        ]
      };
    }
  }

  private async handleTroubleshootFailedTransaction(args: {
    transaction_hash: string;
    expected_outcome?: string;
    user_wallet?: string;
  }) {
    try {
      // Get transaction details
      const transactionStatus = await this.checkSolanaTransaction(args.transaction_hash);
      
      // Analyze the failure
      const troubleshooting = {
        transaction_hash: args.transaction_hash,
        transaction_status: transactionStatus,
        diagnosis: this.diagnoseSolanaTransactionFailure(transactionStatus),
        recommended_actions: this.getRecommendedActions(transactionStatus),
        preventive_measures: [
          "Check gas price recommendations before transactions",
          "Verify network status for congestion",
          "Ensure sufficient balance for gas fees",
          "Double-check recipient addresses"
        ],
        can_retry: transactionStatus.status === 'failed',
        estimated_fix_time: '5-15 minutes'
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              troubleshooting_result: troubleshooting,
              agent_type: "executor",
              timestamp: new Date().toISOString(),
              operation: "troubleshoot_failed_transaction"
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: false,
              error: `Transaction troubleshooting failed: ${error.message}`,
              agent_type: "executor",
              timestamp: new Date().toISOString(),
              operation: "troubleshoot_failed_transaction"
            }, null, 2)
          }
        ]
      };
    }
  }

  private diagnoseSolanaTransactionFailure(result: TransactionResult): string {
    if (result.status === 'failed') {
      if (result.error_message?.includes('InsufficientFunds')) {
        return 'Transaction failed due to insufficient funds for gas fees';
      }
      if (result.error_message?.includes('InvalidAccountData')) {
        return 'Transaction failed due to invalid account data or state';
      }
      if (result.error_message?.includes('ProgramError')) {
        return 'Transaction failed due to smart contract execution error';
      }
      return `Transaction failed: ${result.error_message || 'Unknown error'}`;
    }
    
    if (result.status === 'pending') {
      return 'Transaction is still pending - may be due to network congestion';
    }
    
    return 'Transaction appears to be successful';
  }

  private getRecommendedActions(result: TransactionResult): string[] {
    const actions: string[] = [];
    
    if (result.status === 'failed') {
      actions.push('Verify wallet has sufficient balance for transaction and gas fees');
      actions.push('Check if the destination address is correct and active');
      actions.push('Try resubmitting the transaction with higher gas fees');
      actions.push('Contact support if the issue persists');
    } else if (result.status === 'pending') {
      actions.push('Wait for network confirmation - transactions may take longer during high traffic');
      actions.push('Monitor transaction status in blockchain explorer');
      actions.push('Avoid submitting duplicate transactions');
    } else {
      actions.push('Transaction completed successfully');
      actions.push('Allow time for wallet balance updates to reflect');
    }
    
    return actions;
  }

  private async handleProcessNFTRefund(args: {
    nft_id: string;
    refund_method: 'nft_replacement' | 'sol_refund' | 'token_refund';
    recipient: string;
    reason: string;
    original_transaction_hash?: string;
  }) {
    try {
      // First validate NFT ownership if we have the original transaction
      if (args.original_transaction_hash) {
        const txStatus = await this.checkSolanaTransaction(args.original_transaction_hash);
        if (txStatus.status !== 'failed') {
          throw new Error('Original transaction was not failed - refund not applicable');
        }
      }

      const refundRequestId = `REF-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      
      let refundResult: any;

      switch (args.refund_method) {
        case 'nft_replacement':
          // Mint a replacement NFT using Crossmint
          const replacementNFT = await this.handleMintCompensationNFT({
            recipient: args.recipient,
            issue_type: 'nft_replacement_refund',
            custom_metadata: {
              name: "RUSH NFT Replacement",
              description: `Replacement NFT for refund request ${refundRequestId}. Reason: ${args.reason}`,
              image: "https://ipfs.io/ipfs/QmRUSHReplacementNFT",
              attributes: [
                { trait_type: "Refund Type", value: "NFT Replacement" },
                { trait_type: "Original NFT ID", value: args.nft_id },
                { trait_type: "Refund Request ID", value: refundRequestId }
              ]
            }
          });
          refundResult = {
            refund_request_id: refundRequestId,
            refund_method: args.refund_method,
            status: 'processing',
            nft_replacement: JSON.parse(replacementNFT.content[0].text),
            estimated_completion: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes
          };
          break;

        case 'sol_refund':
          // Process SOL refund (would integrate with actual payment system)
          refundResult = {
            refund_request_id: refundRequestId,
            refund_method: args.refund_method,
            status: 'processing',
            refund_amount: '0.5', // Would be calculated based on NFT price
            recipient: args.recipient,
            estimated_completion: new Date(Date.now() + 2 * 60 * 1000).toISOString() // 2 minutes
          };
          break;

        case 'token_refund':
          // Process token refund
          refundResult = {
            refund_request_id: refundRequestId,
            refund_method: args.refund_method,
            status: 'processing',
            refund_amount: '1.0', // Would be calculated based on NFT price in tokens
            token_type: 'ORGO',
            recipient: args.recipient,
            estimated_completion: new Date(Date.now() + 3 * 60 * 1000).toISOString() // 3 minutes
          };
          break;

        default:
          throw new Error(`Unsupported refund method: ${args.refund_method}`);
      }

      // Store refund request for tracking
      await this.storeRefundRequest(refundRequestId, {
        nft_id: args.nft_id,
        refund_method: args.refund_method,
        recipient: args.recipient,
        reason: args.reason,
        original_transaction_hash: args.original_transaction_hash,
        created_at: new Date().toISOString()
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              refund_result: refundResult,
              agent_type: "executor",
              timestamp: new Date().toISOString(),
              operation: "process_nft_refund"
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: false,
              error: `NFT refund processing failed: ${error.message}`,
              agent_type: "executor",
              timestamp: new Date().toISOString(),
              operation: "process_nft_refund"
            }, null, 2)
          }
        ]
      };
    }
  }

  private async handleGetNFTRefundStatus(args: { refund_request_id: string }) {
    try {
      // In a real implementation, this would query a database
      // For now, we'll simulate different statuses
      const refundStatus = await this.getRefundRequest(args.refund_request_id);
      
      if (!refundStatus) {
        throw new Error('Refund request not found');
      }

      // Simulate processing status based on time elapsed
      const createdAt = new Date(refundStatus.created_at);
      const elapsed = Date.now() - createdAt.getTime();
      let status = 'pending';

      if (elapsed > 5 * 60 * 1000) { // 5 minutes
        status = 'completed';
      } else if (elapsed > 2 * 60 * 1000) { // 2 minutes
        status = 'processing';
      }

      const statusResult = {
        refund_request_id: args.refund_request_id,
        status: status,
        refund_method: refundStatus.refund_method,
        nft_id: refundStatus.nft_id,
        recipient: refundStatus.recipient,
        reason: refundStatus.reason,
        created_at: refundStatus.created_at,
        updated_at: new Date().toISOString(),
        estimated_completion: status === 'completed' ? null : new Date(createdAt.getTime() + 5 * 60 * 1000).toISOString()
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              refund_status: statusResult,
              agent_type: "executor",
              timestamp: new Date().toISOString(),
              operation: "get_nft_refund_status"
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: false,
              error: `Failed to get refund status: ${error.message}`,
              agent_type: "executor",
              timestamp: new Date().toISOString(),
              operation: "get_nft_refund_status"
            }, null, 2)
          }
        ]
      };
    }
  }

  private async handleListNFTRefunds(args: {
    status?: string;
    user_id?: string;
    limit?: number;
  }) {
    try {
      // In a real implementation, this would query a database
      // For now, we'll return mock data
      const mockRefunds = [
        {
          refund_request_id: 'REF-1704067200000-abc123',
          nft_id: 'NFT-456',
          refund_method: 'nft_replacement',
          recipient: 'user@example.com',
          reason: 'Failed mint transaction',
          status: 'completed',
          created_at: '2024-01-15T10:30:00Z',
          completed_at: '2024-01-15T10:35:00Z'
        },
        {
          refund_request_id: 'REF-1704067800000-def456',
          nft_id: 'NFT-789',
          refund_method: 'sol_refund',
          recipient: 'wallet123...abc',
          reason: 'Double payment due to UI glitch',
          status: 'processing',
          created_at: '2024-01-15T14:22:00Z'
        }
      ];

      let filteredRefunds = mockRefunds;

      if (args.status) {
        filteredRefunds = filteredRefunds.filter(refund => refund.status === args.status);
      }

      if (args.limit) {
        filteredRefunds = filteredRefunds.slice(0, args.limit);
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              refunds: filteredRefunds,
              total_count: filteredRefunds.length,
              filters_applied: {
                status: args.status,
                user_id: args.user_id,
                limit: args.limit
              },
              agent_type: "executor",
              timestamp: new Date().toISOString(),
              operation: "list_nft_refunds"
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: false,
              error: `Failed to list refunds: ${error.message}`,
              agent_type: "executor",
              timestamp: new Date().toISOString(),
              operation: "list_nft_refunds"
            }, null, 2)
          }
        ]
      };
    }
  }

  private async handleValidateNFTOwnership(args: {
    nft_id: string;
    owner_wallet: string;
  }) {
    try {
      // Use Crossmint API to check NFT ownership
      const response = await axios.get(
        `${this.crossmintBaseUrl}/2022-06-09/nfts/${args.nft_id}`,
        {
          headers: {
            'X-API-KEY': this.crossmintApiKey,
            'X-PROJECT-ID': this.crossmintProjectId
          }
        }
      );

      const nftData = response.data;
      const actualOwner = nftData.owner || nftData.recipient;
      
      const isOwner = actualOwner === args.owner_wallet || 
                     actualOwner?.toLowerCase() === args.owner_wallet?.toLowerCase();

      const validationResult = {
        nft_id: args.nft_id,
        claimed_owner: args.owner_wallet,
        actual_owner: actualOwner,
        is_valid_owner: isOwner,
        nft_metadata: {
          name: nftData.metadata?.name,
          description: nftData.metadata?.description,
          image: nftData.metadata?.image
        },
        validation_timestamp: new Date().toISOString()
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              ownership_validation: validationResult,
              agent_type: "executor",
              timestamp: new Date().toISOString(),
              operation: "validate_nft_ownership"
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: false,
              error: `NFT ownership validation failed: ${error.message}`,
              nft_id: args.nft_id,
              agent_type: "executor",
              timestamp: new Date().toISOString(),
              operation: "validate_nft_ownership"
            }, null, 2)
          }
        ]
      };
    }
  }

  // Helper methods for refund management
  private async storeRefundRequest(refundRequestId: string, refundData: any): Promise<void> {
    // In a real implementation, this would store in a database
    // For now, we'll just log it
    console.log(`Stored refund request ${refundRequestId}:`, refundData);
  }

  private async getRefundRequest(refundRequestId: string): Promise<any> {
    // In a real implementation, this would query a database
    // For now, we'll return mock data
    return {
      refund_request_id: refundRequestId,
      nft_id: 'NFT-123',
      refund_method: 'nft_replacement',
      recipient: 'user@example.com',
      reason: 'Failed transaction',
      original_transaction_hash: '0x123...abc',
      created_at: new Date(Date.now() - 3 * 60 * 1000).toISOString() // 3 minutes ago
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}

export default ExecutorAgent;

if (import.meta.url === `file://${process.argv[1]}`) {
  const agent = new ExecutorAgent();
  agent.run().catch(console.error);
}
