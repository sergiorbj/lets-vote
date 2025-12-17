# Phase 5: Mobile Frontend Development

## Overview

Create a React Native mobile app with Expo that provides the same core functionality as the web frontend, consuming the existing backend API.

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation
- **HTTP Client**: Fetch API (native)
- **State Management**: React Hooks (useState, useEffect, useContext)
- **Styling**: StyleSheet API (matching web design system)
- **Platform**: Android (tested on Ubuntu)

## Project Structure

```
packages/mobile/
├── src/
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── VoteScreen.tsx
│   │   └── RankingScreen.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Dropdown.tsx
│   │   └── features/
│   │       ├── FeatureCard.tsx
│   │       └── RankingList.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useFeatures.ts
│   │   └── useVotes.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── featureService.ts
│   │   └── voteService.ts
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── types/
│   │   └── index.ts
│   ├── constants/
│   │   ├── colors.ts
│   │   └── api.ts
│   └── App.tsx
├── app.json
├── package.json
├── tsconfig.json
└── babel.config.js
```

## Architecture

### Similar to Web App

Following the same patterns from the web frontend:

1. **Services Layer**
   - Handle all API communication
   - Same endpoints as web app
   - Error handling with custom ApiError class

2. **Hooks Layer**
   - `useAuth`: Authentication state and methods
   - `useFeatures`: Fetch and manage features
   - `useVotes`: Vote submission and fetching

3. **Screens**
   - Focus solely on UI rendering
   - Consume hooks for data and actions
   - Minimal business logic

4. **Context**
   - AuthContext for global authentication state
   - Shared across the navigation tree

## Color System (Matching Web App)

Use the exact same color palette from the web app:

