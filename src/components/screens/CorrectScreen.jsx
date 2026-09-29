import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Check, Trophy, Sprout, ArrowRight, Sparkles } from 'lucide-react';
import { playCorrect, playClick } from '../../services/soundEffects';

export default function CorrectScreen({ score, totalQuestions, onNextQuestion }) {
  useEffect(() => {
    // Play correct harmonic sound
    playCorrect();

    // Trigger celebratory leaf/green confetti burst
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#16a34a', '#84cc16', '#facc15', '#ffffff']
    });
  }, []);

  const handleNext = () => {
    playClick();
    onNextQuestion();
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      maxWidth: '680px',
      margin: '0 auto',
      padding: '16px',
      textAlign: 'center'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        padding: '40px 32px',
        background: 'rgba(255, 255, 255, 0.97)',
        position: 'relative',
        border: '2px solid #86efac'
      }}>
        {/* Animated Check Badge with Orbital Floating Leaves */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '20px' }}>
          <div style={{
            width: '96px',
            height: '96px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 12px 30px rgba(34, 197, 94, 0.45)',
            margin: '0 auto',
            border: '4px solid #ffffff'
          }} className="animate-pulse-glow">
            <Check size={52} strokeWidth={3.5} />
          </div>

          <div style={{ position: 'absolute', top: '-10px', right: '-15px', color: '#84cc16' }} className="animate-float">
            <Sparkles size={24} />
          </div>
        </div>

        {/* Heading */}
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '44px',
          fontWeight: 900,
          color: '#15803d',
          marginBottom: '24px',
          letterSpacing: '-0.5px'
        }}>
          Correct!
        </h2>

        {/* Score Banner (Direct from Mockup) */}
        <div style={{
          background: '#f0fdf4',
          border: '1.5px solid #a7f3d0',
          borderRadius: '20px',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          maxWidth: '380px',
          margin: '0 auto 24px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: '#dcfce7',
            color: '#16a34a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Trophy size={28} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
              Current Score
            </div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '28px',
              fontWeight: 900,
              color: '#064e3b'
            }}>
              {score} <span style={{ fontSize: '18px', color: '#64748b' }}>/ {totalQuestions}</span>
            </div>
          </div>
        </div>

        {/* Motivational Subcard (Direct from Mockup) */}
        <div style={{
          background: '#ffffff',
          border: '1.5px solid #e2e8f0',
          borderRadius: '16px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          maxWidth: '520px',
          margin: '0 auto 36px',
          textAlign: 'left'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: '#ecfdf5',
            color: '#16a34a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Sprout size={26} />
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#064e3b' }}>
              Great Job!
            </div>
            <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.4 }}>
              Keep going and test more of your nature knowledge!
            </div>
          </div>
        </div>

        {/* NEXT QUESTION Button */}
        <button
          onClick={handleNext}
          className="primary-btn"
          style={{
            padding: '18px 48px',
            fontSize: '20px',
            letterSpacing: '1px'
          }}
        >
          <span>NEXT QUESTION</span>
          <ArrowRight size={22} />
        </button>
      </div>
    </div>
  );
}
