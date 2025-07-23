import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useToast } from '../hooks/use-toast';
import { 
  Plus, 
  Calendar,
  Users,
  FolderOpen,
  Clock,
  CheckCircle,
  AlertTriangle,
  Trash2,
  Edit
} from 'lucide-react';

const Assignments = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [assignments, setAssignments] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [formData, setFormData] = useState({
    engineerId: '',
    projectId: '',
    role: '',
    startDate: '',
    endDate: '',
    allocation: 100
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // TODO: Replace with your auth token logic
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };
        const [engRes, projRes, assignRes] = await Promise.all([
          fetch('https://management-system-1-884g.onrender.com/api/engineers', { headers }),
          fetch('https://management-system-1-884g.onrender.com/api/projects', { headers }),
          fetch('https://management-system-1-884g.onrender.com/api/assignments', { headers })
        ]);
        setEngineers(await engRes.json());
        setProjects(await projRes.json());
        setAssignments(await assignRes.json());
      } catch (err) {
        toast({ title: 'Error', description: 'Failed to load data from server', variant: 'destructive' });
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    try {
      if (editingAssignment) {
        const res = await fetch(`https://management-system-1-884g.onrender.com/api/assignments/${editingAssignment.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ ...formData, allocation: parseInt(formData.allocation) })
        });
        if (!res.ok) throw new Error('Failed to update assignment');
        const updated = await res.json();
        setAssignments(assignments.map(a => a.id === updated.id ? updated : a));
        toast({ title: 'Assignment updated', description: 'Assignment has been updated successfully.' });
      } else {
        const res = await fetch('https://management-system-1-884g.onrender.com/api/assignments', {
          method: 'POST',
          headers,
          body: JSON.stringify({ ...formData, allocation: parseInt(formData.allocation) })
        });
        if (!res.ok) throw new Error('Failed to create assignment');
        const created = await res.json();
        setAssignments([...assignments, created]);
        toast({ title: 'Assignment created', description: 'New assignment has been created successfully.' });
      }
      resetForm();
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      engineerId: assignment.engineerId.toString(),
      projectId: assignment.projectId.toString(),
      role: assignment.role,
      startDate: assignment.startDate,
      endDate: assignment.endDate,
      allocation: assignment.allocation.toString()
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    try {
      const res = await fetch(`https://management-system-1-884g.onrender.com/api/assignments/${id}`, {
        method: 'DELETE',
        headers
      });
      if (!res.ok) throw new Error('Failed to delete assignment');
      setAssignments(assignments.filter(a => a.id !== id));
      toast({ title: 'Assignment removed', description: 'Assignment has been removed from the system.', variant: 'destructive' });
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const resetForm = () => {
    setFormData({
      engineerId: '',
      projectId: '',
      role: '',
      startDate: '',
      endDate: '',
      allocation: 100
    });
    setEditingAssignment(null);
    setIsDialogOpen(false);
  };

  const getEngineerName = (engineerId) => {
    const engineer = engineers.find(e => e.id === engineerId);
    return engineer ? engineer.name : 'Unknown Engineer';
  };

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Planned': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      case 'On Hold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active': return <CheckCircle className="h-4 w-4" />;
      case 'Planned': return <Clock className="h-4 w-4" />;
      case 'Completed': return <CheckCircle className="h-4 w-4" />;
      case 'On Hold': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getAllocationColor = (allocation) => {
    if (allocation >= 90) return 'text-destructive';
    if (allocation >= 70) return 'text-warning';
    return 'text-success';
  };

  // Group assignments by status
  const activeAssignments = assignments.filter(a => a.status === 'Active');
  const plannedAssignments = assignments.filter(a => a.status === 'Planned');
  const completedAssignments = assignments.filter(a => a.status === 'Completed');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Assignments</h2>
          <p className="text-muted-foreground">Manage engineer project assignments</p>
        </div>
        {isAdmin && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingAssignment(null)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Assignment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}
                </DialogTitle>
                <DialogDescription>
                  {editingAssignment ? 'Update assignment details' : 'Assign an engineer to a project'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="engineerId">Engineer</Label>
                    <Select value={formData.engineerId} onValueChange={(value) => setFormData({...formData, engineerId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select engineer" />
                      </SelectTrigger>
                      <SelectContent>
                        {engineers.map(engineer => (
                          <SelectItem key={engineer.id} value={engineer.id.toString()}>
                            {engineer.name} - {engineer.department}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projectId">Project</Label>
                    <Select value={formData.projectId} onValueChange={(value) => setFormData({...formData, projectId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map(project => (
                          <SelectItem key={project.id} value={project.id.toString()}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role in Project</Label>
                    <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Lead Developer">Lead Developer</SelectItem>
                        <SelectItem value="Senior Developer">Senior Developer</SelectItem>
                        <SelectItem value="Developer">Developer</SelectItem>
                        <SelectItem value="Junior Developer">Junior Developer</SelectItem>
                        <SelectItem value="UI/UX Designer">UI/UX Designer</SelectItem>
                        <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
                        <SelectItem value="QA Engineer">QA Engineer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="allocation">Allocation (%)</Label>
                    <Select value={formData.allocation.toString()} onValueChange={(value) => setFormData({...formData, allocation: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="25">25%</SelectItem>
                        <SelectItem value="50">50%</SelectItem>
                        <SelectItem value="75">75%</SelectItem>
                        <SelectItem value="100">100%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      className="w-full px-3 py-2 border border-input rounded-md text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      className="w-full px-3 py-2 border border-input rounded-md text-sm"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingAssignment ? 'Update' : 'Create'} Assignment
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{activeAssignments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Planned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{plannedAssignments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">{completedAssignments.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Assignments List */}
      <div className="space-y-6">
        {/* Active Assignments */}
        {activeAssignments.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              Active Assignments ({activeAssignments.length})
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {activeAssignments.map((assignment) => (
                <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-base">{getEngineerName(assignment.engineerId)}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <FolderOpen className="h-3 w-3" />
                          {getProjectName(assignment.projectId)}
                        </CardDescription>
                      </div>
                      {isAdmin && (
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(assignment)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(assignment.id)}>
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(assignment.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(assignment.status)}
                          {assignment.status}
                        </div>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium">{assignment.role}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Allocation</p>
                        <p className={`font-medium ${getAllocationColor(assignment.allocation)}`}>
                          {assignment.allocation}%
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Progress</p>
                        <p className="font-medium">{assignment.progress}%</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Timeline</span>
                      </div>
                      <div className="text-sm flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {new Date(assignment.startDate).toLocaleDateString()} - {new Date(assignment.endDate).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Planned Assignments */}
        {plannedAssignments.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Planned Assignments ({plannedAssignments.length})
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {plannedAssignments.map((assignment) => (
                <Card key={assignment.id} className="hover:shadow-md transition-shadow border-dashed">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-base">{getEngineerName(assignment.engineerId)}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <FolderOpen className="h-3 w-3" />
                          {getProjectName(assignment.projectId)}
                        </CardDescription>
                      </div>
                      {isAdmin && (
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(assignment)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(assignment.id)}>
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(assignment.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(assignment.status)}
                          {assignment.status}
                        </div>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium">{assignment.role}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Allocation</p>
                        <p className={`font-medium ${getAllocationColor(assignment.allocation)}`}>
                          {assignment.allocation}%
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Starts In</p>
                        <p className="font-medium">
                          {Math.ceil((new Date(assignment.startDate) - new Date()) / (1000 * 60 * 60 * 24))} days
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-sm flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {new Date(assignment.startDate).toLocaleDateString()} - {new Date(assignment.endDate).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {assignments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No assignments found. Create your first assignment to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assignments;