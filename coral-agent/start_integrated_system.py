#!/usr/bin/env python3
"""
Start Integrated System - ORGO Rush + Coral Protocol
Complete startup script for the integrated agent system
"""

import asyncio
import os
import sys
import logging
import json
import time
from typing import Dict, Any
import argparse
import signal
from pathlib import Path

# Add current directory to path
sys.path.append(str(Path(__file__).parent))

# Import integrated system
from integrated_agents import IntegratedAgentSystem, IntegratedPaymentRequest

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class IntegratedSystemManager:
    """Manager for the integrated agent system"""
    
    def __init__(self):
        self.system = IntegratedAgentSystem()
        self.is_running = False
        self.startup_time = None
        
    async def start(self):
        """Start the integrated system"""
        try:
            logger.info("🚀 Starting Integrated Agent System...")
            self.startup_time = time.time()
            
            # Initialize system
            await self.system.initialize()
            
            # Set up signal handlers
            self._setup_signal_handlers()
            
            self.is_running = True
            startup_duration = time.time() - self.startup_time
            
            logger.info(f"✅ Integrated Agent System started successfully in {startup_duration:.2f}s")
            logger.info("🎯 System ready to process integrated payments")
            
            # Display system status
            await self._display_system_status()
            
            # Keep system running
            await self._keep_alive()
            
        except Exception as e:
            logger.error(f"❌ Failed to start integrated system: {e}")
            raise
    
    def _setup_signal_handlers(self):
        """Set up signal handlers for graceful shutdown"""
        def signal_handler(signum, frame):
            logger.info(f"🔄 Received signal {signum}, initiating graceful shutdown...")
            asyncio.create_task(self.shutdown())
        
        signal.signal(signal.SIGINT, signal_handler)
        signal.signal(signal.SIGTERM, signal_handler)
    
    async def _display_system_status(self):
        """Display system status"""
        status = await self.system.get_system_status()
        
        print("\n" + "="*60)
        print("🎯 INTEGRATED AGENT SYSTEM STATUS")
        print("="*60)
        print(f"System Status: {status['system_status'].upper()}")
        print(f"Active Sessions: {status['active_sessions']}")
        print(f"Registered Agents: {status['registered_agents']}")
        print(f"Coral Agents: {sum(1 for agent in status['agent_registry'].values() if agent['type'] == 'coral')}")
        print(f"ORGO Agents: {sum(1 for agent in status['agent_registry'].values() if agent['type'] == 'orgo')}")
        
        print("\n📋 REGISTERED AGENTS:")
        for agent_id, agent_info in status['agent_registry'].items():
            print(f"  • {agent_info['name']} ({agent_info['type'].upper()})")
            print(f"    Capabilities: {', '.join(agent_info['capabilities'][:3])}...")
        
        print("\n🔧 SYSTEM CAPABILITIES:")
        capabilities = status['capabilities']
        for capability, enabled in capabilities.items():
            status_icon = "✅" if enabled else "❌"
            print(f"  {status_icon} {capability.replace('_', ' ').title()}")
        
        print("="*60)
        print("🎮 Ready to process integrated payments!")
        print("💡 Use Ctrl+C to gracefully shutdown")
        print("="*60 + "\n")
    
    async def _keep_alive(self):
        """Keep the system running"""
        try:
            while self.is_running:
                await asyncio.sleep(1)
                
                # Periodic status check
                if int(time.time()) % 30 == 0:  # Every 30 seconds
                    await self._periodic_status_check()
                    
        except asyncio.CancelledError:
            logger.info("🔄 Keep-alive loop cancelled")
        except Exception as e:
            logger.error(f"❌ Error in keep-alive loop: {e}")
    
    async def _periodic_status_check(self):
        """Periodic status check"""
        try:
            status = await self.system.get_system_status()
            logger.info(f"📊 System Status: {status['active_sessions']} active sessions, {status['registered_agents']} agents")
        except Exception as e:
            logger.error(f"❌ Error in periodic status check: {e}")
    
    async def shutdown(self):
        """Gracefully shutdown the system"""
        try:
            logger.info("🔄 Initiating graceful shutdown...")
            self.is_running = False
            
            # Shutdown system
            await self.system.shutdown()
            
            logger.info("✅ Integrated Agent System shutdown complete")
            
        except Exception as e:
            logger.error(f"❌ Error during shutdown: {e}")
        finally:
            # Exit the program
            sys.exit(0)
    
    async def run_demo(self):
        """Run a demonstration of the integrated system"""
        try:
            logger.info("🎬 Running Integrated System Demo...")
            
            # Demo payment request
            demo_request = IntegratedPaymentRequest(
                session_id="demo_session_001",
                user_id="demo_user_123",
                amount=1000,
                currency_from="USD",
                currency_to="PHP",
                recipient="Philippines",
                voice_input="Send $1000 to Philippines",
                memo="Demo payment for integrated system",
                user_history=[
                    {"amount": 500, "recipient": "Philippines", "timestamp": time.time() - 3600},
                    {"amount": 200, "recipient": "Mexico", "timestamp": time.time() - 7200},
                    {"amount": 150, "recipient": "India", "timestamp": time.time() - 10800}
                ]
            )
            
            print("\n" + "="*60)
            print("🎬 INTEGRATED SYSTEM DEMO")
            print("="*60)
            print(f"Processing: {demo_request.amount} {demo_request.currency_from} -> {demo_request.currency_to}")
            print(f"Recipient: {demo_request.recipient}")
            print(f"Voice Input: '{demo_request.voice_input}'")
            print("="*60)
            
            # Process payment
            start_time = time.time()
            result = await self.system.process_integrated_payment(demo_request)
            processing_time = time.time() - start_time
            
            print(f"\n✅ Payment processed in {processing_time:.3f}s")
            print("\n📊 RESULTS SUMMARY:")
            print(f"  Status: {result['status']}")
            print(f"  Total Processing Time: {result['processing_time_ms']:.2f}ms")
            print(f"  Agents Used: {result['overall_metrics']['total_agents_used']}")
            print(f"  Success Rate: {result['overall_metrics']['success_rate']:.1%}")
            print(f"  Average Confidence: {result['overall_metrics']['average_confidence']:.1%}")
            
            print("\n🔍 DETAILED RESULTS:")
            for agent_id, agent_result in result['agent_results'].items():
                print(f"  • {agent_result['name']} ({agent_result['type'].upper()}):")
                print(f"    Status: {agent_result['status']}")
                print(f"    Processing Time: {agent_result['processing_time_ms']:.2f}ms")
            
            print("\n🎯 VOICE ANALYSIS:")
            voice_analysis = result.get('voice_analysis', {})
            if voice_analysis:
                print(f"  Transcript: '{voice_analysis.get('transcript', 'N/A')}'")
                print(f"  Confidence: {voice_analysis.get('confidence', 0):.1%}")
            
            print("\n🛡️ FRAUD ANALYSIS:")
            fraud_analysis = result.get('fraud_analysis', {})
            if fraud_analysis:
                print(f"  Risk Score: {fraud_analysis.get('risk_score', 0):.1f}/10")
                print(f"  Fraud Probability: {fraud_analysis.get('fraud_probability', 0):.1%}")
                print(f"  Safe to Proceed: {'✅' if fraud_analysis.get('safe_to_proceed', False) else '❌'}")
            
            print("\n🔮 PREDICTION ANALYSIS:")
            prediction_analysis = result.get('prediction_analysis', {})
            if prediction_analysis:
                predictions = prediction_analysis.get('predictions', [])
                print(f"  Predictions Generated: {len(predictions)}")
                for i, pred in enumerate(predictions[:3], 1):
                    print(f"    {i}. Amount: ${pred.get('amount', 0)}, Confidence: {pred.get('confidence', 0):.1%}")
            
            print("\n💳 PAYMENT RESULTS:")
            payment_results = result.get('payment_results', {})
            for agent_id, payment_result in payment_results.items():
                print(f"  • {agent_id}:")
                print(f"    Transaction ID: {payment_result.get('transaction_id', 'N/A')}")
                print(f"    Status: {payment_result.get('status', 'N/A')}")
                print(f"    Amount: ${payment_result.get('amount', 0)}")
            
            print("="*60)
            print("🎉 Demo completed successfully!")
            print("="*60 + "\n")
            
        except Exception as e:
            logger.error(f"❌ Demo failed: {e}")
            raise

async def main():
    """Main function"""
    parser = argparse.ArgumentParser(description='Integrated Agent System Manager')
    parser.add_argument('--demo', action='store_true', help='Run demo mode')
    parser.add_argument('--daemon', action='store_true', help='Run in daemon mode')
    parser.add_argument('--log-level', default='INFO', choices=['DEBUG', 'INFO', 'WARNING', 'ERROR'],
                       help='Set logging level')
    
    args = parser.parse_args()
    
    # Set logging level
    logging.getLogger().setLevel(getattr(logging, args.log_level))
    
    # Create system manager
    manager = IntegratedSystemManager()
    
    try:
        if args.demo:
            # Run demo mode
            await manager.start()
            await manager.run_demo()
            await manager.shutdown()
        else:
            # Run in daemon mode
            await manager.start()
            
    except KeyboardInterrupt:
        logger.info("🔄 Received keyboard interrupt")
        await manager.shutdown()
    except Exception as e:
        logger.error(f"❌ Fatal error: {e}")
        await manager.shutdown()
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
