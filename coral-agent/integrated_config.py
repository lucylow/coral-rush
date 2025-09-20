#!/usr/bin/env python3
"""
Integrated System Configuration
Configuration management for the unified ORGO Rush + Coral Protocol system
"""

import os
import json
from typing import Dict, Any, Optional
from dataclasses import dataclass, asdict
from pathlib import Path

@dataclass
class CoralProtocolConfig:
    """Coral Protocol configuration"""
    server_url: str = "http://localhost:8080"
    api_key: Optional[str] = None
    timeout: int = 30
    retry_attempts: int = 3
    enable_websocket: bool = True
    websocket_url: Optional[str] = None

@dataclass
class ORGORushConfig:
    """ORGO Rush configuration"""
    backend_url: str = "http://localhost:5001"
    api_key: Optional[str] = None
    timeout: int = 30
    enable_desktop_integration: bool = True
    desktop_instance_id: Optional[str] = None
    enable_ai_services: bool = True

@dataclass
class AgentConfig:
    """Individual agent configuration"""
    agent_id: str
    name: str
    agent_type: str  # 'coral' or 'orgo'
    enabled: bool = True
    timeout: int = 30
    retry_attempts: int = 3
    performance_threshold: float = 0.8
    capabilities: list = None
    
    def __post_init__(self):
        if self.capabilities is None:
            self.capabilities = []

@dataclass
class WorkflowConfig:
    """Workflow configuration"""
    workflow_id: str
    name: str
    enabled: bool = True
    timeout: int = 60
    max_parallel_steps: int = 5
    retry_failed_steps: bool = True
    steps: list = None
    
    def __post_init__(self):
        if self.steps is None:
            self.steps = []

@dataclass
class PerformanceConfig:
    """Performance monitoring configuration"""
    enable_metrics: bool = True
    metrics_interval: int = 30  # seconds
    enable_profiling: bool = False
    max_session_history: int = 1000
    cleanup_interval: int = 3600  # seconds

@dataclass
class SecurityConfig:
    """Security configuration"""
    enable_encryption: bool = True
    encryption_key: Optional[str] = None
    enable_rate_limiting: bool = True
    rate_limit_requests: int = 100
    rate_limit_window: int = 3600  # seconds
    enable_audit_logging: bool = True

@dataclass
class IntegratedSystemConfig:
    """Main integrated system configuration"""
    coral_protocol: CoralProtocolConfig
    orgo_rush: ORGORushConfig
    agents: Dict[str, AgentConfig]
    workflows: Dict[str, WorkflowConfig]
    performance: PerformanceConfig
    security: SecurityConfig
    
    # System settings
    system_name: str = "Integrated Agent System"
    version: str = "1.0.0"
    environment: str = "development"
    debug_mode: bool = False
    log_level: str = "INFO"

