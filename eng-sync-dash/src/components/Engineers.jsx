import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '../hooks/use-toast';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar,
  MapPin,
  Code,
  Brain,
  TrendingUp
} from 'lucide-react';

const Engineers = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [engineers, setEngineers] = useState([]);
  const [filteredEngineers, setFilteredEngineers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEngineer, setEditingEngineer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    role: '',
    skills: '',
    experience: '',
    capacity: 100,
    location: '',
    startDate: ''
  });

  useEffect(() => {
    const fetchEngineers = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };
        const res = await fetch('https://management-system-1-884g.onrender.com/api/engineers', { headers });
        const data = await res.json();
        setEngineers(data);
        setFilteredEngineers(data);
      } catch (err) {
        toast({ title: 'Error', description: 'Failed to load engineers', variant: 'destructive' });
      }
    };
    fetchEngineers();
  }, []);

  useEffect(() => {
    const filtered = engineers.filter(engineer =>
      engineer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      engineer.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      engineer.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      engineer.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredEngineers(filtered);
  }, [searchTerm, engineers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    try {
      if (editingEngineer) {
        const res = await fetch(`https://management-system-1-884g.onrender.com/api/engineers/${editingEngineer.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ ...formData, skills: formData.skills.split(',').map(s => s.trim()) })
        });
        if (!res.ok) throw new Error('Failed to update engineer');
        const updated = await res.json();
        setEngineers(engineers.map(e => e.id === updated.id ? updated : e));
        setFilteredEngineers(engineers.map(e => e.id === updated.id ? updated : e));
        toast({ title: 'Engineer updated', description: 'Engineer information has been updated successfully.' });
      } else {
        const res = await fetch('https://management-system-1-884g.onrender.com/api/engineers', {
          method: 'POST',
          headers,
          body: JSON.stringify({ ...formData, skills: formData.skills.split(',').map(s => s.trim()) })
        });
        if (!res.ok) throw new Error('Failed to add engineer');
        const created = await res.json();
        setEngineers([...engineers, created]);
        setFilteredEngineers([...engineers, created]);
        toast({ title: 'Engineer added', description: 'New engineer has been added successfully.' });
      }
      resetForm();
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleEdit = (engineer) => {
    setEditingEngineer(engineer);
    setFormData({
      ...engineer,
      skills: engineer.skills.join(', ')
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    try {
      const res = await fetch(`https://management-system-1-884g.onrender.com/api/engineers/${id}`, {
        method: 'DELETE',
        headers
      });
      if (!res.ok) throw new Error('Failed to delete engineer');
      setEngineers(engineers.filter(e => e.id !== id));
      setFilteredEngineers(engineers.filter(e => e.id !== id));
      toast({ title: 'Engineer removed', description: 'Engineer has been removed from the system.', variant: 'destructive' });
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      department: '',
      role: '',
      skills: '',
      experience: '',
      capacity: 100,
      location: '',
      startDate: ''
    });
    setEditingEngineer(null);
    setIsDialogOpen(false);
  };

  const getCapacityColor = (capacity) => {
    if (capacity >= 90) return 'text-destructive';
    if (capacity >= 75) return 'text-warning';
    return 'text-success';
  };

  const getDepartmentColor = (department) => {
    const colors = {
      'Frontend': 'bg-blue-100 text-blue-800',
      'Backend': 'bg-green-100 text-green-800',
      'Full Stack': 'bg-purple-100 text-purple-800',
      'DevOps': 'bg-orange-100 text-orange-800',
      'Mobile': 'bg-pink-100 text-pink-800',
      'QA': 'bg-yellow-100 text-yellow-800'
    };
    return colors[department] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Engineers</h2>
          <p className="text-muted-foreground">Manage your engineering team members</p>
        </div>
        {isAdmin && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingEngineer(null)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Engineer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingEngineer ? 'Edit Engineer' : 'Add New Engineer'}
                </DialogTitle>
                <DialogDescription>
                  {editingEngineer ? 'Update engineer information' : 'Add a new engineer to your team'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Frontend">Frontend</SelectItem>
                        <SelectItem value="Backend">Backend</SelectItem>
                        <SelectItem value="Full Stack">Full Stack</SelectItem>
                        <SelectItem value="DevOps">DevOps</SelectItem>
                        <SelectItem value="Mobile">Mobile</SelectItem>
                        <SelectItem value="QA">QA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience</Label>
                    <Input
                      id="experience"
                      value={formData.experience}
                      onChange={(e) => setFormData({...formData, experience: e.target.value})}
                      placeholder="e.g., 3 years"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity (%)</Label>
                    <Input
                      id="capacity"
                      type="number"
                      min={0}
                      max={100}
                      value={formData.capacity}
                      onChange={(e) => setFormData({...formData, capacity: Number(e.target.value)})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills (comma-separated)</Label>
                  <Input
                    id="skills"
                    value={formData.skills}
                    onChange={(e) => setFormData({...formData, skills: e.target.value})}
                    placeholder="React, Node.js, TypeScript"
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingEngineer ? 'Update' : 'Add'} Engineer
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search engineers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Engineers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEngineers.map((engineer) => (
          <Card key={engineer.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{engineer.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Badge className={getDepartmentColor(engineer.department)}>
                      {engineer.department}
                    </Badge>
                  </CardDescription>
                </div>
                {isAdmin && (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(engineer)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(engineer.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="font-medium text-sm">{engineer.role}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  {engineer.email}
                </div>
                {engineer.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {engineer.phone}
                  </div>
                )}
                {engineer.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {engineer.location}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Capacity</span>
                  <span className={`font-medium ${getCapacityColor(engineer.capacity)}`}>
                    {engineer.capacity}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      engineer.capacity >= 90 ? 'bg-destructive' :
                      engineer.capacity >= 75 ? 'bg-warning' : 'bg-success'
                    }`}
                    style={{ width: `${engineer.capacity}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Code className="h-3 w-3" />
                    Projects
                  </div>
                  <div className="font-medium">{engineer.currentProjects}</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Brain className="h-3 w-3" />
                    AI Usage
                  </div>
                  <div className="font-medium">{engineer.aiToolsUsage}%</div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Skills</p>
                <div className="flex flex-wrap gap-1">
                  {engineer.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {engineer.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{engineer.skills.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Joined {new Date(engineer.startDate).toLocaleDateString()}
                </span>
                <span>{engineer.experience}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEngineers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No engineers found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default Engineers;