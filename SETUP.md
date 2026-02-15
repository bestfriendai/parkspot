# ParkSpot - Setup Guide

## Prerequisites

### Required Tools
- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo`)
- Xcode (for iOS builds)
- Android Studio (for Android builds)
- Apple Developer Account ($99/year)
- Google Play Console ($25 one-time)

### Required Accounts
- [RevenueCat](https://www.revenuecat.com) - For subscriptions
- [App Store Connect](https://appstoreconnect.apple.com) - For iOS publishing
- [Google Play Console](https://play.google.com/console) - For Android publishing
- [EAS](https://expo.dev/eas) - For building (free tier available)

---

## Installation

```bash
# Navigate to project directory
cd builds/parkspot

# Install dependencies
npm install

# Start development server
npx expo start
```

### Running on Device/Simulator

**iOS:**
```bash
npx expo run:ios
```

**Android:**
```bash
npx expo run:android
```

**Expo Go:**
```bash
npx expo start
# Then scan QR code with Expo Go app
```

---

## RevenueCat Setup

### Step 1: Create Project
1. Go to [RevenueCat Dashboard](https://app.revenuecat.com)
2. Click "New Project"
3. Name it "ParkSpot"

### Step 2: Add Apps
1. In your project, click "Apps" → "Add App"
2. Select iOS and/or Android
3. Enter Bundle ID: `com.parkspot.app`

### Step 3: Create Products

**iOS (in App Store Connect):**
1. Go to App Store Connect → My Apps → ParkSpot
2. Click "Features" → "Subscriptions"
3. Create subscriptions:
   - **Monthly**: $2.99/month, Product ID: `parkspot_monthly`
   - **Annual**: $14.99/year, Product ID: `parkspot_annual`

**In RevenueCat:**
1. Products → "New Product"
2. Enter Product ID: `parkspot_monthly`
3. Select "Monthly", set price $2.99
4. Repeat for `parkspot_annual`

### Step 4: Configure API Keys
1. Project Settings → API Keys
2. Copy "Public API Key"
3. Update `src/services/purchases.ts`

---

## App Store Connect Setup

### Step 1: Create App
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. My Apps → "+" → "New App"
3. Fill in:
   - Name: ParkSpot
   - Bundle ID: com.parkspot.app
   - SKU: PARKSPOT001
   - Category: Navigation

### Step 2: Upload Build
```bash
eas build --platform ios --profile production
```

### Step 3: Submit for Review
1. Fill in App Information
2. Submit for Review

---

## Google Play Console Setup

### Step 1: Create App
1. Go to [Google Play Console](https://play.google.com/console)
2. Apps → Create App
3. Name: ParkSpot

### Step 2: Upload Build
```bash
eas build --platform android --profile production
```

### Step 3: Submit
- Store Listing, Pricing, Content Rating
- Submit for Review

---

## EAS Build Commands

```bash
# iOS Production
eas build --platform ios --profile production

# Android Production
eas build --platform android --profile production

# Development
eas build --platform ios --profile development
```

---

## Submission Checklist

- [ ] Location permissions configured
- [ ] Notifications permissions configured
- [ ] Privacy policy URL
- [ ] App icon (1024x1024)
- [ ] Screenshots
- [ ] Test subscription flow

---

## Troubleshooting

### Location Not Working
- Check device has location enabled
- Verify permissions in Settings

### Notifications Not Working
- Check notification permissions
- Verify notification ID is stored

### Build Errors
```bash
npx expo start --clear
npx expo update
```

---

## Support

- Expo: https://docs.expo.dev
- RevenueCat: https://docs.revenuecat.com
