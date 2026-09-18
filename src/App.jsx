import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Companion } from './components/Companion';
import { CreativeBackground } from './components/CreativeBackground';
import {
  Volume2,
  VolumeX,
  Sun,
  Trees,
  Sunset,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  WifiOff,
  RotateCcw
} from 'lucide-react';
import { toggleAudioMute } from './utils/audio';
import './App.css';

const THEMES = [
  {
    id: 'porcelain',
    name: 'Porcelain',
    icon: Sun,
    bgWarm: '#f7f6f0',
    textMain: '#18181c',
    textSubtle: '#6c6b74',
    textMuted: '#95949d',
    creatureColor: '#1e1e24',
    creatureHighlight: '#32323c',
    accentBlush: '#e07a5f'
  },
  {
    id: 'sage',
    name: 'Sage Atelier',
    icon: Trees,
    bgWarm: '#eef3ec',
    textMain: '#16221a',
    textSubtle: '#5c6f62',
    textMuted: '#8a9e91',
    creatureColor: '#19261e',
    creatureHighlight: '#283c30',
    accentBlush: '#4ade80'
  },
  {
    id: 'sunset',
    name: 'Sunset Clay',
    icon: Sunset,
    bgWarm: '#f9eee4',
    textMain: '#2c1e19',
    textSubtle: '#7c655d',
    textMuted: '#aa9289',
    creatureColor: '#36241e',
    creatureHighlight: '#52372e',
    accentBlush: '#f97316'
  }
];

const SCENARIO_META = {
  none: {
    code: 'READY',
    label: 'GATEWAY READY · STANDBY',
    color: '#10b981',
    badgeClass: 'badge-ready'
  },
  success: {
    code: '200 OK',
    label: 'PAYMENT SUCCESSFUL · SETTLED',
    color: '#10b981',
    badgeClass: 'badge-success'
  },
  failure: {
    code: '402 DECLINED',
    label: 'OOPS, SOMETHING WENT WRONG · INSUFFICIENT FUNDS',
    color: '#f43f5e',
    badgeClass: 'badge-failure'
  },
  network: {
    code: '504 TIMEOUT',
    label: 'NETWORK ISSUE · SEARCHING FOR PACKETS',
    color: '#06b6d4',
    badgeClass: 'badge-network'
  }
};

const EMOTION_META = {
  calm: { label: 'AFFINITY · EQUILIBRIUM', color: '#eab308' },
  curious: { label: 'AFFINITY · ATTENTIVE FOCUS', color: '#84cc16' },
  bliss: { label: 'AFFINITY · BLISSFUL PURR', color: '#f43f5e' },
  joy: { label: 'AFFINITY · EUPHORIC JOY', color: '#f97316' },
  daydream: { label: 'AFFINITY · SERENE DAYDREAM', color: '#6366f1' },
  tension: { label: 'AFFINITY · ELASTIC TENSION', color: '#ea580c' },
  nourished: { label: 'AFFINITY · NOURISHED (EUPHORIA)', color: '#f59e0b' },
  payment_success: { label: 'PAYMENT SETTLED (200 OK)', color: '#10b981' },
  payment_failed: { label: 'PAYMENT DECLINED (402)', color: '#f43f5e' },
  network_issue: { label: 'NETWORK TIMEOUT (504)', color: '#06b6d4' }
};

