import React from 'react';
import { generateMouthPath } from '../utils/animation';

/**
 * CompanionFace — Minimalist, Editorial, High-Taste Character Rig
 * Designed for organic, subtle, and empathetic expression without cartoon/emoji tropes.
 */
export function CompanionFace({
  eyeGaze = { x: 0, y: 0 },
  saccade = { x: 0, y: 0 },
  blinkProgress = 0,
  smileFactor = 0,
  curiousFactor = 0,
  blissFactor = 0,
  alertness = 0,
  faceOffset = { x: 0, y: 0 },
  accentColor = '#e07a5f',
  creatureColor = '#1e1e24',
  scenario = 'none' // 'none' | 'success' | 'failure' | 'network'
}) {
  const isSuccess = scenario === 'success';
  const isFailure = scenario === 'failure';
  const isNetwork = scenario === 'network';

  // Eye socket dimensions
  const eyeRadiusX = 11.2 * (1 + (alertness || 0) * 0.1);
  const eyeRadiusY = 12.0 * (1 + (alertness || 0) * 0.1);
  const pupilBaseRadius = 5.4 * (1 + (alertness || 0) * 0.14);

  // Maximum pupil travel limits
  const maxTravelX = 5.4;
  const maxTravelY = 5.2;

  let computedGazeX = eyeGaze.x + saccade.x;
  let computedGazeY = eyeGaze.y + saccade.y;

  // In failure state, eyes look slightly bashfully downward
  if (isFailure) {
    computedGazeY = Math.max(1.8, computedGazeY + 2.0);
    computedGazeX = computedGazeX * 0.4 - 0.8;
  }

  const pupilX = Math.max(-maxTravelX, Math.min(maxTravelX, computedGazeX));
  const pupilY = Math.max(-maxTravelY, Math.min(maxTravelY, computedGazeY));

  // Dynamic blush color & opacity (Warm, soft, airbrushed glow)
  let activeBlushColor = accentColor;
  let blushAlpha = Math.min(0.65, 0.18 + smileFactor * 0.35 + blissFactor * 0.45 + curiousFactor * 0.15);

  if (isSuccess) {
    activeBlushColor = '#fb923c'; // Warm radiant sunset peach / amber
    blushAlpha = 0.72;
  } else if (isFailure) {
    activeBlushColor = '#f43f5e'; // Tender apologetic dusky rose
    blushAlpha = 0.62;
  } else if (isNetwork) {
    activeBlushColor = '#06b6d4'; // Subtle electric cyan ambient
    blushAlpha = 0.32;
  }

  // Mouth path calculation
  let mouthPathData = generateMouthPath(smileFactor, curiousFactor, blissFactor);
  if (isSuccess) {
    mouthPathData = 'M -11 2 Q 0 9 11 2'; // Clean joyful buoyant smile
  } else if (isFailure) {
    mouthPathData = 'M -8 3.5 Q -4 5.5 0 3.5 Q 4 1.5 8 3.5'; // Sheepish apologetic soft wavy curve
  } else if (isNetwork) {
    mouthPathData = 'M -5 3.5 Q 0 5 5 3.5'; // Attentive inquisitive small curve
  }

  // Natural eyelid vertical closure (0 = open, 1 = shut)
  const effectiveBlink = Math.max(0, Math.min(1, blinkProgress + (isFailure ? 0.35 : 0)));
  const isEyesClosedHappy = isSuccess || blissFactor > 0.65;

  return (
    <g
      className="companion-face"
      transform={`translate(${faceOffset.x}, ${faceOffset.y})`}
    >
      <defs>
        {/* Soft radial airbrush blush gradient (zero clipping artifacts) */}
        <radialGradient id="face-blush-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={activeBlushColor} stopOpacity={blushAlpha} />
          <stop offset="60%" stopColor={activeBlushColor} stopOpacity={blushAlpha * 0.45} />
          <stop offset="100%" stopColor={activeBlushColor} stopOpacity="0" />
        </radialGradient>

        {/* Eye clip paths */}
        <clipPath id="left-eye-socket-clip">
          <ellipse cx="0" cy="0" rx={eyeRadiusX} ry={eyeRadiusY} />
        </clipPath>
        <clipPath id="right-eye-socket-clip">
          <ellipse cx="0" cy="0" rx={eyeRadiusX} ry={eyeRadiusY} />
        </clipPath>
      </defs>

      {/* 1. Soft Subcutaneous Airbrushed Blush Cheeks */}
      <ellipse
        cx="-33"
        cy="9"
        rx={isSuccess ? 16 : 14}
        ry={isSuccess ? 9.5 : 8}
        fill="url(#face-blush-gradient)"
        className="companion-blush-left"
      />
      <ellipse
        cx="33"
        cy="9"
        rx={isSuccess ? 16 : 14}
        ry={isSuccess ? 9.5 : 8}
        fill="url(#face-blush-gradient)"
        className="companion-blush-right"
      />

      {/* 2. Failure Mode: Subtle Sympathetic Eyebrows */}
      {isFailure && (
        <g className="apologetic-eyebrows" opacity="0.85">
          <path
            d="M -27 -18 Q -20 -23 -13 -17"
            stroke="#ffffff"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 13 -17 Q 20 -23 27 -18"
            stroke="#ffffff"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      )}

      {/* 3. Network Mode: Sleek Signal Arc */}
      {isNetwork && (
        <g className="network-signal-arc" opacity="0.9">
          <circle cx="0" cy="-24" r="1.8" fill="#00e5ff" />
          <path
            d="M -9 -29 Q 0 -35 9 -29"
            stroke="#00e5ff"
            strokeWidth="1.4"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      )}

      {/* 4. Left Eye */}
      <g transform="translate(-21, -7)" className="left-eye-group">
        {isEyesClosedHappy ? (
          /* Success / Pure Joy: Radiant crescent smiling curve */
          <path
            d="M -9 1 Q 0 -7 9 1"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            className="crescent-eye-happy"
          />
        ) : (
          /* Open Living Eye with Glassy Optics & Specular Glints */
          <>
            {/* Eye Sclera */}
            <ellipse
              cx="0"
              cy="0"
              rx={eyeRadiusX}
              ry={eyeRadiusY}
              fill="#fbfaf7"
              className="eye-sclera"
            />

            {/* Iris / Pupil with Specular Reflections */}
            <g clipPath="url(#left-eye-socket-clip)">
              <circle
                cx={pupilX}
                cy={pupilY}
                r={pupilBaseRadius}
                fill="#101014"
                className="eye-pupil"
              />

              {/* Network Tech Iris Halo */}
              {isNetwork && (
                <circle
                  cx={pupilX}
                  cy={pupilY}
                  r={pupilBaseRadius + 1.4}
                  stroke="#00e5ff"
                  strokeWidth="1.2"
                  fill="none"
                  opacity="0.85"
                />
              )}

              {/* Primary Glassy Specular Highlight (Locked to Light Source) */}
              <circle
                cx={pupilX + 1.8}
                cy={pupilY - 1.8}
                r={1.85}
                fill="#ffffff"
                opacity="0.95"
              />
              {/* Secondary Micro Specular Glint */}
              <circle
                cx={pupilX - 1.6}
                cy={pupilY + 1.6}
                r={0.9}
                fill="#ffffff"
                opacity="0.55"
              />

              {/* Organic Curved Eyelid for Blinking */}
              {effectiveBlink > 0.02 && (
                <path
                  d={`M ${-eyeRadiusX - 2} ${-eyeRadiusY - 2} 
                      L ${eyeRadiusX + 2} ${-eyeRadiusY - 2} 
                      L ${eyeRadiusX + 2} ${-eyeRadiusY + eyeRadiusY * 2 * effectiveBlink} 
                      Q 0 ${-eyeRadiusY + eyeRadiusY * 2 * effectiveBlink + 2} ${-eyeRadiusX - 2} ${-eyeRadiusY + eyeRadiusY * 2 * effectiveBlink} 
                      Z`}
                  fill={creatureColor}
                />
              )}
            </g>

            {/* Eyelash contour line */}
            <path
              d={`M ${-eyeRadiusX + 0.5} ${-eyeRadiusY + 1.5} Q 0 ${-eyeRadiusY - 1} ${eyeRadiusX - 0.5} ${-eyeRadiusY + 1.5}`}
              stroke="#1a1a20"
              strokeWidth="1.1"
              fill="none"
              opacity="0.35"
            />
          </>
        )}
      </g>

      {/* 5. Right Eye */}
      <g transform="translate(21, -7)" className="right-eye-group">
        {isEyesClosedHappy ? (
          /* Success / Pure Joy: Radiant crescent smiling curve */
          <path
            d="M -9 1 Q 0 -7 9 1"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            className="crescent-eye-happy"
          />
        ) : (
          /* Open Living Eye with Glassy Optics & Specular Glints */
          <>
            {/* Eye Sclera */}
            <ellipse
              cx="0"
              cy="0"
              rx={eyeRadiusX}
              ry={eyeRadiusY}
              fill="#fbfaf7"
              className="eye-sclera"
            />

            {/* Iris / Pupil with Specular Reflections */}
            <g clipPath="url(#right-eye-socket-clip)">
              <circle
                cx={pupilX}
                cy={pupilY}
                r={pupilBaseRadius}
                fill="#101014"
                className="eye-pupil"
              />

              {/* Network Tech Iris Halo */}
              {isNetwork && (
                <circle
                  cx={pupilX}
                  cy={pupilY}
                  r={pupilBaseRadius + 1.4}
                  stroke="#00e5ff"
                  strokeWidth="1.2"
                  fill="none"
                  opacity="0.85"
                />
              )}

              {/* Primary Glassy Specular Highlight */}
              <circle
                cx={pupilX + 1.8}
                cy={pupilY - 1.8}
                r={1.85}
                fill="#ffffff"
                opacity="0.95"
              />
              {/* Secondary Micro Specular Glint */}
              <circle
                cx={pupilX - 1.6}
                cy={pupilY + 1.6}
                r={0.9}
                fill="#ffffff"
                opacity="0.55"
              />

              {/* Organic Curved Eyelid for Blinking */}
              {effectiveBlink > 0.02 && (
                <path
                  d={`M ${-eyeRadiusX - 2} ${-eyeRadiusY - 2} 
                      L ${eyeRadiusX + 2} ${-eyeRadiusY - 2} 
                      L ${eyeRadiusX + 2} ${-eyeRadiusY + eyeRadiusY * 2 * effectiveBlink} 
                      Q 0 ${-eyeRadiusY + eyeRadiusY * 2 * effectiveBlink + 2} ${-eyeRadiusX - 2} ${-eyeRadiusY + eyeRadiusY * 2 * effectiveBlink} 
                      Z`}
                  fill={creatureColor}
                />
              )}
            </g>

            {/* Eyelash contour line */}
            <path
              d={`M ${-eyeRadiusX + 0.5} ${-eyeRadiusY + 1.5} Q 0 ${-eyeRadiusY - 1} ${eyeRadiusX - 0.5} ${-eyeRadiusY + 1.5}`}
              stroke="#1a1a20"
              strokeWidth="1.1"
              fill="none"
              opacity="0.35"
            />
          </>
        )}
      </g>

      {/* 6. Expressive Minimalist Mouth */}
      <g transform="translate(0, 16)">
        <path
          d={mouthPathData}
          stroke="#ffffff"
          strokeWidth={isSuccess || smileFactor > 0.2 || blissFactor > 0.2 ? '2.3' : '1.9'}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className="companion-mouth"
        />
      </g>
    </g>
  );
}
