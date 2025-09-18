#!/usr/bin/env python3
"""
LSTM Transaction Predictor for OrgoRush
Predicts likely transactions for pre-signing optimization
"""

import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
import json
import sys
import argparse

class TransactionPredictor:
    def __init__(self, model_path=None):
        self.model = None
        self.sequence_length = 10
        self.features = ['amount', 'recipient_hash', 'token_type', 'hour', 'day_of_week']
        
        if model_path:
            self.load_model(model_path)
        else:
            self.build_model()
    
    def build_model(self):
        """Build GPU-accelerated LSTM model architecture"""
        # Enable mixed precision for GPU acceleration
        policy = tf.keras.mixed_precision.Policy('mixed_float16')
        tf.keras.mixed_precision.set_global_policy(policy)
        
        self.model = Sequential([
            LSTM(256, return_sequences=True, input_shape=(self.sequence_length, len(self.features))),
            Dropout(0.3),
            LSTM(128, return_sequences=True),
            Dropout(0.2),
            LSTM(64, return_sequences=False),
            Dropout(0.2),
            Dense(32, activation='relu'),
            Dense(len(self.features), activation='linear', dtype='float32')  # Output in float32
        ])
        
        # Use GPU-optimized optimizer
        optimizer = tf.keras.optimizers.Adam(learning_rate=0.001, epsilon=1e-7)
        
        self.model.compile(
            optimizer=optimizer,
            loss='mse',
            metrics=['mae']
        )
        
        print(f"🚀 GPU-accelerated LSTM model built with {self.model.count_params()} parameters")
    
    def preprocess_transaction(self, tx):
        """Convert transaction to feature vector"""
        return [
            float(tx.get('amount', 0)),
            hash(tx.get('recipient', '')) % 10000,  # Hash recipient to numeric
            {'USDC': 1, 'USDT': 2, 'SOL': 3, 'ORGO': 4}.get(tx.get('token', 'USDC'), 1),
            tx.get('timestamp', 0) % 24,  # Hour of day
            (tx.get('timestamp', 0) // 86400) % 7  # Day of week
        ]
    
    def prepare_sequences(self, transactions):
        """Prepare transaction sequences for training/prediction"""
        features = [self.preprocess_transaction(tx) for tx in transactions]
        
        if len(features) < self.sequence_length:
            # Pad with zeros if insufficient data
            features = [[0] * len(self.features)] * (self.sequence_length - len(features)) + features
        
        sequences = []
        targets = []
        
        for i in range(len(features) - self.sequence_length):
            sequences.append(features[i:i + self.sequence_length])
            targets.append(features[i + self.sequence_length])
        
        return np.array(sequences), np.array(targets)
    
    def train(self, user_transactions, epochs=50):
        """Train model on user transaction history"""
        if len(user_transactions) < self.sequence_length + 1:
            print("Insufficient transaction history for training")
            return
        
        X, y = self.prepare_sequences(user_transactions)
        
        if len(X) == 0:
            print("No valid sequences for training")
            return
        
        self.model.fit(
            X, y,
            epochs=epochs,
            batch_size=32,
            validation_split=0.2,
            verbose=0
        )
    
    def predict_next_transactions(self, recent_transactions, num_predictions=3):
        """Predict next likely transactions"""
        if len(recent_transactions) < self.sequence_length:
            # Return default predictions if insufficient history
            return [
                {"amount": 100, "recipient": "default", "token": "USDC", "confidence": 0.5},
                {"amount": 50, "recipient": "default", "token": "USDT", "confidence": 0.3},
                {"amount": 25, "recipient": "default", "token": "SOL", "confidence": 0.2}
            ]
        
        # Prepare input sequence
        features = [self.preprocess_transaction(tx) for tx in recent_transactions[-self.sequence_length:]]
        X = np.array([features])
        
        predictions = []
        for _ in range(num_predictions):
            pred = self.model.predict(X, verbose=0)[0]
            
            # Convert prediction back to transaction format
            prediction = {
                "amount": max(1, int(pred[0])),
                "recipient": f"predicted_{hash(str(pred[1])) % 1000}",
                "token": {1: "USDC", 2: "USDT", 3: "SOL", 4: "ORGO"}.get(int(pred[2]), "USDC"),
                "confidence": min(1.0, max(0.1, 1.0 - np.std(pred)))
            }
            predictions.append(prediction)
            
            # Update sequence for next prediction
            X = np.roll(X, -1, axis=1)
            X[0, -1] = pred
        
        return sorted(predictions, key=lambda x: x['confidence'], reverse=True)
    
    def save_model(self, path):
        """Save trained model"""
        self.model.save(path)
    
    def load_model(self, path):
        """Load pre-trained model"""
        self.model = tf.keras.models.load_model(path)

def main():
    parser = argparse.ArgumentParser(description='LSTM Transaction Predictor')
    parser.add_argument('--user', required=True, help='User ID')
    parser.add_argument('--model', default='models/lstm_predictor.h5', help='Model path')
    parser.add_argument('--train', action='store_true', help='Train mode')
    parser.add_argument('--predict', action='store_true', help='Prediction mode')
    
    args = parser.parse_args()
    
    # Mock transaction data for demo
    mock_transactions = [
        {"amount": 100, "recipient": "alice", "token": "USDC", "timestamp": 1640995200},
        {"amount": 50, "recipient": "bob", "token": "USDT", "timestamp": 1640995800},
        {"amount": 75, "recipient": "alice", "token": "USDC", "timestamp": 1640996400},
        {"amount": 200, "recipient": "charlie", "token": "SOL", "timestamp": 1640997000},
        {"amount": 25, "recipient": "bob", "token": "ORGO", "timestamp": 1640997600},
    ] * 5  # Repeat to have enough data
    
    predictor = TransactionPredictor()
    
    if args.train:
        print(f"Training model for user {args.user}")
        predictor.train(mock_transactions)
        predictor.save_model(args.model)
        print(f"Model saved to {args.model}")
    
    if args.predict:
        try:
            predictor.load_model(args.model)
        except:
            print("No pre-trained model found, using fresh model")
        
        predictions = predictor.predict_next_transactions(mock_transactions[-10:])
        print(json.dumps(predictions, indent=2))

if __name__ == "__main__":
    main()

