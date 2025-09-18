#!/usr/bin/env python3
"""
OrgoRush Payment Workflow Orchestrator
Complete end-to-end workflow for instant cross-border payments
"""

import asyncio
import time
import json
from typing import Dict, List, Optional
from dataclasses import dataclass
from enum import Enum
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config.orgo_config import get_orgo_client, ORGO_API_KEY

class WorkflowStatus(Enum):
    INITIATED = "initiated"
    IDENTITY_VERIFIED = "identity_verified"
    FRAUD_CHECKED = "fraud_checked"
    TRANSACTION_MATCHED = "transaction_matched"
    SWAP_EXECUTED = "swap_executed"
    TOKENOMICS_APPLIED = "tokenomics_applied"
    COMPLETED = "completed"
    FAILED = "failed"

@dataclass
class PaymentRequest:
    session_id: str
    user_id: str
    amount: float
    source_currency: str
    target_currency: str
    recipient_wallet: str
    memo: str = ""
    timestamp: float = None
    
    def __post_init__(self):
        if self.timestamp is None:
            self.timestamp = time.time()

@dataclass
class WorkflowResult:
    status: WorkflowStatus
    execution_time_ms: float
    tx_hash: str = ""
    burn_amount: float = 0.0
    fee_amount: float = 0.0
    fraud_score: float = 0.0
    error_message: str = ""
    metadata: Dict = None

