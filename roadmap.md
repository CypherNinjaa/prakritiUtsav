# 🌿 Prakriti Utsav — "Nature in Action"
## Project Roadmap & Architecture Plan (Static & GitHub Pages Ready)

---

### 📌 Project Overview
**Prakriti Utsav** is hosting the flagship sub-event **"Nature in Action"** at **Amity University Patna**. 
This is a **100% static, client-side web application** deployable on **GitHub Pages**, running entirely without a backend server. 

Data persistence is powered by the **Native Web File System Access API** (inspired by [`CypherNinjaa/study_schedule`](https://github.com/CypherNinjaa/study_schedule)), allowing the Admin to directly **connect, create, read, and write to a real local `.json` file on disk** directly from the browser.

---

### 🏛️ System Architecture: Serverless Local-File Engine
*(Patterned after `CypherNinjaa/study_schedule/app/src/services/fileStorage.ts`)*

```
┌────────────────────────────────────────────────────────────────────────┐
│                        REACT + VITE STATIC APP                         │
│                    (Hosted on GitHub Pages / Local)                    │
│                                                                        │
│  ┌───────────────────────┐  ┌──────────────────────┐  ┌─────────────┐  │
│  │ Welcome & Onboarding  │  │ MCQ Engine & Timer   │  │ Results &   │  │
│  │ (Amity & Event Mockup)│  │ (Pills, Score, Auto) │  │ Celebration │  │
│  └───────────┬───────────┘  └──────────┬───────────┘  └──────┬──────┘  │
│              │                         │                     │         │
│  ┌───────────┴─────────────────────────┴─────────────────────┴──────┐  │
│  │            PIN-Protected Admin & Analytics Dashboard             │  │
│  │ - File Connection Hub (Connect / Create / Export JSON)           │  │
│  │ - Question Bank CRUD & Toggle                                    │  │
│  │ - Dynamic Countdown Timer Controls (ON/OFF, Seconds)             │  │
│  │ - Live Leaderboard & CSV Exporter                                │  │
│  └───────────────────────────────────┬──────────────────────────────┘  │
└──────────────────────────────────────┼─────────────────────────────────┘
                                       │
                                       ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  DATA PERSISTENCE LAYER (Zero Server)                  │
│                                                                        │
│  [Primary Path: Native File System Access API]                         │
│  • window.showOpenFilePicker()  -> Admin connects local .json file     │
│  • window.showSaveFilePicker()  -> Admin creates new .json file        │
│  • FileSystemWritableFileStream -> Auto-saves answers & new questions  │
│  • File handle persisted in IndexedDB (idb-keyval) for auto-reconnect  │
│                                                                        │
│  [Fallback Path: Universal Cross-Browser Support]                      │
│  • Standard File Upload (<input type="file">) & Instant JSON Download  │
│  • IndexedDB / LocalStorage active session mirror (zero data loss)     │
│                                                                        │
│  [Default Bundled Dataset (src/data/defaultQuizData.json)]             │
│  • 50 starter questions, default settings (Timer 20s, PIN "1234")      │
└──────────────────────────────────────┬─────────────────────────────────┘
                                       │ Direct Disk I/O
                                       ▼
                     ┌──────────────────────────────────┐
                     │     ADMIN'S LOCAL JSON FILE      │
                     │  (e.g., prakriti_utsav_quiz.json)│
                     │  ├── config: { timer, pin... }   │
                     │  ├── questions: [ ...50 items ]  │
                     │  └── participants: [ runs... ]   │
                     └──────────────────────────────────┘
```

---

### 🎨 Visual Identity & Assets (From Mockups & Logos)
Directly aligned with [`website mockup/`](file:///d:/prakritiUtsav/website%20mockup) and [`amity logo/`](file:///d:/prakritiUtsav/amity%20logo):
- **Branding**: Amity University Patna logo ([`amity-shield.png`](file:///d:/prakritiUtsav/amity%20logo/amity-shield.png), [`amity-aup-logo-white.png`](file:///d:/prakritiUtsav/amity%20logo/amity-aup-logo-white.png)), "Prakriti Utsav" gradient title, and "NATURE IN ACTION" badge.
- **Theme**: Lush botanical theme with green foliage, floral accents, kingfisher bird mascot, and glassmorphism translucent cards.
- **Responsive Display**: Seamless 16:9 widescreen (projector/desktop) and 9:16 portrait (vertical kiosk/mobile).
- **Component Strategy (Gemini + User)**:
  - Mockups act as visual ground truth for cards, pills, buttons, and layouts.
  - Gemini generates SVG/PNG foliage decorations, burst particles, and badges.
  - You can provide custom sponsor graphics or banner overlays at any time.

---

### 🚀 Phased Implementation Roadmap

#### **Phase 1: Project Scaffolding & Serverless File Storage Engine**
- [x] Initialize React + Vite project in the workspace (`base: './'` for GitHub Pages).
- [x] Install lightweight dependencies: `idb-keyval` (for persisting `FileSystemFileHandle`), `canvas-confetti` (for celebrations), `lucide-react` (icons).
- [x] Implement `src/services/fileStorage.js` (modeled after `CypherNinjaa/study_schedule`):
  - `connectExistingFile()`: Opens native file picker (`showOpenFilePicker`), loads JSON, stores handle in `IndexedDB`.
  - `createNewFile()`: Prompts native save picker (`showSaveFilePicker`), writes seed template, binds handle.
  - `saveQuizData(data)`: Automatically writes updated state directly to the connected JSON file on disk.
  - `loadInitialData()`: Auto-reconnects to the previously connected JSON file on page refresh with 1-click permission.
  - Fallback import/export handlers for browsers lacking the File System Access API.
- [x] Create `src/data/defaultQuizData.json` containing:
  - Default game configuration (`timerEnabled: true`, `timerSeconds: 20`, `adminPin: "1234"`).
  - 50 starter questions on nature, ecology, biodiversity, and sustainability.
  - Empty `participants: []` array.
- [x] **Deliverable**: Working static web app capable of creating, loading, and modifying a local JSON file on disk. (VERIFIED & TESTED)

---

#### **Phase 2: Welcome & Participant Registration Flow**
- [x] **Screen 1: Welcome Screen** (Matching `home page 9_16.png` [16:9] / `home page16_9.png` [9:16]):
  - Amity University Patna logo + Prakriti Utsav typography.
  - Event subtitle: *"Test your knowledge about nature, environment and sustainability."*
  - 3 Overview Badges: Total Questions count, *"One Wrong Answer = Game Over"*, *"Highest Score Wins"*.
  - Gradient button: *"START QUIZ &rarr;"*.
  - Discrete File Status Chip in top corner (shows active connected file name e.g. `prakriti_quiz.json` or "Default Dataset").
- [x] **Screen 2: Participant Intake & Ready Screen** (Matching `Participant Ready` mockup):
  - Form fields: Full Name, Roll No / Student ID, Department/College.
  - Rule briefing card: *"When you press START, your quiz begins immediately."*
  - Big CTA: *"BEGIN"* button.
- [x] **Deliverable**: Clean participant registration flow initializing the active player session. (VERIFIED)

---

#### **Phase 3: Interactive MCQ Engine & Dynamic Countdown Timer**
- [x] **Screen 3: Question Screen** (Matching `question screen 16_9.png`):
  - Question header: *"Question X of N"* with progress bar + Live *"Current Score"* badge.
  - Dynamic **Countdown Timer** component:
    - Driven by the connected JSON's `config.timerEnabled` and `config.timerSeconds`.
    - Smooth countdown progress ring/bar with color alert (Green &rarr; Orange &rarr; Red pulsing below 5 seconds).
    - Timeout immediately triggers Sudden Death.
  - 4 rounded option pill cards (`A`, `B`, `C`, `D`) with hover and selected states.
  - *"SUBMIT"* action button.
- [x] Randomized question sequence for every participant session.
- [x] **Deliverable**: Complete interactive quiz engine running on client-side state. (VERIFIED)

---

#### **Phase 4: Feedback Screens, Sudden Death & Auto-Reset Loop**
- [x] **Screen 4: Correct Celebration Screen** (Matching `correct answer 16_9.png`):
  - Animated green check badge with floating leaves & confetti burst.
  - *"Correct!"* title + Updated score banner (*"Current Score X / N"*).
  - Motivational card: *"Great Job! Keep going and test more of your nature knowledge!"*.
  - *"NEXT QUESTION &rarr;"* trigger button.
- [x] **Screen 5: Game Over Screen (Sudden Death)**:
  - Triggers on incorrect answer or countdown timeout.
  - Highlights chosen answer vs. correct answer with explanation.
  - Shows final score and streak.
- [x] **Screen 6: Quiz Completed Screen** (Matching `quiz complete 16_9.png`):
  - Golden trophy graphic + laurel wreath.
  - Results grid: Correct count, Incorrect count, Total Questions, Score %.
  - Performance rating bar.
  - Actions: *"Retake Quiz"*, *"View Answers"*, *"Next Participant / Back to Home"*.
- [x] **Auto-Persist**: On session end, participant record is appended and automatically written to the connected local JSON file on disk.
- [x] Clean state reset returning the kiosk to the Welcome Screen for the next student.
- [x] **Deliverable**: Robust participant gameplay loop with real-time local file auto-save. (VERIFIED)

---

#### **Phase 5: PIN-Protected Admin & Analytics Dashboard**
- [x] Protected `/dashboard` route or modal accessible via PIN (default `"1234"`).
- [x] **Local JSON File Manager (Study Schedule Pattern)**:
  - 📂 **Connect File**: Choose an existing `.json` file from disk via `showOpenFilePicker`.
  - ➕ **Create New File**: Create a new `.json` file via `showSaveFilePicker`.
  - 💾 **Save / Backup Now**: Immediate write to disk + Downloadable JSON backup.
  - 🔄 **Active File Indicator**: Displays file name, last saved timestamp, and connection status.
- [x] **Question Bank Manager**:
  - Live list of questions with search and filter.
  - Add new question modal (question, 4 options, correct answer index, explanation).
  - Edit and Delete questions with auto-save to the JSON file.
  - Toggle questions Active / Inactive.
- [x] **Dynamic Game Settings**:
  - Countdown Timer Toggle (**ON / OFF**).
  - Timer duration slider (10s &ndash; 60s).
  - Questions per session count.
  - Change Admin PIN.
- [x] **Live Leaderboard & Statistics Hub**:
  - Leaderboard table (Rank, Name, Roll No, Department, Score, Time Taken, Date).
  - Summary metric cards: Total Participants, Average Score, Top Score, Pass Rate.
  - One-click **Export to CSV** for official college event records.
- [x] **Deliverable**: Complete event coordinator station operating 100% locally from the browser. (VERIFIED)

---

#### **Phase 6: Audio-Visual Polish & GitHub Pages Deployment**
- [x] Audio sound effects: Button click, countdown tick, correct chime, game over buzzer, and victory fanfare (Web Audio API synthesized, 100% offline & zero external audio files).
- [x] Micro-animations (celebratory confetti bursts via `canvas-confetti`, pulsing timers, hover lifts).
- [x] Responsive layout for both widescreen 16:9 and portrait 9:16 displays.
- [x] Configured `vite.config.js` with `base: './'` for seamless GitHub Pages hosting.
- [x] Added GitHub Actions deployment workflow (`.github/workflows/deploy.yml`) for automated zero-config publishing.
- [x] **Deliverable**: Live, production-ready static web app deployed on GitHub Pages. (VERIFIED)
