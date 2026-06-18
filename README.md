# AIBusinessAssistant

AI-powered business assistant app built with React Native / Expo.
- GPT-4o powered AI Chat
- Task Management
- Business Insights
- Push Notifications
- Voice Input

## Setup
```bash
npm install
npx expo start
```

## Build for stores
```bash
npm install -g eas-cli
eas login
eas build --platform android   # Google Play
eas build --platform ios       # App Store (requires Apple Developer account)
```

## Backend
Powered by Base44: https://superagent-02ccfade.base44.app/functions/aiChat