class ConfigManager:
    """Configuration manager for the integrated system"""
    
    def __init__(self, config_file: Optional[str] = None):
        self.config_file = config_file or "integrated_config.json"
        self.config: Optional[IntegratedSystemConfig] = None
        
    def load_config(self) -> IntegratedSystemConfig:
        """Load configuration from file or environment variables"""
        if os.path.exists(self.config_file):
            return self._load_from_file()
        else:
            return self._load_from_environment()
    
    def _load_from_file(self) -> IntegratedSystemConfig:
        """Load configuration from JSON file"""
        try:
            with open(self.config_file, 'r') as f:
                config_data = json.load(f)
            
            # Parse configuration
            coral_config = CoralProtocolConfig(**config_data.get('coral_protocol', {}))
            orgo_config = ORGORushConfig(**config_data.get('orgo_rush', {}))
            
            # Parse agents
            agents = {}
            for agent_id, agent_data in config_data.get('agents', {}).items():
                agents[agent_id] = AgentConfig(**agent_data)
            
            # Parse workflows
            workflows = {}
            for workflow_id, workflow_data in config_data.get('workflows', {}).items():
                workflows[workflow_id] = WorkflowConfig(**workflow_data)
            
            # Parse other configs
            performance_config = PerformanceConfig(**config_data.get('performance', {}))
            security_config = SecurityConfig(**config_data.get('security', {}))
            
            # Create main config
            self.config = IntegratedSystemConfig(
                coral_protocol=coral_config,
                orgo_rush=orgo_config,
                agents=agents,
                workflows=workflows,
                performance=performance_config,
                security=security_config,
                system_name=config_data.get('system_name', 'Integrated Agent System'),
                version=config_data.get('version', '1.0.0'),
                environment=config_data.get('environment', 'development'),
                debug_mode=config_data.get('debug_mode', False),
                log_level=config_data.get('log_level', 'INFO')
            )
            
            return self.config
            
        except Exception as e:
            print(f"Error loading config file: {e}")
            return self._load_from_environment()
    
    def _load_from_environment(self) -> IntegratedSystemConfig:
        """Load configuration from environment variables"""
        
        # Coral Protocol config
        coral_config = CoralProtocolConfig(
            server_url=os.getenv('CORAL_SERVER_URL', 'http://localhost:8080'),
            api_key=os.getenv('CORAL_API_KEY'),
            timeout=int(os.getenv('CORAL_TIMEOUT', '30')),
            retry_attempts=int(os.getenv('CORAL_RETRY_ATTEMPTS', '3')),
            enable_websocket=os.getenv('CORAL_ENABLE_WEBSOCKET', 'true').lower() == 'true',
            websocket_url=os.getenv('CORAL_WEBSOCKET_URL')
        )
        
        # ORGO Rush config
        orgo_config = ORGORushConfig(
            backend_url=os.getenv('ORGO_BACKEND_URL', 'http://localhost:5001'),
            api_key=os.getenv('ORGO_API_KEY'),
            timeout=int(os.getenv('ORGO_TIMEOUT', '30')),
            enable_desktop_integration=os.getenv('ORGO_ENABLE_DESKTOP', 'true').lower() == 'true',
            desktop_instance_id=os.getenv('ORGO_DESKTOP_INSTANCE_ID'),
            enable_ai_services=os.getenv('ORGO_ENABLE_AI_SERVICES', 'true').lower() == 'true'
        )
        
        # Default agents configuration
        agents = {
            'coral-voice-listener': AgentConfig(
                agent_id='coral-voice-listener',
                name='Coral Voice Listener',
                agent_type='coral',
                capabilities=['speech-to-text', 'text-to-speech', 'voice-processing']
            ),
            'coral-payment-processor': AgentConfig(
                agent_id='coral-payment-processor',
                name='Coral Payment Processor',
                agent_type='coral',
                capabilities=['payment-processing', 'blockchain-operations', 'settlement']
            ),
            'orgo-fraud-detector': AgentConfig(
                agent_id='orgo-fraud-detector',
                name='ORGO Fraud Detector',
                agent_type='orgo',
                capabilities=['fraud-detection', 'anomaly-detection', 'risk-assessment']
            ),
            'orgo-lstm-predictor': AgentConfig(
                agent_id='orgo-lstm-predictor',
                name='ORGO LSTM Predictor',
                agent_type='orgo',
                capabilities=['transaction-prediction', 'pattern-recognition', 'optimization']
            ),
            'orgo-payment-agent': AgentConfig(
                agent_id='orgo-payment-agent',
                name='ORGO Payment Agent',
                agent_type='orgo',
                capabilities=['payment-processing', 'token-burning', 'cross-border-settlement']
            ),
            'orgo-orchestrator': AgentConfig(
                agent_id='orgo-orchestrator',
                name='ORGO Agent Orchestrator',
                agent_type='orgo',
                capabilities=['agent-coordination', 'workflow-management', 'performance-optimization']
            )
        }
        
        # Default workflows configuration
        workflows = {
            'voice_payment_unified': WorkflowConfig(
                workflow_id='voice_payment_unified',
                name='Unified Voice Payment Processing',
                steps=[
                    'voice_processing',
                    'fraud_detection',
                    'transaction_prediction',
                    'payment_processing',
                    'settlement'
                ]
            ),
            'optimized_payment': WorkflowConfig(
                workflow_id='optimized_payment',
                name='Optimized Payment Processing',
                steps=[
                    'fraud_detection',
                    'transaction_prediction',
                    'payment_optimization',
                    'settlement'
                ]
            )
        }
        
        # Performance config
        performance_config = PerformanceConfig(
            enable_metrics=os.getenv('ENABLE_METRICS', 'true').lower() == 'true',
            metrics_interval=int(os.getenv('METRICS_INTERVAL', '30')),
            enable_profiling=os.getenv('ENABLE_PROFILING', 'false').lower() == 'true',
            max_session_history=int(os.getenv('MAX_SESSION_HISTORY', '1000')),
            cleanup_interval=int(os.getenv('CLEANUP_INTERVAL', '3600'))
        )
        
        # Security config
        security_config = SecurityConfig(
            enable_encryption=os.getenv('ENABLE_ENCRYPTION', 'true').lower() == 'true',
            encryption_key=os.getenv('ENCRYPTION_KEY'),
            enable_rate_limiting=os.getenv('ENABLE_RATE_LIMITING', 'true').lower() == 'true',
            rate_limit_requests=int(os.getenv('RATE_LIMIT_REQUESTS', '100')),
            rate_limit_window=int(os.getenv('RATE_LIMIT_WINDOW', '3600')),
            enable_audit_logging=os.getenv('ENABLE_AUDIT_LOGGING', 'true').lower() == 'true'
        )
        
        # Create main config
        self.config = IntegratedSystemConfig(
            coral_protocol=coral_config,
            orgo_rush=orgo_config,
            agents=agents,
            workflows=workflows,
            performance=performance_config,
            security=security_config,
            system_name=os.getenv('SYSTEM_NAME', 'Integrated Agent System'),
            version=os.getenv('SYSTEM_VERSION', '1.0.0'),
            environment=os.getenv('ENVIRONMENT', 'development'),
            debug_mode=os.getenv('DEBUG_MODE', 'false').lower() == 'true',
            log_level=os.getenv('LOG_LEVEL', 'INFO')
        )
        
        return self.config
    
    def save_config(self, config: IntegratedSystemConfig):
        """Save configuration to file"""
        try:
            config_dict = asdict(config)
            
            with open(self.config_file, 'w') as f:
                json.dump(config_dict, f, indent=2)
            
            print(f"Configuration saved to {self.config_file}")
            
        except Exception as e:
            print(f"Error saving config: {e}")
    
    def create_default_config(self):
        """Create default configuration file"""
        config = self._load_from_environment()
        self.save_config(config)
        return config
    
    def validate_config(self, config: IntegratedSystemConfig) -> bool:
        """Validate configuration"""
        try:
            # Validate Coral Protocol config
            if not config.coral_protocol.server_url:
                print("Error: Coral Protocol server URL is required")
                return False
            
            # Validate ORGO Rush config
            if not config.orgo_rush.backend_url:
                print("Error: ORGO Rush backend URL is required")
                return False
            
            # Validate agents
            if not config.agents:
                print("Error: At least one agent must be configured")
                return False
            
            # Validate workflows
            if not config.workflows:
                print("Error: At least one workflow must be configured")
                return False
            
            # Validate security
            if config.security.enable_encryption and not config.security.encryption_key:
                print("Warning: Encryption enabled but no encryption key provided")
            
            return True
            
        except Exception as e:
            print(f"Error validating config: {e}")
            return False
    
    def get_agent_config(self, agent_id: str) -> Optional[AgentConfig]:
        """Get configuration for a specific agent"""
        if not self.config:
            self.load_config()
        
        return self.config.agents.get(agent_id)
    
    def get_workflow_config(self, workflow_id: str) -> Optional[WorkflowConfig]:
        """Get configuration for a specific workflow"""
        if not self.config:
            self.load_config()
        
        return self.config.workflows.get(workflow_id)
    
    def update_agent_config(self, agent_id: str, **kwargs):
        """Update configuration for a specific agent"""
        if not self.config:
            self.load_config()
        
        if agent_id in self.config.agents:
            agent_config = self.config.agents[agent_id]
            for key, value in kwargs.items():
                if hasattr(agent_config, key):
                    setattr(agent_config, key, value)
    
    def get_enabled_agents(self) -> Dict[str, AgentConfig]:
        """Get all enabled agents"""
        if not self.config:
            self.load_config()
        
        return {agent_id: config for agent_id, config in self.config.agents.items() if config.enabled}
    
    def get_enabled_workflows(self) -> Dict[str, WorkflowConfig]:
        """Get all enabled workflows"""
        if not self.config:
            self.load_config()
        
        return {workflow_id: config for workflow_id, config in self.config.workflows.items() if config.enabled}

# Example usage and configuration creation
def create_example_config():
    """Create an example configuration file"""
    config_manager = ConfigManager("example_integrated_config.json")
    config = config_manager.create_default_config()
    
    print("Example configuration created:")
    print(f"System: {config.system_name} v{config.version}")
    print(f"Environment: {config.environment}")
    print(f"Coral Protocol Server: {config.coral_protocol.server_url}")
    print(f"ORGO Rush Backend: {config.orgo_rush.backend_url}")
    print(f"Agents: {len(config.agents)}")
    print(f"Workflows: {len(config.workflows)}")
    
    return config

if __name__ == "__main__":
    # Create example configuration
    config = create_example_config()
    
    # Validate configuration
    config_manager = ConfigManager()
    if config_manager.validate_config(config):
        print("✅ Configuration is valid")
    else:
        print("❌ Configuration has errors")
