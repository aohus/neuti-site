# Product Guidelines

## 1. Brand & Prose Style
- **Tone & Voice:** Professional and Formal.
    - 신뢰감을 주기 위해 정중하고 객관적인 어조를 사용합니다.
    - 전문 용어는 정확하게 사용하되, 고객(일반인)이 이해하기 쉽도록 맥락을 제공합니다.
    - '나무는 삶의 동반자'라는 철학을 바탕으로 진정성을 담습니다.

## 2. Visual Identity
- **Theme:** Nature-Friendly & Earthy.
    - **Primary Colors:** Green (생명, 나무), Brown/Earth (흙, 안정감).
    - **Atmosphere:** 자연과의 조화, 심리적 안정감, 전문적인 치유.
    - **Design Philosophy:** 자연의 편안함을 주는 동시에 나무병원의 전문성을 드러내는 깔끔한 레이아웃.

## 3. Coding Standards & AI Rules
This project follows the coding standards and AI rules defined in the `.ai/` directory.
- **Reference:** Please refer to `[.ai/rules/coding-style.md](../.ai/rules/coding-style.md)` for detailed coding conventions.
- **AI Operations:** Adhere to the AI roles and workflows defined in `[.ai/agents/](../.ai/agents/)` and `[.ai/rules/](../.ai/rules/)`.

## 4. Git Workflow
- **Commit Messages:** Follow **Conventional Commits** specification.
    - `feat:` New features
    - `fix:` Bug fixes
    - `docs:` Documentation changes
    - `style:` Formatting, missing semi colons, etc; no code change
    - `refactor:` Refactoring production code
    - `test:` Adding missing tests, refactoring tests
    - `chore:` Updating build tasks, package manager configs, etc
- **Branching:** Feature branching workflow is recommended (e.g., `feature/branch-name`, `fix/issue-id`).

## 5. Documentation Strategy
- **Focus:** Maintain high-level documentation in `README.md` and the `conductor/` directory.
- **Code Comments:** Prioritize readable code over heavy commenting. Add comments only for complex logic or "why" explanations.
- **Project Index:** Keep `conductor/index.md` and `conductor/initial_set.md` updated as the entry points for project documentation.
