import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, CheckCircle, XCircle, FileText, ArrowRight, RotateCcw, Home, Sprout } from 'lucide-react';
import { playVictory, playClick } from '../../services/soundEffects';

export default function QuizCompleteScreen({
  participant,
  score,
  totalQuestions,
  onRetake,
  onBackToHome
}) {
  const incorrect = totalQuestions - score;
  const scorePercent = Math.round((score / totalQuestions) * 100);

  useEffect(() => {
    playVictory();

    // Multi-stage celebratory fireworks
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#22c55e', '#facc15', '#16a34a']
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#22c55e', '#38bdf8', '#a855f7']
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div style={{
      width: '100%',
      maxWidth: '880px',
      margin: '0 auto',
      padding: '16px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        padding: '36px',
        background: 'rgba(255, 255, 255, 0.98)',
        position: 'relative',
        border: '2px solid #86efac'
      }}>
        {/* Main Grid: Left Laurel Trophy + Right Results */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '32px',
          alignItems: 'center',
          marginBottom: '36px'
        }}>
          {/* Left Column: Laurel Trophy Badge (Direct from Mockup) */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #dcfce7 0%, #bbf7d0 100%)',
              border: '4px solid #16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px',
              color: '#eab308',
              boxShadow: '0 12px 30px rgba(22, 163, 74, 0.25)',
              position: 'relative'
            }} className="animate-float">
              <Trophy size={72} strokeWidth={2.2} />
            </div>

            <div style={{
              display: 'inline-block',
              background: '#15803d',
              color: '#ffffff',
              padding: '6px 20px',
              borderRadius: '9999px',
              fontWeight: 800,
              fontSize: '15px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '12px'
            }}>
              Quiz Completed!
            </div>

            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '32px',
              fontWeight: 900,
              color: '#064e3b',
              marginBottom: '6px'
            }}>
              Great Job, {participant?.name || 'Explorer'}!
            </h2>

            <p style={{ fontSize: '14px', color: '#64748b' }}>
              You have successfully completed the Nature in Action quiz challenge!
            </p>
          </div>

          {/* Right Column: Your Results Grid (Direct from Mockup) */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '18px',
              fontWeight: 800,
              color: '#064e3b',
              marginBottom: '16px'
            }}>
              <Sprout size={20} color="#16a34a" />
              <span>Your Results</span>
            </div>

            {/* 4 Result Metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '10px',
              marginBottom: '24px'
            }}>
              {/* Correct */}
              <div style={{
                background: '#f0fdf4',
                border: '1.5px solid #bbf7d0',
                borderRadius: '14px',
                padding: '12px 6px',
                textAlign: 'center'
              }}>
                <CheckCircle size={20} color="#16a34a" style={{ margin: '0 auto 4px' }} />
                <div style={{ fontSize: '22px', fontWeight: 900, color: '#166534', fontFamily: 'var(--font-heading)' }}>
                  {score}
                </div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Correct</div>
              </div>

              {/* Incorrect */}
              <div style={{
                background: '#fef2f2',
                border: '1.5px solid #fecaca',
                borderRadius: '14px',
                padding: '12px 6px',
                textAlign: 'center'
              }}>
                <XCircle size={20} color="#ef4444" style={{ margin: '0 auto 4px' }} />
                <div style={{ fontSize: '22px', fontWeight: 900, color: '#991b1b', fontFamily: 'var(--font-heading)' }}>
                  {incorrect}
                </div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Incorrect</div>
              </div>

              {/* Total Questions */}
              <div style={{
                background: '#f0f9ff',
                border: '1.5px solid #bae6fd',
                borderRadius: '14px',
                padding: '12px 6px',
                textAlign: 'center'
              }}>
                <FileText size={20} color="#0284c7" style={{ margin: '0 auto 4px' }} />
                <div style={{ fontSize: '22px', fontWeight: 900, color: '#0369a1', fontFamily: 'var(--font-heading)' }}>
                  {totalQuestions}
                </div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Total Qs</div>
              </div>

              {/* Score Percentage */}
              <div style={{
                background: '#fefce8',
                border: '1.5px solid #fef08a',
                borderRadius: '14px',
                padding: '12px 6px',
                textAlign: 'center'
              }}>
                <Trophy size={20} color="#ca8a04" style={{ margin: '0 auto 4px' }} />
                <div style={{ fontSize: '22px', fontWeight: 900, color: '#a16207', fontFamily: 'var(--font-heading)' }}>
                  {scorePercent}%
                </div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Accuracy</div>
              </div>
            </div>

            {/* Performance Bar */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                <span style={{ color: '#334155' }}>Your Performance</span>
                <span style={{ color: '#15803d' }}>{scorePercent}%</span>
              </div>
              <div style={{ width: '100%', height: '10px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${scorePercent}%`,
                  background: 'linear-gradient(90deg, #22c55e, #15803d)',
                  borderRadius: '9999px',
                  transition: 'width 0.8s ease'
                }} />
              </div>
            </div>

            {/* Congratulatory Card */}
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '12px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '13px',
              color: '#166534'
            }}>
              <Sprout size={20} color="#16a34a" />
              <span>
                <strong>Well done!</strong> You have demonstrated great understanding of nature and sustainability.
              </span>
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          paddingTop: '20px',
          borderTop: '1px solid #e2e8f0'
        }}>
          <button
            onClick={() => { playClick(); onRetake(); }}
            className="secondary-btn"
            style={{ padding: '14px 28px', fontSize: '16px' }}
          >
            <RotateCcw size={18} />
            <span>Retake Quiz</span>
          </button>

          <button
            onClick={() => { playClick(); onBackToHome(); }}
            className="primary-btn"
            style={{ padding: '14px 36px', fontSize: '16px' }}
          >
            <Home size={18} />
            <span>Back to Home / Next Participant</span>
          </button>
        </div>
      </div>
    </div>
  );
}
