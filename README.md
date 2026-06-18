# AI Business Assistant

> Powered by GPT-4o · Built with React Native / Expo  
> AIBusinessAssistant.ai — by Bob Chand

## Features
- 💬 AI Chat powered by GPT-4o
- ✅ Task management with priorities & reminders
- 📊 Business insights & productivity tracking
- 🔔 Push notifications (daily briefing + task reminders)
- 🎤 Voice input support
- 🎨 Custom branded UI

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Start development server
```bash
npx expo start
```

### 3. Build for production (no Mac needed!)
```bash
npm install -g eas-cli
eas login
eas build --platform android   # Google Play
eas build --platform ios       # App Store (cloud build)
```

## Backend
AI is powered by a Base44 backend function:
`https://superagent-02ccfade.base44.app/functions/aiChat`

## Publishing
- **Google Play**: Build APK/AAB with EAS, upload to Google Play Console
- **App Store**: Build IPA with EAS (cloud Mac), upload via App Store Connect

## Developer
Bob Chand · AIBusinessAssistant.ai
