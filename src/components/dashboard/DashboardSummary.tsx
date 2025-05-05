
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useAuth } from "@/contexts/AuthContext";
import { getUserDashboardData } from "@/lib/local-storage-db";

export const DashboardSummary: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = React.useState<any>(null);

  React.useEffect(() => {
    if (user) {
      const data = getUserDashboardData(user.id);
      setDashboardData(data);
    }
  }, [user]);

  if (!dashboardData) return null;

  const statusData = [
    { name: "To Do", value: dashboardData.tasksByStatus.todo, color: "#94a3b8" },
    { name: "In Progress", value: dashboardData.tasksByStatus.inProgress, color: "#3b82f6" },
    { name: "Review", value: dashboardData.tasksByStatus.review, color: "#eab308" },
    { name: "Done", value: dashboardData.tasksByStatus.done, color: "#22c55e" },
  ];

  const priorityData = [
    { name: "Low", value: dashboardData.tasksByPriority.low, color: "#22c55e" },
    { name: "Medium", value: dashboardData.tasksByPriority.medium, color: "#eab308" },
    { name: "High", value: dashboardData.tasksByPriority.high, color: "#ef4444" },
  ];

  const completionPercentage = Math.round(dashboardData.completionRate * 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <Card className="col-span-1">
        <CardHeader className="pb-2">
          <CardTitle>Task Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-secondary/50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold">
                {dashboardData.assignedTasks.length}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Assigned Tasks</div>
            </div>
            <div className="bg-secondary/50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold">
                {dashboardData.overdueTasks.length}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Overdue Tasks</div>
            </div>
            <div className="bg-secondary/50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold">
                {dashboardData.createdTasks.length}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Created Tasks</div>
            </div>
            <div className="bg-secondary/50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold">
                {dashboardData.tasksByStatus.done}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Completed Tasks</div>
            </div>
          </div>
          
          <div className="pt-4">
            <div className="flex justify-between mb-1">
              <div className="text-sm">Completion Rate</div>
              <div className="text-sm">{completionPercentage}%</div>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader className="pb-2">
          <CardTitle>Task Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-center text-sm font-medium mb-2">By Status</h4>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [
                      `${value} task${value !== 1 ? 's' : ''}`, 
                      name
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h4 className="text-center text-sm font-medium mb-2">By Priority</h4>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart
                  data={priorityData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip 
                    formatter={(value) => [
                      `${value} task${value !== 1 ? 's' : ''}`,
                      "Count"
                    ]}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex justify-center mt-2 text-xs text-muted-foreground gap-4">
            {statusData.map((status) => (
              <div key={status.name} className="flex items-center">
                <div 
                  className="w-3 h-3 mr-1 rounded-full" 
                  style={{ backgroundColor: status.color }}
                />
                <span>{status.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
