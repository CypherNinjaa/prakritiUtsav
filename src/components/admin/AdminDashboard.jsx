import React, { useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import {
  Shield,
  Trophy,
  BookOpen,
  Settings,
  HardDrive,
  Download,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Clock,
  Key,
  Users,
  Award,
  Search,
  ArrowLeft,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { playClick } from '../../services/soundEffects';

export default function AdminDashboard({ onClose, onOpenFileHub }) {
  const {
    quizData,
    fileState,
    updateConfig,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    exportJSON
  } = useQuiz();

  const [pinInput, setPinInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinError, setPinError] = useState('');
  const [activeTab, setActiveTab] = useState('leaderboard'); // 'leaderboard' | 'questions' | 'settings'

  // Question editing/adding state
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [questionSearch, setQuestionSearch] = useState('');
  const [newQuestionForm, setNewQuestionForm] = useState({
    question: '',
    options: ['', '', '', ''],
    correctIndex: 0,
    explanation: ''
  });

  // Settings local state
  const [settingsForm, setSettingsForm] = useState({
    timerEnabled: quizData?.config?.timerEnabled ?? true,
    timerSeconds: quizData?.config?.timerSeconds ?? 20,
    questionsPerSession: quizData?.config?.questionsPerSession ?? 10,
    adminPin: quizData?.config?.adminPin ?? '1234'
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Participant search
  const [participantSearch, setParticipantSearch] = useState('');

  // Handle PIN verification
  const handleVerifyPin = (e) => {
    e.preventDefault();
    const correctPin = quizData?.config?.adminPin || '1234';
    if (pinInput === correctPin) {
      playClick();
      setIsUnlocked(true);
      setPinError('');
    } else {
      setPinError('Incorrect PIN. Please try again.');
    }
  };

  // Export Leaderboard to CSV
  const exportLeaderboardCSV = () => {
    playClick();
    const participants = quizData?.participants || [];
    if (participants.length === 0) {
      alert('No participant records to export yet.');
      return;
    }

    const headers = ['Rank', 'Name', 'Roll Number', 'Department', 'Score', 'Total Questions', 'Status', 'Date Time'];
    const rows = participants.map((p, idx) => [
      idx + 1,
      `"${p.name || ''}"`,
      `"${p.rollNo || ''}"`,
      `"${p.department || ''}"`,
      p.score || 0,
      p.totalQuestions || 0,
      p.completed ? 'Completed' : 'Eliminated',
      `"${p.timestamp ? new Date(p.timestamp).toLocaleString() : ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prakriti_utsav_leaderboard_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Save Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    playClick();
    await updateConfig(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  // Save New or Edited Question
  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestionForm.question.trim()) return;
    if (newQuestionForm.options.some(opt => !opt.trim())) {
      alert('Please fill out all 4 options.');
      return;
    }

    playClick();
    if (editingQuestionId) {
      await updateQuestion(editingQuestionId, newQuestionForm);
    } else {
      await addQuestion(newQuestionForm);
    }

    setIsAddingQuestion(false);
    setEditingQuestionId(null);
    setNewQuestionForm({
      question: '',
      options: ['', '', '', ''],
      correctIndex: 0,
      explanation: ''
    });
  };

  // Edit Question Click
  const startEditQuestion = (q) => {
    playClick();
    setEditingQuestionId(q.id);
    setNewQuestionForm({
      question: q.question,
      options: [...q.options],
      correctIndex: q.correctIndex,
      explanation: q.explanation || ''
    });
    setIsAddingQuestion(true);
  };

  // Delete Question Click
  const handleDeleteQuestion = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      playClick();
      await deleteQuestion(id);
    }
  };

  // PIN Gatekeeper Modal
  if (!isUnlocked) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(2, 44, 34, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '20px'
      }}>
        <div className="glass-panel" style={{
          width: '100%',
          maxWidth: '420px',
          padding: '36px',
          textAlign: 'center',
          background: '#ffffff',
          position: 'relative',
          border: '2px solid #86efac'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={16} color="#64748b" />
          </button>

          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: '#ecfdf5',
            color: '#16a34a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            border: '2px solid #a7f3d0'
          }}>
            <Shield size={32} />
          </div>

          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            Coordinator Dashboard
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>
            Enter your Admin PIN to manage questions, timer rules, and analytics.
          </p>

          <form onSubmit={handleVerifyPin}>
            {pinError && (
              <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, marginBottom: '16px' }}>
                {pinError}
              </div>
            )}

            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <Key size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '14px' }} />
              <input
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Default PIN: 1234"
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '12px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '16px',
                  outline: 'none',
                  textAlign: 'center',
                  letterSpacing: '4px',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <button
              type="submit"
              className="primary-btn"
              style={{ width: '100%', padding: '14px', fontSize: '16px' }}
            >
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Analytics Metrics
  const participants = quizData?.participants || [];
  const totalParticipants = participants.length;
  const avgScore = totalParticipants > 0
    ? (participants.reduce((acc, p) => acc + (p.score || 0), 0) / totalParticipants).toFixed(1)
    : 0;
  const topScore = totalParticipants > 0
    ? Math.max(...participants.map(p => p.score || 0))
    : 0;
  const passRate = totalParticipants > 0
    ? Math.round((participants.filter(p => p.completed).length / totalParticipants) * 100)
    : 0;

  // Filtered Questions
  const filteredQuestions = (quizData?.questions || []).filter(q =>
    q.question.toLowerCase().includes(questionSearch.toLowerCase())
  );

  // Filtered Participants
  const filteredParticipants = participants.filter(p =>
    (p.name || '').toLowerCase().includes(participantSearch.toLowerCase()) ||
    (p.rollNo || '').toLowerCase().includes(participantSearch.toLowerCase()) ||
    (p.department || '').toLowerCase().includes(participantSearch.toLowerCase())
  );

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(2, 44, 34, 0.75)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '16px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '1060px',
        height: '92vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#ffffff',
        overflow: 'hidden',
        border: '2px solid #86efac'
      }}>
        {/* Dashboard Top Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 24px',
          borderBottom: '1.5px solid #e2e8f0',
          background: '#f8fafc'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: '#002b49',
              color: '#facc15',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Shield size={24} />
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
                Coordinator & Analytics Hub
              </h2>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Active File: <strong style={{ color: '#15803d' }}>{fileState.fileName || 'Default Dataset'}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => { playClick(); onOpenFileHub(); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                fontSize: '12px',
                fontWeight: 700,
                background: '#f0fdf4',
                color: '#15803d',
                border: '1.5px solid #86efac',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <HardDrive size={14} />
              <span>Connect JSON</span>
            </button>

            <button
              onClick={() => { playClick(); onClose(); }}
              className="primary-btn"
              style={{ padding: '8px 16px', fontSize: '13px' }}
            >
              <ArrowLeft size={16} />
              <span>Back to Kiosk</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e2e8f0',
          padding: '0 24px',
          background: '#ffffff'
        }}>
          <button
            onClick={() => { playClick(); setActiveTab('leaderboard'); }}
            style={{
              padding: '14px 20px',
              fontSize: '14px',
              fontWeight: 800,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: activeTab === 'leaderboard' ? '#15803d' : '#64748b',
              borderBottom: activeTab === 'leaderboard' ? '3px solid #16a34a' : '3px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Trophy size={16} />
            <span>Leaderboard & Analytics</span>
          </button>

          <button
            onClick={() => { playClick(); setActiveTab('questions'); }}
            style={{
              padding: '14px 20px',
              fontSize: '14px',
              fontWeight: 800,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: activeTab === 'questions' ? '#15803d' : '#64748b',
              borderBottom: activeTab === 'questions' ? '3px solid #16a34a' : '3px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <BookOpen size={16} />
            <span>Question Bank ({quizData?.questions?.length || 0})</span>
          </button>

          <button
            onClick={() => { playClick(); setActiveTab('settings'); }}
            style={{
              padding: '14px 20px',
              fontSize: '14px',
              fontWeight: 800,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: activeTab === 'settings' ? '#15803d' : '#64748b',
              borderBottom: activeTab === 'settings' ? '3px solid #16a34a' : '3px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Settings size={16} />
            <span>Game Rules & Timer</span>
          </button>
        </div>

        {/* Tab Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {/* TAB 1: LEADERBOARD & METRICS */}
          {activeTab === 'leaderboard' && (
            <div>
              {/* Stat Summary Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '24px'
              }}>
                <div style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: '16px', padding: '16px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#166534', textTransform: 'uppercase' }}>Total Attempts</div>
                  <div style={{ fontSize: '28px', fontWeight: 900, color: '#064e3b', fontFamily: 'var(--font-heading)' }}>{totalParticipants}</div>
                </div>
                <div style={{ background: '#f0f9ff', border: '1.5px solid #bae6fd', borderRadius: '16px', padding: '16px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#0369a1', textTransform: 'uppercase' }}>Average Score</div>
                  <div style={{ fontSize: '28px', fontWeight: 900, color: '#0c4a6e', fontFamily: 'var(--font-heading)' }}>{avgScore}</div>
                </div>
                <div style={{ background: '#fefce8', border: '1.5px solid #fef08a', borderRadius: '16px', padding: '16px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#854d0e', textTransform: 'uppercase' }}>Top Score</div>
                  <div style={{ fontSize: '28px', fontWeight: 900, color: '#713f12', fontFamily: 'var(--font-heading)' }}>{topScore}</div>
                </div>
                <div style={{ background: '#faf5ff', border: '1.5px solid #e9d5ff', borderRadius: '16px', padding: '16px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#7e22ce', textTransform: 'uppercase' }}>Completion Rate</div>
                  <div style={{ fontSize: '28px', fontWeight: 900, color: '#581c87', fontFamily: 'var(--font-heading)' }}>{passRate}%</div>
                </div>
              </div>

              {/* Controls: Search + CSV Export */}
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                  <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <input
                    type="text"
                    value={participantSearch}
                    onChange={(e) => setParticipantSearch(e.target.value)}
                    placeholder="Search by name, roll no, or department..."
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 36px',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                <button
                  onClick={exportLeaderboardCSV}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    background: '#15803d',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Download size={16} />
                  <span>Export CSV</span>
                </button>
              </div>

              {/* Leaderboard Table */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <tr>
                      <th style={{ padding: '12px 16px', fontWeight: 800, color: '#475569' }}>Rank</th>
                      <th style={{ padding: '12px 16px', fontWeight: 800, color: '#475569' }}>Name</th>
                      <th style={{ padding: '12px 16px', fontWeight: 800, color: '#475569' }}>Roll No</th>
                      <th style={{ padding: '12px 16px', fontWeight: 800, color: '#475569' }}>Dept</th>
                      <th style={{ padding: '12px 16px', fontWeight: 800, color: '#475569' }}>Score</th>
                      <th style={{ padding: '12px 16px', fontWeight: 800, color: '#475569' }}>Status</th>
                      <th style={{ padding: '12px 16px', fontWeight: 800, color: '#475569' }}>Date Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredParticipants.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ padding: '36px', textAlign: 'center', color: '#94a3b8' }}>
                          No participant attempts recorded yet.
                        </td>
                      </tr>
                    ) : (
                      filteredParticipants.map((p, idx) => (
                        <tr key={`${p.id || 'run'}-${idx}`} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px 16px', fontWeight: 800, color: '#16a34a' }}>#{idx + 1}</td>
                          <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0f172a' }}>{p.name}</td>
                          <td style={{ padding: '12px 16px', color: '#475569' }}>{p.rollNo}</td>
                          <td style={{ padding: '12px 16px', color: '#475569' }}>{p.department}</td>
                          <td style={{ padding: '12px 16px', fontWeight: 900, color: '#064e3b' }}>{p.score}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 700,
                              background: p.completed ? '#dcfce7' : '#fee2e2',
                              color: p.completed ? '#166534' : '#991b1b'
                            }}>
                              {p.completed ? 'Completed' : 'Eliminated'}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '11px' }}>
                            {p.timestamp ? new Date(p.timestamp).toLocaleTimeString() : 'N/A'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: QUESTION BANK MANAGER */}
          {activeTab === 'questions' && (
            <div>
              {/* Question Header & Add Trigger */}
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                  <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <input
                    type="text"
                    value={questionSearch}
                    onChange={(e) => setQuestionSearch(e.target.value)}
                    placeholder="Search question bank..."
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 36px',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                <button
                  onClick={() => {
                    playClick();
                    setEditingQuestionId(null);
                    setNewQuestionForm({ question: '', options: ['', '', '', ''], correctIndex: 0, explanation: '' });
                    setIsAddingQuestion(!isAddingQuestion);
                  }}
                  className="primary-btn"
                  style={{ padding: '10px 20px', fontSize: '14px' }}
                >
                  <Plus size={16} />
                  <span>{isAddingQuestion ? 'Cancel' : 'Add New Question'}</span>
                </button>
              </div>

              {/* Add / Edit Question Form Modal */}
              {isAddingQuestion && (
                <form onSubmit={handleSaveQuestion} style={{
                  background: '#f8fafc',
                  border: '2px solid #86efac',
                  borderRadius: '16px',
                  padding: '24px',
                  marginBottom: '24px'
                }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#064e3b', marginBottom: '16px' }}>
                    {editingQuestionId ? 'Edit Question' : 'Create New MCQ Question'}
                  </h3>

                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Question Text *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={newQuestionForm.question}
                      onChange={(e) => setNewQuestionForm({ ...newQuestionForm, question: e.target.value })}
                      placeholder="e.g. Which layer of the atmosphere contains the ozone layer?"
                      style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                    {newQuestionForm.options.map((opt, idx) => (
                      <div key={idx}>
                        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                          <span>Option {['A', 'B', 'C', 'D'][idx]} *</span>
                          <span style={{ color: newQuestionForm.correctIndex === idx ? '#16a34a' : '#64748b', cursor: 'pointer' }}
                            onClick={() => setNewQuestionForm({ ...newQuestionForm, correctIndex: idx })}>
                            <input
                              type="radio"
                              name="correctAnswer"
                              checked={newQuestionForm.correctIndex === idx}
                              onChange={() => setNewQuestionForm({ ...newQuestionForm, correctIndex: idx })}
                              style={{ marginRight: '4px' }}
                            />
                            Mark as Correct
                          </span>
                        </label>
                        <input
                          type="text"
                          required
                          value={opt}
                          onChange={(e) => {
                            const updated = [...newQuestionForm.options];
                            updated[idx] = e.target.value;
                            setNewQuestionForm({ ...newQuestionForm, options: updated });
                          }}
                          placeholder={`Option ${['A', 'B', 'C', 'D'][idx]}`}
                          style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '10px',
                            border: newQuestionForm.correctIndex === idx ? '2px solid #16a34a' : '1.5px solid #cbd5e1',
                            background: newQuestionForm.correctIndex === idx ? '#f0fdf4' : '#ffffff',
                            fontSize: '14px',
                            outline: 'none'
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Botanical / Ecological Explanation
                    </label>
                    <input
                      type="text"
                      value={newQuestionForm.explanation}
                      onChange={(e) => setNewQuestionForm({ ...newQuestionForm, explanation: e.target.value })}
                      placeholder="Brief note shown on Game Over or summary..."
                      style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="primary-btn" style={{ padding: '10px 24px', fontSize: '14px' }}>
                      <Check size={16} />
                      <span>{editingQuestionId ? 'Update Question' : 'Save Question'}</span>
                    </button>
                    <button type="button" onClick={() => setIsAddingQuestion(false)} className="secondary-btn" style={{ padding: '10px 20px', fontSize: '14px' }}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Questions List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredQuestions.map((q, idx) => (
                  <div key={q.id || idx} style={{
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '16px 20px',
                    background: '#ffffff',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '16px'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                        #{idx + 1}. {q.question}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', fontSize: '12px' }}>
                        {q.options.map((opt, optIdx) => (
                          <div key={optIdx} style={{
                            padding: '6px 10px',
                            borderRadius: '8px',
                            background: q.correctIndex === optIdx ? '#dcfce7' : '#f8fafc',
                            color: q.correctIndex === optIdx ? '#166534' : '#475569',
                            fontWeight: q.correctIndex === optIdx ? 800 : 500,
                            border: q.correctIndex === optIdx ? '1px solid #86efac' : '1px solid #e2e8f0'
                          }}>
                            {['A', 'B', 'C', 'D'][optIdx]}: {opt}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => startEditQuestion(q)}
                        style={{ padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer', color: '#0369a1' }}
                        title="Edit question"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        style={{ padding: '8px', borderRadius: '8px', border: '1px solid #fca5a5', background: '#fef2f2', cursor: 'pointer', color: '#b91c1c' }}
                        title="Delete question"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SETTINGS & DYNAMIC TIMER */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} style={{ maxWidth: '640px' }}>
              <div style={{
                background: '#f8fafc',
                border: '1.5px solid #e2e8f0',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '20px'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#064e3b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={18} color="#16a34a" />
                  <span>Countdown Timer Settings</span>
                </h3>

                {/* Timer Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                      Enable Countdown Timer
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      When ON, each question has an active timer; time out triggers sudden death.
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    checked={settingsForm.timerEnabled}
                    onChange={(e) => setSettingsForm({ ...settingsForm, timerEnabled: e.target.checked })}
                    style={{ width: '22px', height: '22px', cursor: 'pointer', accentColor: '#16a34a' }}
                  />
                </div>

                {/* Timer Duration Slider */}
                {settingsForm.timerEnabled && (
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                      <span style={{ color: '#334155' }}>Timer Duration</span>
                      <span style={{ color: '#16a34a', fontWeight: 800 }}>{settingsForm.timerSeconds} seconds</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={60}
                      step={5}
                      value={settingsForm.timerSeconds}
                      onChange={(e) => setSettingsForm({ ...settingsForm, timerSeconds: Number(e.target.value) })}
                      style={{ width: '100%', accentColor: '#16a34a' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                      <span>5s (Blitz)</span>
                      <span>20s (Recommended)</span>
                      <span>60s (Generous)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Game Rules & PIN */}
              <div style={{
                background: '#f8fafc',
                border: '1.5px solid #e2e8f0',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '24px'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#064e3b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Key size={18} color="#eab308" />
                  <span>Security & Round Rules</span>
                </h3>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Questions Per Session (to Win)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={quizData?.questions?.length || 50}
                    value={settingsForm.questionsPerSession}
                    onChange={(e) => setSettingsForm({ ...settingsForm, questionsPerSession: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                  />
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                    Total available questions in bank: {quizData?.questions?.length || 0}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Admin PIN Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={settingsForm.adminPin}
                    onChange={(e) => setSettingsForm({ ...settingsForm, adminPin: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                  />
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                    Used to unlock this coordinator dashboard.
                  </div>
                </div>
              </div>

              {/* Save Settings Button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <button
                  type="submit"
                  className="primary-btn"
                  style={{ padding: '14px 32px', fontSize: '16px' }}
                >
                  <Check size={18} />
                  <span>Save Configuration</span>
                </button>

                {settingsSaved && (
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#16a34a' }}>
                    ✓ Settings updated & saved to local JSON!
                  </span>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
