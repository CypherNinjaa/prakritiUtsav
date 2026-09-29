import React, { useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { Play, BookOpen, FileText, XCircle, Trophy, User, Hash, GraduationCap, ArrowLeft } from 'lucide-react';
import { playClick } from '../../services/soundEffects';

export default function ParticipantReadyScreen({ onBeginQuiz, onBack }) {
  const { quizData } = useQuiz();
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState('');

  const totalQuestions = quizData?.questions?.length || 50;
  const questionsPerSession = quizData?.config?.questionsPerSession || 10;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!rollNo.trim()) {
      setError('Please enter your Roll Number / Student ID');
      return;
    }
    playClick();
    onBeginQuiz({
      name: name.trim(),
      rollNo: rollNo.trim(),
      department: department.trim() || 'General'
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

        {/* Participant Registration Inputs */}
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

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Full Name *
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Roll No / ID *
              </label>
              <div style={{ position: 'relative' }}>
                <Hash size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '14px' }} />
                <input
                  type="text"
                  value={rollNo}
                  onChange={(e) => { setRollNo(e.target.value); setError(''); }}
                  placeholder="e.g. AUP/2024/042"
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    background: '#f8fafc'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                  onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Department
              </label>
              <div style={{ position: 'relative' }}>
                <GraduationCap size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '14px' }} />
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. BCA / Biotech"
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    background: '#f8fafc'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                  onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                />
              </div>
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
