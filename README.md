# Dodo Companion

An interactive, emotional companion designed for payment feedback states. Exploring tactile physics, procedural sound, and expressive micro-interactions to turn transactional moments into delightful, living digital experiences.

---

## Why I Built This

Payment interactions often carry emotional weight: excitement when completing an order, anxiety when a transaction declines, and confusion during connection drops. In most web applications, these states are relegated to cold spinners, red banners, or generic alert modals.

I built **Dodo Companion** with a clear design motto: **Useful, Inclusive, and Accessible**.

Instead of treating payment states as static text, this project reimagines payment feedback as a living, empathetic companion that reflects system state through organic body language, gaze, color atmosphere, and procedural sound.

### Core Intentions:
- **Focused on the Essential Cases**: Rather than unnecessary complexity, the focus is squarely on the 3 most crucial payment scenarios—**Success (`200`)**, **Declined/Failure (`402`)**, and **Network Connectivity Issues (`408`)**, plus a natural standby state.
- **Accessible & Inclusive by Default**:
  - Full keyboard accessibility: every interaction, gaze direction, and payment state can be triggered entirely from the keyboard.
  - ARIA attributes and high-contrast emotional status indicators displaying real HTTP status codes.
  - Respects `prefers-reduced-motion` media queries for motion sensitivity.
  - Sound can be easily muted or unmuted anytime (`M` key or top utility button) to respect quiet or sensory-sensitive environments.
- **Interactive Toy / Playfulness**:
  - Includes a playful light-mote mechanic: tapping anywhere on the canvas drops floating motes that the companion tracks with its eyes and absorbs, alongside poking, petting, and stretching physics.

---

## Payment Feedback States

- **Payment Success (`200 OK` / Key `1`)**  
  Joyful buoyant bounce, radiant emerald glow, ascending pentatonic bell chimes, and expanding celebratory rings with golden prosperity motes.
- **Payment Failed (`402 Error` / Key `2`)**  
  Apologetic head-shake, velvety warm rosewood tones, sympathetic minor third chords, and soft coral warning ripples.
- **Network Issue (`408 Timeout` / Key `3`)**  
  Inquisitive tilt, abyssal cyan hue, rhythmic sonar radar pings, and searching packet waves.
- **Standby (`Key 0`)**  
  Natural resting breath, autonomous saccades, daydream wandering, and bio-resonant canvas background.

---

## Core Interactions

- **Gaze Tracking**: Eyes follow the pointer or nearest light mote with natural saccadic micro-tremors.
- **Click / Poke**: Single-click creates responsive squash & stretch deformation with soft audio pops.
- **Double Click**: Triggers a warm smile with a pentatonic chime.
- **Petting**: Stroking back and forth triggers blissful purring vibrations and radiating cymatics.
- **Drag & Fling**: Elastic silicone body pulls toward the pointer with momentum impulse upon release.
- **Feed Light Motes**: Clicking anywhere on the background spawns light motes that drift toward the companion for absorption.

---

## Keyboard Shortcuts

| Key | Action |
| --- | --- |
| `1` | Trigger Payment Success (`200 OK`) |
| `2` | Trigger Payment Failed (`402 Error`) |
| `3` | Trigger Network Searching (`408 Timeout`) |
| `0` | Reset to Standby |
| `Space` / `Enter` | Poke companion |
| `P` | Pet companion |
| `S` | Make companion smile |
| `Arrow Keys` | Direct gaze manually |
| `M` | Toggle procedural audio mute |

---

## Tech Stack

- **Framework**: React 18 + Vite
- **Graphics & Motion**: Dynamic SVG paths, 60fps requestAnimationFrame physics loop, Semi-implicit Euler spring simulation, HTML5 2D Canvas
- **Sound**: Web Audio API (100% procedural synthesizers; zero external audio files)
- **Icons**: Lucide React
- **Typography**: Fraunces & Plus Jakarta Sans

---

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
```
