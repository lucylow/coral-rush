#!/usr/bin/env python3
"""
ORGO Configuration Module
Manages API keys and client connections for OrgoRush
"""

import os
from typing import Optional, Dict, Any

# API Keys from environment variables
ORGO_API_KEY = os.getenv('ORGO_API_KEY', 'sk_live_3927767011051e2f9d97473b75578a1c9f6a03d62ef92eb0')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', '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')
ANTHROPIC_API_KEY = os.getenv('ANTHROPIC_API_KEY', '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')

# ORGO Configuration
ORGO_CONFIG = {
    'api_key': ORGO_API_KEY,
    'base_url': 'https://api.orgo.ai/v1',
    'timeout': 30,
    'max_retries': 3
}

# OpenAI Configuration
OPENAI_CONFIG = {
    'api_key': OPENAI_API_KEY,
    'base_url': 'https://api.openai.com/v1',
    'model': 'gpt-4',
    'temperature': 0.7,
    'max_tokens': 2000
}

# Anthropic Configuration
ANTHROPIC_CONFIG = {
    'api_key': ANTHROPIC_API_KEY,
    'base_url': 'https://api.anthropic.com/v1',
    'model': 'claude-3-5-sonnet-20241022',
    'max_tokens': 1024
}

class OrgoClient:
    """Mock ORGO client for hackathon simulation"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = ORGO_CONFIG['base_url']
        
    async def create_payment(self, payment_data: Dict[str, Any]) -> Dict[str, Any]:
        """Simulate ORGO payment creation"""
        import time
        import hashlib
        
        # Simulate payment processing
        tx_hash = hashlib.sha256(f"{payment_data}{time.time()}".encode()).hexdigest()
        
        return {
            'success': True,
            'tx_hash': f"0x{tx_hash[:64]}",
            'status': 'completed',
            'amount': payment_data.get('amount', 0),
            'fee': payment_data.get('amount', 0) * 0.001,  # 0.1% fee
            'burn_amount': payment_data.get('amount', 0) * 0.0001,  # 0.01% burn
            'processing_time': 0.3,  # 300ms
            'timestamp': time.time()
        }
    
    async def get_balance(self, wallet_address: str) -> Dict[str, Any]:
        """Simulate wallet balance check"""
        import random
        
        return {
            'success': True,
            'wallet_address': wallet_address,
            'orgo_balance': round(random.uniform(100, 10000), 2),
            'usdc_balance': round(random.uniform(500, 50000), 2),
            'sol_balance': round(random.uniform(1, 100), 4)
        }
    
    async def burn_tokens(self, amount: float, reason: str = 'payment_fee') -> Dict[str, Any]:
        """Simulate ORGO token burning"""
        import time
        import hashlib
        
        burn_tx = hashlib.sha256(f"burn_{amount}_{reason}_{time.time()}".encode()).hexdigest()
        
        return {
            'success': True,
            'burn_tx_hash': f"0x{burn_tx[:64]}",
            'burned_amount': amount,
            'reason': reason,
            'timestamp': time.time(),
            'total_burned': amount  # In production, track cumulative
        }

def get_orgo_client() -> OrgoClient:
    """Get configured ORGO client"""
    return OrgoClient(ORGO_API_KEY)

def get_openai_config() -> Dict[str, Any]:
    """Get OpenAI configuration"""
    return OPENAI_CONFIG.copy()

def get_anthropic_config() -> Dict[str, Any]:
    """Get Anthropic configuration"""
    return ANTHROPIC_CONFIG.copy()

def validate_api_keys() -> Dict[str, bool]:
    """Validate all API keys are present"""
    return {
        'orgo': bool(ORGO_API_KEY and ORGO_API_KEY.startswith('sk_live_')),
        'openai': bool(OPENAI_API_KEY and OPENAI_API_KEY.startswith('sk-proj-')),
        'anthropic': bool(ANTHROPIC_API_KEY and ANTHROPIC_API_KEY.startswith('sk-ant-'))
    }

# Environment setup
def setup_environment():
    """Setup environment variables if not already set"""
    if not os.getenv('ORGO_API_KEY'):
        os.environ['ORGO_API_KEY'] = ORGO_API_KEY
    
    if not os.getenv('OPENAI_API_KEY'):
        os.environ['OPENAI_API_KEY'] = OPENAI_API_KEY
    
    if not os.getenv('ANTHROPIC_API_KEY'):
        os.environ['ANTHROPIC_API_KEY'] = ANTHROPIC_API_KEY

# Initialize on import
setup_environment()

