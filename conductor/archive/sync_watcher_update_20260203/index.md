# Track: Sync Watcher Update (2026-02-03)

## Objective
Update the `sync_watcher` service (`backend/app/sync_md.py`) to support updating existing `Performance` records in the database when the corresponding markdown files are modified.

## Context
Currently, the `sync_md.py` script skips processing if a record with the same title already exists in the database to prioritize web edits. However, for a markdown-driven workflow, updates to the markdown files should act as the source of truth or at least be able to update the database. The user requested this change explicitly.

## Plan
1.  **Modify `backend/app/sync_md.py`**:
    *   Locate the logic that checks for existing records (`if db_obj:`).
    *   Remove the `continue` statement.
    *   Implement logic to update the fields of `db_obj` with the parsed data from the markdown file.
    *   Ensure the `updated_at` timestamp is updated (if applicable, though `Performance` model might verify this).
2.  **Verify**:
    *   Run the watcher.
    *   Modify a markdown file.
    *   Check if the changes are reflected in the database.

## Status
- [x] Modify `backend/app/sync_md.py`
- [x] Verify functionality
