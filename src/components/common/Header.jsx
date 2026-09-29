import React from 'react';
import { useQuiz } from '../../context/QuizContext';
import { HardDrive, CheckCircle2, Shield, RefreshCw, Volume2, VolumeX } from 'lucide-react';
import { isSoundMuted, toggleSoundMute } from '../../services/soundEffects';
import amityLogoWhite from '../../../amity logo/amity-aup-logo-white.png';

export default function Header({ onOpenAdmin, onOpenFileHub }) {
  const { fileState, reAuthorize } = useQuiz();
  const [muted, setMuted] = React.useState(isSoundMuted());

  const handleMuteToggle = () => {
    const newState = toggleSoundMute();
    setMuted(newState);
  };

  return (
    <header className="app-header" style={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 20px',
      position: 'relative',
      zIndex: 20,
      flexWrap: 'wrap',
      gap: '10px'
    }}>
      <style>{`
        @media (max-width: 640px) {
          .app-header {
            padding: 8px 12px !important;
          }
          .header-amity-logo {
            height: 32px !important;
          }
          .header-json-text {
            display: none !important;
          }
          .header-admin-text {
            display: none !important;
          }
          .header-controls {
            gap: 6px !important;
          }
        }
      `}</style>

      {/* Amity University Patna Logo - Only Amity Logo, No Background Color, Clean & Responsive */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'transparent',
        border: 'none',
        padding: '2px 0'
      }}>
        <img
          src={amityLogoWhite}
          alt="Amity University Patna"
          className="header-amity-logo"
          style={{
            height: '46px',
            width: 'auto',
            objectFit: 'contain',
            filter: 'drop-shadow(0 2px 8px rgba(0, 43, 73, 0.5))',
            transition: 'height 0.2s ease'
          }}
        />
      </div>

      {/* Action Controls & File Status Indicator */}
      <div className="header-controls" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Sound Toggle */}
        <button
          onClick={handleMuteToggle}
          title={muted ? 'Unmute Sound' : 'Mute Sound'}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.92)',
            border: '1.5px solid #cbd5e1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: muted ? '#94a3b8' : '#15803d',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
          }}
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        {/* Re-authorize Prompt if needed */}
        {fileState.needsPermissionPrompt && (
          <button
            onClick={reAuthorize}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 700,
              background: '#fef08a',
              color: '#854d0e',
              border: '1px solid #facc15',
              borderRadius: '9999px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
            }}
          >
            <RefreshCw size={14} className="animate-spin" />
            <span className="header-admin-text">Reconnect File</span>
          </button>
        )}

        {/* File Connection Chip */}
        <button
          onClick={onOpenFileHub}
          title="Click to manage or connect local JSON file"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: 700,
            background: fileState.fileName ? '#f0fdf4' : 'rgba(255, 255, 255, 0.92)',
            color: fileState.fileName ? '#15803d' : '#475569',
            border: `1.5px solid ${fileState.fileName ? '#86efac' : '#cbd5e1'}`,
            borderRadius: '9999px',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
          }}
        >
          <HardDrive size={14} color={fileState.fileName ? '#16a34a' : '#64748b'} />
          <span className="header-json-text">{fileState.fileName ? fileState.fileName : 'Default JSON'}</span>
          {fileState.isSaving ? (
            <RefreshCw size={12} className="animate-spin" color="#16a34a" />
          ) : (
            <CheckCircle2 size={12} color="#16a34a" />
          )}
        </button>

        {/* Admin Dashboard Trigger */}
        <button
          onClick={onOpenAdmin}
          title="Coordinator Dashboard (PIN Protected)"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            fontSize: '12px',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #002b49 0%, #0c4a6e 100%)',
            color: '#ffffff',
            border: '1.5px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '9999px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0, 43, 73, 0.3)'
          }}
        >
          <Shield size={14} color="#facc15" />
          <span className="header-admin-text">Dashboard</span>
        </button>
      </div>
    </header>
 
  );
}