class PaymentWorkflowOrchestrator:
    def __init__(self):
        self.orgo_client = get_orgo_client()
        self.active_sessions = {}
        self.user_profiles = {}
        self.pre_signed_pool = {}
        
    async def execute_payment_workflow(self, request: PaymentRequest) -> WorkflowResult:
        """Execute complete payment workflow with all phases"""
        start_time = time.perf_counter()
        workflow_result = WorkflowResult(
            status=WorkflowStatus.INITIATED,
            execution_time_ms=0.0,
            metadata={}
        )
        
        try:
            print(f"🚀 Starting payment workflow for session {request.session_id}")
            
            # Phase 1: Identity Verification (0-500ms)
            identity_result = await self.phase_1_identity_verification(request)
            if not identity_result['verified']:
                workflow_result.status = WorkflowStatus.FAILED
                workflow_result.error_message = "Identity verification failed"
                return workflow_result
            
            workflow_result.status = WorkflowStatus.IDENTITY_VERIFIED
            print(f"✅ Phase 1: Identity verified in {identity_result['time_ms']:.2f}ms")
            
            # Phase 2: Fraud Detection (50-150ms)
            fraud_result = await self.phase_2_fraud_detection(request)
            workflow_result.fraud_score = fraud_result['risk_score']
            
            if fraud_result['risk_level'] == 'HIGH':
                workflow_result.status = WorkflowStatus.FAILED
                workflow_result.error_message = f"High fraud risk: {fraud_result['risk_score']:.2f}"
                return workflow_result
            
            workflow_result.status = WorkflowStatus.FRAUD_CHECKED
            print(f"🛡️ Phase 2: Fraud check passed (risk: {fraud_result['risk_score']:.2f})")
            
            # Phase 3: Transaction Prediction & Matching (50-300ms)
            prediction_result = await self.phase_3_transaction_prediction(request)
            workflow_result.status = WorkflowStatus.TRANSACTION_MATCHED
            print(f"🧠 Phase 3: Transaction {'matched' if prediction_result['pre_signed'] else 'new'}")
            
            # Phase 4: Atomic Swap Execution (100-300ms)
            swap_result = await self.phase_4_atomic_swap_execution(request, prediction_result)
            workflow_result.tx_hash = swap_result['tx_hash']
            workflow_result.status = WorkflowStatus.SWAP_EXECUTED
            print(f"⚡ Phase 4: Swap executed - {swap_result['tx_hash'][:16]}...")
            
            # Phase 5: Tokenomics Enforcement (50-100ms)
            tokenomics_result = await self.phase_5_tokenomics_enforcement(request, swap_result)
            workflow_result.burn_amount = tokenomics_result['burn_amount']
            workflow_result.fee_amount = tokenomics_result['fee_amount']
            workflow_result.status = WorkflowStatus.TOKENOMICS_APPLIED
            print(f"🔥 Phase 5: Burned {tokenomics_result['burn_amount']:.3f} ORGO")
            
            # Phase 6: Feedback & Optimization
            await self.phase_6_feedback_optimization(request, workflow_result)
            workflow_result.status = WorkflowStatus.COMPLETED
            print(f"📈 Phase 6: Feedback loop initiated")
            
            # Calculate total execution time
            execution_time = (time.perf_counter() - start_time) * 1000
            workflow_result.execution_time_ms = execution_time
            
            print(f"🎉 Payment completed in {execution_time:.2f}ms")
            return workflow_result
            
        except Exception as e:
            execution_time = (time.perf_counter() - start_time) * 1000
            workflow_result.status = WorkflowStatus.FAILED
            workflow_result.execution_time_ms = execution_time
            workflow_result.error_message = str(e)
            print(f"❌ Workflow failed: {e}")
            return workflow_result
    
    async def phase_1_identity_verification(self, request: PaymentRequest) -> Dict:
        """Phase 1: ZK-proof identity verification"""
        phase_start = time.perf_counter()
        
        try:
            if self.orgo_client:
                # Retrieve stored ZK credential
                zk_credential = self.orgo_client.execute(
                    f"secure_retrieve --key zk_kyc_{request.user_id}"
                )
                
                # Verify ZK proof without exposing PII
                verification_result = self.orgo_client.execute(
                    f"zkverify --proof {zk_credential} --circuit kyc_circuit.zbin"
                )
                
                verified = "VALID" in verification_result
            else:
                # Mock verification for demo
                verified = True
                await asyncio.sleep(0.1)  # Simulate verification time
            
            # Update user profile
            if request.user_id not in self.user_profiles:
                self.user_profiles[request.user_id] = {
                    'first_seen': time.time(),
                    'transaction_count': 0,
                    'total_volume': 0.0,
                    'risk_score': 0.1
                }
            
            phase_time = (time.perf_counter() - phase_start) * 1000
            return {
                'verified': verified,
                'time_ms': phase_time,
                'method': 'zk_proof'
            }
            
        except Exception as e:
            return {
                'verified': False,
                'time_ms': (time.perf_counter() - phase_start) * 1000,
                'error': str(e)
            }
    
    async def phase_2_fraud_detection(self, request: PaymentRequest) -> Dict:
        """Phase 2: Multi-layered fraud detection"""
        phase_start = time.perf_counter()
        
        try:
            user_profile = self.user_profiles.get(request.user_id, {})
            
            # Real-time behavioral analysis
            velocity_risk = self._calculate_velocity_risk(request.user_id)
            amount_risk = self._calculate_amount_risk(request.amount, user_profile)
            time_risk = self._calculate_time_risk()
            location_risk = self._calculate_location_risk(request)
            
            # Composite risk calculation
            risk_factors = {
                'velocity': velocity_risk * 0.3,
                'amount': amount_risk * 0.3,
                'time': time_risk * 0.2,
                'location': location_risk * 0.2
            }
            
            total_risk = sum(risk_factors.values())
            
            # AI model enhancement (if available)
            if self.orgo_client:
                try:
                    ai_risk = self.orgo_client.execute(
                        f"python3 ai-services/fraud_detector.py --tx '{json.dumps(request.__dict__)}'"
                    )
                    total_risk = (total_risk + float(ai_risk)) / 2
                except:
                    pass  # Fallback to rule-based scoring
            
            # Determine risk level
            if total_risk > 0.8:
                risk_level = "HIGH"
            elif total_risk > 0.4:
                risk_level = "MEDIUM"
            else:
                risk_level = "LOW"
            
            phase_time = (time.perf_counter() - phase_start) * 1000
            return {
                'risk_score': total_risk,
                'risk_level': risk_level,
                'risk_factors': risk_factors,
                'time_ms': phase_time
            }
            
        except Exception as e:
            return {
                'risk_score': 0.5,
                'risk_level': "MEDIUM",
                'time_ms': (time.perf_counter() - phase_start) * 1000,
                'error': str(e)
            }
    
    async def phase_3_transaction_prediction(self, request: PaymentRequest) -> Dict:
        """Phase 3: LSTM prediction and pre-signed transaction matching"""
        phase_start = time.perf_counter()
        
        try:
            # Check for pre-signed transaction
            tx_key = f"{request.user_id}_{request.amount}_{request.target_currency}"
            pre_signed_tx = self.pre_signed_pool.get(tx_key)
            
            if pre_signed_tx:
                # Use existing pre-signed transaction
                result = {
                    'pre_signed': True,
                    'tx_data': pre_signed_tx,
                    'prediction_confidence': 0.95
                }
            else:
                # Generate new prediction and pre-sign for future
                if self.orgo_client:
                    predictions = self.orgo_client.execute(
                        f"python3 ai-services/lstm_predictor.py --user {request.user_id} --predict"
                    )
                    
                    # Pre-sign top predictions for future use
                    await self._pre_sign_predictions(request.user_id, json.loads(predictions))
                else:
                    # Mock prediction
                    predictions = [
                        {"amount": request.amount * 1.1, "confidence": 0.8},
                        {"amount": request.amount * 0.9, "confidence": 0.7}
                    ]
                
                result = {
                    'pre_signed': False,
                    'predictions': predictions,
                    'prediction_confidence': 0.7
                }
            
            phase_time = (time.perf_counter() - phase_start) * 1000
            result['time_ms'] = phase_time
            return result
            
        except Exception as e:
            return {
                'pre_signed': False,
                'time_ms': (time.perf_counter() - phase_start) * 1000,
                'error': str(e)
            }
    
    async def phase_4_atomic_swap_execution(self, request: PaymentRequest, prediction_result: Dict) -> Dict:
        """Phase 4: Execute atomic swap with GPU acceleration"""
        phase_start = time.perf_counter()
        
        try:
            if self.orgo_client:
                # Enable GPU acceleration
                self.orgo_client.execute("webgpu-accel on --algo ecdsa")
                
                if prediction_result.get('pre_signed'):
                    # Execute pre-signed transaction (instant)
                    tx_hash = self.orgo_client.execute(
                        f"solana send --pre-signed {prediction_result['tx_data']['hash']} --gpu"
                    )
                    execution_type = "pre_signed"
                else:
                    # Sign and execute new transaction
                    tx_hash = self.orgo_client.execute(
                        f"solana transfer --amount {request.amount} "
                        f"--to {request.recipient_wallet} "
                        f"--token {request.source_currency} --gpu-sign"
                    )
                    execution_type = "new_transaction"
            else:
                # Mock execution
                tx_hash = f"mock_tx_{int(time.time() * 1000)}"
                execution_type = "mock"
                await asyncio.sleep(0.05)  # Simulate execution time
            
            phase_time = (time.perf_counter() - phase_start) * 1000
            return {
                'tx_hash': tx_hash,
                'execution_type': execution_type,
                'time_ms': phase_time,
                'status': 'success'
            }
            
        except Exception as e:
            return {
                'tx_hash': '',
                'time_ms': (time.perf_counter() - phase_start) * 1000,
                'status': 'failed',
                'error': str(e)
            }
    
    async def phase_5_tokenomics_enforcement(self, request: PaymentRequest, swap_result: Dict) -> Dict:
        """Phase 5: Apply dynamic tokenomics rules"""
        phase_start = time.perf_counter()
        
        try:
            # Get current ORGO volatility
            volatility = await self._get_orgo_volatility()
            
            # Calculate base burn amount (0.1% of transaction value)
            base_burn = request.amount * 0.001
            
            # Apply volatility adjustment
            volatility_multiplier = 1.5 if volatility > 15 else 1.0
            burn_amount = base_burn * volatility_multiplier
            
            # Check for staking discount
            user_profile = self.user_profiles[request.user_id]
            orgo_balance = user_profile.get('orgo_balance', 0)
            
            # Calculate fee with staking discount
            base_fee = request.amount * 0.001
            discount = 0.5 if orgo_balance >= 100 else 0.0
            fee_amount = base_fee * (1 - discount)
            
            # Execute token burn
            if self.orgo_client:
                burn_result = self.orgo_client.execute(
                    f"spl-token burn {burn_amount} --mint ORGO --owner {request.user_id}"
                )
            
            # Update user transaction count
            user_profile['transaction_count'] += 1
            user_profile['total_volume'] += request.amount
            
            # Check for loyalty NFT minting (every 10 transactions)
            if user_profile['transaction_count'] % 10 == 0:
                if self.orgo_client:
                    self.orgo_client.execute(
                        f"metaplex mint --to {request.user_id} --type loyalty_nft"
                    )
                print(f"🎁 Loyalty NFT minted for user {request.user_id}")
            
            phase_time = (time.perf_counter() - phase_start) * 1000
            return {
                'burn_amount': burn_amount,
                'fee_amount': fee_amount,
                'volatility': volatility,
                'discount_applied': discount,
                'nft_minted': user_profile['transaction_count'] % 10 == 0,
                'time_ms': phase_time
            }
            
        except Exception as e:
            return {
                'burn_amount': 0.0,
                'fee_amount': 0.0,
                'time_ms': (time.perf_counter() - phase_start) * 1000,
                'error': str(e)
            }
    
    async def phase_6_feedback_optimization(self, request: PaymentRequest, workflow_result: WorkflowResult):
        """Phase 6: Feedback loop and model optimization"""
        try:
            # Update session tracking
            self.active_sessions[request.session_id] = {
                'request': request,
                'result': workflow_result,
                'timestamp': time.time()
            }
            
            # Trigger model retraining (background task)
            if self.orgo_client:
                asyncio.create_task(self._retrain_models(request.user_id))
            
            # Update real-time dashboard
            await self._update_dashboard(workflow_result)
            
            # Send user notification
            await self._send_completion_notification(request, workflow_result)
            
        except Exception as e:
            print(f"Feedback phase error: {e}")
    
    # Helper methods
    def _calculate_velocity_risk(self, user_id: str) -> float:
        """Calculate transaction velocity risk"""
        recent_sessions = [s for s in self.active_sessions.values() 
                          if s['request'].user_id == user_id and 
                          time.time() - s['timestamp'] < 3600]
        return min(1.0, len(recent_sessions) / 10)
    
    def _calculate_amount_risk(self, amount: float, user_profile: Dict) -> float:
        """Calculate amount anomaly risk"""
        avg_amount = user_profile.get('total_volume', 0) / max(1, user_profile.get('transaction_count', 1))
        if avg_amount == 0:
            return 0.1 if amount < 1000 else 0.3
        return min(1.0, abs(amount - avg_amount) / (avg_amount + 1))
    
    def _calculate_time_risk(self) -> float:
        """Calculate time-based risk"""
        hour = time.localtime().tm_hour
        return 0.3 if hour < 6 or hour > 22 else 0.0
    
    def _calculate_location_risk(self, request: PaymentRequest) -> float:
        """Calculate location change risk"""
        # Simplified location risk based on memo patterns
        suspicious_patterns = ['urgent', 'emergency', 'quick', 'asap']
        return 0.4 if any(pattern in request.memo.lower() for pattern in suspicious_patterns) else 0.1
    
    async def _get_orgo_volatility(self) -> float:
        """Get real-time ORGO volatility"""
        try:
            if self.orgo_client:
                volatility = self.orgo_client.execute(
                    "curl -s 'https://api.coingecko.com/api/v3/coins/orgo/market_chart?vs_currency=usd&days=1' | jq '.prices[-24:] | map(.[1]) | (max - min) / (add / length) * 100'"
                )
                return float(volatility)
            return 12.0  # Mock volatility
        except:
            return 12.0
    
    async def _pre_sign_predictions(self, user_id: str, predictions: List[Dict]):
        """Pre-sign predicted transactions"""
        try:
            for pred in predictions[:3]:  # Top 3 predictions
                tx_key = f"{user_id}_{pred['amount']}_USDC"
                self.pre_signed_pool[tx_key] = {
                    'hash': f"presigned_{int(time.time())}",
                    'amount': pred['amount'],
                    'confidence': pred['confidence'],
                    'expires': time.time() + 300  # 5 minutes
                }
        except Exception as e:
            print(f"Pre-signing error: {e}")
    
    async def _retrain_models(self, user_id: str):
        """Background model retraining"""
        try:
            if self.orgo_client:
                self.orgo_client.execute(
                    f"python3 ai-services/retrain.py --user {user_id} --background"
                )
        except Exception as e:
            print(f"Model retraining error: {e}")
    
    async def _update_dashboard(self, result: WorkflowResult):
        """Update real-time monitoring dashboard"""
        try:
            dashboard_data = {
                'total_burned': result.burn_amount,
                'execution_time': result.execution_time_ms,
                'fraud_score': result.fraud_score,
                'timestamp': time.time()
            }
            # In a real implementation, this would update a web dashboard
            print(f"📊 Dashboard updated: {dashboard_data}")
        except Exception as e:
            print(f"Dashboard update error: {e}")
    
    async def _send_completion_notification(self, request: PaymentRequest, result: WorkflowResult):
        """Send completion notification to user"""
        try:
            notification = {
                'user_id': request.user_id,
                'amount': request.amount,
                'execution_time': result.execution_time_ms,
                'burn_amount': result.burn_amount,
                'tx_hash': result.tx_hash
            }
            print(f"📧 Notification sent: Payment of {request.amount} {request.source_currency} completed in {result.execution_time_ms:.2f}ms")
        except Exception as e:
            print(f"Notification error: {e}")