export default function App() {
  const [themeIndex, setThemeIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [rippleTrigger, setRippleTrigger] = useState(0);
  const [absorbedTrigger, setAbsorbedTrigger] = useState(0);
  const [emotionState, setEmotionState] = useState('calm');
  const [scenario, setScenario] = useState('none'); // 'none' | 'success' | 'failure' | 'network'

  // Shared 60fps emotion telemetry ref (completely decouples canvas from React re-renders)
  const emotionRef = useRef({
    state: 'calm',
    scenario: 'none',
    bliss: 0,
    smile: 0,
    curious: 0,
    alertness: 0,
    isIdle: false,
    dragTension: 0,
    dragVector: { x: 0, y: 0 },
    nearestMote: null
  });

  const currentTheme = THEMES[themeIndex];
  const activeScenarioMeta = SCENARIO_META[scenario] || SCENARIO_META.none;
  const currentEmotion = EMOTION_META[emotionState] || EMOTION_META.calm;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handler = (e) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Keyboard shortcut listener for testing payment scenarios (1, 2, 3, 0)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === '1') {
        setScenario('success');
      } else if (e.key === '2') {
        setScenario('failure');
      } else if (e.key === '3') {
        setScenario('network');
      } else if (e.key === '0' || e.key === 'Escape') {
        setScenario('none');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleSound = () => {
    const next = toggleAudioMute();
    setIsMuted(next);
  };

  const handleNextTheme = () => {
    setThemeIndex((prev) => (prev + 1) % THEMES.length);
  };

  const handleInteract = useCallback((type) => {
    setRippleTrigger((prev) => prev + 1);
  }, []);

  const handleEmotionChange = useCallback((newEmotion) => {
    setEmotionState(newEmotion);
  }, []);

  const handleMoteAbsorbed = useCallback(() => {
    setAbsorbedTrigger((prev) => prev + 1);
    setEmotionState('nourished');
    setTimeout(() => {
      setEmotionState((prev) => (prev === 'nourished' ? 'joy' : prev));
    }, 1200);
  }, []);

  const handleSelectScenario = (newScenario) => {
    setScenario((prev) => (prev === newScenario ? 'none' : newScenario));
  };

  return (
    <main
      className={`companion-app theme-${currentTheme.id} scenario-${scenario}`}
      style={{
        '--bg-warm': currentTheme.bgWarm,
        '--text-main': currentTheme.textMain,
        '--text-subtle': currentTheme.textSubtle,
        '--text-muted': currentTheme.textMuted,
        '--accent-blush': currentTheme.accentBlush
      }}
      role="main"
    >
      {/* Creative Interactive Background (Topographic Membrane + Light Motes + Bio-Resonance Field) */}
      <CreativeBackground
        theme={currentTheme}
        emotionRef={emotionRef}
        scenario={scenario}
        rippleTrigger={rippleTrigger}
        onMoteAbsorbed={handleMoteAbsorbed}
      />

      {/* Top Utility Controls */}
      <div className="top-utilities">
        {/* Dodo Payments: Live Telemetry & Status Code Pill */}
        <div className={`emotion-status-pill scenario-pill-${scenario}`}>
          <span
            className="emotion-pulse-dot"
            style={{ backgroundColor: activeScenarioMeta.color }}
          />
          <span className={`status-code-badge ${activeScenarioMeta.badgeClass}`}>
            {activeScenarioMeta.code}
          </span>
          <span className="emotion-pill-text">
            {scenario !== 'none' ? activeScenarioMeta.label : currentEmotion.label}
          </span>
        </div>

        <button
          type="button"
          onClick={handleNextTheme}
          className="utility-btn"
          title={`Palette: ${currentTheme.name} (Click to switch)`}
          aria-label={`Current palette ${currentTheme.name}. Click to switch.`}
        >
          <currentTheme.icon size={13} className="theme-icon" />
          <span>{currentTheme.name}</span>
        </button>

        <button
          type="button"
          onClick={handleToggleSound}
          className={`utility-btn ${isMuted ? 'muted' : ''}`}
          title={isMuted ? 'Unmute procedural sound' : 'Mute procedural sound'}
          aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
        >
          {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
          <span>{isMuted ? 'Muted' : 'Sound'}</span>
        </button>
      </div>

      {/* Editorial Header */}
      <header className="companion-header">
        <h1 className="companion-title">Dodo Companion</h1>
        <p className="companion-subtitle">
          {scenario === 'success' && 'payment cleared · celebratory bloom & radiant harmonics.'}
          {scenario === 'failure' && 'oops, something went wrong · empathetic wobble & comforting warmth.'}
          {scenario === 'network' && 'network disconnected · radar sweep & satellite packet search.'}
          {scenario === 'none' && 'what if payment feedback spoke through living body language?'}
        </p>
      </header>

      {/* Main Interactive Stage */}
      <section className="stage-area" aria-label="Interactive Companion Area">
        <Companion
          isReducedMotion={isReducedMotion}
          theme={currentTheme}
          emotionRef={emotionRef}
          scenario={scenario}
          absorbedTrigger={absorbedTrigger}
          onEmotionChange={handleEmotionChange}
          onInteract={handleInteract}
        />
      </section>

      {/* Dodo Payments: Dedicated Scenario Switcher Dock */}
      <nav className="payment-scenario-bar" aria-label="Payment Scenario Testing Bar">
        <button
          type="button"
          onClick={() => handleSelectScenario('success')}
          className={`scenario-btn btn-success ${scenario === 'success' ? 'active' : ''}`}
          title="Simulate Successful Payment (Key 1)"
        >
          <CheckCircle2 size={13} className="scenario-btn-icon" />
          <span className="scenario-btn-label">Success</span>
          <span className="scenario-hotkey">1</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectScenario('failure')}
          className={`scenario-btn btn-failure ${scenario === 'failure' ? 'active' : ''}`}
          title="Simulate Payment Declined / Oops (Key 2)"
        >
          <AlertCircle size={13} className="scenario-btn-icon" />
          <span className="scenario-btn-label">Declined</span>
          <span className="scenario-hotkey">2</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectScenario('network')}
          className={`scenario-btn btn-network ${scenario === 'network' ? 'active' : ''}`}
          title="Simulate Internet / Network Issue (Key 3)"
        >
          <WifiOff size={13} className="scenario-btn-icon" />
          <span className="scenario-btn-label">Offline</span>
          <span className="scenario-hotkey">3</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectScenario('none')}
          className={`scenario-btn btn-reset ${scenario === 'none' ? 'active' : ''}`}
          title="Reset to Standby (Key 0)"
        >
          <RotateCcw size={13} className="scenario-btn-icon" />
          <span className="scenario-btn-label">Standby</span>
          <span className="scenario-hotkey">0</span>
        </button>
      </nav>

      {/* Understated Interaction Hints */}
      <footer className="companion-footer">
        <div className="hints-row" aria-label="Interaction Guide">
          <span className="hint-pill hint-action">
            <Sparkles size={11} className="hint-icon" />
            <span>Click canvas to drop light motes</span>
          </span>
          <span className="hint-sep">·</span>
          <span className="hint-pill">Hotkeys: 1 (Success) · 2 (Declined) · 3 (Offline) · 0 (Standby)</span>
          <span className="hint-sep">·</span>
          <span className="hint-pill">Stroke to pet & purr</span>
          <span className="hint-sep">·</span>
          <span className="hint-pill">Drag & fling</span>
        </div>
      </footer>
    </main>
  );
}

