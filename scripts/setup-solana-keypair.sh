#!/bin/bash

# Solana Keypair Setup Script for Coral Rush

echo "🔑 Setting up Solana keypair for Coral Rush logging..."

# Check if Solana CLI is installed
if ! command -v solana &> /dev/null; then
    echo "❌ Solana CLI is not installed."
    echo "📥 Installing Solana CLI..."
    
    # Install Solana CLI
    sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
    
    # Add to PATH for current session
    export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
    
    if ! command -v solana &> /dev/null; then
        echo "❌ Failed to install Solana CLI. Please install manually:"
        echo "   https://docs.solana.com/cli/install-solana-cli-tools"
        exit 1
    fi
fi

echo "✅ Solana CLI is available"

# Set to devnet
echo "🌐 Configuring Solana to use devnet..."
solana config set --url devnet

# Generate new keypair
echo "🔧 Generating new keypair for logging..."
KEYPAIR_FILE="coral-rush-logger-keypair.json"

if [ -f "$KEYPAIR_FILE" ]; then
    echo "⚠️ Keypair file already exists: $KEYPAIR_FILE"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "🚫 Keeping existing keypair"
        KEYPAIR_FILE_EXISTS=true
    fi
fi

if [ "$KEYPAIR_FILE_EXISTS" != true ]; then
    solana-keygen new --no-bip39-passphrase --silent --outfile "$KEYPAIR_FILE"
fi

# Get the public key
PUBKEY=$(solana-keygen pubkey "$KEYPAIR_FILE")
echo "🏠 Public Key: $PUBKEY"

# Get some devnet SOL
echo "💰 Requesting devnet SOL airdrop..."
solana airdrop 1 "$PUBKEY"

# Check balance
BALANCE=$(solana balance "$PUBKEY")
echo "💳 Balance: $BALANCE"

# Get the private key for .env
echo "🔐 Generating private key for .env..."
PRIVATE_KEY_ARRAY=$(cat "$KEYPAIR_FILE")

echo ""
echo "🎯 Setup Complete!"
echo ""
echo "📋 Add this to your backend/.env file:"
echo "SOLANA_LOGGING_KEYPAIR='$PRIVATE_KEY_ARRAY'"
echo ""
echo "📊 Your logging address: $PUBKEY"
echo "🔍 View on Solana Explorer:"
echo "   https://explorer.solana.com/address/$PUBKEY?cluster=devnet"
echo ""
echo "⚠️  IMPORTANT SECURITY NOTES:"
echo "   - This keypair is for DEVELOPMENT/DEMO only"
echo "   - Never commit the private key to git"
echo "   - Use a dedicated keypair with minimal SOL for production"
echo "   - Rotate keypairs regularly"
echo ""

# Create a backup info file
INFO_FILE="solana-keypair-info.txt"
cat > "$INFO_FILE" << EOF
Coral Rush Solana Logging Keypair Information
Generated: $(date)

Public Key: $PUBKEY
Balance: $BALANCE
Cluster: devnet
Explorer URL: https://explorer.solana.com/address/$PUBKEY?cluster=devnet

Private Key Array (for .env):
$PRIVATE_KEY_ARRAY

⚠️ Keep this information secure and never commit to version control!
EOF

echo "💾 Keypair info saved to: $INFO_FILE"
