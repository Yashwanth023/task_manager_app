
import React, { createContext, useContext, useState, useEffect } from "react";
import { Task, TaskPriority, TaskStatus, TaskFilter } from "@/types";
import {
  getTasks,
  getTaskById,
  createTask as createNewTask,
  updateTask as updateExistingTask,
  deleteTask as deleteExistingTask,
  filterTasks as filterTasksDb,
  processRecurringTasks
} from "@/lib/local-storage-db";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "./AuthContext";

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  createTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => Promise<Task | null>;
  updateTask: (id: string, taskData: Partial<Task>) => Promise<Task | null>;
  deleteTask: (id: string) => Promise<boolean>;
  getTask: (id: string) => Task | null;
  filterTasks: (filter: TaskFilter) => Task[];
  assignedTasks: Task[];
  createdTasks: Task[];
  overdueTasks: Task[];
  refreshTasks: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshTasks = () => {
    setTasks(getTasks());
  };

  useEffect(() => {
    // Load tasks on initial render and when user changes
    refreshTasks();
    setLoading(false);

    // Check for recurring tasks
    processRecurringTasks();
    
    // Set up interval to check for recurring tasks (every hour)
    const interval = setInterval(() => {
      processRecurringTasks();
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user]);

  const createTask = async (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ): Promise<Task | null> => {
    try {
      if (!user) {
        toast.error("You must be logged in to create tasks");
        return null;
      }

      const newTask = createNewTask(taskData);
      refreshTasks();
      toast.success("Task created successfully");
      return newTask;
    } catch (error) {
      console.error("Create task error:", error);
      toast.error("Failed to create task");
      return null;
    }
  };

  const updateTask = async (id: string, taskData: Partial<Task>): Promise<Task | null> => {
    try {
      const updatedTask = updateExistingTask(id, taskData);
      
      if (updatedTask) {
        refreshTasks();
        toast.success("Task updated successfully");
        return updatedTask;
      }
      
      return null;
    } catch (error) {
      console.error("Update task error:", error);
      toast.error("Failed to update task");
      return null;
    }
  };

  const deleteTask = async (id: string): Promise<boolean> => {
    try {
      const success = deleteExistingTask(id);
      
      if (success) {
        refreshTasks();
        toast.success("Task deleted successfully");
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Delete task error:", error);
      toast.error("Failed to delete task");
      return false;
    }
  };

  const getTask = (id: string): Task | null => {
    return getTaskById(id);
  };

  const filterTasks = (filter: TaskFilter): Task[] => {
    return filterTasksDb(filter);
  };

  // Derived task lists
  const assignedTasks = user ? tasks.filter(task => task.assigneeId === user.id) : [];
  const createdTasks = user ? tasks.filter(task => task.creatorId === user.id) : [];
  const overdueTasks = assignedTasks.filter(task => {
    if (!task.dueDate) return false;
    if (task.status === TaskStatus.DONE) return false;
    return new Date(task.dueDate) < new Date();
  });

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        createTask,
        updateTask,
        deleteTask,
        getTask,
        filterTasks,
        assignedTasks,
        createdTasks,
        overdueTasks,
        refreshTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  
  return context;
};
