from dataclasses import dataclass

from app.config import Settings


@dataclass(frozen=True)
class HealthStatus:
    status: str
    app: str
    environment: str
    api_prefix: str


def get_health_status(settings: Settings) -> HealthStatus:
    return HealthStatus(
        status="ok",
        app=settings.app_name,
        environment=settings.environment,
        api_prefix=settings.api_prefix,
    )

