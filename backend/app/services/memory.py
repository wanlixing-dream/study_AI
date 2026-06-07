from app.domain.models import AgentMemory, MemoryAction, MemoryEvent, ReviewStatus
from app.ports import MemoryRepositoryPort


class MemoryNotFoundError(ValueError):
    """Raised when a memory operation targets a missing memory."""


class MemoryValidationError(ValueError):
    """Raised when memory input is not valid enough to store."""


class MemoryService:
    def __init__(self, memories: MemoryRepositoryPort) -> None:
        self.memories = memories

    def propose_memory(
        self,
        *,
        content: str,
        scope: str,
        memory_type: str,
        entities: tuple[str, ...] = (),
        importance: float = 0.5,
        confidence: float = 0.5,
        source_text: str = "",
        actor: str = "system",
    ) -> tuple[AgentMemory, MemoryEvent]:
        normalized_content = content.strip()
        normalized_scope = scope.strip()
        normalized_type = memory_type.strip()
        if not normalized_content:
            raise MemoryValidationError("Memory content is required.")
        if not normalized_scope:
            raise MemoryValidationError("Memory scope is required.")
        if not normalized_type:
            raise MemoryValidationError("Memory type is required.")

        memory = self.memories.add_memory(
            AgentMemory(
                content=normalized_content,
                scope=normalized_scope,
                memory_type=normalized_type,
                entities=tuple(entity.strip() for entity in entities if entity.strip()),
                importance=max(0.0, min(importance, 1.0)),
                confidence=max(0.0, min(confidence, 1.0)),
                status=ReviewStatus.candidate,
            )
        )
        event = self.memories.append_event(
            MemoryEvent(
                memory_id=memory.id,
                action=MemoryAction.add,
                reason="Memory proposed for review.",
                actor=actor,
                source_text=source_text,
            )
        )
        return memory, event

    def review_memory(
        self,
        *,
        memory_id: str,
        status: ReviewStatus,
        reason: str,
        actor: str = "system",
    ) -> tuple[AgentMemory, MemoryEvent]:
        if status not in {ReviewStatus.approved, ReviewStatus.rejected, ReviewStatus.needs_review}:
            raise MemoryValidationError("Memory review status must be approved, rejected, or needs-review.")
        if self.memories.get_memory(memory_id) is None:
            raise MemoryNotFoundError(f"Memory not found: {memory_id}")

        memory = self.memories.update_memory_status(memory_id, status)
        action = MemoryAction.reject if status == ReviewStatus.rejected else MemoryAction.update
        event = self.memories.append_event(
            MemoryEvent(
                memory_id=memory.id,
                action=action,
                reason=reason.strip() or f"Memory marked {status.value}.",
                actor=actor,
            )
        )
        return memory, event
