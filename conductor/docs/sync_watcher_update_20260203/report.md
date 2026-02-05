# Report: Sync Watcher Update (2026-02-03)

## Summary
The `sync_watcher` service (`backend/app/sync_md.py`) was updated to support updating existing `Performance` records in the database when the corresponding markdown files are modified. Previously, the service would skip processing if a record with the same title already existed.

## Changes
- **`backend/app/sync_md.py`**:
    - Refactored `sync_performances` to construct `performance_data` dictionary before checking for existing records.
    - Modified the logic to check if a record exists (`db_obj`).
    - If it exists, update its attributes using `setattr` with values from `performance_data`.
    - If it does not exist, create a new `Performance` instance and add it to the session.

## Outcome
Changes to markdown files (content, metadata) will now be reflected in the database when the `sync-watcher` processes the file event or runs a sync. This ensures the database stays in sync with the markdown files, which are treated as the source of truth for content structure.
