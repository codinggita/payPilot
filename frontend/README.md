<div align="center">

# 🎨 PayPilot - Frontend Interface
### **Premium UI for Intelligent Payment Control**

The user-facing side of PayPilot, built for speed, aesthetics, and a seamless experience in managing personal finances.

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-Modern-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Animations-Framer-0055FF?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)

</div>

---

## ✨ Design Philosophy

PayPilot Frontend follows a **Premium Dark Aesthetic** with:
- 🌌 **Deep Glassmorphism**: Translucent layers with subtle blurs.
- ⚡ **Micro-animations**: Smooth transitions powered by Framer Motion.
- 📱 **Responsive Design**: Fully optimized for mobile, tablet, and desktop.
- 📊 **Visual Analytics**: Interactive data visualization using Chart.js/Recharts.

---

## 🛠️ Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Navigation**: React Router DOM v6
- **Icons**: Lucide React
- **Animation**: Framer Motion
- **State Management**: React Hooks (Context API where needed)

---

## 📂 Project Structure

```text
frontend/
├── 📁 src/
│   ├── 📂 components/     # Reusable UI elements (Buttons, Cards, Inputs)
│   ├── 📂 pages/          # Full page views (Dashboard, Subs, Wallets)
│   ├── 📂 layouts/        # Page wrappers (AuthLayout, DashboardLayout)
│   ├── 📂 hooks/          # Custom business logic hooks
│   ├── 📂 utils/          # API helpers and formatters
│   └── 📂 assets/         # Global images and fonts
├── 📄 index.html          # Entry HTML
└── 📄 vite.config.js      # Vite Configuration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Backend API running (locally or on cloud)

### Installation
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🎨 Key Pages

| Page | Description |
|:--- |:--- |
| **Dashboard** | Overview of finances, KPIs, and recent activity charts. |
| **Subscriptions** | List of recurring payments with pause/resume controls. |
| **Wallets** | Visual cards for managing multiple digital wallets. |
| **Rewards** | Tracker for points, cashback, and miles with redemption UI. |
| **Settings** | User profile, security center, and notification controls. |

---

## 👨‍💻 Developer
**Anand Suthar**
*Full Stack Developer*
