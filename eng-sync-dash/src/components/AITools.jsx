import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '../hooks/use-toast';
import { 
  Brain, 
  Code2, 
  TrendingUp, 
  Users, 
  Zap,
  GitBranch,
  MessageSquare,
  Target,
  CheckCircle,
  Clock,
  BarChart3,
  Settings
} from 'lucide-react';

const AITools = () => {
  const { toast } = useToast();
  const [aiData, setAiData] = useState({
    overview: {
      totalUsers: 22,
      copilotUsers: 20,
      chatgptUsers: 18,
      weeklyUsage: 345,
      productivityIncrease: 28
    },
    usage: [],
    insights: []
  });

  useEffect(() => {
    // Optionally fetch AI tools data from backend if available
    setAiData(prev => ({ ...prev, usage: [], insights: [] }));
  }, []);

  const getUsageColor = (usage) => {
    if (usage >= 90) return 'text-success';
    if (usage >= 70) return 'text-primary';
    if (usage >= 50) return 'text-warning';
    return 'text-muted-foreground';
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-blue-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  const handleIntegrationSetup = (tool) => {
    toast({
      title: `${tool} Integration`,
      description: `Setting up ${tool} integration for your team...`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">AI Tools Integration</h2>
          <p className="text-muted-foreground">Monitor and optimize AI tool usage across your engineering team</p>
        </div>
        <Button onClick={() => handleIntegrationSetup('New AI Tool')}>
          <Settings className="mr-2 h-4 w-4" />
          Configure Tools
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aiData.overview.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Active AI tool users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              GitHub Copilot
            </CardTitle>
            <Code2 className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{aiData.overview.copilotUsers}</div>
            <p className="text-xs text-muted-foreground">Active users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              ChatGPT
            </CardTitle>
            <Brain className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{aiData.overview.chatgptUsers}</div>
            <p className="text-xs text-muted-foreground">Active users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Weekly Usage
            </CardTitle>
            <BarChart3 className="h-5 w-5 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{aiData.overview.weeklyUsage}h</div>
            <p className="text-xs text-muted-foreground">Total hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Productivity Gain
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">+{aiData.overview.productivityIncrease}%</div>
            <p className="text-xs text-muted-foreground">vs. baseline</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Tool Usage by Engineer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-primary" />
            Individual AI Tool Usage
          </CardTitle>
          <CardDescription>
            Detailed breakdown of AI tool adoption and productivity metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiData.usage.map((engineer) => (
              <div key={engineer.id} className="p-4 rounded-lg border bg-card/30">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-medium">{engineer.engineerName}</h4>
                    <p className="text-sm text-muted-foreground">{engineer.department}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      Productivity: {engineer.productivityScore}%
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>GitHub Copilot</span>
                      <span className={`font-medium ${getUsageColor(engineer.copilotUsage)}`}>
                        {engineer.copilotUsage}%
                      </span>
                    </div>
                    <Progress value={engineer.copilotUsage} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>ChatGPT</span>
                      <span className={`font-medium ${getUsageColor(engineer.chatgptUsage)}`}>
                        {engineer.chatgptUsage}%
                      </span>
                    </div>
                    <Progress value={engineer.chatgptUsage} className="h-2" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Weekly Commits</p>
                    <p className="text-lg font-semibold">{engineer.weeklyCommits}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Code Quality</p>
                    <p className="text-lg font-semibold">{engineer.codeQuality}%</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Favorite AI Tools:</p>
                  <div className="flex flex-wrap gap-2">
                    {engineer.favoriteTools.map((tool, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Integration Setup */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-warning" />
              Available AI Integrations
            </CardTitle>
            <CardDescription>
              Set up and configure AI tools for your team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Code2 className="h-8 w-8 text-success" />
                <div>
                  <h4 className="font-medium">GitHub Copilot</h4>
                  <p className="text-sm text-muted-foreground">AI pair programmer</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">Integrated</Badge>
                <Button size="sm" variant="outline" onClick={() => handleIntegrationSetup('GitHub Copilot')}>
                  Configure
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Brain className="h-8 w-8 text-blue-500" />
                <div>
                  <h4 className="font-medium">ChatGPT-4</h4>
                  <p className="text-sm text-muted-foreground">Advanced AI assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">Integrated</Badge>
                <Button size="sm" variant="outline" onClick={() => handleIntegrationSetup('ChatGPT-4')}>
                  Configure
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-8 w-8 text-purple-500" />
                <div>
                  <h4 className="font-medium">Claude</h4>
                  <p className="text-sm text-muted-foreground">Anthropic AI assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Available</Badge>
                <Button size="sm" onClick={() => handleIntegrationSetup('Claude')}>
                  Integrate
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <GitBranch className="h-8 w-8 text-orange-500" />
                <div>
                  <h4 className="font-medium">Copilot Chat</h4>
                  <p className="text-sm text-muted-foreground">Conversational coding</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">Integrated</Badge>
                <Button size="sm" variant="outline" onClick={() => handleIntegrationSetup('Copilot Chat')}>
                  Configure
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              AI Impact Insights
            </CardTitle>
            <CardDescription>
              Data-driven insights on AI tool effectiveness
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiData.insights.map((insight) => (
              <div key={insight.id} className="p-3 border rounded-lg bg-card/50">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">{insight.title}</h4>
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                    {insight.metric}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
                <div className="flex items-center gap-1 mt-2">
                  <CheckCircle className="h-3 w-3 text-success" />
                  <span className="text-xs text-success">Positive Impact</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Usage Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Usage Analytics & Recommendations
          </CardTitle>
          <CardDescription>
            AI-powered recommendations for optimizing tool usage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Increase Copilot Adoption</h4>
              <p className="text-sm text-blue-700 mb-3">
                David Kim shows low Copilot usage (65%). Providing training could increase productivity by 15-20%.
              </p>
              <Button size="sm" variant="outline" className="text-blue-700 border-blue-300">
                Schedule Training
              </Button>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Excellent AI Integration</h4>
              <p className="text-sm text-green-700 mb-3">
                Lisa Wang demonstrates optimal AI tool usage with 94% productivity score. Consider her as AI champion.
              </p>
              <Button size="sm" variant="outline" className="text-green-700 border-green-300">
                Make Champion
              </Button>
            </div>
            
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Team Knowledge Sharing</h4>
              <p className="text-sm text-yellow-700 mb-3">
                Schedule monthly AI tools showcase sessions to share best practices and new features.
              </p>
              <Button size="sm" variant="outline" className="text-yellow-700 border-yellow-300">
                Schedule Session
              </Button>
            </div>
            
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-medium text-purple-800 mb-2">Expand Tool Portfolio</h4>
              <p className="text-sm text-purple-700 mb-3">
                Consider integrating Claude for teams needing advanced reasoning and analysis capabilities.
              </p>
              <Button size="sm" variant="outline" className="text-purple-700 border-purple-300">
                Evaluate Claude
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AITools;