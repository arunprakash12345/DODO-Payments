# Dodo Companion

An interactive, emotional companion designed for payment feedback states. Exploring tactile physics, procedural sound, and expressive micro-interactions to turn transactional moments into delightful, living digital experiences.

---

## Overview

Dodo Companion translates financial transactions and connectivity states into empathetic physical behaviors:

- **Payment Success (`200 OK` / Key `1`)**  
  Joyful buoyant bounce, radiant emerald glow, ascending pentatonic bell chimes, and expanding celebratory rings with golden motes.
- **Payment Failed (`402 Error` / Key `2`)**  
  Apologetic head-shake, velvety warm rosewood tones, sympathetic minor third chords, and soft coral warning ripples.
- **Network Issue (`408 Timeout` / Key `3`)**  
  Inquisitive tilt, abyssal cyan hue, rhythmic sonar radar pings, and searching packet waves.
- **Standby (`Key 0`)**  
  Natural resting breath, autonomous saccades, daydream wandering, and bio-resonant canvas background.

---

## Core Interactions

- **Gaze Tracking**: Eyes follow the pointer across the screen with natural saccadic micro-tremors.
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
