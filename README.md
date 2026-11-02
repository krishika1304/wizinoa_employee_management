# Employee Management System

A responsive MERN Stack web application designed to manage employee records efficiently. The application provides employee CRUD operations, admin authentication, pagination, and profile photo uploads.

## 🚀 Features

- **Admin Authentication:** Secure login using JWT authentication.
- **Employee Management:** Create, view, update, and delete employee records.
- **Admin Authorization:** Only authenticated administrators can create employee records.
- **Employee Photo Upload:** Upload and manage employee profile photos using Multer.
- **Pagination:** Display employee records across multiple pages.
- **Search:** Search employees by name, employee ID, department, or email.
- **Responsive UI:** Responsive interface for desktop, tablet, and mobile devices.
- **MVC Architecture:** Organized backend using Models, Controllers, and Routes.

## 🛠️ Technologies Used

### Frontend
- React.js
- Vite
- CSS3
- Axios
- React Router DOM
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose ODM
- JWT (JSON Web Token)
- bcryptjs
- Multer

## 📁 Project Structure

```text
employee-management-system/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   └── styles.css
│   └── package.json
│
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- MongoDB
- Git

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd employee-management-system
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file inside the backend directory and configure:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/wizinoa_employee_db
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173

ADMIN_NAME=System Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@12345
```

### 3. Create Admin Account

Run the following command to create the initial administrator account:

```bash
npm run seed:admin
```

### 4. Start the Backend Server

```bash
npm run dev
```

Backend server runs at:

`http://localhost:5000`

### 5. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

Frontend application runs at:

`http://localhost:5173`

## 🔐 Admin Login

For local development:

- **Email:** admin@example.com
- **Password:** Admin@12345

The administrator account is created using the seed script.

Change the default credentials before using the application in any shared or production environment.

## 📡 API Endpoints

All employee endpoints require a valid JWT token in the Authorization header.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Admin login |
| GET | `/api/auth/me` | Get authenticated user |
| GET | `/api/employees` | Get all employees |
| GET | `/api/employees/:id` | Get employee by ID |
| POST | `/api/employees` | Create employee |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |

### Authentication

Include the JWT token in API requests:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

### Employee Fields

- Employee ID
- Full Name
- Email
- Phone Number
- Department
- Designation
- Joining Date
- Salary
- Address
- Profile Photo

## 📸 File Upload

Multer is used to handle employee profile photo uploads.

- Supported formats: JPG, JPEG, PNG, WEBP
- Maximum file size: 2 MB
- Uploaded files are stored in the backend `uploads` directory.

## 🏗️ Architecture

The backend follows the MVC pattern:

- **Models:** Define MongoDB schemas using Mongoose.
- **Controllers:** Handle application logic and CRUD operations.
- **Routes:** Define API endpoints.
- **Middleware:** Handle authentication, authorization, and file uploads.

JWT authentication middleware verifies the token and attaches the authenticated user's information to `req.user`, making it accessible inside controllers.

## 👩‍💻 Author

Developed as part of the MERN Stack Developer Technical Assessment for Wizinoa.
