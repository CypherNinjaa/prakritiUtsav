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
    <header style={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 28px',
      position: 'relative',
      zIndex: 20
    }}>
      {/* Brand Header with Real Amity Logo (amity-aup-logo-white.png) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        background: 'rgba(0, 43, 73, 0.94)',
        backdropFilter: 'blur(12px)',
        padding: '6px 20px 6px 14px',
        borderRadius: '9999px',
        border: '1.5px solid rgba(250, 204, 21, 0.45)',
        boxShadow: '0 6px 20px rgba(0, 43, 73, 0.3)'
      }}>
        <img
          src={amityLogoWhite}
          alt="Amity University Patna"
          style={{ height: '36px', objectFit: 'contain' }}
        />
        <div style={{ width: '1.5px', height: '22px', background: 'rgba(255, 255, 255, 0.25)' }} />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span className="brand-prakriti" style={{ fontSize: '20px' }}>
            Prakriti
          </span>
          <span className="brand-utsav" style={{ fontSize: '24px', color: '#4ade80' }}>
            Utsav
          </span>
          <span className="brand-subheading" style={{
            fontSize: '9px',
            padding: '2px 8px',
            background: 'rgba(34, 197, 94, 0.25)',
            color: '#86efac',
            borderRadius: '9999px',
            border: '1px solid rgba(134, 239, 172, 0.4)',
            marginLeft: '2px'
          }}>
            Nature in Action
          </span>
        </div>
      </div>

      {/* Action Controls & File Status Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Sound Toggle */}
        <button
          onClick={handleMuteToggle}
          title={muted ? 'Unmute Sound' : 'Mute Sound'}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1.5px solid #cbd5e1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: muted ? '#94a3b8' : '#15803d',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
          }}
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
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
            Reconnect File
          </button>
        )}

        {/* File Connection Chip */}
        <button
          onClick={onOpenFileHub}
          title="Click to manage or connect local JSON file"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            fontSize: '12px',
            fontWeight: 700,
            background: fileState.fileName ? '#f0fdf4' : 'rgba(255, 255, 255, 0.9)',
            color: fileState.fileName ? '#15803d' : '#475569',
            border: `1.5px solid ${fileState.fileName ? '#86efac' : '#cbd5e1'}`,
            borderRadius: '9999px',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
          }}
        >
          <HardDrive size={14} color={fileState.fileName ? '#16a34a' : '#64748b'} />
          <span>{fileState.fileName ? fileState.fileName : 'Default JSON'}</span>
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
            padding: '7px 16px',
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
          <span>Dashboard</span>
        </button>
      </div>
    </header>
  );
}
