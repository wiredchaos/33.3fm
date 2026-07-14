# 33.3FM SCORE LAB

## AI Music to Editable Sheet Music

**Turn the song in your head into music the world can play.**

33.3FM SCORE LAB converts AI-generated music, demos, voice recordings, and finished songs into editable musical notation and creator-ready export packages.

Creators upload a track. SCORE LAB separates the audio into usable parts, identifies melody, rhythm, chords, tempo, key, lyrics, and song structure, then produces downloadable sheet music, MIDI, MusicXML, chord charts, and archive receipts.

---

## Why It Exists

AI music platforms can generate complete songs, but creators are often left without the underlying musical documentation.

A songwriter may have:

- Lyrics
- A finished MP3 or WAV
- An AI-generated instrumental
- A vocal performance
- No written melody
- No chord chart
- No editable arrangement
- No performance-ready score

This makes it harder to recreate the song with musicians, arrange it for new formats, teach it to performers, preserve the composition, or organize rights and publishing documentation.

---

## Core Promise

Upload a song and receive a playable music package.

Possible outputs:

- Lead sheet PDF
- Vocal melody notation
- Lyrics aligned beneath notes
- Chord symbols
- Piano and vocal score
- Guitar chord chart
- MIDI
- MusicXML
- Instrument stems
- Tempo and key analysis
- Song structure map
- Processing receipt

---

## User Flow

```text
SONG UPLOAD
    ↓
AUDIO QUALITY CHECK
    ↓
STEM SEPARATION
    ↓
TEMPO, KEY, METER AND STRUCTURE ANALYSIS
    ↓
PITCH, RHYTHM AND CHORD TRANSCRIPTION
    ↓
LYRIC ALIGNMENT
    ↓
NOTATION CLEANUP
    ↓
CREATOR REVIEW
    ↓
PDF + MIDI + MUSICXML + RECEIPT
```

### 1. Upload

Accepted sources:

- MP3
- WAV
- M4A
- MIDI
- Voice memo
- Instrumental
- AI-generated song
- Individual stems

Creators may paste the original lyrics separately to improve alignment accuracy.

### 2. Choose a Score Type

#### Lead Sheet

- Vocal melody
- Lyrics
- Chords
- Song sections

#### Piano and Vocal

- Vocal melody
- Lyrics
- Piano accompaniment
- Chord symbols

#### Guitar Chart

- Lyrics
- Chords
- Tempo
- Key
- Song structure

#### Choir Arrangement

- Soprano
- Alto
- Tenor
- Bass
- Piano reference

#### Full Score

Available parts may include vocals, piano, bass, drums, guitar, strings, synthesizers, brass, and other detected instruments.

### 3. Review and Correct

The Score Editor should allow creators to:

- Correct notes
- Edit lyrics
- Move lyric syllables
- Change chords
- Change key
- Adjust tempo
- Transpose for another singer
- Rename song sections
- Remove instruments
- Simplify passages
- Compare notation against synchronized audio

### 4. Export

#### Standard Package

- Lead sheet PDF
- Chord chart PDF
- MIDI
- MusicXML
- Song analysis report

#### Performance Package

- Piano and vocal score
- Instrument parts
- Transposed versions
- Rehearsal audio
- Click track

#### Archive Package

- Original uploaded audio
- Separated stems
- Lyrics file
- Score files
- File fingerprint
- Creation timestamp
- Version history
- Processing receipt

---

## Product Modules

### SIGNAL SPLITTER

Separates a mixed recording into vocals, drums, bass, piano, guitar, and other usable audio stems.

### MELODY SCRIBE

Detects pitch, rhythm, note duration, rests, melodic phrases, and repeated musical patterns.

### CHORD ORACLE

Identifies key, chord names, chord changes, harmonic movement, and possible alternate interpretations.

### LYRIC LOCK

Aligns creator-supplied lyrics with the detected vocal melody and supports syllable correction, ad-libs, background vocals, and section labels.

### SCORE FORGE

Generates readable notation, lead sheets, chord charts, piano reductions, instrument parts, MIDI, and MusicXML.

### ARRANGER AGENT

Adapts the source composition for piano, guitar, choir, band, string quartet, orchestra, or electronic live performance.

### RIGHTS RECEIPT

Creates an auditable project record containing source-file fingerprint, upload date, creator declaration, generated files, processing version, and export history.

---

## Human Approval Gates

The system must pause for human review before:

- Finalizing ownership declarations
- Publishing or distributing scores
- Claiming transcription accuracy
- Creating commercial arrangements
- Exporting a human-verified package
- Submitting rights, publishing, or copyright documentation

AI transcription will not always be perfect, especially with dense mixes, multiple singers, heavy effects, improvised vocals, spoken word, unusual rhythms, or nonstandard tuning.

A premium **Human Verified** tier should allow a musician, arranger, or transcriber to correct the score before delivery.

---

