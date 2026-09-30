import React, { useState, useEffect } from 'react';
import { Trophy, Send, Leaf, Clock, AlertCircle } from 'lucide-react';
import { playClick, playTick } from '../../services/soundEffects';

export default function QuestionScreen({
  question,
  quizSet,
  questionNumber,
  totalQuestions,
  currentScore,
  timerEnabled,
  timerDuration = 20,
  onSubmitAnswer,
  onTimeout
}) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [timeLeft, setTimeLeft] = useState(timerDuration);

  // Reset selection and timer whenever question changes
  useEffect(() => {
    setSelectedIndex(null);
    setTimeLeft(timerDuration);
  }, [question, timerDuration]);

  // Countdown timer effect
  useEffect(() => {
    if (!timerEnabled) return;

    if (timeLeft <= 0) {
      onTimeout();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 6 && prev > 1) {
          playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, timerEnabled, onTimeout]);

  // Keyboard shortcut support (1-4, A-D, Enter)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toUpperCase();
      if (['1', 'A'].includes(key) && question.options[0]) {
        playClick();
        setSelectedIndex(0);
      } else if (['2', 'B'].includes(key) && question.options[1]) {
        playClick();
        setSelectedIndex(1);
      } else if (['3', 'C'].includes(key) && question.options[2]) {
        playClick();
        setSelectedIndex(2);
      } else if (['4', 'D'].includes(key) && question.options[3]) {
        playClick();
        setSelectedIndex(3);
      } else if (e.key === 'Enter' && selectedIndex !== null) {
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, question]);

  const handleSelectOption = (index) => {
    playClick();
    setSelectedIndex(index);
  };

  const handleSubmit = () => {
    if (selectedIndex === null) return;
    playClick();
    onSubmitAnswer(selectedIndex);
  };

  const progressPercent = Math.round(((questionNumber) / totalQuestions) * 100);

  // Timer color indicator
  const getTimerColor = () => {
    if (timeLeft > 10) return '#16a34a';
    if (timeLeft > 5) return '#ea580c';
    return '#dc2626';
  };

  const letters = ['A', 'B', 'C', 'D'];

 
  return (
    <div style={{
      width: '100%',
      maxWidth: '860px',
      margin: '0 auto',
      padding: '12px'
    }}>
      <style>{`
        @media (max-width: 640px) {
          .question-panel {
            padding: 18px 12px !important;
          }
          .question-options-grid {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
            margin-bottom: 24px !important;
          }
          .question-title {
            font-size: 19px !important;
            margin-bottom: 20px !important;
          }
          .option-card-btn {
            padding: 12px 14px !important;
            gap: 12px !important;
          }
          .question-submit-btn {
            padding: 14px 40px !important;
            font-size: 17px !important;
            width: 100% !important;
          }
        }
      `}</style>
      <div className="glass-panel question-panel" style={{
        width: '100%',
        padding: '36px 32px',
        background: 'rgba(255, 255, 255, 0.96)',
        position: 'relative',
        border: '2px solid rgba(34, 197, 94, 0.35)'
      }}>
        {/* Top Status Bar: Progress + Timer + Score */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '24px',
          flexWrap: 'wrap'
        }}>
          {/* Progress Section */}
          <div style={{ flex: '1', minWidth: '160px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '6px',
              gap: '8px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '14px',
                fontWeight: 800,
                color: '#064e3b'
              }}>
                <Leaf size={16} color="#16a34a" />
                <span>Question {questionNumber} of {totalQuestions}</span>
              </div>
              {(quizSet || question?.set) && (
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  background: ((quizSet && quizSet.includes('B')) || question?.set === 'B') ? '#f3e8ff' : '#dcfce7',
                  color: ((quizSet && quizSet.includes('B')) || question?.set === 'B') ? '#7e22ce' : '#15803d',
                  border: ((quizSet && quizSet.includes('B')) || question?.set === 'B') ? '1px solid #d8b4fe' : '1px solid #86efac'
                }}>
                  {((quizSet && quizSet.includes('B')) || question?.set === 'B') ? '🌲 Set B (Senior)' : '🌿 Set A (Junior)'}
                </span>
              )}
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              background: '#e2e8f0',
              borderRadius: '9999px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${progressPercent}%`,
                background: 'linear-gradient(90deg, #22c55e, #16a34a)',
                borderRadius: '9999px',
                transition: 'width 0.4s ease'
              }} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {/* Dynamic Countdown Timer */}
            {timerEnabled && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                background: timeLeft <= 5 ? '#fee2e2' : '#f0fdf4',
                border: `1.5px solid ${getTimerColor()}`,
                borderRadius: '9999px',
                color: getTimerColor(),
                fontWeight: 800,
                fontSize: '14px',
                transition: 'all 0.2s ease'
              }} className={timeLeft <= 5 ? 'animate-pulse-glow' : ''}>
                <Clock size={16} />
                <span>{timeLeft}s</span>
              </div>
            )}

            {/* Current Score Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              background: '#ecfdf5',
              border: '1.5px solid #a7f3d0',
              borderRadius: '14px'
            }}>
              <Trophy size={18} color="#15803d" />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '9px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                  Score
                </div>
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '17px',
                  fontWeight: 900,
                  color: '#064e3b',
                  lineHeight: 1
                }}>
                  {currentScore}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Question Text Prompt */}
        <h2 className="question-title" style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(20px, 3vw, 28px)',
          fontWeight: 800,
          color: '#0f172a',
          textAlign: 'center',
          maxWidth: '720px',
          margin: '0 auto 30px',
          lineHeight: 1.35
        }}>
          {question.question}
        </h2>

        {/* 4 MCQ Option Cards (Grid Layout) */}
        <div className="question-options-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '12px',
          marginBottom: '32px'
        }}>
          {question.options.map((option, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(idx)}
                className="option-card-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px 18px',
                  background: isSelected ? '#dcfce7' : '#ffffff',
                  border: isSelected ? '2.5px solid #16a34a' : '2px solid #e2e8f0',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isSelected
                    ? '0 8px 20px -4px rgba(22, 163, 74, 0.3)'
                    : '0 2px 6px rgba(0, 0, 0, 0.03)',
                  transform: isSelected ? 'scale(1.02)' : 'none',
                  minHeight: '56px'
                }}
              >
                {/* Letter Badge A, B, C, D */}
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: isSelected ? '#16a34a' : '#f1f5f9',
                  color: isSelected ? '#ffffff' : '#15803d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '14px',
                  flexShrink: 0,
                  transition: 'all 0.2s'
                }}>
                  {letters[idx]}
                </div>

                {/* Option Text */}
                <span style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: isSelected ? '#064e3b' : '#334155',
                  lineHeight: 1.3
                }}>
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        {/* SUBMIT Button */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={selectedIndex === null}
            className="primary-btn question-submit-btn"
            style={{
              padding: '16px 54px',
              fontSize: '19px',
              letterSpacing: '1px',
              opacity: selectedIndex === null ? 0.45 : 1,
              cursor: selectedIndex === null ? 'not-allowed' : 'pointer'
            }}
          >
            <Send size={18} />
            <span>SUBMIT</span>
          </button>
        </div>
      </div>
    </div>
  );
}
