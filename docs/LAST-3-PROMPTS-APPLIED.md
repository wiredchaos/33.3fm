# Last 3 RED FANG Prompts Applied

Patch branch: `red-fang-v2-last-prompts`

## 1. Terminal Update Prompt

The previous `33.3FM — LIVE AGENT TERMINAL · DJ RED FANG` prompt introduced a Claude-powered artifact launcher with Voice Forge, GTM Distribution, Agent DJ Forge, Signalbeat Memeplay Forge, Track / Release Forge, Agent DJ Instrument Forge, Broadcast Script Forge, Audiobook Forge, and Full Pipeline.

Patch directive: maintain the existing functional architecture, but remove the v1 cyber-neon RED FANG aesthetic from the voice/canon layer.

## 2. RED FANG v2 Brand Bible Prompt

The canonical identity is now RED FANG v2: Patron Saint of Lost Frequencies. The station direction is GenX Analog Rebellion: Monterey Pop 1967, alternative hip-hop, 50 years of grunge, Depeche Mode, John Hughes, Arctic Monkeys, college radio, pirate FM, record-store curation, cassette decks, zines, worn leather, and late-night programming.

Patch directive: this supersedes cyber-noir Afrofuturist Radio Queen, antagonist seductress, yandere Rezona, crimson eye glow, wolf-fang necklace, red silk/chrome/latex, CIPHER HOUR as her show name, and D7 CRIMSON FREQUENCY as her district name.

## 3. RED FANG Ad Portal Prompt

The most recent HTML prompt defines `33.3 FM // RED FANG · Tell Me What You Made`, a no-API intake page for advertising submissions. It collects customer type, pitch, link, press kit/deck, audience, vibe reference, spot duration, channels, email, and optional webhook URL. It writes orders to localStorage under `wc_ad_campaigns` and can POST to an operator webhook.

Patch directive: deploy this analog flyer-style portal as the immediate public-facing route for submissions.

## Canon Decisions

- Root route should land in the RED FANG v2 analog portal.
- Keep the ad-portal Path B model: no exposed model API key in public frontend.
- Use localStorage + operator webhook for submissions until backend intake is wired.
- Keep $XENTS as utility-credit language only.
- Treat Rezona v1 anime prompts as retired or needing total VHS/cassette rewrite.

## Files added in this branch

- `docs/RED-FANG-v2-CANON-LOCK.md`
- `docs/LAST-3-PROMPTS-APPLIED.md`
- `public/33-3fm-ad-portal.html`
- `index.html` redirects to the new portal.
