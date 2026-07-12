# MulTTiPop Research Integration

## Classification

- **System:** 33.3FM Labs
- **Type:** External research dataset adapter
- **Source:** https://gclef-cmu.org/multtipop/
- **Dataset:** https://huggingface.co/datasets/gclef-cmu/multtipop
- **Paper:** https://arxiv.org/abs/2607.08756
- **License:** CC BY 4.0 for the released aligned MIDI data, with upstream attribution requirements
- **Status:** Candidate / research-only
- **Default autonomy:** A0 Observe

## What MulTTiPop provides

MulTTiPop is a multitrack pop-music transcription evaluation dataset containing 572 aligned segments and approximately 3.5 hours of material. It pairs multitrack MIDI labels with metadata identifying the corresponding source-audio segment.

The authors explicitly recommend:

1. Obtain only the relevant source-audio segments.
2. Use MulTTiPop for model evaluation, not model training.

33.3FM must preserve those constraints.

## 33.3FM use cases

### Transcription benchmark lane

Evaluate music-analysis systems on:

- instrument separation
- melody and harmony transcription
- bass-line extraction
- chord and arrangement analysis
- section-aware transcription
- multitrack alignment quality

### Agentic music operations

Use benchmark results to score candidate tools before recommending them to artists, producers, labels, or educational programs.

### Academy demonstrations

Create rights-aware demonstrations showing how machine transcription differs from original composition, arrangement, performance, master ownership, and publishing ownership.

### Dataset provenance training

Teach creators and agents to distinguish:

- source audio
- derived MIDI labels
- metadata references
- model-generated inference
- licensed dataset content

## Hard boundaries

- Do not use MulTTiPop as a training corpus.
- Do not bulk-download full copyrighted source recordings.
- Do not redistribute source audio.
- Do not represent evaluation outputs as ownership evidence.
- Do not use transcription output to bypass licensing, publishing, or master rights.
- Do not expose YouTube identifiers as a substitute for rights clearance.
- Do not promote inferred credits, splits, samples, or ownership claims without human review.

## Proposed architecture

```text
MulTTiPop metadata + MIDI
        |
        v
33.3FM Research Ingest
        |
        +--> license + attribution check
        +--> segment-only source retrieval policy
        +--> isolated benchmark runner
        +--> transcription candidate scoring
        +--> provenance receipt
        v
33.3FM Labs Evaluation Report
        |
        +--> Academy lesson
        +--> tool recommendation
        +--> model comparison
        +--> no automatic commercial release action
```

## Evaluation receipt

Every run should record:

```json
{
  "dataset": "MulTTiPop",
  "datasetVersion": "v1",
  "split": "dev|test",
  "segmentId": "string",
  "model": "string",
  "modelVersion": "string",
  "metrics": {},
  "sourceAudioRetrieved": false,
  "retrievalPolicy": "segment-only",
  "trainingUse": false,
  "licenseReviewed": true,
  "executedAt": "ISO-8601",
  "reviewer": "human-or-service-id"
}
```

## Attribution

Any published benchmark, demo, or derivative research output must cite the MulTTiPop paper and preserve the required dataset attribution.
