
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useTasks } from "@/contexts/TaskContext";
import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskList } from "@/components/tasks/TaskList";

const TasksPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { assignedTasks, createdTasks, overdueTasks, updateTask, deleteTask } = useTasks();
  const [isCreateTaskDialogOpen, setIsCreateTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const initialTab = searchParams.get("filter") === "overdue" ? "overdue" : "assigned";

  const handleEditTask = (task: any) => {
    setEditingTask(task);
    setIsCreateTaskDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsCreateTaskDialogOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <Button onClick={() => setIsCreateTaskDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Task
        </Button>
      </div>

      <Tabs defaultValue={initialTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="assigned">
            Assigned ({assignedTasks.length})
          </TabsTrigger>
          <TabsTrigger value="created">
            Created ({createdTasks.length})
          </TabsTrigger>
          <TabsTrigger value="overdue">
            Overdue ({overdueTasks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assigned" className="space-y-4">
          <TaskList
            tasks={assignedTasks}
            onEdit={handleEditTask}
            onDelete={deleteTask}
          />
        </TabsContent>

        <TabsContent value="created" className="space-y-4">
          <TaskList
            tasks={createdTasks}
            onEdit={handleEditTask}
            onDelete={deleteTask}
          />
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          <TaskList
            tasks={overdueTasks}
            onEdit={handleEditTask}
            onDelete={deleteTask}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={isCreateTaskDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingTask ? "Edit Task" : "Create Task"}
            </DialogTitle>
          </DialogHeader>
          <TaskForm
            task={editingTask}
            onSuccess={handleDialogClose}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TasksPage;
