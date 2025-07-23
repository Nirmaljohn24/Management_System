import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '../hooks/use-toast';
import { Loader2, Users, Shield, Code, Brain } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      toast({
        title: "Login successful",
        description: "Welcome to Engineering Resource Management System",
      });
    } else {
      toast({
        title: "Login failed",
        description: result.error,
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  const fillCredentials = (role) => {
    if (role === 'admin') {
      setEmail('admin@company.com');
      setPassword('admin123');
    } else {
      setEmail('user@company.com');
      setPassword('user123');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Hero content */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Engineering Resource Management
            </h1>
            <p className="text-xl text-muted-foreground">
              Streamline your engineering team management with AI-powered insights and intelligent resource allocation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-4 rounded-lg bg-card border shadow-sm">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Team Management</h3>
                <p className="text-sm text-muted-foreground">Manage engineers and teams</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 rounded-lg bg-card border shadow-sm">
              <Code className="h-8 w-8 text-accent" />
              <div>
                <h3 className="font-semibold">Project Tracking</h3>
                <p className="text-sm text-muted-foreground">Monitor project progress</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 rounded-lg bg-card border shadow-sm">
              <Brain className="h-8 w-8 text-warning" />
              <div>
                <h3 className="font-semibold">AI Integration</h3>
                <p className="text-sm text-muted-foreground">GitHub Copilot & ChatGPT</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 rounded-lg bg-card border shadow-sm">
              <Shield className="h-8 w-8 text-success" />
              <div>
                <h3 className="font-semibold">Role-based Access</h3>
                <p className="text-sm text-muted-foreground">Secure user management</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <Card className="w-full max-w-md mx-auto shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign in</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
            
            <div className="mt-6 space-y-2">
              <p className="text-sm text-muted-foreground text-center">Demo Credentials:</p>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => fillCredentials('admin')}
                  className="text-xs"
                >
                  Admin Login
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => fillCredentials('user')}
                  className="text-xs"
                >
                  User Login
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;