import { useRef, useEffect, useState, useCallback } from 'react';

export function useIdleState(pointerRef, idleTimeoutMs = 9000) {
  const idleStateRef = useRef({
    isIdle: false,
    wanderGazeX: 0,
    wanderGazeY: 0,
    wanderTargetX: 0,
    wanderTargetY: 0,
    nextWanderTime: 0,
    blinkProgress: 0,
    isBlinking: false,
    nextBlinkTime: Date.now() + 3000,
    isPerkedUp: false,
    perkUpUntil: 0
  });

  const [isIdleReactState, setIsIdleReactState] = useState(false);

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

    if (s.isIdle) {
      if (now >= s.nextWanderTime) {
        const angles = [
          { x: -70, y: -40 },
          { x: 80, y: -50 },
          { x: 0, y: -60 },
          { x: -80, y: 10 },
          { x: 80, y: 10 },
          { x: 0, y: 0 }
        ];
        const choice = angles[Math.floor(Math.random() * angles.length)];
        s.wanderTargetX = choice.x;
        s.wanderTargetY = choice.y;
        s.nextWanderTime = now + 2400 + Math.random() * 2600;
      }

      s.wanderGazeX += (s.wanderTargetX - s.wanderGazeX) * 0.05;
      s.wanderGazeY += (s.wanderTargetY - s.wanderGazeY) * 0.05;
    } else {
      s.wanderGazeX = 0;
      s.wanderGazeY = 0;
    }

    if (s.isPerkedUp && now > s.perkUpUntil) {
      s.isPerkedUp = false;
    }

    if (now >= s.nextBlinkTime && !s.isBlinking) {
      s.isBlinking = true;
      s.blinkStartTime = now;
      s.blinkDuration = 140;
      s.isDoubleBlink = Math.random() < 0.22;
    }

    if (s.isBlinking) {
      const elapsed = now - s.blinkStartTime;
      if (elapsed < s.blinkDuration) {
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
