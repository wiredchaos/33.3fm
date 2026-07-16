# 33.3FM SCORE LAB MVP

SCORE LAB turns creator-owned audio and optional lyrics into an editable lead-sheet package.

This directory is the implementation boundary for GitHub Issue #3.

## MVP promise

```text
MP3/WAV + OPTIONAL LYRICS
  -> PRIVATE PROJECT INTAKE
  -> AUDIO ANALYSIS
  -> LEAD MELODY MIDI
  -> MUSICXML
  -> AI DRAFT PDF
  -> HUMAN REVIEW
  -> VERSIONED EXPORT PACKAGE + RECEIPT
```

The MVP does not promise flawless automatic transcription or full orchestral scoring. Every generated score remains an `AI DRAFT` until a human explicitly approves it.

## Service boundaries

```text
score-lab/
  contracts/       Shared JSON contracts and examples
  web/             Creator intake, status, review and export UI
  worker/          Isolated Python audio/notation processing service
  fixtures/        Synthetic or public-domain test inputs only
  docs/            Architecture and operating notes
```

Private creator audio must never be committed to Git.

## First vertical slice

1. Create a private project.
2. Validate MP3/WAV metadata and creator declaration.
3. Generate a SHA-256 fingerprint.
4. Queue a processing job.
5. Return analysis metadata and a lead-melody MIDI artifact.
6. Generate valid MusicXML.
7. Render an `AI DRAFT` lead-sheet PDF.
8. Package exports with a machine-readable processing receipt.

## Canonical job states

```text
created
uploaded
queued
analyzing
transcribing
generating_score
awaiting_review
approved
exporting
completed
failed
cancelled
```

Clients must treat unknown states as non-terminal and display the raw state rather than silently guessing.

## Privacy and rights rules

- Audio is private by default.
- The creator must declare ownership, a license, or permission to process the source.
- 33.3FM does not claim ownership of uploaded or generated musical material.
- Temporary working files must support expiration and deletion.
- Human review is required before an output can be marked verified or published.
- A processing receipt documents the technical trail. It is not copyright registration or legal advice.

## Local development target

The frontend may run with the existing Vite application. The worker should expose a versioned API under `/v1` and be independently containerizable.

Initial endpoints:

```text
POST /v1/projects
POST /v1/projects/{project_id}/audio
POST /v1/projects/{project_id}/jobs
GET  /v1/projects/{project_id}
GET  /v1/jobs/{job_id}
POST /v1/projects/{project_id}/approve
GET  /v1/projects/{project_id}/exports
DELETE /v1/projects/{project_id}
```

See `contracts/` for the canonical payload shapes.