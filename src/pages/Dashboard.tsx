
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTasks } from "@/contexts/TaskContext";
import { useAuth } from "@/contexts/AuthContext";
import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskCard } from "@/components/tasks/TaskCard";
import { DashboardSummary } from "@/components/dashboard/DashboardSummary";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { assignedTasks, overdueTasks, updateTask, deleteTask } = useTasks();
  const [isCreateTaskDialogOpen, setIsCreateTaskDialogOpen] = useState(false);

  // Get 5 most recent tasks
  const recentTasks = [...assignedTasks]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          Welcome back, {user?.name?.split(' ')[0]}
        </h1>
        <Button onClick={() => setIsCreateTaskDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Task
        </Button>
      </div>

      <DashboardSummary />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={(task) => navigate(`/tasks/${task.id}`)}
                />
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No recent tasks
              </p>
            )}
            
            {recentTasks.length > 0 && (
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => navigate("/tasks")}
              >
                View All Tasks
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Overdue Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {overdueTasks.length > 0 ? (
              overdueTasks.slice(0, 3).map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={(task) => navigate(`/tasks/${task.id}`)}
                />
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No overdue tasks
              </p>
            )}

            {overdueTasks.length > 0 && (
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => navigate("/tasks?filter=overdue")}
              >
                View All Overdue Tasks
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={isCreateTaskDialogOpen}
        onOpenChange={setIsCreateTaskDialogOpen}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Task</DialogTitle>
          </DialogHeader>
          <TaskForm onSuccess={() => setIsCreateTaskDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
