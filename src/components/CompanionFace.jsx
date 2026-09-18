import React from 'react';
import { generateMouthPath } from '../utils/animation';

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
  scenario = 'none'
}) {
  const isSuccess = scenario === 'success';
  const isFailure = scenario === 'failure';
  const isNetwork = scenario === 'network';

  const eyeRadiusX = 11.2 * (1 + (alertness || 0) * 0.1);
  const eyeRadiusY = 12.0 * (1 + (alertness || 0) * 0.1);
  const pupilBaseRadius = 5.4 * (1 + (alertness || 0) * 0.14);

  const maxTravelX = 5.4;
  const maxTravelY = 5.2;

  let computedGazeX = eyeGaze.x + saccade.x;
  let computedGazeY = eyeGaze.y + saccade.y;

  if (isFailure) {
    computedGazeY = Math.max(1.8, computedGazeY + 2.0);
    computedGazeX = computedGazeX * 0.4 - 0.8;
  }

  const pupilX = Math.max(-maxTravelX, Math.min(maxTravelX, computedGazeX));
  const pupilY = Math.max(-maxTravelY, Math.min(maxTravelY, computedGazeY));

  let activeBlushColor = accentColor;
  let blushAlpha = Math.min(0.65, 0.18 + smileFactor * 0.35 + blissFactor * 0.45 + curiousFactor * 0.15);

  if (isSuccess) {
    activeBlushColor = '#fb923c';
    blushAlpha = 0.72;
  } else if (isFailure) {
    activeBlushColor = '#f43f5e';
    blushAlpha = 0.62;
  } else if (isNetwork) {
    activeBlushColor = '#06b6d4';
    blushAlpha = 0.32;
  }

  let mouthPathData = generateMouthPath(smileFactor, curiousFactor, blissFactor);
  if (isSuccess) {
    mouthPathData = 'M -11 2 Q 0 9 11 2';
  } else if (isFailure) {
    mouthPathData = 'M -8 3.5 Q -4 5.5 0 3.5 Q 4 1.5 8 3.5';
  } else if (isNetwork) {
    mouthPathData = 'M -5 3.5 Q 0 5 5 3.5';
  }

  const effectiveBlink = Math.max(0, Math.min(1, blinkProgress + (isFailure ? 0.35 : 0)));
  const isEyesClosedHappy = isSuccess || blissFactor > 0.65;

  return (
    <g
      className="companion-face"
      transform={`translate(${faceOffset.x}, ${faceOffset.y})`}
    >
      <defs>
        <radialGradient id="face-blush-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={activeBlushColor} stopOpacity={blushAlpha} />
          <stop offset="60%" stopColor={activeBlushColor} stopOpacity={blushAlpha * 0.45} />
          <stop offset="100%" stopColor={activeBlushColor} stopOpacity="0" />
        </radialGradient>

        <clipPath id="left-eye-socket-clip">
          <ellipse cx="0" cy="0" rx={eyeRadiusX} ry={eyeRadiusY} />
        </clipPath>
        <clipPath id="right-eye-socket-clip">
          <ellipse cx="0" cy="0" rx={eyeRadiusX} ry={eyeRadiusY} />
        </clipPath>
      </defs>

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

      <g transform="translate(-21, -7)" className="left-eye-group">
        {isEyesClosedHappy ? (
          <path
            d="M -9 1 Q 0 -7 9 1"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            className="crescent-eye-happy"
          />
        ) : (
          <>
            <ellipse
              cx="0"
              cy="0"
              rx={eyeRadiusX}
              ry={eyeRadiusY}
              fill="#fbfaf7"
              className="eye-sclera"
            />

            <g clipPath="url(#left-eye-socket-clip)">
              <circle
                cx={pupilX}
                cy={pupilY}
                r={pupilBaseRadius}
                fill="#101014"
                className="eye-pupil"
              />

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

              <circle
                cx={pupilX + 1.8}
                cy={pupilY - 1.8}
                r={1.85}
                fill="#ffffff"
                opacity="0.95"
              />
              <circle
                cx={pupilX - 1.6}
                cy={pupilY + 1.6}
                r={0.9}
                fill="#ffffff"
                opacity="0.55"
              />

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

      <g transform="translate(21, -7)" className="right-eye-group">
        {isEyesClosedHappy ? (
          <path
            d="M -9 1 Q 0 -7 9 1"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            className="crescent-eye-happy"
          />
        ) : (
          <>
            <ellipse
              cx="0"
              cy="0"
              rx={eyeRadiusX}
              ry={eyeRadiusY}
              fill="#fbfaf7"
              className="eye-sclera"
            />

            <g clipPath="url(#right-eye-socket-clip)">
              <circle
                cx={pupilX}
                cy={pupilY}
                r={pupilBaseRadius}
                fill="#101014"
                className="eye-pupil"
              />

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

              <circle
                cx={pupilX + 1.8}
                cy={pupilY - 1.8}
                r={1.85}
                fill="#ffffff"
                opacity="0.95"
              />
              <circle
                cx={pupilX - 1.6}
                cy={pupilY + 1.6}
                r={0.9}
                fill="#ffffff"
                opacity="0.55"
              />

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