**Primary Colors:**
- Teal (#14b8a6) - Main primary color
- Various shades from 50 to 900

**Success Colors:**
- Green (#22c55e)
- Shades from 50 to 700

**Error Colors:**
- Red (#ef4444)
- Shades from 50 to 700

**Neutral Colors:**
- Gray scale from 50 to 900
- White and black

All colors should be defined in `src/constants/colors.ts` with the same structure as the web app's Tailwind configuration.

## Navigation Strategy

### Stack Navigator

Use React Navigation with a simple stack navigator:

**Navigation Flow:**
- Unauthenticated users: Show only Login screen
- Authenticated users: Show Vote and Ranking screens
- No tab navigation (linear flow)

### Trade-offs

**Why Stack Navigator?**
- ✅ Simple for linear flows
- ✅ Native transitions
- ✅ Easy to understand
- ❌ Less flexible than Tab Navigator

**Why not Tab Navigator?**
- ❌ Overkill for 2 screens (Vote & Ranking)
- ❌ User journey is linear: Login → Vote → Ranking
- ❌ More complexity for minimal benefit

## API Integration

### API Service

Create a central API service similar to the web app:
- Base URL configuration for different environments
- Request wrapper with error handling
- ApiError class for consistent error handling
- GET and POST methods

### Important: Android Emulator Localhost

**Critical configuration:**
- Use `10.0.2.2` instead of `localhost` or `127.0.0.1`
- This is the special IP that maps to the host machine's localhost
- Real device would need the actual IP address of the machine (e.g., 192.168.x.x)

### Services Structure (Matching Web)

Create these service modules:

**authService:**
- verifyUser(email): Verify user exists by email

**featureService:**
- getAllFeatures(): Fetch all features sorted by vote count

**voteService:**
- getAllVotes(): Fetch all votes
- voteOnFeature(featureId, userEmail): Submit or update vote

All services should use the central API service and follow the same patterns as the web app.

## State Management

### Auth Context

Create AuthContext to manage global authentication state:

**State:**
- user: Current user object or null
- userEmail: User's email or null
- isAuthenticated: Boolean flag

**Methods:**
- login(email): Authenticate user and store in AsyncStorage
- logout(): Clear user data and AsyncStorage

**Storage:**
- Use AsyncStorage to persist authentication
- Load stored auth on app mount

### Custom Hooks (Matching Web)

Follow the same pattern as the web app:

**useAuth:**
- Consumes AuthContext
- Provides authentication state and methods

**useFeatures:**
- Manages features list
- Loading and error states
- Refetch method

**useVotes:**
- Manages votes list
- Submit vote method (no optimistic update)
- Refetch method
- Loading and error states

## UI Components

### Design System Matching Web

All components should match the web app's visual design:

**Button Component:**
- Variants: primary, secondary
- States: disabled
- Full width option
- Proper touch feedback

**Card Component:**
- White background
- Rounded corners
- Shadow/elevation
- Padding

**Dropdown Component (Picker):**
- Use @react-native-picker/picker
- Styled border
- Placeholder support
- Disabled state

### Component Guidelines

- Use TouchableOpacity for buttons (native feel)
- Use StyleSheet for all styling (no inline styles)
- Follow React Native naming conventions
- Add testID props for E2E testing

## Screens Implementation

### 1. Login Screen

**UI Elements:**
- Title: "Feature Voting"
- Subtitle: "Help us prioritize features for AI Studies Manager"
- Email input field
- Continue button
- Error message display

**Functionality:**
- Validate email input
- Call authService.verifyUser()
- Handle errors (user not found, network issues)
- Navigate to Vote screen on success
- Show loading state during API call

### 2. Vote Screen

**UI Elements:**
- Header with welcome message and logout button
- Feature dropdown (Picker)
- Feature description display (when selected)
- Submit vote button
- Error message display
- Success state with "Thank you" message

**Functionality:**
- Load user's existing vote on mount
- Pre-select user's voted feature in dropdown
- Submit vote on button press
- Handle vote changes (backend handles the swap)
- Show success state after voting
- Hide form and show only "View Rankings" button after voting
- Reset to form view when user changes dropdown selection
- Handle errors gracefully

**State Management:**
- selectedFeature: Current dropdown selection
- submitting: Loading state for API call
- error: Error message
- hasVotedInSession: Track if user voted in current session

### 3. Ranking Screen

**UI Elements:**
- Title: "Feature Rankings"
- Scrollable list of features
- Medal indicators for top 3 (🥇🥈🥉)
- Rank numbers for others (#4, #5, etc.)
- Vote count display
- Feature title and description
- "Back to Voting" button

**Functionality:**
- Display features sorted by vote count
- Highlight top 3 features
- Navigate back to Vote screen
- Handle loading state
- Show proper medals/ranks

## Local Testing Strategy

### Option 1: Expo Go (Easiest - RECOMMENDED)

**How it works:**
- Install Expo Go app on Android device
- Run `npx expo start`
- Scan QR code with Expo Go app
- App runs on physical device

**Pros:**
- ✅ Zero configuration
- ✅ Instant reload
- ✅ No emulator needed
- ✅ Real device testing
- ✅ Works on Ubuntu without any special setup

**Cons:**
- ❌ Requires physical Android device
- ❌ Device and dev machine must be on same network
- ❌ Can't test native modules outside Expo's SDK

**Best for:** Primary development and testing

### Option 2: Android Studio Emulator

**How it works:**
- Install Android Studio
- Create Android Virtual Device (AVD)
- Run emulator
- Run `npx expo start --android`

**Pros:**
- ✅ No physical device needed
- ✅ Consistent environment
- ✅ Can test different Android versions
- ✅ Good for CI/CD

**Cons:**
- ❌ Heavy installation (Android Studio ~900MB)
- ❌ Requires hardware virtualization
- ❌ Slower than physical device
- ❌ Higher resource usage

**Best for:** Testing specific scenarios or CI/CD

### Option 3: Web Preview (Development Only)

**How it works:**
- Run `npx expo start`
- Press `w` to open in web browser

**Pros:**
- ✅ Instant
- ✅ No device/emulator needed
- ✅ Good for rapid UI iteration

**Cons:**
- ❌ Not a real mobile environment
- ❌ Many native features don't work
- ❌ Different layout behavior

**Best for:** Quick UI testing only

### Recommendation

**Primary:** Use Expo Go for main development and testing
**Secondary:** Use Android Emulator for specific testing scenarios
**Avoid:** Web preview for anything beyond quick UI checks

## E2E Testing Options

### Option 1: Maestro (RECOMMENDED)

**Description:**
- Modern, simple E2E testing framework
- YAML-based test definitions
- Works with Expo Go and emulators
- Built specifically for mobile

**Pros:**
- ✅ Simplest setup
- ✅ Works with Expo Go (no detaching needed)
- ✅ Readable YAML syntax
- ✅ Fast execution
- ✅ Good documentation
- ✅ Cross-platform (iOS and Android)
- ✅ No need to rebuild app for tests

**Cons:**
- ❌ Newer tool (less mature than Detox)
- ❌ Less community resources
- ❌ Limited debugging tools

**Test Structure:**
- YAML files define test flows
- Simple tap and assertion syntax
- Can run against Expo Go or built app

**Setup Effort:** 2-3 hours for setup + test writing

**Best for:** This project - simple app with straightforward flows

### Option 2: Detox

**Description:**
- Industry-standard E2E framework
- Gray box testing (synchronization with app)
- Used by major companies

**Pros:**
- ✅ Most mature option
- ✅ Excellent synchronization
- ✅ Rich assertion library
- ✅ Great debugging tools
- ✅ Large community

**Cons:**
- ❌ Complex setup
- ❌ Requires app rebuild for each test run
- ❌ Doesn't work with Expo Go (need to eject or use bare workflow)
- ❌ Steeper learning curve
- ❌ Slower test execution

**Test Structure:**
- TypeScript/JavaScript test files
- Jest-based test runner
- Extensive matchers and assertions

**Setup Effort:** 6-8 hours for setup + test writing

**Best for:** Production apps with complex native modules

### Option 3: Appium

**Description:**
- Industry standard for mobile testing
- WebDriver protocol
- Cross-platform (iOS, Android, web)

**Pros:**
- ✅ Industry standard
- ✅ Works with any app
- ✅ Many integrations
- ✅ Language-agnostic (can use TypeScript, Python, etc.)

**Cons:**
- ❌ Very complex setup
- ❌ Requires Appium server
- ❌ Slower execution
- ❌ More brittle tests
- ❌ Overkill for simple apps

**Test Structure:**
- Requires Appium server setup
- Test files in any language
- WebDriver protocol

**Setup Effort:** 8-10 hours for setup + test writing

**Best for:** Enterprise apps or multi-platform testing

### Recommendation: Maestro

**Why Maestro?**

Given the constraints:
- Time-limited project
- Using Expo (managed workflow)
- Simple app with straightforward flows
- Need easy local testing

**Maestro is the best choice because:**
1. Works seamlessly with Expo Go
2. No complex configuration
3. Readable tests (YAML)
4. Fast to write and run
5. Good enough for this use case

**When to use Detox instead:**
- Production app with complex native modules
- Need deep app synchronization
- Large test suite with many edge cases
- Team already familiar with Detox

**When to use Appium instead:**
- Testing multiple apps
- Need language flexibility
- Enterprise requirements
- Complex test orchestration

## Implementation Steps

### 1. Project Setup

**Tasks:**
- Create Expo app with TypeScript template
- Install dependencies:
  - React Navigation (native + stack)
  - React Native Picker
  - AsyncStorage
  - Safe Area Context
  - React Native Screens

### 2. Configure TypeScript

**Tasks:**
- Update tsconfig.json with strict mode
- Configure path aliases
- Set base URL to ./src

### 3. Setup Folder Structure

**Tasks:**
- Create all directories according to project structure
- Setup barrel exports where appropriate

### 4. Implementation Order

**1. Constants & Types** (30 min)
- Define color system in constants/colors.ts
- Define API base URL in constants/api.ts
- Create TypeScript types matching backend models

**2. Services Layer** (1 hour)
- API service with error handling
- Auth service (verifyUser)
- Feature service (getAllFeatures)
- Vote service (getAllVotes, voteOnFeature)

**3. Context** (30 min)
- Create AuthContext
- Implement AuthProvider with AsyncStorage
- Setup context provider in App.tsx

**4. Hooks** (1 hour)
- useAuth hook (consume AuthContext)
- useFeatures hook (fetch and manage features)
- useVotes hook (fetch and submit votes)

**5. UI Components** (2 hours)
- Button component (primary/secondary variants)
- Card component (with proper shadows)
- Dropdown component (using Picker)

**6. Screens** (3 hours)
- LoginScreen (email validation, navigation)
- VoteScreen (dropdown, submission, success state)
- RankingScreen (FlatList, medals, navigation)

**7. Navigation** (30 min)
- Setup React Navigation
- Configure stack navigator
- Implement conditional rendering based on auth

**8. Testing** (2-3 hours)
- Install Maestro
- Write E2E tests for login flow
- Write E2E tests for voting flow
- Write E2E tests for ranking view
- Test on device/emulator

**Total Estimated Time:** 10-12 hours

### 5. Testing Checklist

**Login Flow:**
- [ ] Login with valid email succeeds
- [ ] Login with invalid email shows error
- [ ] Loading state displays correctly

**Voting Flow:**
- [ ] Features load and display in dropdown
- [ ] Can select a feature
- [ ] Feature description appears when selected
- [ ] Submit button works
- [ ] Success state appears after voting
- [ ] Form hides after successful vote
- [ ] Can navigate to rankings after voting

**Vote Change:**
- [ ] Can change dropdown selection
- [ ] Form reappears when changing selection
- [ ] Can submit new vote
- [ ] Backend correctly updates the vote

**Ranking Flow:**
- [ ] Features display sorted by vote count
- [ ] Top 3 have medal indicators
- [ ] Vote counts are accurate
- [ ] Can navigate back to voting

**General:**
- [ ] Logout works correctly
- [ ] Navigation flows work
- [ ] Network errors are handled gracefully
- [ ] AsyncStorage persists authentication

## Key Differences from Web

### 1. Navigation
- **Web:** React Router with `useNavigate()`
- **Mobile:** React Navigation with `navigation.navigate()`

### 2. Styling
- **Web:** Tailwind CSS classes
- **Mobile:** StyleSheet API

### 3. Storage
- **Web:** localStorage (synchronous)
- **Mobile:** AsyncStorage (asynchronous)

### 4. Form Inputs
- **Web:** `<input>`, `<select>`
- **Mobile:** `<TextInput>`, `<Picker>`

### 5. API Base URL
- **Web:** `http://localhost:3000`
- **Mobile Emulator:** `http://10.0.2.2:3000`
- **Mobile Device:** `http://192.168.x.x:3000` (actual machine IP)

### 6. Layout
- **Web:** CSS box model, block/inline
- **Mobile:** Flexbox by default, no auto sizing

## Gotchas & Tips

### 1. Android Emulator Localhost
- ❌ **Don't use:** `localhost` or `127.0.0.1`
- ✅ **Use:** `10.0.2.2` (maps to host's localhost)

### 2. Text Must Be in <Text> Component
- All text content must be wrapped in `<Text>` components
- Cannot render raw strings in `<View>` components

### 3. Flexbox is Default
- All views use flexbox by default with `flexDirection: 'column'`
- No need to enable flexbox like in CSS

### 4. No Auto Height/Width
- Must explicitly set dimensions or use flex
- Views won't automatically size to content

### 5. Picker Styling Limitations
- Native Picker component has limited styling options
- Consider custom dropdown library if more control needed

### 6. AsyncStorage is Asynchronous
- Always use `await` with AsyncStorage operations
- Remember to handle loading states

### 7. SafeAreaView for Notches
- Use SafeAreaView to avoid content being hidden by device notches
- Wrap top-level content in SafeAreaView

### 8. Image Caching
- React Native caches images by default
- May need to clear cache during development

### 9. Debugging
- Use React Native Debugger or Flipper
- Console logs appear in terminal, not browser console

### 10. Network Security (Android)
- Android 9+ blocks cleartext (HTTP) traffic by default
- Need to configure network security config for local development

## Dependencies to Install

### Core Dependencies:
- @react-navigation/native
- @react-navigation/native-stack
- react-native-screens
- react-native-safe-area-context
- @react-native-picker/picker
- @react-native-async-storage/async-storage

### Dev Dependencies:
- @types/react
- @types/react-native
- typescript

### Testing:
- Maestro CLI (installed globally via curl)

## Next Steps After Implementation

### Phase 1: Core Functionality
1. Test thoroughly on both emulator and physical device
2. Verify all flows work end-to-end
3. Check error handling

### Phase 2: Polish (Optional)
- Add pull-to-refresh on ranking screen
- Add loading skeletons instead of spinner
- Implement error boundary
- Add haptic feedback for button presses

### Phase 3: Build & Distribution (Optional)
- Build APK for distribution using EAS Build
- Test on multiple Android versions
- Create app icon and splash screen

### Phase 4: Advanced Features (Future)
- Offline support with local caching
- Push notifications for voting reminders
- Share rankings feature
- Animation and transitions

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Maestro Documentation](https://maestro.mobile.dev/)
- [React Native Styling Cheat Sheet](https://github.com/vhpoet/react-native-styling-cheat-sheet)
- [Expo Go App](https://expo.dev/client)
- [React Native AsyncStorage](https://react-native-async-storage.github.io/async-storage/)

## Summary

This plan provides a complete roadmap for building a React Native mobile app that:
- ✅ Matches the web app's functionality
- ✅ Reuses the same architecture patterns
- ✅ Uses the same design system
- ✅ Can be tested easily on Ubuntu
- ✅ Has a pragmatic E2E testing strategy
- ✅ Provides clear implementation steps
- ✅ Documents trade-offs and gotchas

The approach prioritizes:
- **Simplicity** over complexity
- **Rapid development** over perfect architecture
- **Pragmatic testing** over comprehensive coverage
- **Code reuse** where it makes sense
- **Clear documentation** of decisions and trade-offs

Implementation should take approximately 10-12 hours for a functional mobile app with all core features and E2E tests.
