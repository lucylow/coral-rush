from flask import Blueprint, jsonify, request
import requests
import json
from datetime import datetime, timedelta
import time

meteora_bp = Blueprint('meteora', __name__)

# Cache for API responses (simple in-memory cache)
cache = {}
CACHE_DURATION = 300  # 5 minutes

def is_cache_valid(cache_key):
    """Check if cached data is still valid"""
    if cache_key not in cache:
        return False
    return time.time() - cache[cache_key]['timestamp'] < CACHE_DURATION

def get_cached_data(cache_key):
    """Get cached data if valid"""
    if is_cache_valid(cache_key):
        return cache[cache_key]['data']
    return None

def set_cache_data(cache_key, data):
    """Set data in cache with timestamp"""
    cache[cache_key] = {
        'data': data,
        'timestamp': time.time()
    }

@meteora_bp.route('/pools', methods=['GET'])
def get_meteora_pools():
    """Get all Meteora liquidity pools"""
    try:
        cache_key = 'meteora_all_pools'
        cached_data = get_cached_data(cache_key)
        
        if cached_data:
            return jsonify({
                'success': True,
                'data': cached_data,
                'cached': True,
                'timestamp': datetime.now().isoformat()
            })

        # Shyft GraphQL API query for all DLMM pools
        query = """
        query GetAllPools {
            meteora_dlmm_LbPair(limit: 50) {
                activeId
                binStep
                reserveX
                reserveY
                status
                tokenXMint
                tokenYMint
                oracle
                protocolFee
                lastUpdatedAt
                pairType
            }
        }
        """
        
        # Note: In production, you would use a real Shyft API key
        # For demo purposes, we'll return simulated data
        simulated_pools = [
            {
                "activeId": 8388608,
                "binStep": 25,
                "reserveX": "1250000000",
                "reserveY": "2500000000000",
                "status": "Enabled",
                "tokenXMint": "G85CQEBqwsoe3qkb5oXXpdZFh7uhYXhDRsQAM4aJuBLV",  # ORGO token
                "tokenYMint": "So11111111111111111111111111111111111111112",   # SOL
                "oracle": "7UVimffxr9ow1uXYxsr4LHAcV58mLzhmwaeKvJ1pjLiE",
                "protocolFee": 2000,
                "lastUpdatedAt": datetime.now().isoformat(),
                "pairType": "Permissionless",
                "poolAddress": "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDs3nWqHBXmsPiSb1",
                "tvl": 3750000,
                "volume24h": 125000,
                "fees24h": 250,
                "apy": 18.5
            },
            {
                "activeId": 8388610,
                "binStep": 10,
                "reserveX": "5000000000",
                "reserveY": "5000000000000",
                "status": "Enabled",
                "tokenXMint": "G85CQEBqwsoe3qkb5oXXpdZFh7uhYXhDRsQAM4aJuBLV",  # ORGO token
                "tokenYMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",   # USDC
                "oracle": "8UVimffxr9ow1uXYxsr4LHAcV58mLzhmwaeKvJ1pjLiF",
                "protocolFee": 2000,
                "lastUpdatedAt": datetime.now().isoformat(),
                "pairType": "Permissionless",
                "poolAddress": "8WzDXwBbmkg8ZTbNMqUxvQRAyrZzDs3nWqHBXmsPiSb2",
                "tvl": 10000000,
                "volume24h": 500000,
                "fees24h": 1000,
                "apy": 22.3
            }
        ]
        
        set_cache_data(cache_key, simulated_pools)
        
        return jsonify({
            'success': True,
            'data': simulated_pools,
            'cached': False,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

@meteora_bp.route('/pools/orgo', methods=['GET'])
def get_orgo_pools():
    """Get Meteora pools specifically for ORGO token"""
    try:
        cache_key = 'meteora_orgo_pools'
        cached_data = get_cached_data(cache_key)
        
        if cached_data:
            return jsonify({
                'success': True,
                'data': cached_data,
                'cached': True,
                'timestamp': datetime.now().isoformat()
            })

        orgo_token = "G85CQEBqwsoe3qkb5oXXpdZFh7uhYXhDRsQAM4aJuBLV"
        
        # Simulated ORGO pools data
        orgo_pools = [
            {
                "poolAddress": "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDs3nWqHBXmsPiSb1",
                "tokenX": {
                    "mint": orgo_token,
                    "symbol": "ORGO",
                    "decimals": 9,
                    "reserve": "1250000000"
                },
                "tokenY": {
                    "mint": "So11111111111111111111111111111111111111112",
                    "symbol": "SOL",
                    "decimals": 9,
                    "reserve": "2500000000000"
                },
                "price": 0.0005,  # 1 ORGO = 0.0005 SOL
                "tvl": 3750000,
                "volume24h": 125000,
                "fees24h": 250,
                "apy": 18.5,
                "binStep": 25,
                "activeId": 8388608,
                "status": "Active"
            },
            {
                "poolAddress": "8WzDXwBbmkg8ZTbNMqUxvQRAyrZzDs3nWqHBXmsPiSb2",
                "tokenX": {
                    "mint": orgo_token,
                    "symbol": "ORGO",
                    "decimals": 9,
                    "reserve": "5000000000"
                },
                "tokenY": {
                    "mint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                    "symbol": "USDC",
                    "decimals": 6,
                    "reserve": "5000000000000"
                },
                "price": 0.001,  # 1 ORGO = 0.001 USDC
                "tvl": 10000000,
                "volume24h": 500000,
                "fees24h": 1000,
                "apy": 22.3,
                "binStep": 10,
                "activeId": 8388610,
                "status": "Active"
            }
        ]
        
        set_cache_data(cache_key, orgo_pools)
        
        return jsonify({
            'success': True,
            'data': orgo_pools,
            'cached': False,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

@meteora_bp.route('/pools/<pool_address>', methods=['GET'])
def get_pool_details(pool_address):
    """Get detailed information for a specific pool"""
    try:
        cache_key = f'meteora_pool_{pool_address}'
        cached_data = get_cached_data(cache_key)
        
        if cached_data:
            return jsonify({
                'success': True,
                'data': cached_data,
                'cached': True,
                'timestamp': datetime.now().isoformat()
            })

        # Simulated pool details
        pool_details = {
            "poolAddress": pool_address,
            "tokenX": {
                "mint": "G85CQEBqwsoe3qkb5oXXpdZFh7uhYXhDRsQAM4aJuBLV",
                "symbol": "ORGO",
                "decimals": 9,
                "reserve": "1250000000",
                "price": 0.001
            },
            "tokenY": {
                "mint": "So11111111111111111111111111111111111111112",
                "symbol": "SOL",
                "decimals": 9,
                "reserve": "2500000000000",
                "price": 200
            },
            "tvl": 3750000,
            "volume24h": 125000,
            "fees24h": 250,
            "apy": 18.5,
            "binStep": 25,
            "activeId": 8388608,
            "status": "Active",
            "feeRate": 0.002,
            "protocolFee": 0.0002,
            "lpFee": 0.0018,
            "bins": [
                {"id": 8388607, "price": 0.0004995, "liquidityX": "625000000", "liquidityY": "0"},
                {"id": 8388608, "price": 0.0005000, "liquidityX": "625000000", "liquidityY": "1250000000000"},
                {"id": 8388609, "price": 0.0005005, "liquidityX": "0", "liquidityY": "1250000000000"}
            ],
            "priceHistory": [
                {"timestamp": (datetime.now() - timedelta(hours=24)).isoformat(), "price": 0.0004950},
                {"timestamp": (datetime.now() - timedelta(hours=12)).isoformat(), "price": 0.0004975},
                {"timestamp": datetime.now().isoformat(), "price": 0.0005000}
            ]
        }
        
        set_cache_data(cache_key, pool_details)
        
        return jsonify({
            'success': True,
            'data': pool_details,
            'cached': False,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

@meteora_bp.route('/pools/stats', methods=['GET'])
def get_meteora_stats():
    """Get overall Meteora ecosystem statistics"""
    try:
        cache_key = 'meteora_stats'
        cached_data = get_cached_data(cache_key)
        
        if cached_data:
            return jsonify({
                'success': True,
                'data': cached_data,
                'cached': True,
                'timestamp': datetime.now().isoformat()
            })

        # Simulated Meteora ecosystem stats
        stats = {
            "totalTVL": 125000000,
            "totalVolume24h": 15000000,
            "totalFees24h": 30000,
            "totalPools": 1247,
            "activePools": 1189,
            "orgoStats": {
                "totalTVL": 13750000,
                "totalVolume24h": 625000,
                "totalFees24h": 1250,
                "poolCount": 2,
                "averageAPY": 20.4,
                "burnRate": 0.001,  # 0.1% of volume burned
                "totalBurned": 625
            },
            "topPools": [
                {
                    "poolAddress": "8WzDXwBbmkg8ZTbNMqUxvQRAyrZzDs3nWqHBXmsPiSb2",
                    "pair": "ORGO/USDC",
                    "tvl": 10000000,
                    "apy": 22.3
                },
                {
                    "poolAddress": "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDs3nWqHBXmsPiSb1",
                    "pair": "ORGO/SOL",
                    "tvl": 3750000,
                    "apy": 18.5
                }
            ]
        }
        
        set_cache_data(cache_key, stats)
        
        return jsonify({
            'success': True,
            'data': stats,
            'cached': False,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

@meteora_bp.route('/pools/search', methods=['GET'])
def search_pools():
    """Search pools by token address or symbol"""
    try:
        token = request.args.get('token', '').strip()
        if not token:
            return jsonify({
                'success': False,
                'error': 'Token parameter is required',
                'timestamp': datetime.now().isoformat()
            }), 400

        cache_key = f'meteora_search_{token}'
        cached_data = get_cached_data(cache_key)
        
        if cached_data:
            return jsonify({
                'success': True,
                'data': cached_data,
                'cached': True,
                'timestamp': datetime.now().isoformat()
            })

        # Simulated search results
        if token.upper() == 'ORGO' or token == 'G85CQEBqwsoe3qkb5oXXpdZFh7uhYXhDRsQAM4aJuBLV':
            search_results = [
                {
                    "poolAddress": "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDs3nWqHBXmsPiSb1",
                    "pair": "ORGO/SOL",
                    "tvl": 3750000,
                    "apy": 18.5,
                    "volume24h": 125000
                },
                {
                    "poolAddress": "8WzDXwBbmkg8ZTbNMqUxvQRAyrZzDs3nWqHBXmsPiSb2",
                    "pair": "ORGO/USDC",
                    "tvl": 10000000,
                    "apy": 22.3,
                    "volume24h": 500000
                }
            ]
        else:
            search_results = []
        
        set_cache_data(cache_key, search_results)
        
        return jsonify({
            'success': True,
            'data': search_results,
            'cached': False,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

