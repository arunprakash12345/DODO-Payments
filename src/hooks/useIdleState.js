import { useRef, useEffect, useState, useCallback } from 'react';

/**
 * Hook to manage idle behavior, autonomous gaze wandering, and natural blinking.
 */
export function useIdleState(pointerRef, idleTimeoutMs = 9000) {
  const idleStateRef = useRef({
    isIdle: false,
    wanderGazeX: 0,
    wanderGazeY: 0,
    wanderTargetX: 0,
    wanderTargetY: 0,
    nextWanderTime: 0,
    // Blinking
    blinkProgress: 0, // 0 = open, 1 = fully closed
    isBlinking: false,
    nextBlinkTime: Date.now() + 3000,
    isPerkedUp: false,
    perkUpUntil: 0
  });

  const [isIdleReactState, setIsIdleReactState] = useState(false);

  // Trigger immediate wakeup/perk
  const wakeUp = useCallback(() => {
    const s = idleStateRef.current;
    if (s.isIdle) {
      s.isPerkedUp = true;
      s.perkUpUntil = Date.now() + 600;
    }
    s.isIdle = false;
    if (pointerRef.current) {
      pointerRef.current.lastActiveTime = Date.now();
    }
    setIsIdleReactState(false);
  }, [pointerRef]);

  // Main tick for idle state and blinking logic
  const updateIdleState = useCallback((now) => {
    const s = idleStateRef.current;
    const ptr = pointerRef.current;

    const timeSinceActive = ptr ? now - ptr.lastActiveTime : 0;
    const shouldBeIdle = timeSinceActive > idleTimeoutMs && !ptr?.isDragging;

    if (shouldBeIdle !== s.isIdle) {
      s.isIdle = shouldBeIdle;
      setIsIdleReactState(shouldBeIdle);
      if (shouldBeIdle) {
        s.nextWanderTime = now + 1000;
      } else {
        s.isPerkedUp = true;
        s.perkUpUntil = now + 500;
      }
    }

    // Gaze wandering during idle
    if (s.isIdle) {
      if (now >= s.nextWanderTime) {
        // Pick a random looking direction (up, left, right, down)
        const angles = [
          { x: -70, y: -40 }, // look up-left
          { x: 80, y: -50 },  // look up-right
          { x: 0, y: -60 },   // look directly up
          { x: -80, y: 10 },  // look left
          { x: 80, y: 10 },   // look right
          { x: 0, y: 0 }      // look center
        ];
        const choice = angles[Math.floor(Math.random() * angles.length)];
        s.wanderTargetX = choice.x;
        s.wanderTargetY = choice.y;
        s.nextWanderTime = now + 2400 + Math.random() * 2600;
      }

      // Smoothly interpolate wander gaze
      s.wanderGazeX += (s.wanderTargetX - s.wanderGazeX) * 0.05;
      s.wanderGazeY += (s.wanderTargetY - s.wanderGazeY) * 0.05;
    } else {
      s.wanderGazeX = 0;
      s.wanderGazeY = 0;
    }

    // Perked up timer
    if (s.isPerkedUp && now > s.perkUpUntil) {
      s.isPerkedUp = false;
    }

    // Natural Blinking Cycle
    if (now >= s.nextBlinkTime && !s.isBlinking) {
      s.isBlinking = true;
      s.blinkStartTime = now;
      s.blinkDuration = 140; // 140ms blink
      s.isDoubleBlink = Math.random() < 0.22; // 22% chance of double blink
    }

    if (s.isBlinking) {
      const elapsed = now - s.blinkStartTime;
      if (elapsed < s.blinkDuration) {
        // Half cycle up, half down (parabolic curve)
        const progress = elapsed / s.blinkDuration;
        s.blinkProgress = Math.sin(progress * Math.PI);
      } else {
        if (s.isDoubleBlink) {
          s.isDoubleBlink = false;
          s.blinkStartTime = now + 80;
          s.nextBlinkTime = now + 80;
          s.blinkProgress = 0;
        } else {
          s.isBlinking = false;
          s.blinkProgress = 0;
          s.nextBlinkTime = now + 3200 + Math.random() * 4500;
        }
      }
    }

    return s;
  }, [idleTimeoutMs, pointerRef]);

  return {
    idleStateRef,
    isIdle: isIdleReactState,
    wakeUp,
    updateIdleState
  };
}
