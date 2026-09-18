# Dodo Payments — Design Engineer Submission

**Project Title:** Dodo Companion — Emotional Payment Feedback Toy  
**Live Demo:** [Deploy Link / http://localhost:5173]  
**Repository:** [Source Code Link]

---

## 1. Concept: Beyond Sterile Checkout Modals

Traditional payment gateways communicate transactional states through mechanical spinners, generic red alert banners, and cold HTTP error codes. When a card declines or a network drops, the user is greeted with clinical hostility: *"Transaction Failed (Code 402)"*.

**Dodo Companion** is an experimental interaction-design toy exploring an alternative question:
> *"What if payment states communicated through organic body language, empathetic expressions, and generative acoustic resonance instead of sterile UI components?"*

Rather than building a standard fintech dashboard, I crafted a living, tactile digital entity that embodies transaction health directly through physical kinetics, posture, gaze, and procedural sound.

---

## 2. The Three Payment Scenarios

### 1. Successful Payment (`200 OK · SETTLED`) — Hotkey `1`
- **Dynamic Body Color:** The creature's body smoothly morphs from obsidian charcoal into a **luxurious deep emerald velvet** (`#132c20` with a radiant jade top highlight `#22553c` and emerald ambient rim glow).
- **Body Language & Kinetics:** The creature leaps upward with celebratory buoyancy (`squashSpring` squash-and-stretch into a buoyant hover). Its posture perks up with triumphant satisfaction.
- **Facial Rig:** Eyes transform into radiant closed crescent arcs, smiling warmly; cheeks flush with glowing peach/amber warmth (`#fb923c`).
- **Environment & Resonance:** The bio-resonance field shifts into a luminous emerald-gold aura (`hsl(156, 36%, 94%)`). Golden harmonic wavefronts expand outward across the topographic contours, and 3 golden prosperity motes drift into the space.
- **Procedural Audio:** A shimmering, ascending 5-note pentatonic bell chime (C5 $\rightarrow$ E5 $\rightarrow$ G5 $\rightarrow$ C6 $\rightarrow$ E6) synthesized in real-time via the Web Audio API with shimmering harmonic overtones.

### 2. Payment Declined / "Oops, something went wrong" (`402 DECLINED`) — Hotkey `2`
- **Dynamic Body Color:** The body shifts into a **warm deep rosewood / velvety espresso-wine** (`#2d181c` with a soft terracotta top highlight `#4a252c` and comforting coral rim glow).
- **Body Language & Kinetics:** Instead of punishing red alarms, the creature displays sheepish, empathetic remorse. It sinks into a lowered slouch and performs a soft, lateral "head-shake" wobble oscillation ($\sin(t \times 18) \times e^{-t}$), as if gently apologizing: *"Oops, card declined… let's fix this together."*
- **Facial Rig:** Concerned, sympathetic eyebrows slant upwards, bashful downcast pupils look downward, and cheeks flush in a tender dusky-rose bloom (`#f43f5e`).
- **Environment & Resonance:** The background transitions into a warm, consoling terracotta-rose atmosphere (`hsl(352, 36%, 95%)`) with gentle, damped inward warning rings.
- **Procedural Audio:** A soft, pillowy "oops" minor-third thud (descending G3 $\rightarrow$ E3 triangle wave through a 450Hz lowpass filter). It feels tactile and comforting rather than alarming.

### 3. Internet / Network Timeout (`504 TIMEOUT`) — Hotkey `3`
- **Dynamic Body Color:** The body shifts into a **deep abyssal oceanic storm-slate** (`#101c28` with an electric cyan-tinged top highlight `#1c344a` and vibrant cyan rim glow).
- **Body Language & Kinetics:** The creature enters an alert, inquisitive "radar search" mode. Its head tilts sideways with curiosity, and high-frequency static tremor/jitter vibrates across its organic body contours ($\sin(t \times 45) \times 1.5\text{px}$).
- **Facial Rig:** Focused, narrowed eyelids; pupils continuously sweep horizontally back-and-forth across the sockets with a glowing cyan tech iris rim. Glowing cyan signal waves pulse above its head.
- **Environment & Resonance:** The atmosphere shifts into deep oceanic storm-slate and electric cyan (`hsl(198, 42%, 93%)`). Concentric cyan sonar wavefronts ping outward across the topographic membrane every 1.3s.
- **Procedural Audio:** A rhythmic, delicate 920Hz carrier sonar blip pinging the ether with a bandpass filter in sync with the visual wavefronts.


### 4. Standby / Gateway Ready (`READY`) — Hotkey `0`
- Returns to the tranquil digital pet state. Users can pet the creature (triggering purrs and cymatic acoustic vibrations), drag and stretch its rubbery silicone body, or drop light motes for it to track and absorb.

---

## 3. Technical Craft & Performance

- **Zero External Assets:** 100% vector SVG and native Web Audio API synthesis. Zero audio files to fetch, zero image downloads, zero CDN latency. Runs completely offline.
- **Decoupled 60/120 FPS Physics Loop:** All spring simulations, gaze vectors, micro-saccades, and body deformations run in an unblocked `requestAnimationFrame` loop using mutable references, completely eliminating React re-render thrashing during pointer movement.
- **Living Topographic Canvas:** A dynamic mathematical membrane rendered on HTML5 Canvas that calculates gravity-well depression, pointer wake displacement, and acoustic cymatics.
- **Multi-Modal Accessibility:** Full support for keyboard controls (`1`, `2`, `3`, `0` for scenarios; `Space`/`Enter` to poke; `S` to smile; `P` to pet; `Arrow` keys for gaze) and `prefers-reduced-motion` compliance.

---

## 4. What I Would Explore Next (Given More Time)

1. **Hardware POS / Terminal Haptics:** Integrating the Web Vibration API so mobile terminals physically vibrate with distinctive haptic signatures (a joyful double-thump for success, a gentle remorseful murmur for declined, and a rhythmic sonar pulse for network search).
2. **WebGPU Fluid Shaders:** Simulating volumetric subsurface scattering and liquid ambient occlusion on the creature's body using custom WGSL shaders.
3. **Multi-Party Checkout Ecosystem:** Spawning merchant and buyer companions that pass the light motes back and forth across screens to represent peer-to-peer split payments.
