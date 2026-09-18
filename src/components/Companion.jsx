import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CompanionFace } from './CompanionFace';
import { usePointerTracking } from '../hooks/usePointerTracking';
import { useIdleState } from '../hooks/useIdleState';
import { Spring, MicroSaccade, generateOrganicBodyPath, lerp, clamp } from '../utils/animation';
import {
  playPokeSound,
  playSmileChime,
  startPurr,
  stopPurr,
  playPaymentSuccessSound,
  playPaymentFailedSound,
  startNetworkSearchingSound,
  stopNetworkSearchingSound
} from '../utils/audio';

const DEFAULT_BODY_PATH = generateOrganicBodyPath(0, 0, 76, 82, {});

export function Companion({
  isReducedMotion = false,
  theme = {},
  emotionRef = null,
  scenario = 'none',
  absorbedTrigger = 0,
  onEmotionChange = null,
  onInteract = null
}) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const scenarioRef = useRef(scenario);
  scenarioRef.current = scenario;

  const { pointerRef, updatePointerRelative } = usePointerTracking(containerRef);
  const { idleStateRef, wakeUp, updateIdleState } = useIdleState(pointerRef);

  const saccadeGenRef = useRef(new MicroSaccade());

  const pettingRef = useRef({
    lastX: 0,
    lastDirection: 0,
    reversals: 0,
    strokeDistance: 0,
    lastStrokeTime: 0,
    isPetting: false,
    pettingLevel: 0
  });

  const animRef = useRef({
    baseRx: 76,
    baseRy: 82,
    dragSpringX: new Spring(0, 190, 13),
    dragSpringY: new Spring(0, 190, 13),
    squashSpring: new Spring(0, 240, 12),
    leanSpringX: new Spring(0, 120, 16),
    leanSpringY: new Spring(0, 120, 16),
    eyeSpringX: new Spring(0, 170, 16),
    eyeSpringY: new Spring(0, 170, 16),
    smileFactor: 0,
    targetSmile: 0,
    curiousFactor: 0,
    targetCurious: 0,
    blissFactor: 0,
    targetBliss: 0,
    wobbleIntensity: 0,
    dragLastX: 0,
    dragLastY: 0,
    dragLastTime: 0,
    dragVx: 0,
    dragVy: 0,
    breathPhase: 0,
    smileTimeout: null,
    curiousTimeout: null,
    lastClickTime: 0
  });

  const [renderState, setRenderState] = useState({
    bodyPath: DEFAULT_BODY_PATH,
    faceOffset: { x: 0, y: 0 },
    eyeGaze: { x: 0, y: 0 },
    saccade: { x: 0, y: 0 },
    blinkProgress: 0,
    smileFactor: 0,
    curiousFactor: 0,
    blissFactor: 0,
    alertness: 0,
    shadowScale: 1,
    shadowOffsetX: 0
  });

  useEffect(() => {
    wakeUp();
    const a = animRef.current;
    if (scenario === 'success') {
      playPaymentSuccessSound();
      a.squashSpring.snap(0.35);
      a.dragSpringY.snap(-36);
      a.dragSpringY.setTarget(-14);
      a.targetSmile = 1;
      a.targetCurious = 0;
      a.targetBliss = 0;
      a.wobbleIntensity = 0;
      stopNetworkSearchingSound();
    } else if (scenario === 'failure') {
      playPaymentFailedSound();
      a.dragSpringY.setTarget(16);
      a.squashSpring.snap(-0.16);
      a.targetSmile = 0;
      a.targetCurious = 0;
      a.targetBliss = 0;
      a.wobbleIntensity = 1;
      stopNetworkSearchingSound();
    } else if (scenario === 'network') {
      startNetworkSearchingSound();
      a.leanSpringX.setTarget(10);
      a.dragSpringY.setTarget(0);
      a.targetSmile = 0;
      a.targetCurious = 1;
      a.wobbleIntensity = 0;
    } else {
      stopNetworkSearchingSound();
      a.dragSpringY.setTarget(0);
      a.dragSpringX.setTarget(0);
      a.leanSpringX.setTarget(0);
      a.leanSpringY.setTarget(0);
      a.targetSmile = 0;
      a.targetCurious = 0;
      a.targetBliss = 0;
      a.wobbleIntensity = 0;
    }
  }, [scenario, wakeUp]);

  const triggerCurious = useCallback(() => {
    wakeUp();
    playPokeSound(1.0 + (Math.random() - 0.5) * 0.2);
    const a = animRef.current;
    a.squashSpring.snap(-0.16);
    a.squashSpring.setTarget(0);

    a.targetCurious = 1;
    if (a.curiousTimeout) clearTimeout(a.curiousTimeout);
    a.curiousTimeout = setTimeout(() => {
      a.targetCurious = 0;
    }, 450);

    if (onInteract) onInteract('poke');
  }, [wakeUp, onInteract]);

  const triggerSmile = useCallback(() => {
    wakeUp();
    playSmileChime();
    const a = animRef.current;
    a.squashSpring.snap(0.12);
    a.squashSpring.setTarget(0);

    a.targetSmile = 1;
    a.targetCurious = 0;
    if (a.smileTimeout) clearTimeout(a.smileTimeout);
    a.smileTimeout = setTimeout(() => {
      a.targetSmile = 0;
    }, 1250);

    if (onInteract) onInteract('smile');
  }, [wakeUp, onInteract]);

  const handlePointerDown = (e) => {
    e.preventDefault();
    wakeUp();
    const ptr = pointerRef.current;
    ptr.isDragging = true;
    ptr.dragStartX = e.clientX;
    ptr.dragStartY = e.clientY;
    ptr.dragOffsetX = 0;
    ptr.dragOffsetY = 0;

    const a = animRef.current;
    a.dragLastX = e.clientX;
    a.dragLastY = e.clientY;
    a.dragLastTime = performance.now();
    a.dragVx = 0;
    a.dragVy = 0;

    if (containerRef.current && containerRef.current.setPointerCapture) {
      try {
        containerRef.current.setPointerCapture(e.pointerId);
      } catch (_) {}
    }

    const now = Date.now();
    const diff = now - a.lastClickTime;
    a.lastClickTime = now;

    if (diff < 320) {
      triggerSmile();
    } else {
      triggerCurious();
    }
  };

  const handlePointerMove = (e) => {
    const ptr = pointerRef.current;
    const now = performance.now();

    if (ptr.isDragging) {
      const a = animRef.current;
      const dt = Math.max(1, now - a.dragLastTime) / 1000;
      a.dragVx = (e.clientX - a.dragLastX) / dt;
      a.dragVy = (e.clientY - a.dragLastY) / dt;
      a.dragLastX = e.clientX;
      a.dragLastY = e.clientY;
      a.dragLastTime = now;
      return;
    }

    if (ptr.distance < 110) {
      const pet = pettingRef.current;
      const dx = e.clientX - pet.lastX;
      const dir = dx > 0 ? 1 : dx < 0 ? -1 : 0;

      if (dir !== 0 && dir !== pet.lastDirection && Math.abs(dx) > 4) {
        pet.reversals++;
        pet.lastDirection = dir;
        pet.lastStrokeTime = Date.now();

        if (pet.reversals >= 3) {
          pet.isPetting = true;
          animRef.current.targetBliss = 1;
          startPurr();
          if (onInteract) onInteract('pet');
        }
      }

      pet.lastX = e.clientX;
      pet.strokeDistance += Math.abs(dx);
    }
  };

  const handlePointerUp = () => {
    const ptr = pointerRef.current;
    const a = animRef.current;

    if (ptr.isDragging) {
      ptr.isDragging = false;
      ptr.dragOffsetX = 0;
      ptr.dragOffsetY = 0;

      const flingImpulseX = clamp(a.dragVx * 0.04, -35, 35);
      const flingImpulseY = clamp(a.dragVy * 0.04, -35, 35);
      a.dragSpringX.impulse(flingImpulseX);
      a.dragSpringY.impulse(flingImpulseY);
      a.dragSpringX.setTarget(0);
      a.dragSpringY.setTarget(0);

      const speed = Math.sqrt(a.dragVx * a.dragVx + a.dragVy * a.dragVy);
      if (speed > 400) {
        a.squashSpring.snap(0.14);
        a.squashSpring.setTarget(0);
        playPokeSound(1.2);
      }
    }
  };

  const handlePointerCancel = () => {
    const ptr = pointerRef.current;
    ptr.isDragging = false;
    animRef.current.dragSpringX.setTarget(0);
    animRef.current.dragSpringY.setTarget(0);
  };

  const handleKeyDown = (e) => {
    wakeUp();
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      const now = Date.now();
      if (now - animRef.current.lastClickTime < 350) {
        triggerSmile();
      } else {
        triggerCurious();
      }
      animRef.current.lastClickTime = now;
    } else if (e.key === 's' || e.key === 'S') {
      triggerSmile();
    } else if (e.key === 'p' || e.key === 'P') {
      animRef.current.targetBliss = 1;
      startPurr();
      setTimeout(() => {
        animRef.current.targetBliss = 0;
        stopPurr();
      }, 1500);
    } else if (e.key === 'ArrowLeft') {
      animRef.current.eyeSpringX.setTarget(-5);
    } else if (e.key === 'ArrowRight') {
      animRef.current.eyeSpringX.setTarget(5);
    } else if (e.key === 'ArrowUp') {
      animRef.current.eyeSpringY.setTarget(-5);
    } else if (e.key === 'ArrowDown') {
      animRef.current.eyeSpringY.setTarget(5);
    }
  };

  useEffect(() => {
    if (absorbedTrigger > 0) {
      wakeUp();
      const a = animRef.current;
      a.squashSpring.snap(0.18);
      a.squashSpring.setTarget(0);
      a.targetSmile = 1;
      a.targetCurious = 0;
      if (a.smileTimeout) clearTimeout(a.smileTimeout);
      a.smileTimeout = setTimeout(() => {
        a.targetSmile = 0;
      }, 1400);
      if (onInteract) onInteract('mote_eaten');
    }
  }, [absorbedTrigger, wakeUp, onInteract]);

  useEffect(() => {
    let animationFrameId;
    let lastTime = performance.now();

    const loop = (currentTime) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const a = animRef.current;
      const ptr = pointerRef.current;
      const idle = updateIdleState(currentTime);
      const saccade = saccadeGenRef.current.update(currentTime);

      const pet = pettingRef.current;
      if (pet.isPetting && Date.now() - pet.lastStrokeTime > 650) {
        pet.isPetting = false;
        pet.reversals = 0;
        a.targetBliss = 0;
        stopPurr();
      }

      const breathSpeed = isReducedMotion ? 0.8 : (1.4 + ptr.proximity * 0.8 + a.targetBliss * 0.5);
      a.breathPhase += dt * breathSpeed;
      const breathScaleY = Math.sin(a.breathPhase) * (0.024 + a.targetBliss * 0.02);
      const breathScaleX = -breathScaleY * 0.5;

      const currentSquash = a.squashSpring.update(dt);
      const totalScaleX = 1 + breathScaleX + (isReducedMotion ? 0 : currentSquash * -0.7);
      const totalScaleY = 1 + breathScaleY + (isReducedMotion ? 0 : currentSquash);

      if (ptr.isDragging) {
        const dragLimit = 75;
        const targetDx = clamp(ptr.dragOffsetX * 0.48, -dragLimit, dragLimit);
        const targetDy = clamp(ptr.dragOffsetY * 0.48, -dragLimit, dragLimit);
        a.dragSpringX.setTarget(targetDx);
        a.dragSpringY.setTarget(targetDy);
      }
      let curDragX = isReducedMotion ? 0 : a.dragSpringX.update(dt);
      let curDragY = isReducedMotion ? 0 : a.dragSpringY.update(dt);

      let targetLeanX = 0;
      let targetLeanY = 0;
      if (!idle.isIdle && ptr.proximity > 0.05 && !pet.isPetting) {
        targetLeanX = clamp(ptr.targetRelX * 0.045, -14, 14);
        targetLeanY = clamp(ptr.targetRelY * 0.035, -9, 9);
      }
      a.leanSpringX.setTarget(targetLeanX);
      a.leanSpringY.setTarget(targetLeanY);
      let curLeanX = a.leanSpringX.update(dt);
      let curLeanY = a.leanSpringY.update(dt);

      const activeScenario = scenarioRef.current;
      if (activeScenario === 'success') {
        const buoyant = Math.sin(currentTime * 0.006) * 5;
        curDragY += buoyant;
      } else if (activeScenario === 'failure') {
        if (a.wobbleIntensity > 0.005) {
          a.wobbleIntensity *= 0.988;
        }
        const headShake = Math.sin(currentTime * 0.018) * 13 * a.wobbleIntensity;
        curLeanX += headShake;
        curDragY += 12;
      } else if (activeScenario === 'network') {
        const tremorX = (Math.sin(currentTime * 0.05) + Math.cos(currentTime * 0.08)) * 1.5;
        const tremorY = Math.sin(currentTime * 0.06) * 1.2;
        curDragX += tremorX;
        curDragY += tremorY;
        curLeanX += 8;
      }

      let targetEyeX = 0;
      let targetEyeY = 0;
      const nearestMote = emotionRef?.current?.nearestMote;

      if (activeScenario === 'network') {
        targetEyeX = Math.sin(currentTime * 0.0036) * 4.8;
        targetEyeY = 0;
      } else if (nearestMote && nearestMote.dist < 550 && !ptr.isDragging) {
        const dxM = nearestMote.x - (window.innerWidth / 2);
        const dyM = nearestMote.y - (window.innerHeight / 2);
        const angle = Math.atan2(dyM, dxM);
        const eyeDist = clamp(nearestMote.dist * 0.038, 0, 5.4);
        targetEyeX = Math.cos(angle) * eyeDist;
        targetEyeY = Math.sin(angle) * eyeDist;
      } else if (idle.isIdle) {
        targetEyeX = clamp(idle.wanderGazeX * 0.08, -5.2, 5.2);
        targetEyeY = clamp(idle.wanderGazeY * 0.08, -4.8, 4.8);
      } else {
        const angle = Math.atan2(ptr.targetRelY, ptr.targetRelX);
        const eyeDist = clamp(ptr.distance * 0.03, 0, 5.4);
        targetEyeX = Math.cos(angle) * eyeDist;
        targetEyeY = Math.sin(angle) * eyeDist;
      }

      a.eyeSpringX.setTarget(targetEyeX);
      a.eyeSpringY.setTarget(targetEyeY);
      const curEyeX = a.eyeSpringX.update(dt);
      const curEyeY = a.eyeSpringY.update(dt);

      a.smileFactor += (a.targetSmile - a.smileFactor) * 0.12;
      a.curiousFactor += (a.targetCurious - a.curiousFactor) * 0.14;
      a.blissFactor += (a.targetBliss - a.blissFactor) * 0.12;

      const rx = a.baseRx * totalScaleX;
      const ry = a.baseRy * totalScaleY;
      const bodyDeform = {
        topX: curDragX * 0.85 + curLeanX,
        topY: curDragY * 0.85 + curLeanY,
        rightX: curDragX * 0.45 + curLeanX * 0.4,
        rightY: curDragY * 0.45,
        bottomX: curLeanX * 0.2,
        bottomY: 0,
        leftX: curDragX * 0.45 + curLeanX * 0.4,
        leftY: curDragY * 0.45
      };

      const path = generateOrganicBodyPath(0, 0, rx, ry, bodyDeform);

      const faceOffset = {
        x: curDragX * 0.45 + curLeanX * 0.7,
        y: curDragY * 0.45 + curLeanY * 0.7 + (currentSquash * 12)
      };

      let dominantEmotion = 'calm';
      if (activeScenario === 'success') {
        dominantEmotion = 'payment_success';
      } else if (activeScenario === 'failure') {
        dominantEmotion = 'payment_failed';
      } else if (activeScenario === 'network') {
        dominantEmotion = 'network_issue';
      } else {
        const dragDist = Math.sqrt(curDragX * curDragX + curDragY * curDragY);
        if (ptr.isDragging || dragDist > 14) {
          dominantEmotion = 'tension';
        } else if (a.blissFactor > 0.25) {
          dominantEmotion = 'bliss';
        } else if (a.smileFactor > 0.25) {
          dominantEmotion = 'joy';
        } else if (a.curiousFactor > 0.25 || (ptr.proximity > 0.45 && !idle.isIdle)) {
          dominantEmotion = 'curious';
        } else if (idle.isIdle) {
          dominantEmotion = 'daydream';
        } else {
          dominantEmotion = 'calm';
        }
      }

      if (emotionRef && emotionRef.current) {
        emotionRef.current.state = dominantEmotion;
        emotionRef.current.scenario = activeScenario;
        emotionRef.current.bliss = a.blissFactor;
        emotionRef.current.smile = a.smileFactor;
        emotionRef.current.curious = a.curiousFactor;
        emotionRef.current.alertness = ptr.proximity;
        emotionRef.current.isIdle = idle.isIdle;
        emotionRef.current.dragTension = Math.min(1, Math.sqrt(curDragX * curDragX + curDragY * curDragY) / 60);
        emotionRef.current.dragVector = { x: curDragX, y: curDragY };
      }

      if (animRef.current.lastReportedEmotion !== dominantEmotion) {
        animRef.current.lastReportedEmotion = dominantEmotion;
        if (onEmotionChange) onEmotionChange(dominantEmotion);
      }

      const shadowScale = clamp(1 - (curDragY + curLeanY) * 0.0035, 0.65, 1.35);
      const shadowOffsetX = curDragX * 0.35 + curLeanX * 0.35;

      setRenderState({
        bodyPath: path,
        faceOffset,
        eyeGaze: { x: curEyeX, y: curEyeY },
        saccade,
        blinkProgress: idle.blinkProgress,
        smileFactor: a.smileFactor,
        curiousFactor: a.curiousFactor,
        blissFactor: a.blissFactor,
        alertness: ptr.proximity,
        shadowScale,
        shadowOffsetX
      });

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animationFrameId);
      stopPurr();
      stopNetworkSearchingSound();
    };
  }, [isReducedMotion, updateIdleState]);

  let creatureFill = theme.creatureColor || '#1e1e24';
  let creatureTopHighlight = theme.creatureHighlight || '#32323c';
  let accentColor = theme.accentBlush || '#e07a5f';
  let rimColor = 'rgba(255, 255, 255, 0.08)';

  if (scenario === 'success') {
    creatureFill = '#132c20';
    creatureTopHighlight = '#22553c';
    accentColor = '#fb923c';
    rimColor = 'rgba(52, 211, 153, 0.38)';
  } else if (scenario === 'failure') {
    creatureFill = '#2d181c';
    creatureTopHighlight = '#4a252c';
    accentColor = '#f43f5e';
    rimColor = 'rgba(251, 113, 133, 0.35)';
  } else if (scenario === 'network') {
    creatureFill = '#101c28';
    creatureTopHighlight = '#1c344a';
    accentColor = '#06b6d4';
    rimColor = 'rgba(6, 182, 212, 0.42)';
  }

  return (
    <div
      ref={containerRef}
      className="companion-interactive-area"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label="Little Companion. Move cursor to guide its gaze, Click to poke, Double-click to make it smile, Stroke back and forth to pet, or Drag to stretch."
    >
      <svg
        ref={svgRef}
        viewBox="-140 -140 280 280"
        className="companion-svg"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="body-gradient" cx="35%" cy="28%" r="78%">
            <stop offset="0%" stopColor={creatureTopHighlight} />
            <stop offset="58%" stopColor={creatureFill} />
            <stop offset="100%" stopColor="#0a0a0e" />
          </radialGradient>

          <radialGradient id="body-rim-glow" cx="50%" cy="50%" r="50%">
            <stop offset="76%" stopColor={rimColor} stopOpacity="0" />
            <stop offset="94%" stopColor={rimColor} stopOpacity="0.75" />
            <stop offset="100%" stopColor={rimColor} stopOpacity="1" />
          </radialGradient>

          <radialGradient id="shadow-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(24, 24, 30, 0.16)" />
            <stop offset="65%" stopColor="rgba(24, 24, 30, 0.05)" />
            <stop offset="100%" stopColor="rgba(24, 24, 30, 0)" />
          </radialGradient>
        </defs>

        <ellipse
          cx={renderState.shadowOffsetX}
          cy="88"
          rx={68 * renderState.shadowScale}
          ry={13 * renderState.shadowScale}
          fill="url(#shadow-gradient)"
          className="floor-shadow"
        />

        <path
          d={renderState.bodyPath || DEFAULT_BODY_PATH}
          fill={creatureFill}
          className="companion-body-path"
          style={{ transition: 'fill 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
        />

        <path
          d={renderState.bodyPath || DEFAULT_BODY_PATH}
          fill="url(#body-gradient)"
          opacity="0.88"
          pointerEvents="none"
          style={{ transition: 'opacity 0.6s ease' }}
        />

        {scenario !== 'none' && (
          <path
            d={renderState.bodyPath || DEFAULT_BODY_PATH}
            fill="url(#body-rim-glow)"
            opacity="0.95"
            pointerEvents="none"
            style={{ transition: 'opacity 0.6s ease' }}
          />
        )}

        <CompanionFace
          eyeGaze={renderState.eyeGaze}
          saccade={renderState.saccade}
          blinkProgress={renderState.blinkProgress}
          smileFactor={renderState.smileFactor}
          curiousFactor={renderState.curiousFactor}
          blissFactor={renderState.blissFactor}
          alertness={renderState.alertness}
          faceOffset={renderState.faceOffset}
          accentColor={accentColor}
          creatureColor={creatureFill}
          scenario={scenario}
        />
      </svg>
    </div>
  );
}
