#!/usr/bin/env python3
"""
Coral Protocol Fraud Detection Agent
Advanced AI-powered fraud detection agent with real-time risk assessment.
Built for the Coral Protocol Agent Registry.
"""

import asyncio
import json
import logging
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
from datetime import datetime, timedelta
import uuid
import aiohttp
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import pickle
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class TransactionData:
    """Transaction data structure for fraud analysis"""
    amount: float
    currency_from: str
    currency_to: str
    recipient: str
    purpose: str
    user_id: Optional[str] = None
    session_id: Optional[str] = None
    timestamp: Optional[str] = None
    ip_address: Optional[str] = None
    device_fingerprint: Optional[str] = None
    previous_transactions: List[Dict] = None

@dataclass
class FraudAnalysis:
    """Fraud analysis result structure"""
    fraud_score: float
    risk_level: str
    risk_factors: List[str]
    recommendation: str
    confidence: float
    processing_time_ms: int
    model_version: str
    timestamp: str
    detailed_analysis: Dict[str, Any] = None

class CoralFraudDetectionAgent:
    """
    Advanced Coral Protocol Fraud Detection Agent
    
    This agent uses machine learning and rule-based systems to detect
    fraudulent transactions in real-time with high accuracy.
    """
    
    def __init__(self):
        self.agent_id = "coral-fraud-detection-agent-v1"
        self.agent_name = "AI Fraud Detection Agent"
        self.version = "1.0.0"
        self.capabilities = [
            "real-time-fraud-detection",
            "risk-assessment",
            "pattern-analysis",
            "behavioral-analysis",
            "ml-model-inference",
            "rule-based-filtering"
        ]
        
        # ML Model components
        self.isolation_forest = None
        self.scaler = StandardScaler()
        self.model_trained = False
        self.model_version = "1.0.0"
        
        # Risk thresholds
        self.risk_thresholds = {
            "low": 0.0,
            "medium": 3.0,
            "high": 6.0,
            "critical": 8.0
        }
        
        # Transaction patterns for analysis
        self.transaction_patterns = {
            "normal_amounts": [10, 50, 100, 500, 1000, 2000, 5000],
            "suspicious_amounts": [9999, 10001, 49999, 50001, 99999, 100001],
            "high_risk_currencies": ["PHP", "INR", "BRL", "MXN", "VND", "IDR"],
            "medium_risk_currencies": ["EUR", "GBP", "CAD", "AUD", "CHF"],
            "low_risk_currencies": ["USD", "JPY", "CNY", "KRW"]
        }
        
        # Initialize ML model
        asyncio.create_task(self.initialize_ml_model())
    
    async def initialize_ml_model(self):
        """Initialize and train the ML model"""
        try:
            # Create synthetic training data for demonstration
            training_data = await self.generate_synthetic_training_data()
            
            # Train Isolation Forest for anomaly detection
            self.isolation_forest = IsolationForest(
                contamination=0.1,  # Expect 10% anomalies
                random_state=42,
                n_estimators=100
            )
            
            # Prepare features
            features = self.extract_features_batch(training_data)
            
            # Scale features
            features_scaled = self.scaler.fit_transform(features)
            
            # Train model
            self.isolation_forest.fit(features_scaled)
            self.model_trained = True
            
            logger.info("ML model initialized and trained successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize ML model: {e}")
            self.model_trained = False
    
    async def generate_synthetic_training_data(self) -> List[TransactionData]:
        """Generate synthetic training data for ML model"""
        training_data = []
        
        # Generate normal transactions
        for _ in range(1000):
            transaction = TransactionData(
                amount=np.random.uniform(10, 5000),
                currency_from="USD",
                currency_to=np.random.choice(["EUR", "GBP", "CAD", "AUD"]),
                recipient=f"recipient_{np.random.randint(1000, 9999)}",
                purpose=np.random.choice(["family_support", "business", "education", "medical"]),
                user_id=f"user_{np.random.randint(100, 999)}",
                timestamp=datetime.now().isoformat(),
                ip_address=f"192.168.{np.random.randint(1, 255)}.{np.random.randint(1, 255)}",
                device_fingerprint=f"device_{np.random.randint(1000, 9999)}"
            )
            training_data.append(transaction)
        
        # Generate some fraudulent transactions
        for _ in range(100):
            transaction = TransactionData(
                amount=np.random.uniform(10000, 100000),
                currency_from="USD",
                currency_to=np.random.choice(["PHP", "INR", "BRL", "MXN"]),
                recipient=f"suspicious_{np.random.randint(1000, 9999)}",
                purpose=np.random.choice(["urgent", "emergency", "family_emergency"]),
                user_id=f"new_user_{np.random.randint(1000, 9999)}",
                timestamp=datetime.now().isoformat(),
                ip_address=f"10.0.{np.random.randint(1, 255)}.{np.random.randint(1, 255)}",
                device_fingerprint=f"new_device_{np.random.randint(1000, 9999)}"
            )
            training_data.append(transaction)
        
        return training_data
    
    def extract_features(self, transaction: TransactionData) -> List[float]:
        """Extract features from transaction for ML model"""
        features = []
        
        # Amount-based features
        features.append(transaction.amount)
        features.append(np.log10(transaction.amount + 1))  # Log amount
        features.append(1 if transaction.amount > 10000 else 0)  # High amount flag
        
        # Currency risk features
        currency_risk = 0
        if transaction.currency_to in self.transaction_patterns["high_risk_currencies"]:
            currency_risk = 3
        elif transaction.currency_to in self.transaction_patterns["medium_risk_currencies"]:
            currency_risk = 2
        elif transaction.currency_to in self.transaction_patterns["low_risk_currencies"]:
            currency_risk = 1
        
        features.append(currency_risk)
        
        # Purpose-based features
        suspicious_purposes = ["urgent", "emergency", "family_emergency"]
        purpose_risk = sum(1 for purpose in suspicious_purposes 
                          if purpose in transaction.purpose.lower())
        features.append(purpose_risk)
        
        # Time-based features
        if transaction.timestamp:
            hour = datetime.fromisoformat(transaction.timestamp.replace('Z', '+00:00')).hour
            features.append(hour)
            features.append(1 if hour < 6 or hour > 22 else 0)  # Off-hours flag
        else:
            features.extend([12, 0])  # Default values
        
        # Cross-border flag
        features.append(1 if transaction.currency_from != transaction.currency_to else 0)
        
        # User behavior features (simplified)
        features.append(1 if transaction.user_id and "new_user" in transaction.user_id else 0)
        
        # Device fingerprint features
        features.append(1 if transaction.device_fingerprint and "new_device" in transaction.device_fingerprint else 0)
        
        return features
    
    def extract_features_batch(self, transactions: List[TransactionData]) -> List[List[float]]:
        """Extract features for multiple transactions"""
        return [self.extract_features(tx) for tx in transactions]
    
    async def detect_fraud(self, transaction: TransactionData) -> FraudAnalysis:
        """
        Main fraud detection method
        
        Combines rule-based and ML-based approaches for comprehensive fraud detection
        """
        start_time = datetime.now()
        
        try:
            # Rule-based analysis
            rule_score, rule_factors = await self.rule_based_analysis(transaction)
            
            # ML-based analysis
            ml_score, ml_confidence = await self.ml_based_analysis(transaction)
            
            # Combine scores with weighted approach
            combined_score = (rule_score * 0.6) + (ml_score * 0.4)
            
            # Determine risk level
            risk_level = self.determine_risk_level(combined_score)
            
            # Generate recommendation
            recommendation = self.generate_recommendation(combined_score, risk_level)
            
            # Calculate processing time
            processing_time = int((datetime.now() - start_time).total_seconds() * 1000)
            
            # Create detailed analysis
            detailed_analysis = {
                "rule_based_score": rule_score,
                "ml_based_score": ml_score,
                "rule_factors": rule_factors,
                "ml_confidence": ml_confidence,
                "combined_score": combined_score,
                "risk_level": risk_level
            }
            
            result = FraudAnalysis(
                fraud_score=combined_score,
                risk_level=risk_level,
                risk_factors=rule_factors,
                recommendation=recommendation,
                confidence=ml_confidence,
                processing_time_ms=processing_time,
                model_version=self.model_version,
                timestamp=datetime.now().isoformat(),
                detailed_analysis=detailed_analysis
            )
            
            logger.info(f"Fraud analysis completed: Score={combined_score:.2f}, Risk={risk_level}, Recommendation={recommendation}")
            
            return result
            
        except Exception as e:
            logger.error(f"Fraud detection failed: {e}")
            # Return safe default
            return FraudAnalysis(
                fraud_score=5.0,  # Medium risk as default
                risk_level="medium",
                risk_factors=["analysis_error"],
                recommendation="manual_review",
                confidence=0.5,
                processing_time_ms=int((datetime.now() - start_time).total_seconds() * 1000),
                model_version=self.model_version,
                timestamp=datetime.now().isoformat()
            )
    
    async def rule_based_analysis(self, transaction: TransactionData) -> tuple[float, List[str]]:
        """Rule-based fraud detection analysis"""
        score = 0.0
        factors = []
        
        # Amount-based rules
        if transaction.amount > 100000:
            score += 3.0
            factors.append("very_high_amount")
        elif transaction.amount > 50000:
            score += 2.0
            factors.append("high_amount")
        elif transaction.amount > 10000:
            score += 1.0
            factors.append("medium_amount")
        
        # Currency risk rules
        if transaction.currency_to in self.transaction_patterns["high_risk_currencies"]:
            score += 2.0
            factors.append("high_risk_currency")
        elif transaction.currency_to in self.transaction_patterns["medium_risk_currencies"]:
            score += 1.0
            factors.append("medium_risk_currency")
        
        # Purpose-based rules
        suspicious_purposes = ["urgent", "emergency", "family_emergency"]
        if any(purpose in transaction.purpose.lower() for purpose in suspicious_purposes):
            score += 1.5
            factors.append("suspicious_purpose")
        
        # Time-based rules
        if transaction.timestamp:
            hour = datetime.fromisoformat(transaction.timestamp.replace('Z', '+00:00')).hour
            if hour < 6 or hour > 22:
                score += 0.5
                factors.append("off_hours_transaction")
        
        # Cross-border rules
        if transaction.currency_from != transaction.currency_to:
            score += 0.5
            factors.append("cross_border")
        
        # User behavior rules
        if transaction.user_id and "new_user" in transaction.user_id:
            score += 1.0
            factors.append("new_user")
        
        # Device fingerprint rules
        if transaction.device_fingerprint and "new_device" in transaction.device_fingerprint:
            score += 0.5
            factors.append("new_device")
        
        # IP address rules (simplified)
        if transaction.ip_address:
            if transaction.ip_address.startswith("10.0."):
                score += 1.0
                factors.append("suspicious_ip")
        
        return min(score, 10.0), factors
    
    async def ml_based_analysis(self, transaction: TransactionData) -> tuple[float, float]:
        """ML-based fraud detection analysis"""
        if not self.model_trained:
            return 5.0, 0.5  # Default medium risk
        
        try:
            # Extract features
            features = self.extract_features(transaction)
            features_array = np.array(features).reshape(1, -1)
            
            # Scale features
            features_scaled = self.scaler.transform(features_array)
            
            # Get anomaly score
            anomaly_score = self.isolation_forest.decision_function(features_scaled)[0]
            
            # Convert to fraud score (0-10 scale)
            # Isolation Forest returns negative values for anomalies
            fraud_score = max(0, min(10, 5 - anomaly_score))
            
            # Calculate confidence based on distance from decision boundary
            confidence = min(1.0, abs(anomaly_score) / 2.0)
            
            return fraud_score, confidence
            
        except Exception as e:
            logger.error(f"ML analysis failed: {e}")
            return 5.0, 0.5  # Default medium risk
    
    def determine_risk_level(self, score: float) -> str:
        """Determine risk level based on fraud score"""
        if score >= self.risk_thresholds["critical"]:
            return "critical"
        elif score >= self.risk_thresholds["high"]:
            return "high"
        elif score >= self.risk_thresholds["medium"]:
            return "medium"
        else:
            return "low"
    
    def generate_recommendation(self, score: float, risk_level: str) -> str:
        """Generate recommendation based on fraud score and risk level"""
        if risk_level == "critical":
            return "reject"
        elif risk_level == "high":
            return "manual_review"
        elif risk_level == "medium":
            return "approve_with_monitoring"
        else:
            return "approve"
    
    async def get_agent_metrics(self) -> Dict[str, Any]:
        """Get agent performance metrics"""
        return {
            "agent_id": self.agent_id,
            "agent_name": self.agent_name,
            "version": self.version,
            "model_trained": self.model_trained,
            "model_version": self.model_version,
            "capabilities": self.capabilities,
            "risk_thresholds": self.risk_thresholds,
            "last_updated": datetime.now().isoformat()
        }
    
    async def handle_coral_request(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Handle requests from Coral Protocol
        
        This is the main entry point for other agents/systems to interact with this agent
        """
        action = request_data.get("action")
        
        if action == "detect_fraud":
            transaction_data = request_data.get("transaction_data", {})
            transaction = TransactionData(**transaction_data)
            result = await self.detect_fraud(transaction)
            return {"result": asdict(result)}
            
        elif action == "get_metrics":
            metrics = await self.get_agent_metrics()
            return {"metrics": metrics}
            
        elif action == "update_thresholds":
            new_thresholds = request_data.get("thresholds", {})
            self.risk_thresholds.update(new_thresholds)
            return {"success": True, "thresholds": self.risk_thresholds}
            
        else:
            return {"error": f"Unknown action: {action}"}

# Agent Registry Entry Point
async def create_fraud_detection_agent() -> CoralFraudDetectionAgent:
    """Factory function to create a fraud detection agent instance"""
    agent = CoralFraudDetectionAgent()
    return agent

if __name__ == "__main__":
    # Run the agent
    async def main():
        agent = await create_fraud_detection_agent()
        
        # Keep the agent running
        logger.info("Fraud Detection Agent is running and ready to process requests...")
        
        # Example usage
        sample_transaction = TransactionData(
            amount=10000.0,
            currency_from="USD",
            currency_to="PHP",
            recipient="Philippines",
            purpose="family support",
            user_id="user_123",
            session_id="demo_session_001",
            timestamp=datetime.now().isoformat(),
            ip_address="192.168.1.100",
            device_fingerprint="device_abc123"
        )
        
        result = await agent.detect_fraud(sample_transaction)
        logger.info(f"Sample fraud detection result: {result}")
        
        # Keep running
        while True:
            await asyncio.sleep(1)
    
    asyncio.run(main())
