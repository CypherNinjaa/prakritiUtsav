import React, { useState, useEffect } from 'react';
import { Trophy, Send, Leaf, Clock, AlertCircle } from 'lucide-react';
import { playClick, playTick } from '../../services/soundEffects';

export default function QuestionScreen({
  question,
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
      padding: '16px'
    }}>
      <div className="glass-panel" style={{
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
          gap: '16px',
          marginBottom: '28px',
          flexWrap: 'wrap'
        }}>
          {/* Progress Section */}
          <div style={{ flex: '1', minWidth: '200px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '15px',
              fontWeight: 800,
              color: '#064e3b',
              marginBottom: '8px'
            }}>
              <Leaf size={18} color="#16a34a" />
              <span>Question {questionNumber} of {totalQuestions}</span>
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

          {/* Dynamic Countdown Timer */}
          {timerEnabled && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: timeLeft <= 5 ? '#fee2e2' : '#f0fdf4',
              border: `1.5px solid ${getTimerColor()}`,
              borderRadius: '9999px',
              color: getTimerColor(),
              fontWeight: 800,
              fontSize: '15px',
              transition: 'all 0.2s ease'
            }} className={timeLeft <= 5 ? 'animate-pulse-glow' : ''}>
              <Clock size={18} />
              <span>{timeLeft}s</span>
            </div>
          )}

          {/* Current Score Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 18px',
            background: '#ecfdf5',
            border: '1.5px solid #a7f3d0',
            borderRadius: '16px'
          }}>
            <Trophy size={20} color="#15803d" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                Current Score
              </div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '20px',
                fontWeight: 900,
                color: '#064e3b',
                lineHeight: 1
              }}>
                {currentScore}
              </div>
            </div>
          </div>
        </div>

        {/* Question Text Prompt */}
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(22px, 3vw, 30px)',
          fontWeight: 800,
          color: '#0f172a',
          textAlign: 'center',
          maxWidth: '720px',
          margin: '0 auto 36px',
          lineHeight: 1.35
        }}>
          {question.question}
        </h2>

        {/* 4 MCQ Option Cards (Grid Layout) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '14px',
          marginBottom: '36px'
        }}>
          {question.options.map((option, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px 20px',
                  background: isSelected ? '#dcfce7' : '#ffffff',
                  border: isSelected ? '2.5px solid #16a34a' : '2px solid #e2e8f0',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isSelected
                    ? '0 8px 20px -4px rgba(22, 163, 74, 0.3)'
                    : '0 2px 6px rgba(0, 0, 0, 0.03)',
                  transform: isSelected ? 'scale(1.02)' : 'none'
                }}
              >
                {/* Letter Badge A, B, C, D */}
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: isSelected ? '#16a34a' : '#f1f5f9',
                  color: isSelected ? '#ffffff' : '#15803d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '15px',
                  flexShrink: 0,
                  transition: 'all 0.2s'
                }}>
                  {letters[idx]}
                </div>

                {/* Option Text */}
                <span style={{
                  fontSize: '16px',
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
            className="primary-btn"
            style={{
              padding: '16px 54px',
              fontSize: '20px',
              letterSpacing: '1px',
              opacity: selectedIndex === null ? 0.45 : 1,
              cursor: selectedIndex === null ? 'not-allowed' : 'pointer'
            }}
          >
            <Send size={20} />
            <span>SUBMIT</span>
          </button>
        </div>
      </div>
    </div>
  );
}
