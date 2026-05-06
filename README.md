<div align="center">
  <img src="https://img.icons8.com/fluency/96/salesforce.png" alt="SF Logo" width="80" height="80" />
  <h1>🚀 Salesforce Validation Rule Manager</h1>
  <p align="center">
    <strong>An ultra-modern, production-ready full-stack suite for managing Salesforce validation rules.</strong>
    <br />
    <em>Built with a futuristic glassmorphism UI and powered by JSForce.</em>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=for-the-badge&logo=node.js" alt="Node" />
    <img src="https://img.shields.io/badge/Styling-TailwindCSS%20%2B%20Framer-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind" />
    <img src="https://img.shields.io/badge/Salesforce-JSForce-00A1E0?style=for-the-badge&logo=salesforce" alt="Salesforce" />
  </p>
</div>

---

## ⚡ Core Highlights

- 🔐 **OAuth 2.0 Security** — Industry-standard Salesforce authentication.
- 📋 **Rule Introspection** — Real-time rule fetching via Tooling API.
- 🔀 **One-Click Deployment** — Instant Metadata API updates with optimistic UI.
- 🎨 **Futuristic UX** — Glassmorphism cards, neon gradients, and smooth Framer Motion transitions.
- 📊 **Org Analytics** — Live monitoring of org health and validation rule status.

---

## 🏗️ Architecture

```mermaid
graph TD
    A[React Frontend] -->|REST API| B[Express Backend]
    B -->|OAuth 2.0| C[Salesforce Identity]
    B -->|Tooling API| D[Salesforce Metadata]
    B -->|Metadata API| D
```

---

## 🔧 Setup Guide

### 1. Salesforce Connected App
1.  **Setup** > **App Manager** > **New Connected App**.
2.  **Name**: `SF Rule Manager`.
3.  **Callback URL**: `http://localhost:3001/auth/callback`.
4.  **Scopes**: `Full access`, `Perform requests at any time`.
5.  **PKCE**: Ensure **"Require PKCE"** is **UNCHECKED**.

### 2. Backend Configuration
Create `backend/.env`:
```env
SF_CLIENT_ID=your_consumer_key
SF_CLIENT_SECRET=your_consumer_secret
SF_REDIRECT_URI=http://localhost:3001/auth/callback
SESSION_SECRET=a-secure-random-string
FRONTEND_URL=http://localhost:5173
```

### 3. Execution
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev
```

---

## 📡 API Reference

| Endpoint | Method | Purpose |
| :--- | :--- | :--- |
| `/auth/salesforce` | `GET` | Initiates OAuth 2.0 Flow |
| `/api/validation-rules`| `GET` | Fetches Account Rules |
| `/api/deploy` | `POST`| Metadata API Deployment |
| `/api/org-info` | `GET` | Connected Org Intelligence |

---

## 🛡️ Security Posture

- **Session Security**: tokens are stored in `httpOnly`, `secure` cookies.
- **Middleware**: All API calls pass through an `authGuard` validation layer.
- **Data Privacy**: No Salesforce credentials or customer data are persisted in any database.

---

<div align="center">
  <p>Built with ❤️ for the Salesforce Ecosystem</p>
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square" alt="License" />
</div>
