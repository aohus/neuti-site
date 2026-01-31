# Technology Stack

## 1. Backend Stack
- **Language:** Python 3.12 (Strictly enforced)
- **Framework:** FastAPI (Latest)
- **Validation:** Pydantic v2 (Using `model_validate`, `ConfigDict`)
- **Database ORM:** SQLAlchemy 2.0+ (Asyncio Extension)
- **Database:** PostgreSQL
- **Dependency Management:** Poetry (with UV for fast installation)
- **Standards:** Guard Clauses, Async-first, Repository Pattern with Unit of Work (UoW).
- **Tools:** Ruff (Linter & Formatter), Mypy (Strict Type Checking).

## 2. Frontend Stack
- **Language:** TypeScript
- **Library/Framework:** React (using Next.js App Router for modern SEO-friendly structure)
- **Validation:** Zod (for schema validation)
- **Styling:** Tailwind CSS (for rapid and consistent UI development)
- **Standards:** Readability First, Functional Components, Type Safety (avoiding `any`), Immutability Pattern.
- **Tools:** ESLint, Prettier.

## 3. Infrastructure & DevOps
- **Containerization:** Docker (Multi-stage builds)
- **Orchestration:** Docker Compose
- **Migrations:** Alembic (Async configuration)

## 4. Development Standards
Follow the detailed standards defined in:
- Backend: `[.ai/skills/python/SKILL.md](../.ai/skills/python/SKILL.md)`
- Frontend: `[.ai/skills/coding-standards/SKILL.md](../.ai/skills/coding-standards/SKILL.md)`