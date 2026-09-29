import React, { useState, useMemo } from 'react';
import { QuizProvider, useQuiz } from './context/QuizContext';
import Header from './components/common/Header';
import WelcomeScreen from './components/screens/WelcomeScreen';
import ParticipantReadyScreen from './components/screens/ParticipantReadyScreen';
import QuestionScreen from './components/screens/QuestionScreen';
import CorrectScreen from './components/screens/CorrectScreen';
import GameOverScreen from './components/screens/GameOverScreen';
import QuizCompleteScreen from './components/screens/QuizCompleteScreen';
import AdminDashboard from './components/admin/AdminDashboard';
import FileConnectionModal from './components/admin/FileConnectionModal';

function QuizApp() {
  const { quizData, addParticipantRun } = useQuiz();

  // Screen flow: 'welcome' | 'ready' | 'quiz' | 'correct' | 'game_over' | 'completed'
  const [currentScreen, setCurrentScreen] = useState('welcome');

  // Modals
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Active Participant Session State
  const [participant, setParticipant] = useState(null);
  const [sessionQuestions, setSessionQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [failedQuestion, setFailedQuestion] = useState(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [failureReason, setFailureReason] = useState('wrong');

  // Total questions per session configured by admin (defaults to 10)
  const questionsPerSession = quizData?.config?.questionsPerSession || 10;
  const timerEnabled = quizData?.config?.timerEnabled ?? true;
  const timerDuration = quizData?.config?.timerSeconds ?? 20;

  // Start Quiz: Transition from Welcome to Ready
  const handleStartQuiz = () => {
    setCurrentScreen('ready');
  };

  // Begin Quiz: Participant submits info -> pick randomized questions & start
  const handleBeginQuiz = (participantInfo) => {
    setParticipant(participantInfo);

    const allQuestions = quizData?.questions || [];
    // Shuffle questions
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    // Limit to questionsPerSession
    const selected = shuffled.slice(0, Math.min(questionsPerSession, shuffled.length));

    setSessionQuestions(selected);
    setCurrentQuestionIndex(0);
    setScore(0);
    setFailedQuestion(null);
    setSelectedOptionIndex(null);
    setCurrentScreen('quiz');
  };

  // Current active question
  const currentQuestion = sessionQuestions[currentQuestionIndex];

  // Handle Answer Submission
  const handleSubmitAnswer = async (chosenIndex) => {
    const isCorrect = chosenIndex === currentQuestion.correctIndex;

    if (isCorrect) {
      const newScore = score + 1;
      setScore(newScore);

      // Check if finished entire session
      if (currentQuestionIndex + 1 >= sessionQuestions.length) {
        // Participant won the quiz!
        await addParticipantRun({
          ...participant,
          score: newScore,
          totalQuestions: sessionQuestions.length,
          completed: true
        });
        setCurrentScreen('completed');
      } else {
        // Show correct celebration screen
        setCurrentScreen('correct');
      }
    } else {
      // Wrong answer -> Sudden death Game Over
      setFailedQuestion(currentQuestion);
      setSelectedOptionIndex(chosenIndex);
      setFailureReason('wrong');

      await addParticipantRun({
        ...participant,
        score: score,
        totalQuestions: sessionQuestions.length,
        completed: false
      });
      setCurrentScreen('game_over');
    }
  };

  // Handle Countdown Timer Timeout (Sudden Death)
  const handleTimeout = async () => {
    setFailedQuestion(currentQuestion);
    setSelectedOptionIndex(null);
    setFailureReason('timeout');

    await addParticipantRun({
      ...participant,
      score: score,
      totalQuestions: sessionQuestions.length,
      completed: false
    });
    setCurrentScreen('game_over');
  };

  // Next Question trigger from Correct screen
  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prev) => prev + 1);
    setCurrentScreen('quiz');
  };

  // Reset to Welcome Screen for next participant
  const handleResetKiosk = () => {
    setParticipant(null);
    setSessionQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setFailedQuestion(null);
    setSelectedOptionIndex(null);
    setCurrentScreen('welcome');
  };

  // Retake Quiz with same participant info
  const handleRetakeQuiz = () => {
    if (participant) {
      handleBeginQuiz(participant);
    } else {
      handleResetKiosk();
    }
  };

  return (
    <div className="app-viewport">
      {/* Soft scenic contrast overlay */}
      <div className="scenic-overlay" />

      {/* Persistent App Header */}
      <Header
        onOpenFileHub={() => setIsFileModalOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Screen Viewport Container */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        position: 'relative',
        zIndex: 10
      }}>
        {currentScreen === 'welcome' && (
          <WelcomeScreen onStartQuiz={handleStartQuiz} />
        )}

        {currentScreen === 'ready' && (
          <ParticipantReadyScreen
            onBeginQuiz={handleBeginQuiz}
            onBack={handleResetKiosk}
          />
        )}

        {currentScreen === 'quiz' && currentQuestion && (
          <QuestionScreen
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={sessionQuestions.length}
            currentScore={score}
            timerEnabled={timerEnabled}
            timerDuration={timerDuration}
            onSubmitAnswer={handleSubmitAnswer}
            onTimeout={handleTimeout}
          />
        )}

        {currentScreen === 'correct' && (
          <CorrectScreen
            score={score}
            totalQuestions={sessionQuestions.length}
            onNextQuestion={handleNextQuestion}
          />
        )}

        {currentScreen === 'game_over' && (
          <GameOverScreen
            participant={participant}
            score={score}
            failedQuestion={failedQuestion}
            selectedOptionIndex={selectedOptionIndex}
            reason={failureReason}
            onReset={handleResetKiosk}
          />
        )}

        {currentScreen === 'completed' && (
          <QuizCompleteScreen
            participant={participant}
            score={score}
            totalQuestions={sessionQuestions.length}
            onRetake={handleRetakeQuiz}
            onBackToHome={handleResetKiosk}
          />
        )}
      </main>

      {/* File Connection Modal */}
      <FileConnectionModal
        isOpen={isFileModalOpen}
        onClose={() => setIsFileModalOpen(false)}
      />

      {/* Coordinator & Analytics Dashboard Modal */}
      {isAdminOpen && (
        <AdminDashboard
          onClose={() => setIsAdminOpen(false)}
          onOpenFileHub={() => {
            setIsAdminOpen(false);
            setIsFileModalOpen(true);
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <QuizProvider>
      <QuizApp />
    </QuizProvider>
  );
}
