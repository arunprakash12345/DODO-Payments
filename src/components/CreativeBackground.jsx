import React, { useEffect, useRef } from 'react';
import { lerp, clamp } from '../utils/animation';
import { playMoteSpawnSound, playMoteAbsorbSound } from '../utils/audio';

/**
 * Creative Interactive Background — Spatial Bio-Resonance & Topographic Living Membrane
 * Features:
 * 1. Interactive Light Mote Toy: Click anywhere to drop a light mote; companion tracks and absorbs it.
 * 2. Elastic Topographic Gravity Well: Living contour isolines that depress under creature weight and shear during drag.
 * 3. Acoustic Purr Cymatics: Waveforms radiating across the membrane during petting.
 * 4. Ambient studio lighting and museum-grade tactile paper texture.
 */
export function CreativeBackground({
  theme,
  emotionRef,
  scenario = 'none', // 'none' | 'success' | 'failure' | 'network'
  rippleTrigger = 0,
  onMoteAbsorbed = null
}) {
  const canvasRef = useRef(null);

  const stateRef = useRef({
    pointerX: 0,
    pointerY: 0,
    smoothX: 0,
    smoothY: 0,
    time: 0,
    // Emotional interpolation values
    curH: 42,
    curS: 18,
    curL: 96,
    targetH: 42,
    targetS: 18,
    targetL: 96,
    orbHue: 44,
    orbAlpha: 0.45,
    orbScale: 1,
    // Interactive Light Motes (Fireflies / Food)
    motes: [],
    // Sparkle bursts on absorption
    sparks: [],
    // Floor ripples
    ripples: [],
    // Purr harmonic wave timer
    lastPurrWave: 0,
    purrWaves: [],
    // Payment Scenario waves (Sonar / Celebratory rings)
    lastScenarioWave: 0,
    scenarioWaves: []
  });

  // Handle click on canvas background to spawn a Light Mote
  const handleCanvasClick = (e) => {
    // Only spawn if click didn't originate on the creature itself
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const distToCenter = Math.sqrt((clickX - centerX) ** 2 + (clickY - centerY) ** 2);

    // If clicked outside creature core radius (> 90px), spawn a light mote!
    if (distToCenter > 90) {
      playMoteSpawnSound();

      // Max 6 motes at a time
      if (stateRef.current.motes.length >= 6) {
        stateRef.current.motes.shift();
      }

      stateRef.current.motes.push({
        id: Math.random(),
        x: clickX,
        y: clickY,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: 5.2,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.04 + Math.random() * 0.03,
        hue: 45 + Math.random() * 15,
        life: 0
      });

      // Spawn subtle water droplet ripple
      stateRef.current.ripples.push({
        x: clickX,
        y: clickY,
        radius: 8,
        maxRadius: 160,
        alpha: 0.35,
        speed: 2.4,
        color: 'rgba(251, 191, 36, '
      });
    }
  };

  // Track pointer for studio light follow
  useEffect(() => {
    const handlePointer = (e) => {
      stateRef.current.pointerX = e.clientX;
      stateRef.current.pointerY = e.clientY;
    };
    window.addEventListener('pointermove', handlePointer, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointer);
  }, []);

  // Spawn interaction ripples on poke / gesture
  useEffect(() => {
    if (rippleTrigger > 0 && canvasRef.current) {
      const { width, height } = canvasRef.current;
      const emo = emotionRef?.current?.state || 'calm';

      let rippleColor = 'rgba(224, 122, 95, ';
      if (emo === 'bliss') rippleColor = 'rgba(244, 114, 182, ';
      else if (emo === 'joy') rippleColor = 'rgba(251, 146, 60, ';
      else if (emo === 'curious') rippleColor = 'rgba(163, 230, 53, ';
      else if (emo === 'daydream') rippleColor = 'rgba(147, 197, 253, ';
      else if (emo === 'payment_success') rippleColor = 'rgba(16, 185, 129, ';
      else if (emo === 'payment_failed') rippleColor = 'rgba(244, 63, 94, ';
      else if (emo === 'network_issue') rippleColor = 'rgba(6, 182, 212, ';

      stateRef.current.ripples.push({
        x: width / 2,
        y: height / 2 + 50,
        radius: 18,
        maxRadius: 260,
        alpha: 0.4,
        speed: 2.8,
        color: rippleColor
      });
    }
  }, [rippleTrigger, emotionRef]);

  // Handle Payment Scenario Shifts (Waves & Golden Mote Bursts)
  useEffect(() => {
    const s = stateRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const centerX = width / 2;
    const centerY = height / 2;

    if (scenario === 'success') {
      // Celebratory expanding rings
      s.scenarioWaves.push({
        type: 'success',
        x: centerX,
        y: centerY + 20,
        radius: 15,
        maxRadius: 380,
        alpha: 0.7,
        speed: 3.2,
        color: 'rgba(16, 185, 129, '
      });
      s.scenarioWaves.push({
        type: 'success',
        x: centerX,
        y: centerY + 20,
        radius: 8,
        maxRadius: 320,
        alpha: 0.65,
        speed: 2.4,
        color: 'rgba(245, 158, 11, '
      });

      // Spawn 3 golden prosperity motes
      for (let i = 0; i < 3; i++) {
        const ang = (Math.PI * 2 * i) / 3 + 0.3;
        s.motes.push({
          id: Math.random(),
          x: centerX + Math.cos(ang) * 135,
          y: centerY + Math.sin(ang) * 115,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: 5.4,
          phase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.05,
          hue: 44 + Math.random() * 12,
          life: 0
        });
      }
    } else if (scenario === 'failure') {
      // Gentle warning soft coral ripples
      s.scenarioWaves.push({
        type: 'failure',
        x: centerX,
        y: centerY + 30,
        radius: 15,
        maxRadius: 260,
        alpha: 0.55,
        speed: 2.0,
        color: 'rgba(244, 63, 94, '
      });
    } else if (scenario === 'network') {
      // Clear extra motes and send initial sonar pulse
      s.motes = [];
      s.scenarioWaves.push({
        type: 'sonar',
        x: centerX,
        y: centerY,
        radius: 20,
        maxRadius: Math.max(width, height) * 0.65,
        alpha: 0.65,
        speed: 3.8,
        color: 'rgba(6, 182, 212, '
      });
    }
  }, [scenario]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const s = stateRef.current;

    const loop = () => {
      s.time += 0.012;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const centerX = width / 2;
      const centerY = height / 2;

      // Read real-time emotion state
      const emo = emotionRef?.current || {
        state: 'calm',
        bliss: 0,
        smile: 0,
        curious: 0,
        alertness: 0,
        isIdle: false,
        dragTension: 0,
        dragVector: { x: 0, y: 0 }
      };

      // 1. Emotional Color Targets (Responsive to Payment Scenarios & Bio-resonance)
      if (emo.state === 'payment_success' || scenario === 'success') {
        s.targetH = 156; s.targetS = 36; s.targetL = 94;
        s.orbHue = 152; s.orbAlpha = 0.72; s.orbScale = 1.48;
      } else if (emo.state === 'payment_failed' || scenario === 'failure') {
        s.targetH = 352; s.targetS = 36; s.targetL = 95;
        s.orbHue = 350; s.orbAlpha = 0.65; s.orbScale = 1.25;
      } else if (emo.state === 'network_issue' || scenario === 'network') {
        s.targetH = 198; s.targetS = 42; s.targetL = 93;
        s.orbHue = 192; s.orbAlpha = 0.74; s.orbScale = 1.38;
      } else if (emo.state === 'bliss') {
        s.targetH = 12; s.targetS = 36; s.targetL = 96;
        s.orbHue = 8; s.orbAlpha = 0.65; s.orbScale = 1.35;
      } else if (emo.state === 'joy') {
        s.targetH = 36; s.targetS = 44; s.targetL = 95;
        s.orbHue = 38; s.orbAlpha = 0.62; s.orbScale = 1.4;
      } else if (emo.state === 'curious') {
        s.targetH = 75; s.targetS = 28; s.targetL = 96;
        s.orbHue = 68; s.orbAlpha = 0.52; s.orbScale = 1.15;
      } else if (emo.state === 'daydream') {
        s.targetH = 224; s.targetS = 20; s.targetL = 96;
        s.orbHue = 230; s.orbAlpha = 0.42; s.orbScale = 1.05;
      } else if (emo.state === 'tension') {
        s.targetH = 22; s.targetS = 38; s.targetL = 94;
        s.orbHue = 18; s.orbAlpha = 0.58; s.orbScale = 1.2 + emo.dragTension * 0.3;
      } else {
        s.targetH = 42; s.targetS = 18; s.targetL = 96;
        s.orbHue = 42; s.orbAlpha = 0.45; s.orbScale = 1.0;
      }


      s.curH = lerp(s.curH, s.targetH, 0.04);
      s.curS = lerp(s.curS, s.targetS, 0.04);
      s.curL = lerp(s.curL, s.targetL, 0.04);

      s.smoothX += (s.pointerX - s.smoothX) * 0.045;
      s.smoothY += (s.pointerY - s.smoothY) * 0.045;

      ctx.clearRect(0, 0, width, height);

      // 2. Base Bio-Resonant Field Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, `hsl(${s.curH}, ${s.curS}%, ${Math.min(99, s.curL + 2)}%)`);
      bgGrad.addColorStop(1, `hsl(${s.curH}, ${s.curS + 6}%, ${Math.max(90, s.curL - 3)}%)`);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 3. Elastic Topographic Gravity Well Isolines
      const dragVx = emo.dragVector?.x || 0;
      const dragVy = emo.dragVector?.y || 0;
      const creatureX = centerX + dragVx * 0.4;
      const creatureY = centerY + dragVy * 0.4;

      const numContours = 9;
      ctx.save();
      for (let i = 1; i <= numContours; i++) {
        const baseR = i * 28;
        const breathDistort = Math.sin(s.time * 1.6 + i * 0.5) * (3 + i * 0.6);
        const purrCymatic = emo.state === 'bliss' ? Math.sin(s.time * 8 + i * 0.8) * 3.5 : 0;

        // Pointer wake displacement
        const dxP = s.smoothX - creatureX;
        const dyP = s.smoothY - creatureY;
        const distP = Math.sqrt(dxP * dxP + dyP * dyP);
        const wakeFalloff = clamp(1 - Math.abs(distP - baseR) / 90, 0, 1) * 6;

        const rx = (baseR + breathDistort + wakeFalloff) * (1 + Math.abs(dragVx) * 0.003);
        const ry = ((baseR + breathDistort + wakeFalloff) * 0.48 + purrCymatic) * (1 + Math.abs(dragVy) * 0.003);

        const isoAlpha = (0.055 + (1 - i / numContours) * 0.075) * (emo.state === 'daydream' ? 0.4 : 1);
        ctx.beginPath();
        ctx.ellipse(creatureX, creatureY + 45, Math.max(10, rx), Math.max(4, ry), dragVx * 0.002, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${s.orbHue}, 50%, 35%, ${isoAlpha})`;
        ctx.lineWidth = 1;
        ctx.setLineDash(i % 2 === 0 ? [3, 4] : []);
        ctx.stroke();
      }
      ctx.restore();

      // 4. Studio Light Orb with Anisotropic Tension Stretch
      const auraX = creatureX + (s.smoothX - centerX) * 0.07;
      const auraY = creatureY + (s.smoothY - centerY) * 0.07;
      const baseRadius = Math.max(260, Math.min(width, height) * 0.44) * s.orbScale;

      ctx.save();
      if (emo.state === 'tension') {
        const stretchAngle = Math.atan2(-dragVy, -dragVx);
        ctx.translate(auraX, auraY);
        ctx.rotate(stretchAngle);
        ctx.scale(1 + emo.dragTension * 0.45, 1 - emo.dragTension * 0.25);
        ctx.translate(-auraX, -auraY);
      }

      const auraGrad = ctx.createRadialGradient(auraX, auraY, 0, auraX, auraY, baseRadius);
      auraGrad.addColorStop(0, `hsla(${s.orbHue}, 85%, 70%, ${s.orbAlpha})`);
      auraGrad.addColorStop(0.5, `hsla(${s.orbHue + 15}, 70%, 75%, ${s.orbAlpha * 0.4})`);
      auraGrad.addColorStop(1, `hsla(${s.orbHue + 25}, 60%, 80%, 0)`);

      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(auraX, auraY, baseRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 5. Purr Waves in Bliss Mode
      if (emo.state === 'bliss') {
        const now = Date.now();
        if (now - s.lastPurrWave > 450) {
          s.purrWaves.push({ radius: 35, maxRadius: 300, alpha: 0.38, speed: 1.8 });
          s.lastPurrWave = now;
        }
      }

      for (let i = s.purrWaves.length - 1; i >= 0; i--) {
        const pw = s.purrWaves[i];
        pw.radius += pw.speed;
        pw.alpha = (1 - pw.radius / pw.maxRadius) * 0.26;

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(creatureX, creatureY + 20, pw.radius, pw.radius * 0.42, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(244, 114, 182, ${pw.alpha})`;
        ctx.lineWidth = 1.4;
        ctx.stroke();
        ctx.restore();

        if (pw.radius >= pw.maxRadius) s.purrWaves.splice(i, 1);
      }

      // 6. Interactive Light Motes Simulation (Drift, Attraction, and Absorption)
      let closestMote = null;
      let closestDist = Infinity;

      for (let i = s.motes.length - 1; i >= 0; i--) {
        const m = s.motes[i];
        m.life += 1;
        m.phase += m.pulseSpeed;

        // Gravitational attraction toward creature center
        const dx = creatureX - m.x;
        const dy = creatureY - m.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < closestDist) {
          closestDist = dist;
          closestMote = { x: m.x, y: m.y, dist };
        }

        // Soft drift towards companion
        const attractForce = clamp(0.35 / (dist + 50), 0.0005, 0.008);
        m.vx += dx * attractForce + Math.sin(m.phase) * 0.18;
        m.vy += dy * attractForce + Math.cos(m.phase) * 0.18;

        m.vx *= 0.96;
        m.vy *= 0.96;

        m.x += m.vx;
        m.y += m.vy;

        // Draw Light Mote
        const pulse = 1 + Math.sin(m.phase) * 0.25;
        const moteAlpha = Math.min(1, m.life / 30);

        // Halo
        const moteGlow = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, 22 * pulse);
        moteGlow.addColorStop(0, `hsla(${m.hue}, 95%, 65%, ${0.6 * moteAlpha})`);
        moteGlow.addColorStop(0.5, `hsla(${m.hue}, 90%, 75%, ${0.2 * moteAlpha})`);
        moteGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = moteGlow;
        ctx.beginPath();
        ctx.arc(m.x, m.y, 22 * pulse, 0, Math.PI * 2);
        ctx.fill();

        // Core Spark
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius * pulse * 0.5, 0, Math.PI * 2);
        ctx.fill();

        // Check if absorbed by creature! (Within creature collision boundary ~68px)
        if (dist < 68) {
          playMoteAbsorbSound();

          // Spawn celebratory sparks
          for (let k = 0; k < 14; k++) {
            const angle = (Math.PI * 2 * k) / 14 + (Math.random() - 0.5) * 0.4;
            const spd = 1.2 + Math.random() * 2.5;
            s.sparks.push({
              x: m.x,
              y: m.y,
              vx: Math.cos(angle) * spd,
              vy: Math.sin(angle) * spd,
              life: 0,
              maxLife: 40 + Math.random() * 25,
              color: `hsl(${m.hue + Math.random() * 20}, 95%, 65%)`
            });
          }

          // Trigger ripple from mouth
          s.ripples.push({
            x: creatureX,
            y: creatureY,
            radius: 12,
            maxRadius: 220,
            alpha: 0.5,
            speed: 3.2,
            color: 'rgba(251, 191, 36, '
          });

          // Notify parent of absorption
          if (onMoteAbsorbed) onMoteAbsorbed();

          s.motes.splice(i, 1);
        }
      }

      // Stream closest mote to companion's gaze
      if (emotionRef?.current) {
        emotionRef.current.nearestMote = closestMote;
      }

      // 7. Render Absorption Sparks
      for (let i = s.sparks.length - 1; i >= 0; i--) {
        const sp = s.sparks[i];
        sp.life++;
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vx *= 0.96;
        sp.vy *= 0.96;
        const spAlpha = 1 - sp.life / sp.maxLife;

        ctx.beginPath();
        ctx.arc(sp.x, sp.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = sp.color.replace(')', `, ${spAlpha})`).replace('hsl', 'hsla');
        ctx.fill();

        if (sp.life >= sp.maxLife) s.sparks.splice(i, 1);
      }

      // 8. Periodic Payment Scenario Waves (Sonar Radar Pulse / Celebratory Rings)
      const nowTime = Date.now();
      if (scenario === 'network' && nowTime - s.lastScenarioWave > 1300) {
        s.scenarioWaves.push({
          type: 'sonar',
          x: creatureX,
          y: creatureY,
          radius: 20,
          maxRadius: Math.max(width, height) * 0.72,
          alpha: 0.65,
          speed: 4.2,
          color: 'rgba(6, 182, 212, '
        });
        s.lastScenarioWave = nowTime;
      } else if (scenario === 'success' && nowTime - s.lastScenarioWave > 950) {
        s.scenarioWaves.push({
          type: 'success',
          x: creatureX,
          y: creatureY + 20,
          radius: 20,
          maxRadius: 380,
          alpha: 0.55,
          speed: 2.8,
          color: Math.random() > 0.5 ? 'rgba(245, 158, 11, ' : 'rgba(16, 185, 129, '
        });
        s.lastScenarioWave = nowTime;
      }

      // 9. Render Payment Scenario Waves
      for (let i = s.scenarioWaves.length - 1; i >= 0; i--) {
        const sw = s.scenarioWaves[i];
        sw.radius += sw.speed;
        const currentAlpha = (1 - sw.radius / sw.maxRadius) * sw.alpha;

        ctx.save();
        ctx.beginPath();
        if (sw.type === 'sonar') {
          ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
          ctx.setLineDash([4, 6]);
          ctx.lineWidth = 1.6;
        } else {
          ctx.ellipse(sw.x, sw.y, sw.radius, sw.radius * 0.46, 0, 0, Math.PI * 2);
          ctx.lineWidth = 1.8;
        }
        ctx.strokeStyle = `${sw.color}${currentAlpha})`;
        ctx.stroke();
        ctx.restore();

        if (sw.radius >= sw.maxRadius) s.scenarioWaves.splice(i, 1);
      }

      // 10. Render Floor Ripples
      for (let i = s.ripples.length - 1; i >= 0; i--) {
        const r = s.ripples[i];
        r.radius += r.speed;
        const currentAlpha = (1 - r.radius / r.maxRadius) * r.alpha;

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(r.x, r.y, r.radius, r.radius * 0.35, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `${r.color}${currentAlpha})`;
        ctx.lineWidth = 1.3;
        ctx.stroke();
        ctx.restore();

        if (r.radius >= r.maxRadius) s.ripples.splice(i, 1);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [theme, emotionRef, scenario, onMoteAbsorbed]);

  return (
    <div
      className="creative-background-container"
      onClick={handleCanvasClick}
      title="Click anywhere to drop a light mote for the companion"
      aria-label="Interactive background canvas. Click anywhere to drop a light mote."
    >
      {/* Dynamic Bio-Resonance Light & Fluid Canvas */}
      <canvas ref={canvasRef} className="bg-canvas" />

      {/* Studio Depth Vignette */}
      <div className="studio-vignette" />

      {/* Meta Design System Editorial Marks (Dodo Payments Context) */}
      <div className="studio-marks">
        <span className="mark-cross mark-tl">+</span>
        <span className="mark-cross mark-tr">+</span>
        <span className="mark-cross mark-bl">+</span>
        <span className="mark-cross mark-br">+</span>
        <span className="mark-meta mark-meta-left">DODO PAYMENTS · EMOTIONAL INTERACTION ENGINE</span>
        <span className="mark-meta mark-meta-right">LIVING RESILIENCE MEMBRANE · TAP TO FEED</span>
      </div>

      {/* Museum Paper Grain */}
      <div className="paper-grain" />
    </div>
  );
}

