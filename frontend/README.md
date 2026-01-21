# ClassSync Frontend

A modern, responsive frontend for ClassSync—a school management platform that streamlines teacher schedules, leave management, and substitution assignments. Built with React, Vite, and Tailwind CSS, it features role-based dashboards, real-time analytics, and a clean, intuitive UI.

---

## 🚀 Tech Stack
- **React 19**
- **Vite** (blazing fast build tool)
- **Tailwind CSS** (utility-first styling)
- **Recharts** (data visualization)
- **React Router v7** (routing)
- **Axios** (API requests)
- **jwt-decode** (JWT parsing)
- **Lucide React** (icons)

---

## ✨ Features
- **Role-based Dashboards:** Separate views and controls for Admins and Teachers
- **Authentication:** Secure login with JWT
- **Schedule Management:** View and manage class/teacher schedules
- **Leave Management:** Apply for and approve/reject leaves
- **Substitution Management:** Automated and manual substitution assignment
- **Interactive Charts:** Real-time analytics with Recharts
- **Modern UI:** Built with Tailwind CSS for a clean, responsive experience
- **Chatbot Assistant:** Quick help and guidance (optional)

---

## 🗂️ Folder Structure
```
frontend/
├── public/           # Static assets
├── src/
│   ├── assets/       # Images, SVGs, etc.
│   ├── components/   # Reusable UI components (Navbar, Chatbot, ProtectedRoute, etc.)
│   ├── context/      # React Contexts (Auth, etc.)
│   ├── lib/          # API utilities and helpers
│   ├── pages/        # Page-level components (Login, Dashboards, etc.)
│   ├── styles/       # Custom CSS (if any)
│   ├── utils/        # Utility functions (API config, helpers)
│   ├── App.jsx       # Main app component
│   ├── main.jsx      # Entry point
│   └── ...
├── index.html        # HTML template
├── package.json      # Project metadata and scripts
└── ...
```

---

## 🔗 Connecting to the Backend
- By default, API requests are made to the backend server (see `src/utils/api.js`).
- Update the base URL in the API utility or via environment variables if your backend runs on a different host/port.
- Ensure the backend is running and accessible for full functionality.

---

## 🚀 Deployment
- Build the app with `npm run build`. The output will be in the `dist/` folder.
- Deploy the contents of `dist/` to any static hosting service (Vercel, Netlify, GitHub Pages, etc).
- For Vercel, a `vercel.json` is included for configuration.


