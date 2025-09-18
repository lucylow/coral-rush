import os
from dotenv import load_dotenv

load_dotenv()

class OrgoConfig:
    ORGO_API_KEY = os.getenv("ORGO_API_KEY")
    ORGO_API_BASE = os.getenv("ORGO_API_BASE", "https://api.orgo.ai/v1")

    SOLANA_RPC_URL = os.getenv("SOLANA_RPC_URL", "https://api.devnet.solana.com")
    SOLANA_PRIVATE_KEY = os.getenv("SOLANA_PRIVATE_KEY")

    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    OPENAI_API_BASE = os.getenv("OPENAI_API_BASE", "https://api.openai.com/v1")

    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./orgorush.db")

    SECRET_KEY = os.getenv("SECRET_KEY", "orgorush_secret_key_2024_hackathon")
    ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY")

    FLASK_ENV = os.getenv("FLASK_ENV", "development")
    DEBUG = os.getenv("DEBUG", "true").lower() == "true"
    PORT = int(os.getenv("PORT", 5000))

    CIRCUIT_PATH = os.getenv("CIRCUIT_PATH", "./zk-circuits")
    PROVING_KEY_PATH = os.getenv("PROVING_KEY_PATH", "./zk-circuits/kyc.zkey")
    VERIFICATION_KEY_PATH = os.getenv("VERIFICATION_KEY_PATH", "./zk-circuits/verification_key.json")

    # Add Anthropic API key
    ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

    # Add ORGORUSH_API_KEY and ORGO_VM_CLUSTER if they are needed
    ORGORUSH_API_KEY = os.getenv("ORGORUSH_API_KEY")
    ORGO_VM_CLUSTER = os.getenv("ORGO_VM_CLUSTER")


config = OrgoConfig()


