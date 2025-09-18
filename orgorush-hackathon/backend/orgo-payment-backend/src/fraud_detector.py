#!/usr/bin/env python3
"""
AI Fraud Detection for OrgoRush
Multi-modal anomaly detection for payment security
"""

import json
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import argparse
import sys

class FraudDetector:
    def __init__(self):
        self.model = IsolationForest(contamination=0.01, random_state=42)
        self.scaler = StandardScaler()
        self.is_trained = False
        self.feature_names = [
            'amount', 'hour', 'day_of_week', 'recipient_frequency',
            'amount_deviation', 'velocity', 'location_change', 'device_change'
        ]
    
    def extract_features(self, tx_data, user_history=None):
        """Extract fraud detection features from transaction"""
        if user_history is None:
            user_history = []
        
        # Basic transaction features
        amount = float(tx_data.get('amount', 0))
        timestamp = tx_data.get('timestamp', 0)
        hour = timestamp % 24 if timestamp else 12
        day_of_week = (timestamp // 86400) % 7 if timestamp else 3
        
        # Historical analysis features
        recipient = tx_data.get('recipient', '')
        recipient_frequency = sum(1 for tx in user_history if tx.get('recipient') == recipient)
        
        # Amount deviation from user's typical transactions
        if user_history:
            amounts = [float(tx.get('amount', 0)) for tx in user_history]
            avg_amount = np.mean(amounts) if amounts else amount
            amount_deviation = abs(amount - avg_amount) / (avg_amount + 1)
        else:
            amount_deviation = 0
        
        # Transaction velocity (transactions per hour)
        recent_txs = [tx for tx in user_history if timestamp - tx.get('timestamp', 0) < 3600]
        velocity = len(recent_txs)
        
        # Location and device change indicators (simplified)
        location_change = 1 if tx_data.get('location') != user_history[-1].get('location', '') if user_history else 0
        device_change = 1 if tx_data.get('device_id') != user_history[-1].get('device_id', '') if user_history else 0
        
        return [
            amount, hour, day_of_week, recipient_frequency,
            amount_deviation, velocity, location_change, device_change
        ]
    
    def train(self, training_data):
        """Train fraud detection model on historical data"""
        features = []
        
        for user_data in training_data:
            user_history = user_data.get('transactions', [])
            for i, tx in enumerate(user_history):
                # Use previous transactions as history for each transaction
                history = user_history[:i]
                feature_vector = self.extract_features(tx, history)
                features.append(feature_vector)
        
        if not features:
            print("No training data available")
            return
        
        # Normalize features
        features_array = np.array(features)
        self.scaler.fit(features_array)
        normalized_features = self.scaler.transform(features_array)
        
        # Train isolation forest
        self.model.fit(normalized_features)
        self.is_trained = True
        print(f"Fraud detection model trained on {len(features)} transactions")
    
    def predict_fraud_score(self, tx_data, user_history=None):
        """Predict fraud probability for a transaction"""
        if not self.is_trained:
            # Use rule-based scoring if model not trained
            return self.rule_based_scoring(tx_data, user_history)
        
        # Extract features
        features = self.extract_features(tx_data, user_history or [])
        features_array = np.array([features])
        
        # Normalize features
        normalized_features = self.scaler.transform(features_array)
        
        # Get anomaly score
        anomaly_score = self.model.decision_function(normalized_features)[0]
        is_outlier = self.model.predict(normalized_features)[0]
        
        # Convert to probability (0-1 scale)
        # Isolation forest returns negative scores for outliers
        fraud_probability = max(0, min(1, (0.5 - anomaly_score) * 2))
        
        # Boost probability if marked as outlier
        if is_outlier == -1:
            fraud_probability = max(fraud_probability, 0.8)
        
        return fraud_probability
    
    def rule_based_scoring(self, tx_data, user_history):
        """Fallback rule-based fraud scoring"""
        score = 0.0
        
        amount = float(tx_data.get('amount', 0))
        
        # Large amount flag
        if amount > 10000:
            score += 0.3
        elif amount > 1000:
            score += 0.1
        
        # Unusual time flag
        hour = (tx_data.get('timestamp', 0) % 24) if tx_data.get('timestamp') else 12
        if hour < 6 or hour > 22:  # Late night/early morning
            score += 0.2
        
        # High velocity flag
        if user_history:
            recent_count = sum(1 for tx in user_history 
                             if tx_data.get('timestamp', 0) - tx.get('timestamp', 0) < 3600)
            if recent_count > 5:
                score += 0.4
        
        # New recipient flag
        recipient = tx_data.get('recipient', '')
        if user_history and recipient not in [tx.get('recipient') for tx in user_history]:
            score += 0.2
        
        return min(1.0, score)
    
    def analyze_transaction(self, tx_data, user_history=None):
        """Comprehensive transaction analysis"""
        fraud_score = self.predict_fraud_score(tx_data, user_history)
        
        # Determine risk level
        if fraud_score < 0.3:
            risk_level = "LOW"
        elif fraud_score < 0.7:
            risk_level = "MEDIUM"
        else:
            risk_level = "HIGH"
        
        # Generate explanation
        features = self.extract_features(tx_data, user_history or [])
        explanations = []
        
        if features[0] > 1000:  # Large amount
            explanations.append("Large transaction amount")
        if features[5] > 3:  # High velocity
            explanations.append("High transaction frequency")
        if features[6] == 1:  # Location change
            explanations.append("Location change detected")
        if features[7] == 1:  # Device change
            explanations.append("New device detected")
        
        return {
            "fraud_score": fraud_score,
            "risk_level": risk_level,
            "explanations": explanations,
            "features": dict(zip(self.feature_names, features))
        }

def main():
    parser = argparse.ArgumentParser(description='Fraud Detection Service')
    parser.add_argument('--tx', required=True, help='Transaction data (JSON)')
    parser.add_argument('--history', help='User transaction history (JSON)')
    parser.add_argument('--train', help='Training data file (JSON)')
    
    args = parser.parse_args()
    
    detector = FraudDetector()
    
    # Train model if training data provided
    if args.train:
        try:
            with open(args.train, 'r') as f:
                training_data = json.load(f)
            detector.train(training_data)
        except Exception as e:
            print(f"Training failed: {e}")
    
    # Analyze transaction
    try:
        tx_data = json.loads(args.tx)
        user_history = json.loads(args.history) if args.history else []
        
        result = detector.analyze_transaction(tx_data, user_history)
        print(json.dumps(result, indent=2))
        
        # Return fraud score for shell integration
        sys.exit(int(result['fraud_score'] * 100))
        
    except Exception as e:
        print(f"Analysis failed: {e}")
        sys.exit(50)  # Default medium risk

if __name__ == "__main__":
    main()

