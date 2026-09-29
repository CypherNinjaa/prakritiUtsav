import React from 'react';
import { useQuiz } from '../../context/QuizContext';
import { FileText, XCircle, Trophy, ArrowRight, Leaf } from 'lucide-react';
import { playClick } from '../../services/soundEffects';
import amityLogoWhite from '../../../amity logo/amity-aup-logo-white.png';

export default function WelcomeScreen({ onStartQuiz }) {
  const { quizData } = useQuiz();
  const totalQuestions = quizData?.questions?.length || 50;

  const handleStart = () => {
    playClick();
    onStartQuiz();
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      maxWidth: '820px',
      margin: '0 auto',
      textAlign: 'center',
      padding: '16px',
      position: 'relative',
      zIndex: 10
    }}>
      {/* Event Title Matching Mockup */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <span className="brand-prakriti" style={{ fontSize: 'clamp(46px, 8vw, 76px)', lineHeight: 1 }}>
            Prakriti
          </span>
          <span className="brand-utsav" style={{ fontSize: 'clamp(54px, 9vw, 92px)', lineHeight: 1 }}>
            Utsav
          </span>
        </div>

        <div className="brand-subheading" style={{
          fontSize: 'clamp(14px, 2.2vw, 22px)',
          marginTop: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          color: '#15803d'
        }}>
          <span style={{ color: '#22c55e' }}>🌿</span>
          <span>NATURE IN ACTION</span>
          <span style={{ color: '#22c55e' }}>🌿</span>
        </div>
      </div>

      {/* Subtitle */}
      <p style={{
        fontSize: 'clamp(15px, 2vw, 19px)',
        fontWeight: 700,
        color: '#0f172a',
        maxWidth: '580px',
        margin: '0 auto 32px',
        lineHeight: 1.45,
        textShadow: '0 1px 4px rgba(255, 255, 255, 0.9)'
      }}>
        Test your knowledge about nature, environment and sustainability.
      </p>

      {/* 3 Overview Badges (Direct from Mockup) */}
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '720px',
        padding: '20px 14px',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
        marginBottom: '32px',
        background: 'rgba(255, 255, 255, 0.94)'
      }}>
        {/* Badge 1: Questions Count */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 2px',
          borderRight: '1px solid rgba(0,0,0,0.08)'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(34, 197, 94, 0.35)'
          }}>
            <FileText size={22} />
          </div>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(22px, 4vw, 30px)',
            fontWeight: 900,
            color: '#064e3b',
            lineHeight: 1
          }}>
            {totalQuestions}
          </div>
          <div style={{
            fontSize: 'clamp(11px, 2.5vw, 13px)',
            fontWeight: 800,
            color: '#334155'
          }}>
            Questions
          </div>
        </div>

        {/* Badge 2: Sudden Death Rule */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 2px',
          borderRight: '1px solid rgba(0,0,0,0.08)'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.35)'
          }}>
            <XCircle size={22} />
          </div>
          <div style={{
            fontSize: 'clamp(10px, 2.2vw, 12px)',
            fontWeight: 800,
            color: '#991b1b',
            lineHeight: 1.2
          }}>
            One Wrong<br />Answer =
          </div>
          <div style={{
            fontSize: 'clamp(11px, 2.4vw, 13px)',
            fontWeight: 900,
            color: '#b91c1c',
            textTransform: 'uppercase'
          }}>
            Game Over
          </div>
        </div>

        {/* Badge 3: Highest Score */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 2px'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(234, 179, 8, 0.35)'
          }}>
            <Trophy size={22} />
          </div>
          <div style={{
            fontSize: 'clamp(10px, 2.2vw, 12px)',
            fontWeight: 800,
            color: '#854d0e',
            lineHeight: 1.2
          }}>
            Highest<br />Score
          </div>
          <div style={{
            fontSize: 'clamp(11px, 2.4vw, 13px)',
            fontWeight: 900,
            color: '#a16207',
            textTransform: 'uppercase'
          }}>
            Wins
          </div>
        </div>
      </div>

      {/* Primary CTA Button (Matching Mockup) */}
      <button
        onClick={handleStart}
        className="primary-btn"
        style={{
          padding: '16px 44px',
          fontSize: 'clamp(17px, 2.4vw, 22px)',
          letterSpacing: '1px',
          maxWidth: '100%'
        }}
      >
        <Leaf size={22} />
        <span>START QUIZ</span>
        <div style={{
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: '4px'
        }}>
          <ArrowRight size={18} />
        </div>
      </button>
    </div>
  );
}
