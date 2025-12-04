# Posters AI 🎨✨

**Posters AI** is a next-generation web application that leverages Google's **Gemini 2.5 Flash** model to generate stunning, professional-grade posters for Birthdays, Festivals, Anniversaries, and Movies in seconds.

Built with **React 18**, **Vite**, **Tailwind CSS**, and **Node.js**.

## 🚀 Key Features

*   **✨ AI-Powered Generation**: Creates unique, high-quality images based on context (Occasion, Theme, Mood).
*   **🗣️ Voice Commands**: Use your microphone to dictate titles, names, and taglines.
*   **🔐 Advanced Authentication**:
    *   **Biometric Login**: Simulated Face ID / Touch ID.
    *   **Social Login**: Realistic Google & Apple OAuth simulations.
    *   **Phone Login**: OTP simulation with timer.
*   **📂 History & Drafts**:
    *   **Auto-Save**: Automatically saves generated posters to local history.
    *   **Drafts**: Save your work-in-progress forms and resume later.
    *   **Undo/Redo**: Full state management to revert changes.
*   **🎨 Customization**:
    *   **Aspect Ratios**: Optimized for Instagram (9:16, 1:1), Twitter (16:9), and Print.
    *   **Typography**: Select from 30+ Google Fonts.
    *   **Smart Uploads**: Auto-resizes and optimizes user photos (JPG/PNG/WebP).
*   **📱 PWA-Ready UI**: Responsive design, dark mode, and native-app feel.

## 🛠️ Tech Stack

*   **Frontend**: React (TypeScript), Vite, Tailwind CSS
*   **AI Model**: Google Gemini 2.5 Flash (`gemini-2.5-flash-image`)
*   **Backend**: Node.js / Express (Serverless compatible)
*   **Icons**: FontAwesome 6
*   **Fonts**: Plus Jakarta Sans & Google Fonts Library

## ⚙️ Setup & Installation

### Prerequisites
*   Node.js (v18 or higher)
*   Google Gemini API Key

### 1. Clone & Install
```bash
git clone https://github.com/your-username/posters-ai.git
cd posters-ai
npm install
```

### 2. Configure Environment
Create a `.env` file (or use Replit Secrets / Vercel Env Vars):
```env
API_KEY=your_google_gemini_api_key_here
```

### 3. Run Locally
```bash
# Start development server
npm run dev
```

### 4. Build for Production
```bash
# Build frontend and start server
npm run start
```

## 🚀 Deployment

### Deploy to Vercel
1.  Push code to GitHub.
2.  Import project in Vercel.
3.  Add `API_KEY` in **Settings > Environment Variables**.
4.  Deploy!

### Deploy to Replit
1.  Import repo.
2.  Add `API_KEY` in **Tools > Secrets**.
3.  Click **Run**.

## 📜 License
MIT License. Copyright © 2024 Posters AI.
