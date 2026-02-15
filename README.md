# ParkSpot

ParkSpot is an Expo + React Native app to save your parked car location, set meter reminders, and quickly navigate back to your car.

## Features

- Save current parking location with reverse-geocoded address
- View active parking spot details
- Launch navigation back to your saved spot
- Attach a photo to the active parking spot
- Set parking meter reminder notifications
- Persist parking history and app state with AsyncStorage

## Tech Stack

- Expo SDK 54
- React Native 0.81
- Expo Router
- TypeScript
- Zustand
- AsyncStorage

## Getting Started

```bash
npm install
npx expo install --fix
npm run start
```

## Type Checking

```bash
npx tsc --noEmit
```

## Project Structure

- `app/` – Expo Router routes/screens
- `src/components/` – shared UI components
- `src/store/` – Zustand store + persistence
- `src/services/` – service utilities
- `src/theme.ts` – design tokens

## Notes

- Subscription UI exists in `app/paywall.tsx`; billing provider integration is not wired yet.
- Configure push notifications and platform permissions for production builds.
