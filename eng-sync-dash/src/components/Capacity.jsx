import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Users } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const Capacity = () => {
  const [capacityData, setCapacityData] = useState({
    overview: {
      totalEngineers: 0,
      averageCapacity: 0
    },
    engineers: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const [engRes, statsRes] = await Promise.all([
          fetch('http://localhost:5000/api/engineers', { headers }),
          fetch('http://localhost:5000/api/dashboard/stats', { headers })
        ]);

        const engineers = await engRes.json();
        const stats = await statsRes.json();

        setCapacityData({
          engineers,
          overview: {
            totalEngineers: stats.totalEngineers,
            averageCapacity: stats.averageCapacity
          }
        });
      } catch (err) {
        console.error('Error fetching capacity data:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Capacity Management</h2>
        <p className="text-muted-foreground">Overview from backend</p>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Engineers
            </CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{capacityData.overview.totalEngineers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Capacity
            </CardTitle>
            <BarChart3 className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{capacityData.overview.averageCapacity}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Engineers List */}
      <Card>
        <CardHeader>
          <CardTitle>Engineers</CardTitle>
          <CardDescription>Basic engineer data from backend</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {capacityData.engineers.map((eng) => (
            <div key={eng.id} className="p-4 border rounded bg-card/50">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">{eng.name}</h4>
                  <p className="text-sm text-muted-foreground">{eng.department}</p>
                </div>
                <Badge variant="outline">{eng.role}</Badge>
              </div>

              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Capacity</span>
                  <span className="font-medium">{eng.capacity}%</span>
                </div>
                <Progress value={eng.capacity} className="h-2" />
              </div>

              <div className="mt-2 text-sm text-muted-foreground">
                Projects Assigned: <span className="font-medium">{eng.projects}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Capacity;
