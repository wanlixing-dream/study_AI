from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import create_router
from app.config import get_settings
from app.dependencies import create_container
from app.services.health import get_health_status


def create_app() -> FastAPI:
    settings = get_settings()
    container = create_container()
    app = FastAPI(title=settings.app_name)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.frontend_origin],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/health")
    def health() -> dict[str, str]:
        status = get_health_status(settings)
        return {
            "status": status.status,
            "app": status.app,
            "environment": status.environment,
            "apiPrefix": status.api_prefix,
        }

    @app.get(f"{settings.api_prefix}/health")
    def api_health() -> dict[str, str]:
        status = get_health_status(settings)
        return {
            "status": status.status,
            "app": status.app,
            "environment": status.environment,
            "apiPrefix": status.api_prefix,
        }

    app.include_router(create_router(container), prefix=settings.api_prefix)
    return app


app = create_app()
