# Workflow Summary

1. **Authentication**:  
   - Users log in as Admin or User using provided credentials.
   - Role-based access controls what features are available.

2. **Dashboard**:  
   - Shows an overview of engineer capacity, project status, assignments, and AI tool usage.

3. **Engineer Management**:  
   - Admins can add, edit, or remove engineers.
   - Each engineer has details like skills, department, role, and capacity.
   - Capacity can be set and updated from the UI and is tracked in real time.

4. **Project Management**:  
   - Admins can create, update, or delete projects.
   - Projects have timelines, priorities, and progress tracking.

5. **Assignment Management**:  
   - Engineers are assigned to projects with specific roles and workload allocations.
   - Assignments track start/end dates and status.

6. **Capacity Planning**:  
   - The system monitors and displays each engineer’s utilization.
   - Admins can adjust capacity to balance workloads.

7. **AI Tools Integration**:  
   - Tracks usage of tools like GitHub Copilot and ChatGPT for productivity insights.

8. **Responsive UI**:  
   - All features are accessible via a modern, responsive web interface.

9. **Backend API**:  
   - All data operations (CRUD for engineers, projects, assignments) are handled via secure REST API endpoints.

10. **Real-Time Updates**:  
    - Changes in capacity, assignments, or project status are reflected immediately in the dashboard and relevant views.

This workflow ensures efficient management of engineering resources, project tracking, and workload balancing with integrated AI tool monitoring.
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