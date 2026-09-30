import React, { useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { Play, BookOpen, FileText, XCircle, Trophy, User, Hash, ArrowLeft, GraduationCap, Layers, CheckCircle2 } from 'lucide-react';
import { playClick } from '../../services/soundEffects';

export default function ParticipantReadyScreen({ onBeginQuiz, onBack }) {
  const { quizData } = useQuiz();
  const [name, setName] = useState('');
  const [classGrade, setClassGrade] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [selectedSet, setSelectedSet] = useState(quizData?.config?.defaultSet || 'A');
  const [error, setError] = useState('');

  const questionsPerSession = quizData?.config?.questionsPerSession || 10;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!classGrade.trim()) {
      setError('Please enter your class (e.g. Class 6 or 11)');
      return;
    }
    if (!rollNo.trim()) {
      setError('Please enter your Roll No.');
      return;
    }
    playClick();
    onBeginQuiz({
      name: name.trim(),
      classGrade: classGrade.trim(),
      rollNo: rollNo.trim(),
      selectedSet
    });
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      maxWidth: '640px',
      margin: '0 auto',
      padding: '16px'
    }}>
      <style>{`
        @media (max-width: 560px) {
          .participant-grid-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      <div className="glass-panel" style={{
        width: '100%',
        padding: '36px 32px',
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.96)',
        position: 'relative',
        border: '2px solid rgba(34, 197, 94, 0.35)'
      }}>
        {/* Back Button */}
        <button
          onClick={() => { playClick(); onBack(); }}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#475569'
          }}
          title="Back to Welcome"
        >
          <ArrowLeft size={18} />
        </button>

        {/* Central Sprout Book Icon Illustration */}
        <div style={{
          width: '84px',
          height: '84px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          color: '#16a34a',
          boxShadow: '0 8px 20px rgba(22, 163, 74, 0.2)',
          border: '3px solid #86efac'
        }} className="animate-float">
          <BookOpen size={42} />
        </div>

        {/* Heading */}
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '36px',
          fontWeight: 900,
          color: '#064e3b',
          marginBottom: '6px'
        }}>
          Ready?
        </h2>

        <p style={{
          fontSize: '15px',
          color: '#475569',
          marginBottom: '24px',
          lineHeight: 1.4
        }}>
          When you press <strong>BEGIN</strong>, your quiz starts immediately.
        </p>

        {/* Participant Registration Inputs (Name, Class, Roll No) */}
        <form onSubmit={handleSubmit} style={{ textAlign: 'left', marginBottom: '24px' }}>
          {error && (
            <div style={{
              background: '#fee2e2',
              color: '#b91c1c',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          {/* 1. Full Name */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Student Full Name *
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '14px' }} />
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(''); }}
                placeholder="e.g. Rahul Sharma"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '12px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '15px',
                  fontFamily: 'inherit',
                  outline: 'none',
                  transition: 'border 0.2s',
                  background: '#f8fafc'
                }}
                onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
              />
            </div>
          </div>

          {/* 2. Class & Roll No (Two Columns Responsive) */}
          <div className="participant-grid-row" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '18px'
          }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Class / Standard *
              </label>
              <div style={{ position: 'relative' }}>
                <GraduationCap size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '14px' }} />
                <input
                  type="text"
                  value={classGrade}
                  onChange={(e) => { setClassGrade(e.target.value); setError(''); }}
                  placeholder="e.g. Class 6 / 10"
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '15px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    transition: 'border 0.2s',
                    background: '#f8fafc'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                  onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Roll No. *
              </label>
              <div style={{ position: 'relative' }}>
                <Hash size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '14px' }} />
                <input
                  type="text"
                  value={rollNo}
                  onChange={(e) => { setRollNo(e.target.value); setError(''); }}
                  placeholder="e.g. 24 / AUP-042"
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '15px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    transition: 'border 0.2s',
                    background: '#f8fafc'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                  onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                />
              </div>
            </div>
          </div>

          {/* 3. Question Set Selection (Set A for Juniors, Set B for Seniors) */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={16} color="#16a34a" />
                <span>Select Question Set *</span>
              </label>
              <span style={{ fontSize: '11px', color: '#64748b' }}>
                Choose level before test
              </span>
            </div>

            <div className="participant-grid-row" style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px'
            }}>
              {/* Set A Card */}
              <button
                type="button"
                onClick={() => { playClick(); setSelectedSet('A'); }}
                style={{
                  padding: '12px 14px',
                  borderRadius: '14px',
                  border: selectedSet === 'A' ? '2.5px solid #16a34a' : '1.5px solid #cbd5e1',
                  background: selectedSet === 'A' ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' : '#ffffff',
                  boxShadow: selectedSet === 'A' ? '0 4px 12px rgba(22, 163, 74, 0.18)' : 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: 800,
                    color: selectedSet === 'A' ? '#15803d' : '#1e293b'
                  }}>
                    🌿 Set A (Junior)
                  </span>
                  {selectedSet === 'A' && (
                    <CheckCircle2 size={18} color="#16a34a" />
                  )}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: selectedSet === 'A' ? '#166534' : '#64748b' }}>
                  Classes 1 to 10
                </div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  50 Eco Basics Questions
                </div>
              </button>

              {/* Set B Card */}
              <button
                type="button"
                onClick={() => { playClick(); setSelectedSet('B'); }}
                style={{
                  padding: '12px 14px',
                  borderRadius: '14px',
                  border: selectedSet === 'B' ? '2.5px solid #7e22ce' : '1.5px solid #cbd5e1',
                  background: selectedSet === 'B' ? 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)' : '#ffffff',
                  boxShadow: selectedSet === 'B' ? '0 4px 12px rgba(126, 34, 206, 0.18)' : 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: 800,
                    color: selectedSet === 'B' ? '#6b21a8' : '#1e293b'
                  }}>
                    🌲 Set B (Senior)
                  </span>
                  {selectedSet === 'B' && (
                    <CheckCircle2 size={18} color="#7e22ce" />
                  )}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: selectedSet === 'B' ? '#7e22ce' : '#64748b' }}>
                  Class 11, 12 & College
                </div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  50 Ecology & Science Questions
                </div>
              </button>
            </div>
          </div>

          {/* Mini Rule Summary Badges */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '14px',
            padding: '12px 8px',
            textAlign: 'center',
            marginBottom: '24px'
          }}>
            <div>
              <FileText size={18} color="#16a34a" style={{ margin: '0 auto 4px' }} />
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#064e3b' }}>{questionsPerSession} Qs</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>To Win</div>
            </div>
            <div>
              <XCircle size={18} color="#ef4444" style={{ margin: '0 auto 4px' }} />
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#991b1b' }}>1 Mistake</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Game Over</div>
            </div>
            <div>
              <Trophy size={18} color="#eab308" style={{ margin: '0 auto 4px' }} />
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#854d0e' }}>
                {quizData?.config?.timerEnabled ? `${quizData?.config?.timerSeconds}s` : 'No Timer'}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Per Question</div>
            </div>
          </div>

          {/* BEGIN CTA Button */}
          <button
            type="submit"
            className="primary-btn"
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '20px',
              letterSpacing: '1px'
            }}
          >
            <Play size={22} fill="currentColor" />
            <span>BEGIN</span>
          </button>
        </form>
      </div>
    </div>
  );
}
