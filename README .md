# 📝 Task Manager – Full Stack Web Application

A full-stack Task Management web application that allows users to **sign up, log in, and manage their personal tasks** securely.  
Each user can create, view, update, and delete tasks with authentication handled via JWT.

## 🚀 Features

-  User Authentication (Sign Up & Login using JWT)
-  User-specific tasks (each user sees only their own tasks)
-  Create new tasks
-  Edit existing tasks
-  Delete tasks
-  Task status management (Pending / In Progress / Completed)
-  Task timestamps (created & updated time)
-  Responsive UI using Tailwind CSS
-  MongoDB Atlas cloud database

##  Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- JavaScript (ES6+)

### Backend
- Node.js
- Express.js
- JWT (JSON Web Token) Authentication
- bcrypt.js (Password hashing)

### Database
- MongoDB Atlas
- MongoDB Compass (for debugging & inspection)

### Backend
```bash
cd backend
npm install
npm run dev

##  Project Structure
task_manager/
├── backend/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ ├── server.js
│ ├── package.json
│ └── .env (ignored)
│
├── frontend/
│ ├── src/
│ ├── index.html
│ ├── package.json
│
├── .gitignore
└── README.md
