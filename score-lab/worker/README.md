# SCORE LAB Processing Worker

The worker performs untrusted media processing outside the web application process.

## Responsibilities

- Validate decoded audio metadata.
- Compute and verify source fingerprints.
- Detect tempo, key, meter and coarse song sections.
- Extract a lead or vocal melody to MIDI.
- Estimate a basic chord timeline.
- Generate MusicXML with title, composer, lyrics, chords and section labels.
- Render draft PDFs through a notation renderer.
- Emit structured status events and a processing receipt.

## Non-responsibilities

- Public publishing or distribution.
- Ownership adjudication.
- Copyright registration.
- Declaring AI transcription perfect.
- Keeping creator audio indefinitely.

## Proposed modules

```text
worker/
  app/
    api.py
    config.py
    models.py
    pipeline.py
    storage.py
    receipts.py
    stages/
      inspect_audio.py
      analyze_music.py
      extract_melody.py
      estimate_chords.py
      align_lyrics.py
      build_musicxml.py
      render_score.py
  tests/
  pyproject.toml
  Dockerfile
```

## Pipeline rules

1. Each stage receives immutable input references and writes a new versioned artifact.
2. Each stage records its tool name, version, start time, completion time and error state.
3. A failed stage must not leave a project marked successful.
4. Partial results may be preserved for debugging but must remain private and expire.
5. No shell command may interpolate creator-provided filenames or metadata.
6. Media is decoded inside a constrained worker with CPU, memory, execution-time and output-size limits.
7. External network access should be disabled during transcription unless a specifically approved service requires it.
8. PDF and MusicXML exports must visibly include `AI DRAFT` until approval.

## Suggested first implementation

- API: FastAPI
- Queue: database-backed jobs for the first beta, replaceable later
- Analysis: librosa and/or Essentia
- Melody: Spotify Basic Pitch
- Notation: music21
- Rendering: MuseScore CLI in the worker image
- Validation: Pydantic plus the shared JSON schemas

## Definition of done for the first worker

Given a synthetic monophonic WAV fixture, the worker must produce:

- an analysis JSON document,
- a MIDI file containing the detected melody,
- valid MusicXML that opens in MuseScore,
- a readable PDF labeled `AI DRAFT`, and
- a receipt whose artifact fingerprints match the generated files.