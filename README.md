# ClassSync - Smart Teacher Management System

ClassSync is a comprehensive platform designed to streamline and automate teacher management in educational institutions. It provides tools for administrators, teachers, and students to manage schedules, leaves, substitutions, notifications, and more, all in one place.

## Features

- **Role-Based Dashboards:** Separate dashboards for Admins and Teachers.
- **Leave Management:** Teachers can apply for leaves; admins can approve/reject and manage substitutions.
- **Schedule Management:** Create, edit, and view class schedules.
- **Substitution Engine:** Automatically suggests and manages teacher substitutions.
- **Notifications:** Real-time notifications for important events and approvals.
- **Chatbot:** Integrated chatbot for quick help and FAQs.
- **Audit Logs:** Track important actions for transparency.
- **Authentication:** Secure login and registration for all users.

## Tech Stack

- **Frontend:** React, Tailwind CSS, Vite
- **Backend:** Node.js, Express.js, MongoDB
- **Authentication:** JWT
- **Email Service:** Nodemailer (Gmail SMTP)
- **Deployment:** Vercel (Frontend), Render(Backend)

## Project Structure

```
/frontend   # React frontend
/backend    # Node.js/Express backend
```

## Getting Started

### Prerequisites

- Node.js & npm
- MongoDB database

### Setup

1. **Clone the repository:**
   ```
   git clone https://github.com/vijaychandra1910/ClassSync-Smart-Teacher-Management-System.git
   ```

2. **Install dependencies:**
   - Frontend:
     ```
     cd frontend
     npm install
     ```
   - Backend:
     ```
     cd ../backend
     npm install
     ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` in both frontend and backend, and fill in required values.

4. **Run the app:**
   - Backend:
     ```
     npm start
     ```
   - Frontend:
     ```
     npm run dev
     ```

   ## Screenshot Demo
   


## License

This project is licensed under the MIT License.
