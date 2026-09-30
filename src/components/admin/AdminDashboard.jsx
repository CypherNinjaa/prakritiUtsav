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
    set: 'A',
    explanation: ''
  });

  // Settings local state
  const [settingsForm, setSettingsForm] = useState({
    timerEnabled: quizData?.config?.timerEnabled ?? true,
    timerSeconds: quizData?.config?.timerSeconds ?? 20,
    questionsPerSession: quizData?.config?.questionsPerSession ?? 10,
    defaultSet: quizData?.config?.defaultSet ?? 'A',
    adminPin: quizData?.config?.adminPin ?? '1234'
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Participant search, filters, and sorting
  const [participantSearch, setParticipantSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'completed' | 'eliminated'
  const [scoreFilter, setScoreFilter] = useState('all'); // 'all' | 'ge5' | 'ge8'
  const [setFilter, setSetFilter] = useState('all'); // 'all' | 'A' | 'B'
  const [sortBy, setSortBy] = useState('score_desc'); // 'score_desc' | 'recent' | 'name'

  // Question bank set filter
  const [questionBankSetFilter, setQuestionBankSetFilter] = useState('all'); // 'all' | 'A' | 'B'

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

    const headers = ['Rank', 'Student Name', 'Class', 'Roll Number', 'Quiz Set', 'Score', 'Total Questions', 'Status', 'Date Time'];
    const rows = filteredParticipants.map((p, idx) => [
      idx + 1,
      `"${p.name || ''}"`,
      `"${p.classGrade || ''}"`,
      `"${p.rollNo || ''}"`,
      `"${p.quizSet || ((p.selectedSet === 'B' || p.quizSet?.includes('B')) ? 'Set B (Senior)' : 'Set A (Junior)')}"`,
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
      set: 'A',
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
      set: q.set || 'A',
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

  // Filtered Questions by search and set
  const filteredQuestions = (quizData?.questions || []).filter(q => {
    const term = questionSearch.toLowerCase();
    const matchesSearch =
      (q.question || '').toLowerCase().includes(term) ||
      (q.options || []).some(opt => (opt || '').toLowerCase().includes(term));
    if (!matchesSearch) return false;

    if (questionBankSetFilter === 'A') {
      return (q.set || 'A') === 'A';
    }
    if (questionBankSetFilter === 'B') {
      return q.set === 'B';
    }
    return true;
  });

  const completedCount = participants.filter(p => p.completed).length;
  const eliminatedCount = participants.filter(p => !p.completed).length;

  // Filtered & Sorted Participants (Name, Class, Roll No, Set)
  const filteredParticipants = participants
    .filter(p => {
      // Text search by name, class, or roll number
      const term = participantSearch.toLowerCase();
      const matchesSearch =
        (p.name || '').toLowerCase().includes(term) ||
        (p.classGrade || '').toLowerCase().includes(term) ||
        (p.rollNo || '').toLowerCase().includes(term);
      if (!matchesSearch) return false;

      // Status filter
      if (statusFilter === 'completed' && !p.completed) return false;
      if (statusFilter === 'eliminated' && p.completed) return false;

      // Score filter
      if (scoreFilter === 'ge5' && (p.score || 0) < 5) return false;
      if (scoreFilter === 'ge8' && (p.score || 0) < 8) return false;

      // Set filter
      if (setFilter === 'A') {
        const isSetB = p.selectedSet === 'B' || p.quizSet?.includes('B');
        if (isSetB) return false;
      }
      if (setFilter === 'B') {
        const isSetB = p.selectedSet === 'B' || p.quizSet?.includes('B');
        if (!isSetB) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'score_desc') {
        return (b.score || 0) - (a.score || 0);
      }
      if (sortBy === 'recent') {
        return new Date(b.timestamp || 0) - new Date(a.timestamp || 0);
      }
      if (sortBy === 'name') {
        return (a.name || '').localeCompare(b.name || '');
      }
      return 0;
    });

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
      padding: '12px'
    }}>
      <style>{`
        @media (max-width: 680px) {
          .admin-modal-card {
            width: 100% !important;
            height: 96vh !important;
            border-radius: 18px !important;
          }
          .admin-top-bar {
            padding: 10px 14px !important;
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 10px !important;
          }
          .admin-top-actions {
            justify-content: space-between !important;
            width: 100% !important;
          }
          .admin-tab-bar {
            padding: 0 8px !important;
            overflow-x: auto !important;
            white-space: nowrap !important;
            -webkit-overflow-scrolling: touch !important;
          }
          .admin-tab-btn {
            padding: 10px 12px !important;
            font-size: 13px !important;
            flex-shrink: 0 !important;
          }
          .admin-tab-body {
            padding: 12px 10px !important;
          }
          .admin-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 8px !important;
            margin-bottom: 16px !important;
          }
          .admin-stats-grid > div {
            padding: 12px !important;
          }
          .admin-filter-bar {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 10px !important;
          }
          .admin-filter-pills {
            overflow-x: auto !important;
            padding-bottom: 4px !important;
            width: 100% !important;
          }
          .question-action-bar {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .question-add-btn {
            width: 100% !important;
            justify-content: center !important;
          }
        }
      `}</style>
      <div className="glass-panel admin-modal-card" style={{
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
        <div className="admin-top-bar" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 22px',
          borderBottom: '1.5px solid #e2e8f0',
          background: '#f8fafc',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: '#002b49',
              color: '#facc15',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Shield size={22} />
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(17px, 3vw, 20px)', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                Coordinator & Analytics Hub
              </h2>
              <div style={{ fontSize: '11px', color: '#64748b' }}>
                Active File: <strong style={{ color: '#15803d' }}>{fileState.fileName || 'Default Dataset'}</strong>
              </div>
            </div>
          </div>

          <div className="admin-top-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => { playClick(); onOpenFileHub(); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 12px',
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
              style={{ padding: '7px 14px', fontSize: '12px' }}
            >
              <ArrowLeft size={15} />
              <span>home</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="admin-tab-bar" style={{
          display: 'flex',
          borderBottom: '1px solid #e2e8f0',
          padding: '0 20px',
          background: '#ffffff'
        }}>
          <button
            onClick={() => { playClick(); setActiveTab('leaderboard'); }}
            className="admin-tab-btn"
            style={{
              padding: '12px 18px',
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
            className="admin-tab-btn"
            style={{
              padding: '12px 18px',
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
            className="admin-tab-btn"
            style={{
              padding: '12px 18px',
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
        <div className="admin-tab-body" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {/* TAB 1: LEADERBOARD & METRICS */}
          {activeTab === 'leaderboard' && (
            <div>
              {/* Stat Summary Cards */}
              <div className="admin-stats-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '12px',
                marginBottom: '20px'
              }}>
                <div style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: '14px', padding: '14px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#166534', textTransform: 'uppercase' }}>Total Attempts</div>
                  <div style={{ fontSize: '26px', fontWeight: 900, color: '#064e3b', fontFamily: 'var(--font-heading)' }}>{totalParticipants}</div>
                </div>
                <div style={{ background: '#f0f9ff', border: '1.5px solid #bae6fd', borderRadius: '14px', padding: '14px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#0369a1', textTransform: 'uppercase' }}>Average Score</div>
                  <div style={{ fontSize: '26px', fontWeight: 900, color: '#0c4a6e', fontFamily: 'var(--font-heading)' }}>{avgScore}</div>
                </div>
                <div style={{ background: '#fefce8', border: '1.5px solid #fef08a', borderRadius: '14px', padding: '14px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#854d0e', textTransform: 'uppercase' }}>Top Score</div>
                  <div style={{ fontSize: '26px', fontWeight: 900, color: '#713f12', fontFamily: 'var(--font-heading)' }}>{topScore}</div>
                </div>
                <div style={{ background: '#faf5ff', border: '1.5px solid #e9d5ff', borderRadius: '14px', padding: '14px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#7e22ce', textTransform: 'uppercase' }}>Completion Rate</div>
                  <div style={{ fontSize: '26px', fontWeight: 900, color: '#581c87', fontFamily: 'var(--font-heading)' }}>{passRate}%</div>
                </div>
              </div>

              {/* Controls: Search + Filter Pills + Sorting + CSV Export */}
              <div className="admin-filter-bar" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                    <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <input
                      type="text"
                      value={participantSearch}
                      onChange={(e) => setParticipantSearch(e.target.value)}
                      placeholder="Search by student name, class, or roll no..."
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
                      padding: '10px 16px',
                      background: '#15803d',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  >
                    <Download size={16} />
                    <span>Export CSV</span>
                  </button>
                </div>

                {/* Filter Pills and Sort Bar */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  flexWrap: 'wrap',
                  background: '#f8fafc',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  {/* Status Filter Buttons */}
                  <div className="admin-filter-pills" style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569', marginRight: '2px' }}>
                      Status:
                    </span>
                    <button
                      type="button"
                      onClick={() => setStatusFilter('all')}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        background: statusFilter === 'all' ? '#15803d' : '#ffffff',
                        color: statusFilter === 'all' ? '#ffffff' : '#475569',
                        boxShadow: statusFilter === 'all' ? '0 2px 6px rgba(21, 128, 61, 0.3)' : '0 1px 2px rgba(0,0,0,0.06)'
                      }}
                    >
                      All ({participants.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatusFilter('completed')}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        background: statusFilter === 'completed' ? '#166534' : '#ffffff',
                        color: statusFilter === 'completed' ? '#ffffff' : '#166534',
                        boxShadow: statusFilter === 'completed' ? '0 2px 6px rgba(22, 101, 52, 0.3)' : '0 1px 2px rgba(0,0,0,0.06)'
                      }}
                    >
                      🏆 Completed ({completedCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatusFilter('eliminated')}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        background: statusFilter === 'eliminated' ? '#dc2626' : '#ffffff',
                        color: statusFilter === 'eliminated' ? '#ffffff' : '#991b1b',
                        boxShadow: statusFilter === 'eliminated' ? '0 2px 6px rgba(220, 38, 38, 0.3)' : '0 1px 2px rgba(0,0,0,0.06)'
                      }}
                    >
                      Eliminated ({eliminatedCount})
                    </button>
                  </div>

                  {/* Set Filter Buttons */}
                  <div className="admin-filter-pills" style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569', marginRight: '2px' }}>
                      Set:
                    </span>
                    <button
                      type="button"
                      onClick={() => setSetFilter('all')}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        background: setFilter === 'all' ? '#15803d' : '#ffffff',
                        color: setFilter === 'all' ? '#ffffff' : '#475569',
                        boxShadow: setFilter === 'all' ? '0 2px 6px rgba(21, 128, 61, 0.3)' : '0 1px 2px rgba(0,0,0,0.06)'
                      }}
                    >
                      All Sets
                    </button>
                    <button
                      type="button"
                      onClick={() => setSetFilter('A')}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        background: setFilter === 'A' ? '#166534' : '#ffffff',
                        color: setFilter === 'A' ? '#ffffff' : '#166534',
                        boxShadow: setFilter === 'A' ? '0 2px 6px rgba(22, 101, 52, 0.3)' : '0 1px 2px rgba(0,0,0,0.06)'
                      }}
                    >
                      🌿 Set A (Junior)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSetFilter('B')}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        background: setFilter === 'B' ? '#7e22ce' : '#ffffff',
                        color: setFilter === 'B' ? '#ffffff' : '#7e22ce',
                        boxShadow: setFilter === 'B' ? '0 2px 6px rgba(126, 34, 206, 0.3)' : '0 1px 2px rgba(0,0,0,0.06)'
                      }}
                    >
                      🌲 Set B (Senior)
                    </button>
                  </div>

                  {/* Score & Sort Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Score:</span>
                      <select
                        value={scoreFilter}
                        onChange={(e) => setScoreFilter(e.target.value)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '11px',
                          fontWeight: 700,
                          background: '#ffffff',
                          color: '#334155',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="all">All Scores</option>
                        <option value="ge5">Score ≥ 5</option>
                        <option value="ge8">Score ≥ 8</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Sort:</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '11px',
                          fontWeight: 700,
                          background: '#ffffff',
                          color: '#334155',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="score_desc">🏆 Highest Score</option>
                        <option value="recent">⏱ Most Recent</option>
                        <option value="name">🔤 Name</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Leaderboard Table (Responsive scroll with Name, Class, Roll No) */}
              <div className="table-responsive" style={{ border: '1px solid #e2e8f0', borderRadius: '14px', overflowX: 'auto', width: '100%' }}>
                <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <tr>
                      <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569' }}>Rank</th>
                      <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569' }}>Student Name</th>
                      <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569' }}>Class</th>
                      <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569' }}>Roll No</th>
                      <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569' }}>Quiz Set</th>
                      <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569' }}>Score</th>
                      <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569' }}>Status</th>
                      <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569' }}>Date Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredParticipants.length === 0 ? (
                      <tr>
                        <td colSpan={8} style={{ padding: '36px', textAlign: 'center', color: '#94a3b8' }}>
                          No participant attempts found matching your filter.
                        </td>
                      </tr>
                    ) : (
                      filteredParticipants.map((p, idx) => (
                        <tr key={`${p.id || 'run'}-${idx}`} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px 14px', fontWeight: 800, color: '#16a34a' }}>#{idx + 1}</td>
                          <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>{p.name}</td>
                          <td style={{ padding: '12px 14px', color: '#15803d', fontWeight: 700 }}>{p.classGrade || '—'}</td>
                          <td style={{ padding: '12px 14px', color: '#475569' }}>{p.rollNo}</td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 800,
                              background: (p.selectedSet === 'B' || p.quizSet?.includes('B')) ? '#f3e8ff' : '#dcfce7',
                              color: (p.selectedSet === 'B' || p.quizSet?.includes('B')) ? '#6b21a8' : '#166534'
                            }}>
                              {(p.selectedSet === 'B' || p.quizSet?.includes('B')) ? '🌲 Set B (Senior)' : '🌿 Set A (Junior)'}
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px', fontWeight: 900, color: '#064e3b' }}>{p.score}</td>
                          <td style={{ padding: '12px 14px' }}>
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
                          <td style={{ padding: '12px 14px', color: '#94a3b8', fontSize: '11px' }}>
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
              {/* Question Header: Set Filter Tabs + Search & Add Trigger */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#475569' }}>Filter by Set:</span>
                  <button
                    type="button"
                    onClick={() => { playClick(); setQuestionBankSetFilter('all'); }}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      background: questionBankSetFilter === 'all' ? '#15803d' : '#f1f5f9',
                      color: questionBankSetFilter === 'all' ? '#ffffff' : '#475569',
                      boxShadow: questionBankSetFilter === 'all' ? '0 2px 6px rgba(21, 128, 61, 0.3)' : 'none'
                    }}
                  >
                    All Questions ({quizData?.questions?.length || 0})
                  </button>
                  <button
                    type="button"
                    onClick={() => { playClick(); setQuestionBankSetFilter('A'); }}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      background: questionBankSetFilter === 'A' ? '#166534' : '#f1f5f9',
                      color: questionBankSetFilter === 'A' ? '#ffffff' : '#166534',
                      boxShadow: questionBankSetFilter === 'A' ? '0 2px 6px rgba(22, 101, 52, 0.3)' : 'none'
                    }}
                  >
                    🌿 Set A — Junior ({quizData?.questions?.filter(q => (q.set || 'A') === 'A').length || 0})
                  </button>
                  <button
                    type="button"
                    onClick={() => { playClick(); setQuestionBankSetFilter('B'); }}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      background: questionBankSetFilter === 'B' ? '#7e22ce' : '#f1f5f9',
                      color: questionBankSetFilter === 'B' ? '#ffffff' : '#7e22ce',
                      boxShadow: questionBankSetFilter === 'B' ? '0 2px 6px rgba(126, 34, 206, 0.3)' : 'none'
                    }}
                  >
                    🌲 Set B — Senior ({quizData?.questions?.filter(q => q.set === 'B').length || 0})
                  </button>
                </div>

                <div className="question-action-bar" style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                    <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <input
                      type="text"
                      value={questionSearch}
                      onChange={(e) => setQuestionSearch(e.target.value)}
                      placeholder="Search question bank or options..."
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
                      setNewQuestionForm({
                        question: '',
                        options: ['', '', '', ''],
                        correctIndex: 0,
                        set: questionBankSetFilter === 'B' ? 'B' : 'A',
                        explanation: ''
                      });
                      setIsAddingQuestion(!isAddingQuestion);
                    }}
                    className="primary-btn question-add-btn"
                    style={{ padding: '10px 20px', fontSize: '14px' }}
                  >
                    <Plus size={16} />
                    <span>{isAddingQuestion ? 'Cancel' : 'Add New Question'}</span>
                  </button>
                </div>
              </div>

              {/* Add / Edit Question Form Modal */}
              {isAddingQuestion && (
                <form onSubmit={handleSaveQuestion} style={{
                  background: '#f8fafc',
                  border: '2px solid #86efac',
                  borderRadius: '16px',
                  padding: '20px 16px',
                  marginBottom: '24px'
                }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#064e3b', marginBottom: '16px' }}>
                    {editingQuestionId ? 'Edit Question' : 'Create New MCQ Question'}
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        Question Set *
                      </label>
                      <select
                        value={newQuestionForm.set || 'A'}
                        onChange={(e) => setNewQuestionForm({ ...newQuestionForm, set: e.target.value })}
                        style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '14px', background: '#ffffff', outline: 'none' }}
                      >
                        <option value="A">🌿 Set A — Junior (Classes 1 to 10)</option>
                        <option value="B">🌲 Set B — Senior (Classes 11, 12 & College)</option>
                      </select>
                    </div>
                  </div>

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

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '14px' }}>
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 800,
                          background: q.set === 'B' ? '#f3e8ff' : '#dcfce7',
                          color: q.set === 'B' ? '#7e22ce' : '#166534',
                          border: q.set === 'B' ? '1px solid #d8b4fe' : '1px solid #86efac'
                        }}>
                          {q.set === 'B' ? '🌲 Set B (Senior)' : '🌿 Set A (Junior)'}
                        </span>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                          #{idx + 1}. {q.question}
                        </div>
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
                    Default Question Set for Participants
                  </label>
                  <select
                    value={settingsForm.defaultSet || 'A'}
                    onChange={(e) => setSettingsForm({ ...settingsForm, defaultSet: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '14px', outline: 'none', background: '#ffffff' }}
                  >
                    <option value="A">🌿 Set A — Junior (Classes 1 to 10)</option>
                    <option value="B">🌲 Set B — Senior (Classes 11, 12 & College)</option>
                  </select>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                    Pre-selected set on the student start screen. Can be toggled before beginning the quiz.
                  </div>
                </div>

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
                    Total available questions in bank: {quizData?.questions?.length || 0} (50 in Set A, 50 in Set B)
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
