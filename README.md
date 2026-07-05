# Portfolio Management System
**A full-stack portfolio management system built using Next.js, MongoDB, and JWT Authentication.**

##Features
**User Authentication
Dashboard
Add/Edit/Delete Projects
Contact Management
Skills Management
Search
Filters
Image Upload
Profile Management
Notifications
Responsive Design**


## Installation Guide

### Prerequisites

- Node.js (v18 or later)
- npm
- MongoDB Atlas Account
- Cloudinary Account
- Git

### Clone Repository

```bash
git clone https://github.com/Arham1033/personal_portfolio.git
```

### Navigate to Project

```bash
cd personal_portfolio
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file and add the following:

```env
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Start Development Server

```bash
npm run dev
```

Visit:

```
http://localhost:3000
```


##Folder Structure

portfolio/
│
├── app/
│   ├── about/
│   ├── api/
│   ├── content/
│   ├── login/
│   └── preview/
│   └── profile/
│   └── register/
│   └── page.js
│   └── layout.js
│
├── components/
│
├── context/
│
├── lib/
│
├── models/
│
├── public/
│
├── .env
│
├── package.json


## API Documentation

| Endpoint            | Method | Description 
|---------------------|--------|-------------
| /api/register       | POST   | Register a new user 
| /api/login          | POST   | Authenticate user 
| /api/profile        | GET    | Retrieve logged-in user profile 
| /api/profile        | PUT    | Update user profile 
| /api/profile/password | PUT  | Change user password 
| /api/projects       | GET    | Retrieve all projects 
| /api/projects       | POST   | Add a new project 
| /api/projects/:id   | PUT    | Update a project 
| /api/projects/:id   | DELETE | Delete a project 
| /api/skills         | GET    | Retrieve all skills 
| /api/skills         | POST   | Add a new skill 
| /api/skills/:id     | PUT    | Update a skill 
| /api/skills/:id     | DELETE | Delete a skill 
| /api/categories     | GET    | Retrieve all categories 
| /api/categories     | POST   | Add a new category 
| /api/categories/:id | PUT    | Update a category 
| /api/categories/:id | DELETE | Delete a category 
| /api/notifications  | GET    | Retrieve notifications 


## Deployment Links

### Live Application
**https://personal-portfolio.vercel.app**

### GitHub Repository
**https://github.com/Arham1033/personal_portfolio**


## Technologies Used

- Next.js 15
- JavaScript (ES6+)
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcrypt.js
- Tailwind CSS
- HTML5
- CSS3
- Vercel
- Git
- GitHub
- REST API
- Context API
- React Hot Toast**


## Author
**Muhammad Arham**
**Codiora Software House** 
**Full Stack Web Development**
**July 05, 2026**


