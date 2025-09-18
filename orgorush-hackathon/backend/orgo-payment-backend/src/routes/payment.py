from flask import Blueprint, request, jsonify
from datetime import datetime
import hashlib
import json
import time
import random

payment_bp = Blueprint('payment', __name__, url_prefix='/api/payment')

# Mock data for demonstration
burn_tracker = {
    'total_burned': 1234567.89,
    'transactions_count': 15432,
    'last_updated': datetime.now().isoformat()
}

staking_data = {
    'total_staked': 250000000000,  # 250 ORGO in lamports
    'fee_discount_bps': 2500,  # 25% discount
    'last_staked': datetime.now().isoformat()
}

@payment_bp.route('/initiate', methods=['POST'])
def initiate_payment():
    """Initiate a new ORGO payment with burn calculation"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['amount', 'recipient', 'sender']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        amount = float(data['amount'])
        recipient = data['recipient']
        sender = data['sender']
        
        # Calculate burn amount (0.1% base rate)
        base_burn_rate = 0.001
        volatility_multiplier = random.uniform(1.0, 1.5)  # Simulate market volatility
        burn_amount = amount * base_burn_rate * volatility_multiplier
        
        # Apply staking discount
        discount_bps = staking_data['fee_discount_bps']
        discount_multiplier = (10000 - discount_bps) / 10000
        final_fee = burn_amount * discount_multiplier
        
        # Generate transaction ID
        tx_data = f"{sender}{recipient}{amount}{time.time()}"
        tx_id = hashlib.sha256(tx_data.encode()).hexdigest()[:16]
        
        # Create payment record
        payment_record = {
            'tx_id': tx_id,
            'sender': sender,
            'recipient': recipient,
            'amount': amount,
            'burn_amount': burn_amount,
            'final_fee': final_fee,
            'volatility_multiplier': volatility_multiplier,
            'discount_applied': discount_bps,
            'status': 'pending',
            'created_at': datetime.now().isoformat(),
            'estimated_completion': 0.3  # seconds
        }
        
        return jsonify({
            'success': True,
            'payment': payment_record,
            'message': 'Payment initiated successfully'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@payment_bp.route('/execute', methods=['POST'])
def execute_payment():
    """Execute the atomic swap and burn ORGO tokens"""
    try:
        data = request.get_json()
        tx_id = data.get('tx_id')
        
        if not tx_id:
            return jsonify({'error': 'Transaction ID required'}), 400
        
        # Simulate payment execution steps
        execution_steps = [
            {'step': 1, 'message': 'Validating transaction...', 'progress': 20},
            {'step': 2, 'message': 'Calculating optimal route...', 'progress': 40},
            {'step': 3, 'message': 'Executing atomic swap...', 'progress': 60},
            {'step': 4, 'message': 'Burning ORGO tokens...', 'progress': 80},
            {'step': 5, 'message': 'Payment completed!', 'progress': 100}
        ]
        
        # Simulate burn amount for this transaction
        burn_amount = random.uniform(0.5, 2.0)
        
        # Update global burn tracker
        burn_tracker['total_burned'] += burn_amount
        burn_tracker['transactions_count'] += 1
        burn_tracker['last_updated'] = datetime.now().isoformat()
        
        return jsonify({
            'success': True,
            'tx_id': tx_id,
            'status': 'completed',
            'execution_steps': execution_steps,
            'burn_amount': burn_amount,
            'total_burned': burn_tracker['total_burned'],
            'completion_time': 0.3,
            'message': 'Payment executed successfully'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@payment_bp.route('/burn-tracker', methods=['GET'])
def get_burn_tracker():
    """Get current burn statistics"""
    return jsonify({
        'success': True,
        'data': burn_tracker
    }), 200

@payment_bp.route('/staking-info', methods=['GET'])
def get_staking_info():
    """Get user staking information"""
    wallet_address = request.args.get('wallet')
    
    # Mock staking data based on wallet
    if wallet_address:
        return jsonify({
            'success': True,
            'data': {
                'wallet': wallet_address,
                'staked_amount': staking_data['total_staked'],
                'fee_discount_bps': staking_data['fee_discount_bps'],
                'discount_percentage': staking_data['fee_discount_bps'] / 100,
                'last_staked': staking_data['last_staked'],
                'rewards_earned': random.uniform(10, 50),  # Mock rewards
                'next_discount_threshold': 500000000000  # 500 ORGO for next tier
            }
        }), 200
    
    return jsonify({'error': 'Wallet address required'}), 400

@payment_bp.route('/stake', methods=['POST'])
def stake_orgo():
    """Stake ORGO tokens for fee discounts"""
    try:
        data = request.get_json()
        
        required_fields = ['wallet', 'amount']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        wallet = data['wallet']
        amount = int(data['amount'])  # Amount in lamports
        
        # Update staking data
        staking_data['total_staked'] += amount
        staking_data['last_staked'] = datetime.now().isoformat()
        
        # Calculate new discount (0.5% per 100 ORGO, max 50%)
        orgo_amount = staking_data['total_staked'] / 1000000000  # Convert from lamports
        discount_bps = min(int((orgo_amount / 100) * 50), 5000)
        staking_data['fee_discount_bps'] = discount_bps
        
        return jsonify({
            'success': True,
            'data': {
                'wallet': wallet,
                'amount_staked': amount,
                'total_staked': staking_data['total_staked'],
                'new_discount_bps': discount_bps,
                'discount_percentage': discount_bps / 100,
                'timestamp': staking_data['last_staked']
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@payment_bp.route('/liquidity-pools', methods=['GET'])
def get_liquidity_pools():
    """Get available liquidity pools for ORGO swaps"""
    pools = [
        {
            'pool_id': 'orgo_usdc_meteora',
            'token_a': 'ORGO',
            'token_b': 'USDC',
            'tvl': 2500000,  # Total Value Locked
            'apy': 15.7,
            'fee_tier': 0.003,  # 0.3%
            'volume_24h': 450000,
            'provider': 'Meteora DLMM'
        },
        {
            'pool_id': 'orgo_sol_orca',
            'token_a': 'ORGO',
            'token_b': 'SOL',
            'tvl': 1800000,
            'apy': 12.4,
            'fee_tier': 0.0025,  # 0.25%
            'volume_24h': 320000,
            'provider': 'Orca DEX'
        }
    ]
    
    return jsonify({
        'success': True,
        'pools': pools,
        'total_tvl': sum(pool['tvl'] for pool in pools)
    }), 200

@payment_bp.route('/compliance/screen', methods=['POST'])
def screen_transaction():
    """Screen transaction for compliance using Believe.app integration"""
    try:
        data = request.get_json()
        
        required_fields = ['sender', 'recipient', 'amount']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        sender = data['sender']
        recipient = data['recipient']
        amount = float(data['amount'])
        
        # Mock compliance screening
        risk_score = random.uniform(0.0, 0.15)  # Low risk for demo
        
        # Simulate different risk levels
        if amount > 10000:
            risk_score += 0.02  # Slightly higher risk for large amounts
        
        compliance_result = {
            'transaction_id': hashlib.sha256(f"{sender}{recipient}{amount}".encode()).hexdigest()[:12],
            'risk_score': round(risk_score, 4),
            'risk_level': 'LOW' if risk_score < 0.1 else 'MEDIUM' if risk_score < 0.5 else 'HIGH',
            'approved': risk_score < 0.1,
            'screening_provider': 'Believe.app',
            'checks_performed': [
                'AML screening',
                'Sanctions list check',
                'PEP verification',
                'Travel rule compliance'
            ],
            'timestamp': datetime.now().isoformat()
        }
        
        return jsonify({
            'success': True,
            'compliance': compliance_result
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

