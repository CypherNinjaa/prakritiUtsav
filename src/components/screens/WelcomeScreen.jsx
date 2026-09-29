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
      {/* Official Amity University Patna Header Logo */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: 'rgba(0, 43, 73, 0.94)',
        padding: '8px 24px',
        borderRadius: '9999px',
        border: '1.5px solid rgba(250, 204, 21, 0.5)',
        boxShadow: '0 6px 18px rgba(0, 43, 73, 0.25)',
        marginBottom: '16px'
      }}>
        <img
          src={amityLogoWhite}
          alt="Amity University Patna"
          style={{ height: '42px', objectFit: 'contain' }}
        />
      </div>

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
        padding: '24px 20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        marginBottom: '36px',
        background: 'rgba(255, 255, 255, 0.94)'
      }}>
        {/* Badge 1: Questions Count */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 4px',
          borderRight: '1.5px solid rgba(0,0,0,0.06)'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 14px rgba(34, 197, 94, 0.35)'
          }}>
            <FileText size={26} />
          </div>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(24px, 3.5vw, 32px)',
            fontWeight: 900,
            color: '#064e3b',
            lineHeight: 1
          }}>
            {totalQuestions}
          </div>
          <div style={{
            fontSize: '14px',
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
          gap: '8px',
          padding: '10px 4px',
          borderRight: '1.5px solid rgba(0,0,0,0.06)'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 14px rgba(239, 68, 68, 0.35)'
          }}>
            <XCircle size={26} />
          </div>
          <div style={{
            fontSize: '13px',
            fontWeight: 800,
            color: '#991b1b',
            lineHeight: 1.3
          }}>
            One Wrong<br />Answer =
          </div>
          <div style={{
            fontSize: '13px',
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
          gap: '8px',
          padding: '10px 4px'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 14px rgba(234, 179, 8, 0.35)'
          }}>
            <Trophy size={26} />
          </div>
          <div style={{
            fontSize: '13px',
            fontWeight: 800,
            color: '#854d0e',
            lineHeight: 1.3
          }}>
            Highest<br />Score
          </div>
          <div style={{
            fontSize: '13px',
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
          padding: '18px 52px',
          fontSize: 'clamp(18px, 2.5vw, 24px)',
          letterSpacing: '1px'
        }}
      >
        <Leaf size={24} />
        <span>START QUIZ</span>
        <div style={{
          width: '34px',
          height: '34px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: '6px'
        }}>
          <ArrowRight size={20} />
        </div>
      </button>
    </div>
  );
}
