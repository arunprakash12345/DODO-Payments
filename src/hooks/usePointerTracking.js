import { useRef, useEffect, useCallback } from 'react';
import { clamp } from '../utils/animation';

export function usePointerTracking(targetRef) {
  const pointerRef = useRef({
    x: 0,
    y: 0,
    targetRelX: 0,
    targetRelY: 0,
    smoothRelX: 0,
    smoothRelY: 0,
    distance: 1000,
    proximity: 0,
    isInside: false,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    dragOffsetX: 0,
    dragOffsetY: 0,
    lastActiveTime: Date.now()
  });

  const updatePointerRelative = useCallback((clientX, clientY) => {
    const target = targetRef.current;
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const relX = clientX - centerX;
    const relY = clientY - centerY;
    const dist = Math.sqrt(relX * relX + relY * relY);

    const maxRadius = 280;
    const proximity = clamp(1 - dist / maxRadius, 0, 1);

    const ptr = pointerRef.current;
    ptr.x = clientX;
    ptr.y = clientY;
    ptr.targetRelX = relX;
    ptr.targetRelY = relY;
    ptr.distance = dist;
    ptr.proximity = proximity;
    ptr.lastActiveTime = Date.now();

    if (ptr.isDragging) {
      ptr.dragOffsetX = clientX - ptr.dragStartX;
      ptr.dragOffsetY = clientY - ptr.dragStartY;
    }
  }, [targetRef]);

  useEffect(() => {
    const handleWindowPointerMove = (e) => {
      updatePointerRelative(e.clientX, e.clientY);
    };

    const handleWindowTouchMove = (e) => {
      if (e.touches.length > 0) {
        updatePointerRelative(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('pointermove', handleWindowPointerMove, { passive: true });
    window.addEventListener('touchmove', handleWindowTouchMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove);
      window.removeEventListener('touchmove', handleWindowTouchMove);
    };
  }, [updatePointerRelative]);

  return {
    pointerRef,
    updatePointerRelative
  };
}
