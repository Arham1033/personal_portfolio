# Personal Portfolio
**A full-stack portfolio management system built using Next.js, MongoDB Atlas, Cloudinary, and Tailwind CSS.**

## Features
- User Authentication
- Dashboard with Statistics
- Profile Management
- About Section Management
- Project Management (CRUD)
- Skills Management (CRUD)
- Category Management
- Contact Management
- Notification System
- Activity Tracking
- Cloudinary Image Upload & Management
- Search & Filter Projects
- Search & Filter Skills
- Responsive Design
- Loading Indicators
- Empty State Handling
- Toast Notifications


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


## Folder Structure
```text
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
```

## API Documentation

## API Documentation

| Endpoint                 | Method | Description |
|--------------------------|--------|-------------|
| /api/register            | POST   | Register a new user |
| /api/login               | POST   | Authenticate user |
| /api/user/update         | PUT    | Update user profile and password |
| /api/user/stats/:id      | GET    | Retrieve user statistics |
| /api/user/view           | POST   | Increment profile view count |
| /api/projects            | GET    | Retrieve all projects |
| /api/projects            | POST   | Add a new project |
| /api/projects/:id        | PUT    | Update a project |
| /api/projects/:id        | DELETE | Delete a project |
| /api/skills              | GET    | Retrieve all skills |
| /api/skills              | POST   | Add a new skill |
| /api/skills/:id          | PUT    | Update a skill |
| /api/skills/:id          | DELETE | Delete a skill |
| /api/about               | GET    | Retrieve all About sections |
| /api/about               | POST   | Add a new About section |
| /api/about/:id           | PUT    | Update an About section |
| /api/about/:id           | DELETE | Delete an About section |
| /api/contact             | GET    | Retrieve contact information |
| /api/contact             | POST   | Update contact information |
| /api/categories          | GET    | Retrieve all categories |
| /api/categories          | POST   | Add a new category |
| /api/categories/:id      | PUT    | Update a category |
| /api/categories/:id      | DELETE | Delete a category |
| /api/notifications       | GET    | Retrieve notifications |
| /api/notifications       | POST   | Create a notification |


## Deployment Links

### Live Application
https://personal-portfolio.vercel.app

### GitHub Repository
https://github.com/Arham1033/personal_portfolio


## Technologies Used

- Next.js 16.2.7
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
- React Hot Toast


## Author
- Muhammad Arham
- Codiora Software House
- Full Stack Web Development
- July 12, 2026


## License
This project is for educational and portfolio purposes.