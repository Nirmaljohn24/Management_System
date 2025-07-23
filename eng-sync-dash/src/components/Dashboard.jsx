import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FolderOpen, 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Brain,
  Code2,
  GitBranch
} from 'lucide-react';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    engineers: 0,
    projects: 0,
    activeAssignments: 0,
    completedProjects: 0,
    avgCapacity: 0,
    aiToolsUsage: 0
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };
        const res = await fetch('http://localhost:5000/api/dashboard/stats', { headers });
        const stats = await res.json();
        setDashboardData({
          engineers: stats.totalEngineers,
          projects: stats.totalProjects,
          activeAssignments: stats.activeAssignments,
          completedProjects: 0, // You can add this to backend if needed
          avgCapacity: stats.averageCapacity,
          aiToolsUsage: 0 // Placeholder, update if backend provides
        });
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchDashboard();
  }, []);

  const StatCard = ({ title, value, icon: Icon, description, trend, color = "primary" }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-5 w-5 text-${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
        {trend && (
          <div className="flex items-center mt-2">
            <TrendingUp className="h-4 w-4 text-success mr-1" />
            <span className="text-xs text-success">{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Optionally fetch projects and activities from backend if available
  const projects = [];
  const recentActivities = [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress': return 'bg-primary text-primary-foreground';
      case 'Planning': return 'bg-warning text-warning-foreground';
      case 'Completed': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-destructive';
      case 'Medium': return 'text-warning';
      case 'Low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 border">
        <h1 className="text-3xl font-bold text-foreground">Engineering Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here's an overview of your engineering resources and project status.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Engineers"
          value={dashboardData.engineers}
          icon={Users}
          description="Active team members"
          trend="+2 this month"
          color="primary"
        />
        <StatCard
          title="Active Projects"
          value={dashboardData.projects}
          icon={FolderOpen}
          description="Currently in progress"
          trend="+1 this week"
          color="accent"
        />
        <StatCard
          title="Assignments"
          value={dashboardData.activeAssignments}
          icon={Calendar}
          description="Current assignments"
          color="warning"
        />
        <StatCard
          title="Completed Projects"
          value={dashboardData.completedProjects}
          icon={CheckCircle}
          description="This quarter"
          trend="+3 completed"
          color="success"
        />
      </div>

      {/* Capacity and AI Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Team Capacity Overview
            </CardTitle>
            <CardDescription>
              Average capacity utilization across all engineers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Capacity</span>
                <span>{dashboardData.avgCapacity}%</span>
              </div>
              <Progress value={dashboardData.avgCapacity} className="h-2" />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center pt-4">
              <div>
                <div className="text-2xl font-bold text-success">15</div>
                <div className="text-xs text-muted-foreground">Available</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-warning">6</div>
                <div className="text-xs text-muted-foreground">At Capacity</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-destructive">3</div>
                <div className="text-xs text-muted-foreground">Overloaded</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-accent" />
              AI Tools Integration
            </CardTitle>
            <CardDescription>
              GitHub Copilot and ChatGPT usage metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>AI Tools Adoption</span>
                <span>{dashboardData.aiToolsUsage}%</span>
              </div>
              <Progress value={dashboardData.aiToolsUsage} className="h-2" />
            </div>
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-primary" />
                  <span className="text-sm">GitHub Copilot</span>
                </div>
                <Badge variant="outline">20 active users</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-accent" />
                  <span className="text-sm">ChatGPT Integration</span>
                </div>
                <Badge variant="outline">18 active users</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-primary" />
              Active Projects
            </CardTitle>
            <CardDescription>
              Current project status and progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="space-y-2 p-3 rounded-lg border bg-card/50">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{project.name}</h4>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {project.engineers} engineers
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Due {project.deadline}
                    </span>
                    <span className={`font-medium ${getPriorityColor(project.priority)}`}>
                      {project.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Activities
            </CardTitle>
            <CardDescription>
              Latest updates and system activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="mt-1">
                    {activity.type === 'assignment' && <Users className="h-4 w-4 text-primary" />}
                    {activity.type === 'progress' && <TrendingUp className="h-4 w-4 text-success" />}
                    {activity.type === 'user' && <CheckCircle className="h-4 w-4 text-accent" />}
                    {activity.type === 'ai' && <Brain className="h-4 w-4 text-warning" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;