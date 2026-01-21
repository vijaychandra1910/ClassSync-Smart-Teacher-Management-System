# ClassSync Backend

A robust backend for ClassSync, a school management platform that streamlines teacher schedules, leave management, and substitution assignments. Built with Node.js, Express, and MongoDB, it features secure authentication, role-based access, and a comprehensive RESTful API.

---

## 🚀 Tech Stack
- **Node.js**
- **Express.js**
- **MongoDB (Mongoose)**
- **JWT Authentication**
- **Jest** (Testing)
- **OpenAI API** (for chatbot assistance)

---

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in the required values (MongoDB URI, JWT secret, etc).
3. **Run the server:**
   ```bash
   npm start
   ```
4. **Run tests:**
   ```bash
   npm test
   ```

---

## 📚 API Reference
All endpoints are prefixed with `/api/`.

### 1. **Authentication** (`/api/auth`)
| Method | Endpoint      | Description                | Access |
|--------|---------------|----------------------------|--------|
| POST   | /register     | Register a new user        | Public |
| POST   | /login        | Login and receive JWT      | Public |

---

### 2. **School Management** (`/api/schools`)
| Method | Endpoint                      | Description                                 | Access |
|--------|-------------------------------|---------------------------------------------|--------|
| POST   | /                            | Create a new school or college               | Admin  |
| PUT    | /:schoolId/timetable         | Update timetable config for a school        | Admin  |

---

### 3. **Schedule Management** (`/api/schedules`)
| Method | Endpoint                        | Description                                 | Access         |
|--------|----------------------------------|---------------------------------------------|----------------|
| POST   | /assign                         | Assign a new schedule slot                  | Admin          |
| PUT    | /:slotId                        | Edit a schedule slot                        | Admin          |
| DELETE | /:slotId                        | Delete a schedule slot                      | Admin          |
| GET    | /teacher/:teacherId             | Get a teacher's schedule                    | Admin          |
| GET    | /class/:section                 | Get a class's weekly schedule               | Admin          |
| GET    | /mine                           | Get your own schedule                       | Teacher        |
| GET    | /mine/grid                      | Get your own schedule grid                  | Teacher        |
| GET    | /teacher/:teacherId/grid        | Get a teacher's schedule grid               | Admin          |
| GET    | /subjects                       | List all subjects                           | Admin          |
| GET    | /classes                        | List all classes                            | Admin          |
| GET    | /sections                       | List all sections                           | Admin          |

---

### 4. **Substitution Management** (`/api/substitutions`)
| Method | Endpoint         | Description                                 | Access         |
|--------|------------------|---------------------------------------------|----------------|
| GET    | /mine            | View your own substitutions                 | Teacher        |
| GET    | /all             | View all substitutions in school            | Admin          |
| GET    | /history         | View full substitution history              | Admin          |
| POST   | /generate        | Generate substitutions automatically        | Admin          |
| POST   | /override        | Override a substitution assignment          | Admin          |

---

### 5. **Leave Management** (`/api/leaves`)
| Method | Endpoint                | Description                                 | Access         |
|--------|-------------------------|---------------------------------------------|----------------|
| POST   | /apply                  | Apply for leave                             | Teacher        |
| GET    | /my-leaves              | View your leave history                     | Teacher        |
| GET    | /                       | View all leave requests in school           | Admin          |
| GET    | /pending                | View all pending leave requests             | Admin          |
| PUT    | /:leaveId/approve       | Approve a leave request                     | Admin          |
| PUT    | /:leaveId/reject        | Reject a leave request                      | Admin          |

---

### 6. **Admin Management** (`/api/admin`)
| Method | Endpoint                | Description                                 | Access         |
|--------|-------------------------|---------------------------------------------|----------------|
| GET    | /teachers               | List all teachers                           | Admin          |
| GET    | /teachers/:id           | Get a teacher's details                     | Admin          |
| POST   | /teachers               | Create a new teacher                        | Admin          |
| DELETE | /teachers/:id           | Delete a teacher                            | Admin          |
| PUT    | /teachers/:id           | Update a teacher's details                  | Admin          |

---

### 7. **Dashboard** (`/api/dashboard`)
| Method | Endpoint                | Description                                 | Access         |
|--------|-------------------------|---------------------------------------------|----------------|
| GET    | /admin                  | Get admin dashboard data                    | Admin          |
| GET    | /stats                  | Get dashboard statistics                    | Admin          |

---

### 8. **Conflict Management** (`/api/conflicts`)
| Method | Endpoint                | Description                                 | Access         |
|--------|-------------------------|---------------------------------------------|----------------|
| GET    | /                       | Get scheduling conflicts                    | Admin          |

---

### 9. **Chatbot Assistance** (`/api/chatbot`)
| Method | Endpoint                | Description                                 | Access         |
|--------|-------------------------|---------------------------------------------|----------------|
| POST   | /ask                    | Ask a question to the assistant chatbot     | Authenticated  |

---

## 🔒 Authentication & Authorization
- **JWT-based authentication** is used for all protected routes.
- **Role-based access control** ensures only authorized users (admin/teacher) can access specific endpoints.

## 🗂️ Folder Structure (Key Directories)
- `src/routes/` — API route definitions
- `src/controllers/` — Business logic for each route
- `src/models/` — Mongoose models (User, School, etc.)
- `src/middlewares/` — Auth, role, and context middlewares
- `src/services/` — Service layer for complex logic
- `src/utils/` — Utility functions

## 🧪 Testing
- Run all tests with `npm test` (uses Jest and Supertest)

## 📄 License
This project is licensed under the ISC License.

---

## ✨ Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.


