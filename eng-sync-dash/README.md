# Engineering Resource Management System

A full-stack application for managing engineers, projects, and assignments with AI tools integration.

## Features

- **Role-based Authentication** (Admin/User access)
- **Dashboard** with capacity overview and AI tools metrics
- **Engineer Management** with skills tracking and capacity monitoring
- **Project Management** with timeline and progress tracking
- **Assignment Management** with workload allocation
- **Capacity Planning** with real-time utilization monitoring
- **AI Tools Integration** (GitHub Copilot, ChatGPT usage tracking)
- **Responsive Design** with beautiful UI components

## Demo Credentials

- **Admin**: admin@company.com / admin123
- **User**: user@company.com / user123

## Frontend Setup (React)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Backend Code (Node.js + Express)

Create a new directory for backend and add these files:

### 1. package.json
```json
{
  "name": "erms-backend",
  "version": "1.0.0",
  "description": "Engineering Resource Management System Backend",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

### 2. server.js
```javascript
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data storage
let engineers = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    department: 'Frontend',
    role: 'Senior Frontend Developer',
    skills: ['React', 'TypeScript', 'Next.js'],
    capacity: 85,
    projects: 2
  },
  {
    id: '2', 
    name: 'Michael Rodriguez',
    email: 'michael.rodriguez@company.com',
    department: 'Backend',
    role: 'Backend Engineer',
    skills: ['Node.js', 'Python', 'PostgreSQL'],
    capacity: 70,
    projects: 1
  }
];

let projects = [
  {
    id: '1',
    name: 'Mobile App Redesign',
    description: 'Complete redesign of mobile app',
    status: 'In Progress',
    priority: 'High',
    progress: 75,
    startDate: '2024-01-15',
    endDate: '2024-02-15'
  }
];

let assignments = [
  {
    id: '1',
    engineerId: '1',
    projectId: '1',
    role: 'Lead Frontend Developer',
    allocation: 80,
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    status: 'Active'
  }
];

const users = [
  {
    id: '1',
    email: 'admin@company.com',
    password: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    name: 'Admin User'
  },
  {
    id: '2',
    email: 'user@company.com', 
    password: bcrypt.hashSync('user123', 10),
    role: 'user',
    name: 'Regular User'
  }
];

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Routes

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  });
});

// Engineers routes
app.get('/api/engineers', authenticateToken, (req, res) => {
  res.json(engineers);
});

app.post('/api/engineers', authenticateToken, requireAdmin, (req, res) => {
  const newEngineer = {
    id: uuidv4(),
    ...req.body,
    projects: 0
  };
  engineers.push(newEngineer);
  res.status(201).json(newEngineer);
});

app.put('/api/engineers/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const engineerIndex = engineers.findIndex(e => e.id === id);
  
  if (engineerIndex === -1) {
    return res.status(404).json({ error: 'Engineer not found' });
  }

  engineers[engineerIndex] = { ...engineers[engineerIndex], ...req.body };
  res.json(engineers[engineerIndex]);
});

app.delete('/api/engineers/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  engineers = engineers.filter(e => e.id !== id);
  res.status(204).send();
});

// Projects routes
app.get('/api/projects', authenticateToken, (req, res) => {
  res.json(projects);
});

app.post('/api/projects', authenticateToken, requireAdmin, (req, res) => {
  const newProject = {
    id: uuidv4(),
    ...req.body
  };
  projects.push(newProject);
  res.status(201).json(newProject);
});

app.put('/api/projects/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex(p => p.id === id);
  
  if (projectIndex === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }

  projects[projectIndex] = { ...projects[projectIndex], ...req.body };
  res.json(projects[projectIndex]);
});

app.delete('/api/projects/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  projects = projects.filter(p => p.id !== id);
  res.status(204).send();
});

// Assignments routes
app.get('/api/assignments', authenticateToken, (req, res) => {
  res.json(assignments);
});

app.post('/api/assignments', authenticateToken, requireAdmin, (req, res) => {
  const newAssignment = {
    id: uuidv4(),
    ...req.body,
    status: 'Active'
  };
  assignments.push(newAssignment);
  res.status(201).json(newAssignment);
});

app.put('/api/assignments/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const assignmentIndex = assignments.findIndex(a => a.id === id);
  
  if (assignmentIndex === -1) {
    return res.status(404).json({ error: 'Assignment not found' });
  }

  assignments[assignmentIndex] = { ...assignments[assignmentIndex], ...req.body };
  res.json(assignments[assignmentIndex]);
});

app.delete('/api/assignments/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  assignments = assignments.filter(a => a.id !== id);
  res.status(204).send();
});

// Dashboard stats
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
  const stats = {
    totalEngineers: engineers.length,
    totalProjects: projects.length,
    activeAssignments: assignments.filter(a => a.status === 'Active').length,
    averageCapacity: Math.round(engineers.reduce((sum, e) => sum + e.capacity, 0) / engineers.length)
  };
  res.json(stats);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 3. .env
```
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
```

## Full Project Structure

```
engineering-resource-management/
├── frontend/                    # React frontend (this repository)
│   ├── src/
│   │   ├── components/         # All UI components
│   │   ├── contexts/          # React contexts (Auth)
│   │   ├── pages/             # Page components
│   │   └── lib/               # Utilities
│   └── public/
└── backend/                   # Node.js backend
    ├── server.js              # Main server file
    ├── package.json           # Dependencies
    └── .env                   # Environment variables
```

## Running the Complete System

1. **Frontend**: Already set up in this repository
2. **Backend**: Create backend folder with above files, run `npm install` then `npm run dev`
3. **Access**: Frontend on http://localhost:8080, Backend API on http://localhost:5000

The system includes role-based access, CRUD operations for all entities, capacity tracking, and AI tools integration monitoring.
