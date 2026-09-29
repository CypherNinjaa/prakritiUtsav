import React, { useEffect } from 'react';
import { XCircle, Trophy, RotateCcw, AlertTriangle, CheckCircle2, BookOpen } from 'lucide-react';
import { playWrong, playClick } from '../../services/soundEffects';

export default function GameOverScreen({
  participant,
  score,
  failedQuestion,
  selectedOptionIndex,
  reason = 'wrong',
  onReset
}) {
  useEffect(() => {
    playWrong();
  }, []);

  const handleReset = () => {
    playClick();
    onReset();
  };

  const correctOptionText = failedQuestion?.options[failedQuestion.correctIndex];
  const userOptionText = selectedOptionIndex !== null ? failedQuestion?.options[selectedOptionIndex] : null;

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
      <style>{`
        @media (max-width: 640px) {
          .game-over-card {
            padding: 20px 14px !important;
          }
          .game-over-btn {
            width: 100% !important;
            padding: 14px 20px !important;
            font-size: 16px !important;
            justify-content: center !important;
          }
        }
      `}</style>
      <div className="glass-panel game-over-card" style={{
        width: '100%',
        padding: '36px 32px',
        background: 'rgba(255, 255, 255, 0.97)',
        position: 'relative',
        border: '2px solid #fca5a5'
      }}>
        {/* Red Game Over Badge */}
        <div style={{
          width: '76px',
          height: '76px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 25px rgba(239, 68, 68, 0.4)',
          margin: '0 auto 16px',
          border: '4px solid #fee2e2'
        }}>
          <XCircle size={44} strokeWidth={2.5} />
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(28px, 6vw, 38px)',
          fontWeight: 900,
          color: '#991b1b',
          marginBottom: '6px'
        }}>
          Game Over!
        </h2>

        <p style={{ fontSize: '15px', color: '#64748b', marginBottom: '24px' }}>
          {reason === 'timeout'
            ? 'Time ran out! Sudden death rules apply.'
            : 'One incorrect answer ends the run in sudden death mode.'}
        </p>

        {/* Score & Participant summary */}
        <div style={{
          background: '#fef2f2',
          border: '1.5px solid #fecaca',
          borderRadius: '16px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          marginBottom: '24px'
        }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#7f1d1d', textTransform: 'uppercase' }}>
              Participant
            </div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
              {participant?.name || 'Anonymous'}
            </div>
          </div>

          <div style={{ width: '1px', height: '36px', background: '#fca5a5' }} />

          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#7f1d1d', textTransform: 'uppercase' }}>
              Final Score
            </div>
            <div style={{ fontSize: '24px', fontWeight: 900, color: '#991b1b', fontFamily: 'var(--font-heading)' }}>
              {score}
            </div>
          </div>
        </div>

        {/* Answer Breakdown Card */}
        {failedQuestion && (
          <div style={{
            background: '#f8fafc',
            border: '1.5px solid #e2e8f0',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'left',
            marginBottom: '32px'
          }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#334155', marginBottom: '12px' }}>
              Q: {failedQuestion.question}
            </div>

            {userOptionText && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                background: '#fee2e2',
                borderRadius: '8px',
                color: '#991b1b',
                fontSize: '13px',
                fontWeight: 700,
                marginBottom: '8px'
              }}>
                <XCircle size={16} />
                <span>Your choice: {userOptionText}</span>
              </div>
            )}

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              background: '#dcfce7',
              borderRadius: '8px',
              color: '#166534',
              fontSize: '13px',
              fontWeight: 700,
              marginBottom: '10px'
            }}>
              <CheckCircle2 size={16} />
              <span>Correct answer: {correctOptionText}</span>
            </div>

            {failedQuestion.explanation && (
              <div style={{
                fontSize: '12px',
                color: '#64748b',
                lineHeight: 1.4,
                paddingTop: '8px',
                borderTop: '1px solid #e2e8f0'
              }}>
                <strong>Explanation:</strong> {failedQuestion.explanation}
              </div>
            )}
          </div>
        )}

        {/* Next Participant / Reset Button */}
        <button
          onClick={handleReset}
          className="primary-btn game-over-btn"
          style={{
            padding: '16px 42px',
            fontSize: '18px',
            letterSpacing: '0.5px'
          }}
        >
          <RotateCcw size={20} />
          <span>Next Participant / Back to Home</span>
        </button>
      </div>
    </div>
  );
}
