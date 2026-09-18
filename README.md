# Dodo Companion

An interactive, emotional companion designed for payment feedback states. Exploring tactile physics, procedural sound, and expressive micro-interactions to turn transactional moments into delightful, living digital experiences.

---

## What is This?

**Dodo Companion** is an interactive design engineering experiment that turns payment feedback into a living digital toy. Instead of relying on static alerts, error modals, or spinning loaders, it uses real-time physics, continuous gaze tracking, organic SVG deformation, and procedural audio synthesis to communicate payment status through intuitive body language and ambient visuals.

---

## Why I Did This

Payment moments carry significant emotional weight: relief and excitement when an order succeeds, frustration when a card is declined, and uncertainty when the network drops. In modern fintech interfaces, these moments are often handled by cold, unhelpful text banners.

I created this project with a guiding motto: **Useful, Inclusive, and Accessible**.

### Design Philosophy:
- **Focused on the Essential Scenarios**: Rather than adding unnecessary complexity, the project focuses deeply on the 3 vital payment cases—**Success (`200 OK`)**, **Declined/Failure (`402 Error`)**, and **Network Connectivity Issues (`408 Timeout`)**, alongside a natural resting standby state.
- **Accessible by Design**:
  - **Full Keyboard Navigation**: Every state, gesture, and gaze direction can be operated without a mouse (keys `1`, `2`, `3`, `0`, `P`, `S`, `Space`, `Arrow Keys`).
  - **Sensory & Motion Considerations**: Respects `prefers-reduced-motion` media queries and provides an instant sound mute toggle (`M` key) so audio never feels intrusive.
  - **Semantic Feedback**: Includes live status indicators with official HTTP status codes for clarity.
- **Playful & Tactile**:
  - Includes an interactive light-mote mini-toy: clicking the canvas drops floating motes that the companion actively tracks with its eyes and absorbs, alongside natural poking, petting, and stretching physics.

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

## What I Would Do With More Time

If given more time to expand this into a production-grade system for Dodo Payments, here are the next directions I would pursue:

1. **Drop-in Checkout SDK / Web Component**  
   Package the companion into a lightweight, zero-dependency npm package (`<DodoCompanion status={paymentStatus} />`) that merchants can drop directly into checkout modals and hosted payment pages.

2. **Real-Time Webhook & WebSocket Integration**  
   Connect live payment gateway events (via Webhooks or Server-Sent Events) so the companion automatically reacts to real-time asynchronous settlement and 3D Secure verification flows.

3. **Mobile Haptic Feedback API**  
   Integrate the Web Vibration API (`navigator.vibrate`) on mobile devices to produce crisp physical haptics that match the procedural sound chimes during success, failure, and petting.

4. **Multi-Touch & Gyroscope Physics**  
   Add two-finger pinch-to-squash gestures and device tilt parallax (via `DeviceOrientationEvent`) so the creature balances naturally when users tilt their phones.

5. **Merchant Brand Customization Presets**  
   Allow merchants to configure brand color tokens, custom voice/chime scales, and accessory variations while keeping the core accessible physics intact.

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
