# 🏛️ GovDesk — All Government Services · One Platform
> *"Right information at the right time — for every citizen"*

GovDesk is a full-stack MERN (MongoDB, Express, React, Node.js) digital governance platform designed to make finding, understanding, and applying for government schemes seamless, accessible, and transparent.

---

## 🌟 Key Highlights & Implementation Details

1. **Light & Trustworthy GovTech Design System**:
   - Clean, modern, accessible design inspired by high-standard national portals (GOV.UK, India Stack).
   - High-contrast, intuitive navigation, bilingual toggle (English & हिंदी), national helplines directory, and responsive layout across desktop and mobile.

2. **8-Step Citizen Workflow (Matching Specification)**:
   - **Step 1: Register / Login**: Email/mobile authentication, OTP verification (with instant demo OTP preview), and interest preferences.
   - **Step 2: Explore Categories**: 10 comprehensive domains (Farmer, Education, Health, MSME, Housing, Identity, Transport, Social Welfare, Legal, Others) with smart filters.
   - **Step 3: View Service Details**: Department breakdown, benefits summary, processing times, required documents, and direct links to official `.gov.in` portals.
   - **Step 4: Smart Eligibility Engine**: Demographic evaluation (age, occupation, income cap, state) returning itemized pass/fail reasons and suggested alternative schemes.
   - **Step 5: Guidance & Document Checklist**: Interactive step-by-step visual timeline and readiness checklist (*Pending / Uploaded / Verified*) with mock file attachment.
   - **Step 6: Office Locator & Map**: Interactive Leaflet.js map with custom pins for Seva Kendras, CSCs, RTOs, and Tehsils with directions and contact hours.
   - **Step 7: Real-Time Notifications**: Unread badges for scheme deadlines, document renewals, and status updates.
   - **Step 8: Citizen Profile**: Saved bookmarks, personal document locker, and grievance tracking.

3. **Special MVP Modules**:
   - **Compare Schemes**: Side-by-side comparison matrix of up to 3 schemes (eligibility, benefits, fees, documents).
   - **Grievance / Helpdesk**: Lodge complaints, receive tracking tokens (`GOV-GRV-2026-XXXX`), and monitor the official redressal timeline.
   - **Feedback & Rating**: Rate schemes and suggest improvements.
   - **Admin Backoffice**: Manage schemes catalog, resolve citizen complaints, and bulk-import open data (JSON/CSV).

4. **Zero-Fuss Autonomous Database Engine**:
   - Built on Express with full Mongoose compatibility.
   - Features an autonomous resilient file-backed persistent store (`server/data/store.json`), allowing immediate plug-and-play execution without requiring a local MongoDB installation or Atlas credentials. If `MONGO_URI` is provided in `.env`, it connects to MongoDB automatically.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- npm

### 1. Install Dependencies
```bash
# In the root directory
npm install --prefix server
npm install --prefix client
```

### 2. Start Full Stack Application
To run both backend API server and frontend client concurrently:
```bash
npm run dev
```

Or run them in separate terminals:
```bash
# Terminal 1: Backend Server (Port 5000)
npm run server

# Terminal 2: Frontend Client (Port 5173)
npm run client
```

Open your browser at **`http://localhost:5173`**.

---

## 🔑 Pre-seeded Demo Credentials

GovDesk comes pre-seeded with sample user accounts for quick testing:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Citizen** | `citizen@govdesk.in` | `citizen123` | Search, check eligibility, bookmark schemes, lodge grievances |
| **Super Admin** | `admin@govdesk.in` | `admin123` | Manage catalog, resolve grievances, bulk-import data |

*(Both login forms also have **One-Click Instant Demo Login** buttons for instant access!)*

---

## 📡 API Endpoint Overview

- `GET /api/categories` — List 10 service categories with counts
- `GET /api/services` — Filter schemes by category, state, mode, search query, or recommendations
- `GET /api/services/:id` — Full scheme details with steps, documents, and FAQs
- `POST /api/eligibility/check` — Dynamic evaluation engine for a single scheme or entire catalog
- `GET /api/offices` — List Seva Kendras and RTO locations with coordinates
- `POST /api/grievances` — Lodge citizen grievance and obtain tracking token
- `GET /api/grievances/track/:token` — Real-time tracking log of a grievance
- `GET /api/admin/stats` — Backoffice statistics and metrics
- `POST /api/admin/services` — Add new government scheme
- `POST /api/admin/seed/reset` — Reset database to baseline verified dataset
