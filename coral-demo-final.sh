#!/bin/bash

# 🌊 RUSH Coral Protocol Final Demo Script
# Complete demonstration of Coral Protocol v1 integration

echo "🌊 RUSH Coral Protocol Final Demo"
echo "=================================="
echo ""
echo "This demo showcases the complete Coral Protocol integration:"
echo "✅ MCP-Native Architecture"
echo "✅ Agent Registry & Monetization" 
echo "✅ Thread-Based Orchestration"
echo "✅ Coraliser Integration"
echo "✅ Live Multi-Agent Coordination"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Function to show demo steps
show_demo_steps() {
    echo "🎭 Demo Steps:"
    echo "=============="
    echo ""
    echo "1. 🌊 Coral Protocol Tab"
    echo "   - Registry marketplace with live agent discovery"
    echo "   - Agent rental and monetization demonstration"
    echo "   - Revenue metrics and performance analytics"
    echo ""
    echo "2. 🎭 Live Orchestration Tab"
    echo "   - Real-time multi-agent coordination"
    echo "   - Thread-based communication visualization"
    echo "   - Live agent status and workflow tracking"
    echo ""
    echo "3. 🎤 Voice Support Demo"
    echo "   - Voice-first interface with AI coordination"
    echo "   - Multi-agent processing pipeline"
    echo "   - Coral Protocol thread orchestration"
    echo ""
    echo "4. 🔧 Coraliser Integration"
    echo "   - Automatic agent generation from MCP tools"
    echo "   - Tool-to-agent conversion demonstration"
    echo "   - Registry registration automation"
    echo ""
}

# Function to start the demo
start_demo() {
    echo "🚀 Starting Coral Protocol Demo..."
    echo ""
    
    # Check if environment is set up
    if [ ! -f ".env" ]; then
        echo "⚠️ Environment not configured. Setting up..."
        cp coral-config.env .env
        echo "📝 Please update .env with your API keys for full functionality"
        echo ""
    fi
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing dependencies..."
        npm install
        echo ""
    fi
    
    # Start the development server
    echo "🌐 Starting RUSH frontend..."
    echo "📍 URL: http://localhost:5173"
    echo ""
    echo "🎯 Navigate to the Coral Protocol tabs to see the integration:"
    echo "   - 🌊 Coral Protocol (Registry & Workflow)"
    echo "   - 🎭 Live Orchestration (Real-time Coordination)"
    echo ""
    echo "Press Ctrl+C to stop the demo"
    echo ""
    
    # Start the server
    npm run dev
}

# Function to show Coral Protocol features
show_coral_features() {
    echo "🌟 Coral Protocol Features Demonstrated:"
    echo "========================================"
    echo ""
    echo "1. 🔗 MCP-Native Architecture"
    echo "   - True Coral Protocol v1 integration"
    echo "   - Standardized agent communication"
    echo "   - Cross-framework compatibility"
    echo ""
    echo "2. 💰 Agent Registry & Monetization"
    echo "   - Real revenue generation through agent rental"
    echo "   - Live marketplace with pricing and metadata"
    echo "   - Developer earnings tracking"
    echo ""
    echo "3. 🧵 Thread-Based Orchestration"
    echo "   - Structured multi-agent coordination"
    echo "   - Real-time workflow visualization"
    echo "   - Error handling and recovery"
    echo ""
    echo "4. 🤖 Coraliser Integration"
    echo "   - Automatic agent generation from MCP tools"
    echo "   - Seamless tool-to-agent conversion"
    echo "   - Registry registration automation"
    echo ""
    echo "5. 🎭 Live Multi-Agent Coordination"
    echo "   - Real-time agent status tracking"
    echo "   - Thread visualization and monitoring"
    echo "   - Performance analytics and metrics"
    echo ""
}

# Function to show hackathon value
show_hackathon_value() {
    echo "🏆 Internet of Agents Hackathon Value:"
    echo "====================================="
    echo ""
    echo "✅ Real Coral Server MCP integration (not simulated)"
    echo "✅ Agent registry with pricing and metadata"
    echo "✅ Thread-based multi-agent coordination"
    echo "✅ Revenue metrics and payout demonstration"
    echo "✅ Coraliser integration showing tool conversion"
    echo "✅ Live agent discovery and rental capability"
    echo "✅ Professional dashboard showing Coral ecosystem value"
    echo ""
    echo "🎯 This implementation demonstrates RUSH as the"
    echo "   DEFINITIVE EXAMPLE of what's possible with Coral Protocol v1"
    echo ""
}

# Main menu
show_menu() {
    echo "🌊 RUSH Coral Protocol Demo Menu"
    echo "================================"
    echo ""
    echo "1. 🚀 Start Demo"
    echo "2. 📋 Show Demo Steps"
    echo "3. 🌟 Show Coral Features"
    echo "4. 🏆 Show Hackathon Value"
    echo "5. 📚 View Documentation"
    echo "6. ❌ Exit"
    echo ""
    read -p "Choose an option (1-6): " choice
    
    case $choice in
        1)
            start_demo
            ;;
        2)
            show_demo_steps
            echo ""
            show_menu
            ;;
        3)
            show_coral_features
            echo ""
            show_menu
            ;;
        4)
            show_hackathon_value
            echo ""
            show_menu
            ;;
        5)
            echo "📚 Documentation Files:"
            echo "======================"
            echo ""
            echo "📖 CORAL_INTEGRATION_README.md - Complete setup guide"
            echo "📊 CORAL_PROTOCOL_INTEGRATION_SUMMARY.md - Implementation overview"
            echo "⚙️ coral-config.env - Environment configuration template"
            echo "🔧 setup-coral-rush.sh - Setup script"
            echo ""
            echo "🌐 Online Resources:"
            echo "==================="
            echo "📚 Coral Protocol Docs: https://docs.coralprotocol.org"
            echo "💬 Coral Protocol Discord: https://discord.gg/coralprotocol"
            echo "🐙 GitHub Repository: https://github.com/Coral-Protocol"
            echo ""
            show_menu
            ;;
        6)
            echo "👋 Thanks for exploring RUSH Coral Protocol integration!"
            echo "🌊 Good luck with the Internet of Agents Hackathon!"
            exit 0
            ;;
        *)
            echo "❌ Invalid option. Please choose 1-6."
            echo ""
            show_menu
            ;;
    esac
}

# Show initial information
echo "Welcome to the RUSH Coral Protocol Integration Demo!"
echo ""
echo "This implementation showcases advanced Coral Protocol v1 features:"
echo "• MCP-Native Architecture with true agent coordination"
echo "• Registry Monetization with real revenue generation"
echo "• Thread-Based Orchestration with live visualization"
echo "• Coraliser Integration with automatic agent generation"
echo "• Professional UI with comprehensive dashboards"
echo ""

# Start the menu
show_menu
