import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  loadInitialData,
  connectExistingFile,
  createNewFile,
  saveQuizData,
  disconnectFile,
  exportDataAsJSON,
  importUploadedJSON,
  reAuthorizeStoredHandle,
  isFileSystemAccessSupported
} from '../services/fileStorage';

const QuizContext = createContext(null);

export function QuizProvider({ children }) {
  const [quizData, setQuizData] = useState(null);
  const [fileState, setFileState] = useState({
    source: 'loading',
    fileName: null,
    needsPermissionPrompt: false,
    isSaving: false,
    isSupported: isFileSystemAccessSupported(),
    lastSaved: null
  });

  // On mount, load initial data (persisted handle -> mirror -> default)
  useEffect(() => {
    async function init() {
      try {
        const result = await loadInitialData();
        setQuizData(result.data);
        setFileState(prev => ({
          ...prev,
          source: result.source,
          fileName: result.fileName,
          needsPermissionPrompt: result.needsPermissionPrompt,
          lastSaved: new Date().toLocaleTimeString()
        }));
      } catch (err) {
        console.error('Failed to initialize quiz data:', err);
      }
    }
    init();
  }, []);

  // Connect existing file via File System Access API
  const handleConnectFile = async () => {
    try {
      const res = await connectExistingFile();
      setQuizData(res.data);
      setFileState(prev => ({
        ...prev,
        source: 'file',
        fileName: res.fileName,
        needsPermissionPrompt: false,
        lastSaved: new Date().toLocaleTimeString()
      }));
      return { success: true, fileName: res.fileName };
    } catch (err) {
      if (err.name !== 'AbortError') {
        alert(err.message);
      }
      return { success: false, error: err.message };
    }
  };

  // Create new file via File System Access API
  const handleCreateFile = async () => {
    try {
      const res = await createNewFile(quizData);
      setQuizData(res.data);
      setFileState(prev => ({
        ...prev,
        source: 'file',
        fileName: res.fileName,
        needsPermissionPrompt: false,
        lastSaved: new Date().toLocaleTimeString()
      }));
      return { success: true, fileName: res.fileName };
    } catch (err) {
      if (err.name !== 'AbortError') {
        alert(err.message);
      }
      return { success: false, error: err.message };
    }
  };

  // Re-authorize stored handle
  const handleReAuthorize = async () => {
    try {
      const res = await reAuthorizeStoredHandle();
      setQuizData(res.data);
      setFileState(prev => ({
        ...prev,
        source: 'file',
        fileName: res.fileName,
        needsPermissionPrompt: false,
        lastSaved: new Date().toLocaleTimeString()
      }));
    } catch (err) {
      alert(err.message);
    }
  };

  // Disconnect active file
  const handleDisconnect = async () => {
    await disconnectFile();
    setFileState(prev => ({
      ...prev,
      source: 'local_mirror',
      fileName: null,
      needsPermissionPrompt: false
    }));
  };

  // Export JSON file (direct download)
  const handleExportJSON = (filename) => {
    if (quizData) {
      exportDataAsJSON(quizData, filename || fileState.fileName || undefined);
    }
  };

  // Import JSON via file upload input
  const handleImportJSON = async (file) => {
    try {
      const res = await importUploadedJSON(file);
      setQuizData(res.data);
      setFileState(prev => ({
        ...prev,
        source: 'local_mirror',
        fileName: res.fileName,
        needsPermissionPrompt: false,
        lastSaved: new Date().toLocaleTimeString()
      }));
      return { success: true };
    } catch (err) {
      alert(err.message);
      return { success: false, error: err.message };
    }
  };

  // Persist updated data
  const persistData = async (newData) => {
    setQuizData(newData);
    setFileState(prev => ({ ...prev, isSaving: true }));
    try {
      await saveQuizData(newData);
      setFileState(prev => ({
        ...prev,
        isSaving: false,
        lastSaved: new Date().toLocaleTimeString()
      }));
    } catch (err) {
      console.error('Error saving data:', err);
      setFileState(prev => ({ ...prev, isSaving: false }));
    }
  };

  // Add completed participant run
  const addParticipantRun = async (participantRun) => {
    if (!quizData) return;
    const updated = {
      ...quizData,
      participants: [
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          timestamp: new Date().toISOString(),
          ...participantRun
        },
        ...quizData.participants
      ]
    };
    await persistData(updated);
  };

  // Update Game Config (Timer, PIN, etc.)
  const updateConfig = async (newConfig) => {
    if (!quizData) return;
    const updated = {
      ...quizData,
      config: {
        ...quizData.config,
        ...newConfig
      }
    };
    await persistData(updated);
  };

  // Add Question
  const addQuestion = async (newQuestion) => {
    if (!quizData) return;
    const nextId = quizData.questions.length > 0
      ? Math.max(...quizData.questions.map(q => q.id || 0)) + 1
      : 1;
    const questionObj = { id: nextId, ...newQuestion };
    const updated = {
      ...quizData,
      questions: [...quizData.questions, questionObj]
    };
    await persistData(updated);
  };

  // Update Question
  const updateQuestion = async (id, updatedQuestion) => {
    if (!quizData) return;
    const updated = {
      ...quizData,
      questions: quizData.questions.map(q => q.id === id ? { ...q, ...updatedQuestion } : q)
    };
    await persistData(updated);
  };

  // Delete Question
  const deleteQuestion = async (id) => {
    if (!quizData) return;
    const updated = {
      ...quizData,
      questions: quizData.questions.filter(q => q.id !== id)
    };
    await persistData(updated);
  };

  return (
    <QuizContext.Provider
      value={{
        quizData,
        fileState,
        connectFile: handleConnectFile,
        createFile: handleCreateFile,
        reAuthorize: handleReAuthorize,
        disconnectFile: handleDisconnect,
        exportJSON: handleExportJSON,
        importJSON: handleImportJSON,
        addParticipantRun,
        updateConfig,
        addQuestion,
        updateQuestion,
        deleteQuestion
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
