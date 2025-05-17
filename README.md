[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/mNaxAqQD)


# 🌍 Country Explorer Web Application

Welcome to the Country Explorer Web App — a modern React + Node.js based application that allows users to search, explore, and favorite countries using RESTful APIs. This was built as part of the Application Framework module assignment.

## 🔗 Hosted Link
Visit the live version here:  
👉 **[Country Explorer App](https://country-api-frontend.onrender.com/)**

## 📁 GitHub Repository
Source code is publicly available here:  
👉 **[Country Explorer GitHub Repo](https://github.com/KavindaKGD/Country-API.git)**

---

## 👨‍💻 Student Info

- **Name:** Kavinda KGD  
- **ID:** IT22576170  
- **Module:** Application Framework (AF)

---

## 🚀 Tech Stack

### 🔹 Frontend
- React.js
- TailwindCSS
- React Router
- Axios
- Vitest + Testing Library for Unit Testing

### 🔹 Backend
- Node.js + Express
- MongoDB (Mongoose)
- bcryptjs
- JWT (JSON Web Token)

---

## ✅ Features

- 🔍 Search countries by name
- 📌 Mark countries as favorites
- 🔐 User registration & login
- 🛡️ JWT-based authentication
- 🧠 Protected routes
- 🧪 Unit tested components (Login, Header, ProtectedRoute, CountryDetail, Favorites)

---

## 📦 How to Run Locally

### 🖥️ Clone and install:
```bash
git clone https://github.com/KavindaKGD/Country-API.git
cd Country-API
```

### 🔧 Backend Setup
```bash
cd backend
npm install
# Create a .env file with:
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
node server.js
```

### 🎨 Frontend Setup
```bash
cd frontend
npm install
npx tailwindcss init -p
npm run dev
```

---

## 🧪 Running Tests
From the `frontend` folder:
```bash
npx vitest
```

---

## 💾 Local Storage
Used to persist:
- JWT token
- User information
- Favorites list

---

## 💬 Components Used

- ✅ Functional Components only
- 📦 Hooks:
  - `useState`
  - `useEffect`
  - `useNavigate`, `useParams` from React Router

---

## 📜 License
This project is created for educational purposes under the SLIIT AF module.

