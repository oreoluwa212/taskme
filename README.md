# TaskMe AI - Simplify Your Workflow with AI Productivity Partner

![TaskMe AI](./frontend/public/images/desktopView.png)

Welcome to TaskMe AI, your complete AI-driven project management solution designed to simplify your workflow and enhance productivity. TaskMe AI helps you break down project timelines into manageable daily tasks, ensuring you stay on track and meet your deadlines with ease.

## 🚀 Features

![TaskMe AI](./frontend/public/images/dashboard.png)

### 🤖 AI-Powered Task Management

- **Intelligent Task Generation**: Automatically break down projects into actionable subtasks using Google's Gemini AI
- **Smart Project Planning**: Intelligent timeline estimation and resource allocation
- **Real-time Insights**: Project analytics and risk assessment

### 📋 Project Management

- **Full CRUD Operations**: Complete project and task management
- **Progress Tracking**: Monitor your progress daily and adjust tasks as needed
- **Timeline Management**: Stay on top of your deadlines with smart scheduling

### 💬 Chat Interface

- **Conversational AI**: Natural language project planning assistance
- **Context-aware Responses**: Get intelligent suggestions for your projects

### 🔐 Security & User Management

- **Secure Authentication**: JWT-based authentication system
- **User Profiles**: Personalized dashboards and project tracking
- **Media Upload**: Cloudinary integration for file uploads

### 🎨 User Experience

- **Intuitive Design**: User-friendly interface built with React and Tailwind CSS
- **Responsive Design**: Works seamlessly across all devices
- **Real-time Updates**: Live progress tracking and notifications

## 🛠️ Tech Stack

### Frontend

- **React** - Modern UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Figma** - Design and prototyping
- **Vercel** - Frontend deployment

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **Google Generative AI (Gemini)** - AI integration
- **JWT** - Authentication
- **Cloudinary** - File upload service
- **Nodemailer** - Email service
- **Helmet.js & CORS** - Security

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Google AI API Key (Gemini)
- Cloudinary account (for file uploads)

## 🔧 Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/oreoluwa212/taskme-ai.git
   cd taskme-ai
   ```

2. **Install dependencies for both frontend and backend**

   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Environment Setup**

   Create a `.env` file in the `backend` directory:

   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Database
   MONGODB_URI=mongodb://localhost:27017/taskme-ai
   # OR for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskme-ai

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRATION=7d

   # Google AI (Gemini)
   GEMINI_API_KEY=your-gemini-api-key

   # Cloudinary (for file uploads)
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

   # Email Configuration
   EMAIL_USERNAME=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   EMAIL_FROM=TaskMe <your-email@gmail.com>
   ```

   Create a `.env.local` file in the `frontend` folder:

   ```env
   REACT_APP_API_URL=http://localhost:3000/api
   ```

4. **Start the application**

   Run frontend and backend in separate terminals:

   **Terminal 1 - Backend:**

   ```bash
   cd backend
   npm run dev
   # Backend API will be available at http://localhost:3000
   ```

   **Terminal 2 - Frontend:**

   ```bash
   cd frontend
   npm run dev
   # Frontend will be available at http://localhost:3001
   ```

## 📁 Project Structure

```
taskme-ai/
├── frontend/                   # Frontend React application
│   ├── public/                 # Frontend public assets
│   │   └── images/             # App screenshots and assets
│   ├── src/                    # Frontend source code
│   │   ├── components/         # React components
│   │   ├── pages/              # Application pages
│   │   ├── hooks/              # Custom React hooks
│   │   ├── utils/              # Utility functions
│   │   └── styles/             # CSS and styling
│   └── package.json            # Frontend dependencies
├── backend/                    # Backend API
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js     # MongoDB connection
│   │   ├── models/
│   │   │   ├── User.js         # User schema
│   │   │   ├── Project.js      # Project schema
│   │   │   ├── Message.js      # Message schema
│   │   │   ├── Chat.js         # Chat schema
│   │   │   └── Subtask.js      # Subtask schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js   # Authentication routes
│   │   │   ├── userRoutes.js   # User management routes
│   │   │   ├── projectRoutes.js # Project CRUD routes
│   │   │   ├── subtaskRoutes.js # Subtask routes
│   │   │   └── chatRoutes.js   # AI chat routes
│   │   ├── middleware/
│   │   │   └── authMiddleware.js # JWT authentication middleware
│   │   ├── services/
│   │   │   └── aiService.js    # AI integration service
│   │   └── server.js           # Main server file
│   └── package.json            # Backend dependencies
└── README.md                   # This file
```

