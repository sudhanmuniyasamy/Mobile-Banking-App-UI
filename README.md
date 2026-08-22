# 💳 Apex Mobile Banking - Next-Gen Financial Experience

Apex Banking is a modern, feature-rich, high-performance mobile banking application built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS**. It delivers a premium mobile-first fintech user interface with real-time transaction tracking, bill payments, investment management, biometric security, and interactive financial analytics.

---

## 🚀 Technologies Used to Build the Site

The project leverages a modern web development stack:

### **Core Stack**
- **[React 19](https://react.dev/)**: Building interactive component-driven user interfaces.
- **[TypeScript](https://www.typescriptlang.org/)**: Strongly typed JavaScript for safer code, auto-complete, and self-documenting data structures.
- **[Vite 6](https://vitejs.dev/)**: Next-generation frontend tooling providing lightning-fast Hot Module Replacement (HMR) and optimized production builds.

### **Styling & UI Components**
- **[Tailwind CSS v4](https://tailwindcss.com/)**: Utility-first CSS framework for ultra-responsive layouts, custom dark/light modes, and modern glassmorphism aesthetics.
- **[Lucide React](https://lucide.dev/)**: Clean, consistent vector icon set for fintech actions and navigation.
- **[Motion (Framer Motion)](https://motion.dev/)**: Dynamic micro-interactions, modal transitions, and smooth tab switching.
- **[Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)**: Celebration particle animations on successful transactions & bill payments.
- **Google Fonts**: Custom typography using *Plus Jakarta Sans* and *JetBrains Mono*.

### **AI & State Management**
- **[Google Gen AI SDK (`@google/genai`)](https://www.npmjs.com/package/@google/genai)**: Built-in capabilities to interface with Google's Gemini AI models for smart financial insights.
- **React Context API (`BankingContext`)**: Centralized state management for user balance, transaction history, cards, contacts, and active modal overlays.

---

## ✨ Key Features & Information About the Site

### 1. 📱 Interactive Mobile Frame UI
- Realistic mobile device container with integrated status bar, battery indicators, dynamic time, and bottom navigation bar.
- Fully responsive across desktop browsers and mobile screens.

### 2. 🔐 Security & Authorization
- **Biometric & PIN Authentication Screen**: Interactive login with fingerprint/face ID simulation and numeric passcode entry.

### 3. 📊 Dashboard & Account Management
- **Live Balance Overview**: Real-time checking and savings account balances.
- **Quick Action Hub**: Instant buttons for Send, Receive QR, Scan & Pay, Bills, Investments, and Deposit Check.
- **Recent Activity Feed**: Category-tagged transactions with status badges, timestamps, and receipt details.

### 4. 💸 Payments & Money Transfers
- **Bank-to-Bank Transfer**: Transfer funds via Account Number, IFSC code, or saved contacts.
- **Scan & Pay (QR Code)**: Camera-like QR code scanner simulation with automatic merchant detection.
- **Receive Money via QR**: Generate personalized QR codes with instant copy & share options.
- **Send Money & Contacts**: Contact search with search filtering and quick-send amounts.

### 5. ⚡ Utility Bills & Services
- **Electricity Bill Payments**: Select provider, consumer number, and instant bill fetching.
- **Mobile Recharges**: Browse talktime and data plans across telecom operators.
- **FASTag Recharge**: Vehicle tag recharges for toll highways.
- **Recurring Bills Overview**: Upcoming bill reminders and automatic payment toggles.

### 6. 📈 Investments & Wealth Management
- **Fixed Deposits (FD)**: Calculate interest rates, tenure, and create high-yield deposits.
- **Digital Gold**: Buy and sell 24K digital gold with live market prices.
- **Stock Market Tracker**: Real-time performance metrics and detailed stock charts.

### 7. 💳 Cards Management
- **Virtual & Physical Cards**: View card numbers, CVV toggles, expiry dates, and spending limits.
- **Card Controls**: Freeze card, enable international usage, and manage contactless payments.

### 8. 📸 Mobile Check Deposit
- Upload or capture front and back photos of bank checks for instant digital clearing.

### 9. 📈 Spending Insights & Analytics
- Visual category breakdowns (Food & Dining, Shopping, Utilities, Investments) with progress indicators and monthly target trackers.

---

## 🛠️ Getting Started Locally

### **Prerequisites**
Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) installed on your system.

### **Installation & Setup**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sudhanmuniyasamy/Mobile-Banking-App-UI.git
   cd Mobile-Banking-App-UI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000`.

4. **Build for production:**
   ```bash
   npm run build
   ```
   The optimized production bundle will be generated in the `dist/` directory.

---

## 🌐 Deployment

The project contains a [`render.yaml`](./render.yaml) blueprint for 1-click hosting on **Render**:

- **Build Command**: `npm run build`
- **Publish Directory**: `./dist`
- **Routing**: SPA rewrite rules configured for seamless page navigation.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
