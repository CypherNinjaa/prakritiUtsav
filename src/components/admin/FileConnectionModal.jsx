import React, { useRef } from 'react';
import { useQuiz } from '../../context/QuizContext';
import {
  FolderOpen,
  FilePlus2,
  Download,
  Upload,
  HardDrive,
  CheckCircle,
  X,
  AlertTriangle,
  Info
} from 'lucide-react';

export default function FileConnectionModal({ isOpen, onClose }) {
  const {
    quizData,
    fileState,
    connectFile,
    createFile,
    exportJSON,
    importJSON,
    disconnectFile
  } = useQuiz();

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      importJSON(file);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(2, 44, 34, 0.65)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '560px',
        padding: '32px',
        position: 'relative',
        background: '#ffffff',
        border: '2px solid #86efac'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748b'
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: '#dcfce7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#16a34a'
          }}>
            <HardDrive size={24} />
          </div>
          <div>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '22px',
              fontWeight: 800,
              color: '#0f172a'
            }}>
              Local JSON Data Engine
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b' }}>
              Connect, create, or export your quiz database directly from local disk.
            </p>
          </div>
        </div>

        {/* Active File Banner */}
        <div style={{
          background: fileState.fileName ? '#f0fdf4' : '#fffbeb',
          border: `1.5px solid ${fileState.fileName ? '#86efac' : '#fde68a'}`,
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {fileState.fileName ? (
                <CheckCircle size={20} color="#16a34a" />
              ) : (
                <Info size={20} color="#d97706" />
              )}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                  Current Active Source
                </div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                  {fileState.fileName ? fileState.fileName : 'Bundled Default Dataset'}
                </div>
              </div>
            </div>

            {fileState.fileName && (
              <button
                onClick={disconnectFile}
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#dc2626',
                  background: '#fee2e2',
                  border: 'none',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Disconnect
              </button>
            )}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            marginTop: '14px',
            paddingTop: '12px',
            borderTop: '1px solid rgba(0,0,0,0.06)',
            fontSize: '12px'
          }}>
            <div>
              <span style={{ color: '#64748b' }}>Questions: </span>
              <strong>{quizData?.questions?.length || 0}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>Participants: </span>
              <strong>{quizData?.participants?.length || 0}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>Timer: </span>
              <strong>{quizData?.config?.timerEnabled ? `${quizData?.config?.timerSeconds}s` : 'OFF'}</strong>
            </div>
          </div>
        </div>

        {/* Primary Actions (Native File System Access API) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          <button
            onClick={connectFile}
            className="primary-btn"
            style={{ width: '100%', padding: '14px', fontSize: '15px' }}
          >
            <FolderOpen size={18} />
            Connect Existing JSON File
          </button>

          <button
            onClick={createFile}
            className="secondary-btn"
            style={{ width: '100%', padding: '14px', fontSize: '15px' }}
          >
            <FilePlus2 size={18} />
            Create New Quiz Data File
          </button>
        </div>

        {/* Universal Fallback Options */}
        <div style={{
          paddingTop: '16px',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <button
            onClick={() => exportJSON()}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px',
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer'
            }}
          >
            <Download size={16} />
            Backup / Download JSON
          </button>

          <input
            type="file"
            ref={fileInputRef}
            accept=".json"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px',
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer'
            }}
          >
            <Upload size={16} />
            Upload JSON File
          </button>
        </div>

        <div style={{ marginTop: '16px', fontSize: '11px', color: '#94a3b8', textAlign: 'center' }}>
          💡 When connected, all new participant scores and question changes auto-sync to your local JSON file!
        </div>
      </div>
    </div>
  );
}