## 📚 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### Login User

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

### Project Endpoints

#### Create Project

```http
POST /api/projects
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Website Redesign",
  "description": "Complete redesign of company website",
  "timeline": 30,
  "priority": "High",
  "category": "Development"
}
```

#### Get All Projects

```http
GET /api/projects
Authorization: Bearer <your-jwt-token>
```

#### Get Single Project

```http
GET /api/projects/:id
Authorization: Bearer <your-jwt-token>
```

#### Update Project

```http
PUT /api/projects/:id
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Updated Project Name",
  "priority": "Medium"
}
```

#### Delete Project

```http
DELETE /api/projects/:id
Authorization: Bearer <your-jwt-token>
```

### Subtask Endpoints

#### Get Project Subtasks

```http
GET /api/subtasks/project/:projectId
Authorization: Bearer <your-jwt-token>
```

#### Update Subtask

```http
PUT /api/subtasks/:id
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "status": "completed",
  "progress": 100
}
```

### Chat Endpoints

#### Send Chat Message

```http
POST /api/chats
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "message": "Help me plan a mobile app development project"
}
```

#### Get Chat History

```http
GET /api/chats
Authorization: Bearer <your-jwt-token>
```

## 🤖 AI Service Features

The AI service powered by Google's Gemini provides:

### Intelligent Task Breakdown

- Converts project descriptions into 5-15 actionable subtasks
- Follows SMART criteria (Specific, Measurable, Achievable, Relevant, Time-bound)
- Includes realistic time estimates and dependencies

### Smart Scheduling

- Automatically schedules tasks with proper dependencies
- Ensures all dates are in the future
- Includes buffer time and risk considerations

### Project Insights

- Timeline feasibility analysis
- Complexity and risk assessment
- Resource requirement estimation
- Success metrics generation

### Chat Integration

- Natural language project planning
- Conversational task refinement
- Context-aware responses

## 🎯 How It Works

1. **Input Your Project**

   - Enter the details of your project, including the timeline and key milestones

2. **AI Task Generation**

   - TaskMe AI automatically breaks down your project into manageable daily tasks using advanced AI

3. **Track Your Progress**

   - Monitor your progress in real-time, adjust tasks as needed, and stay on top of your deadlines

4. **Chat with AI**
   - Get intelligent suggestions and assistance through our conversational AI interface

## 🌟 Mission and Values

TaskMe AI was born out of the collective frustration of a group of passionate individuals who felt overwhelmed by the complexity of existing task management tools. We believe there had to be a better way—a simpler, more intuitive solution to help individuals stay organized, productive, and focused on what matters most.

### Our Mission

To empower individuals to achieve their goals with ease and efficiency through intelligent automation.

### Our Values

- **Transparency:** Clear and open communication at all times
- **Simplicity:** Making task management straightforward and stress-free
- **User-Centricity:** Focusing on the needs and experiences of our users
- **Innovation:** Leveraging AI to create smarter productivity solutions

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: BCrypt for secure password storage
- **Helmet.js**: Security headers for Express
- **CORS Configuration**: Cross-origin resource sharing setup
- **Input Validation**: Request validation and sanitization

## 🚀 Deployment

### Frontend Deployment (Vercel)

The frontend is deployed on Vercel and automatically deploys from the main branch.

### Backend Deployment (Render)

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Set the root directory to `backend`
4. Configure the following settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. Add environment variables in Render dashboard

## 📈 Performance Considerations

- **Caching**: AI service includes pattern-based caching for similar projects
- **Rate Limiting**: Built-in quota system for AI chat requests
- **Database Indexing**: Optimized MongoDB queries
- **Memory Management**: Efficient data processing for large projects
- **Code Splitting**: Frontend optimized with React lazy loading

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🐛 Known Issues

- AI service may occasionally generate tasks with past dates (fallback mechanisms in place)
- Large projects (50+ tasks) may experience slower response times
- Chat quota resets daily (configurable in production)

## 🔮 Roadmap

- [ ] Real-time notifications
- [ ] Team collaboration features
- [ ] Advanced analytics dashboard
- [ ] Integration with external calendar apps
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Offline functionality
- [ ] Integration with popular project management tools

## 🙏 Acknowledgments

- Google Generative AI for powering the intelligent features
- MongoDB for reliable data storage
- Express.js and React communities for excellent documentation
- All contributors and testers

---

**Made with ❤️ by [Oreoluwa](https://github.com/oreoluwa212)**

_TaskMe AI - Where productivity meets intelligence._