## Rights and Creator Protection

Before processing a song, users must confirm:

> I own this recording, created it, licensed it, or have permission to process it.

33.3FM SCORE LAB should not claim ownership of uploaded music.

Each project should generate a receipt containing:

- Project identifier
- Upload date
- Source-file fingerprint
- Creator declaration
- Generated file list
- Score version
- Processing tools used
- Human review status

This receipt documents the production trail but does not replace formal copyright registration, legal advice, or publishing administration.

---

## AGENTROPOLIS Placement

### 33.3FM MUSIC DISTRICT

**Domain:** Music creation, broadcast, cultural archives, rights readiness, and creator services  
**Layer role:** District institution  
**Application:** 33.3FM SCORE LAB

### Intelligence Corridor

```text
IDENTITY
  ↓
MANDATE
  ↓
INGEST
  ↓
ANALYZE
  ↓
TRANSCRIBE
  ↓
HUMAN REVIEW
  ↓
EXPORT
  ↓
RECEIPT
```

SCORE LAB receives creator audio through the Ingest Membrane. Specialized music skills transform the source into notation and structured musical data. Mission Control presents results for review. Final exports and receipts are stored in the creator project archive.

---

## MVP Scope

The first release should focus on a lead-sheet generator rather than full orchestral transcription.

### MVP Inputs

- MP3 or WAV upload
- Optional lyric paste
- Optional MIDI upload

### MVP Processing

- Key detection
- Tempo detection
- Time-signature estimate
- Vocal or lead-melody extraction
- Basic chord detection
- Song section detection
- Lyric alignment

### MVP Outputs

- Lead sheet PDF
- Chord chart PDF
- MIDI
- MusicXML
- Analysis summary
- Processing receipt

### MVP Success Standard

The output does not need to be flawless automatically. It must be understandable, editable, traceable, and useful enough for a creator or musician to correct and finish.

---

## Suggested Technical Stack

### Front End

- React or Next.js
- Tailwind CSS
- Web Audio API
- WaveSurfer.js
- OpenSheetMusicDisplay
- Tone.js

### Audio Processing

- Demucs or Ultimate Vocal Remover for stem separation
- Spotify Basic Pitch for audio-to-MIDI
- librosa for tempo and audio analysis
- Essentia for key, rhythm, and feature detection
- Whisper-class transcription for lyric assistance

### Score Generation

- Music21 for musical analysis
- MuseScore CLI for notation rendering
- MusicXML as the primary editable notation format
- MIDI for production software interoperability
- LilyPond as an optional engraving engine

### Storage and Operations

- Supabase or PostgreSQL
- Encrypted object storage
- Isolated processing workers
- Temporary-file expiration
- Project-level permissions
- Versioned exports

---

## Product Tiers

### SIGNAL FREE

- One-minute analysis
- Key and tempo detection
- Basic chord estimate
- Watermarked lead-sheet preview

### CREATOR

- Full-song processing
- Vocal melody
- Lyrics
- Chords
- Lead-sheet PDF
- MIDI
- MusicXML
- Basic score editor

### STUDIO

- Stem separation
- Piano and vocal score
- Instrument parts
- Transposition
- Collaboration
- Version history
- Commercial exports

### HUMAN VERIFIED

- AI transcription
- Musician review
- Manual correction
- Professional engraving
- Performance-ready package

---

## Revenue Model

33.3FM can monetize SCORE LAB through:

- Creator subscriptions
- Per-song processing
- Human-review fees
- Arrangement services
- Archive storage plans
- Marketplace commissions
- Label, church, school, and institution licensing
- White-label creator portals

---

## First Beta Case Study

Use the first song created with the songwriter friend as the inaugural SCORE LAB test.

Deliverables:

1. Original-song intake
2. Vocal and instrumental separation
3. Key and tempo analysis
4. Vocal melody transcription
5. Lyric alignment
6. Chord chart
7. Lead-sheet PDF
8. MIDI
9. MusicXML
10. Before-and-after demonstration video

Case-study statement:

> She brought the words. We brought the song to life. 33.3FM made it playable.

---

## Landing Page Direction

### Hero

# Your song already exists.

## Now make it playable.

Upload an AI-generated song, voice memo, demo, or finished track. 33.3FM SCORE LAB converts it into editable sheet music, chords, MIDI, and performance-ready files.

**Primary CTA:** Upload a Song  
**Secondary CTA:** Hear a Demo

### Supporting Line

**From signal to score. From imagination to instrumentation.**

### Brand Direction

- Obsidian-black interface
- Cyan waveform
- Red recording indicators
- Ivory notation panels
- Analog radio texture
- Liquid-glass controls
- Animated notes emerging from a broadcast signal
- Pirate-radio energy combined with a professional music archive

### Taglines

- Your signal. Written.
- Turn frequency into form.
- From signal to score.
- Music imagined. Music documented.
- Make the machines show their work.
