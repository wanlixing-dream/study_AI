from functools import lru_cache
from pathlib import Path

try:
    from pydantic_settings import BaseSettings, SettingsConfigDict
except ModuleNotFoundError:  # pragma: no cover - local tests can run before deps are installed
    BaseSettings = object
    SettingsConfigDict = None


class Settings(BaseSettings):
    app_name: str = "Study AI Backend"
    environment: str = "local"
    api_prefix: str = "/v1"
    host: str = "127.0.0.1"
    port: int = 8001
    frontend_origin: str = "http://127.0.0.1:5173"
    repository_backend: str = "memory"
    database_url: str = "postgresql+psycopg://study_ai:study_ai@127.0.0.1:5432/study_ai"
    storage_root: Path = Path("./storage")
    learning_agent_base_url: str = "http://127.0.0.1:8000"

    if SettingsConfigDict:
        model_config = SettingsConfigDict(
            env_prefix="STUDY_AI_",
            env_file=".env",
            env_file_encoding="utf-8",
            extra="ignore",
        )


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