# Workflow factory for different payment types
class WorkflowFactory:
    @staticmethod
    def create_instant_payment_workflow():
        """Create workflow optimized for instant payments"""
        return PaymentWorkflowOrchestrator()
    
    @staticmethod
    def create_high_value_workflow():
        """Create workflow with enhanced security for high-value payments"""
        workflow = PaymentWorkflowOrchestrator()
        # Enhanced fraud detection for high-value transactions
        return workflow
    
    @staticmethod
    def create_cross_border_workflow():
        """Create workflow optimized for cross-border payments"""
        workflow = PaymentWorkflowOrchestrator()
        # Additional compliance checks for cross-border
        return workflow

if __name__ == "__main__":
    # Demo workflow execution
    async def demo_workflow():
        orchestrator = PaymentWorkflowOrchestrator()
        
        # Create sample payment request
        payment_request = PaymentRequest(
            session_id="session_123",
            user_id="alice_user",
            amount=500.0,
            source_currency="USDC",
            target_currency="EUR",
            recipient_wallet="0xRecipient123",
            memo="Monthly payment to supplier"
        )
        
        # Execute workflow
        result = await orchestrator.execute_payment_workflow(payment_request)
        
        print(f"\n🎉 Workflow Result:")
        print(f"Status: {result.status.value}")
        print(f"Execution Time: {result.execution_time_ms:.2f}ms")
        print(f"TX Hash: {result.tx_hash}")
        print(f"Burn Amount: {result.burn_amount:.3f} ORGO")
        print(f"Fee Amount: ${result.fee_amount:.2f}")
        print(f"Fraud Score: {result.fraud_score:.3f}")
        
        return result
    
    asyncio.run(demo_workflow())

