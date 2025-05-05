
import { User, Task, AuditLog, Notification, UserRole } from "@/types";
import { toast } from "@/components/ui/sonner";

// Default admin user
const DEFAULT_ADMIN: User = {
  id: "admin-1",
  name: "Admin User",
  email: "admin@taskflow.com",
  password: "password123", // In a real app, this would be hashed
  role: UserRole.ADMIN,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  notificationPreferences: {
    email: true,
    inApp: true,
    muted: false,
  },
};

// Initialize localStorage with default data
export const initDatabase = () => {
  if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify([DEFAULT_ADMIN]));
  }

  if (!localStorage.getItem("tasks")) {
    localStorage.setItem("tasks", JSON.stringify([]));
  }

  if (!localStorage.getItem("auditLogs")) {
    localStorage.setItem("auditLogs", JSON.stringify([]));
  }

  if (!localStorage.getItem("notifications")) {
    localStorage.setItem("notifications", JSON.stringify([]));
  }

  if (!localStorage.getItem("currentUser")) {
    localStorage.setItem("currentUser", JSON.stringify(null));
  }
};

// User methods
export const getUsers = (): User[] => {
  try {
    const users = localStorage.getItem("users") || "[]";
    return JSON.parse(users);
  } catch (error) {
    console.error("Error getting users:", error);
    return [];
  }
};

export const getUserById = (id: string): User | null => {
  try {
    const users = getUsers();
    return users.find(user => user.id === id) || null;
  } catch (error) {
    console.error("Error getting user by ID:", error);
    return null;
  }
};

export const getUserByEmail = (email: string): User | null => {
  try {
    const users = getUsers();
    return users.find(user => user.email === email) || null;
  } catch (error) {
    console.error("Error getting user by email:", error);
    return null;
  }
};

export const createUser = (user: Omit<User, "id" | "createdAt" | "updatedAt">): User => {
  try {
    const users = getUsers();
    const newUser: User = {
      ...user,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem("users", JSON.stringify([...users, newUser]));
    createAuditLog({
      userId: newUser.id,
      action: "create",
      entityType: "user",
      entityId: newUser.id,
      details: `User ${newUser.name} created`,
    });
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    toast.error("Failed to create user");
    throw error;
  }
};

export const updateUser = (id: string, userData: Partial<User>): User | null => {
  try {
    const users = getUsers();
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return null;
    }
    
    const updatedUser: User = {
      ...users[userIndex],
      ...userData,
      updatedAt: new Date().toISOString(),
    };
    
    users[userIndex] = updatedUser;
    localStorage.setItem("users", JSON.stringify(users));
    
    createAuditLog({
      userId: updatedUser.id,
      action: "update",
      entityType: "user",
      entityId: updatedUser.id,
      details: `User ${updatedUser.name} updated`,
    });
    
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    toast.error("Failed to update user");
    return null;
  }
};

export const deleteUser = (id: string): boolean => {
  try {
    const users = getUsers();
    const user = users.find(user => user.id === id);
    
    if (!user) {
      return false;
    }
    
    const filteredUsers = users.filter(user => user.id !== id);
    localStorage.setItem("users", JSON.stringify(filteredUsers));
    
    createAuditLog({
      userId: id,
      action: "delete",
      entityType: "user",
      entityId: id,
      details: `User ${user.name} deleted`,
    });
    
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    toast.error("Failed to delete user");
    return false;
  }
};

// Authentication methods
export const login = (email: string, password: string): User | null => {
  try {
    const user = getUserByEmail(email);
    
    if (user && user.password === password) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      return user;
    }
    
    return null;
  } catch (error) {
    console.error("Error during login:", error);
    return null;
  }
};

export const getCurrentUser = (): User | null => {
  try {
    const currentUser = localStorage.getItem("currentUser");
    return currentUser ? JSON.parse(currentUser) : null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

export const logout = (): void => {
  localStorage.setItem("currentUser", JSON.stringify(null));
};

// Task methods
export const getTasks = (): Task[] => {
  try {
    const tasks = localStorage.getItem("tasks") || "[]";
    return JSON.parse(tasks);
  } catch (error) {
    console.error("Error getting tasks:", error);
    return [];
  }
};

export const getTaskById = (id: string): Task | null => {
  try {
    const tasks = getTasks();
    return tasks.find(task => task.id === id) || null;
  } catch (error) {
    console.error("Error getting task by ID:", error);
    return null;
  }
};

export const createTask = (task: Omit<Task, "id" | "createdAt" | "updatedAt">): Task => {
  try {
    const tasks = getTasks();
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem("tasks", JSON.stringify([...tasks, newTask]));
    
    createAuditLog({
      userId: task.creatorId,
      action: "create",
      entityType: "task",
      entityId: newTask.id,
      details: `Task "${newTask.title}" created`,
    });
    
    if (newTask.assigneeId) {
      createNotification({
        userId: newTask.assigneeId,
        title: "New Task Assigned",
        message: `You've been assigned to "${newTask.title}"`,
      });
    }
    
    return newTask;
  } catch (error) {
    console.error("Error creating task:", error);
    toast.error("Failed to create task");
    throw error;
  }
};

export const updateTask = (id: string, taskData: Partial<Task>): Task | null => {
  try {
    const tasks = getTasks();
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return null;
    }
    
    const originalTask = tasks[taskIndex];
    const updatedTask: Task = {
      ...originalTask,
      ...taskData,
      updatedAt: new Date().toISOString(),
    };
    
    tasks[taskIndex] = updatedTask;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    
    const currentUser = getCurrentUser();
    if (currentUser) {
      createAuditLog({
        userId: currentUser.id,
        action: "update",
        entityType: "task",
        entityId: updatedTask.id,
        details: `Task "${updatedTask.title}" updated`,
      });
      
      // If the assignee was changed, create a notification
      if (taskData.assigneeId && taskData.assigneeId !== originalTask.assigneeId) {
        createNotification({
          userId: taskData.assigneeId,
          title: "Task Assigned",
          message: `You've been assigned to "${updatedTask.title}"`,
        });
        
        createAuditLog({
          userId: currentUser.id,
          action: "assign",
          entityType: "task",
          entityId: updatedTask.id,
          details: `Task "${updatedTask.title}" assigned to user ID: ${taskData.assigneeId}`,
        });
      }
    }
    
    return updatedTask;
  } catch (error) {
    console.error("Error updating task:", error);
    toast.error("Failed to update task");
    return null;
  }
};

export const deleteTask = (id: string): boolean => {
  try {
    const tasks = getTasks();
    const task = tasks.find(task => task.id === id);
    
    if (!task) {
      return false;
    }
    
    const filteredTasks = tasks.filter(task => task.id !== id);
    localStorage.setItem("tasks", JSON.stringify(filteredTasks));
    
    const currentUser = getCurrentUser();
    if (currentUser) {
      createAuditLog({
        userId: currentUser.id,
        action: "delete",
        entityType: "task",
        entityId: id,
        details: `Task "${task.title}" deleted`,
      });
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting task:", error);
    toast.error("Failed to delete task");
    return false;
  }
};

// Task filtering
export const filterTasks = (filter: {
  search?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
  assigneeId?: string;
  creatorId?: string;
}): Task[] => {
  try {
    let tasks = getTasks();
    
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      tasks = tasks.filter(
        task => task.title.toLowerCase().includes(searchLower) || 
                task.description.toLowerCase().includes(searchLower)
      );
    }
    
    if (filter.status) {
      tasks = tasks.filter(task => task.status === filter.status);
    }
    
    if (filter.priority) {
      tasks = tasks.filter(task => task.priority === filter.priority);
    }
    
    if (filter.dueDate) {
      // Filter by due date (tasks due before or on the specified date)
      tasks = tasks.filter(task => {
        if (!task.dueDate) return false;
        return new Date(task.dueDate) <= new Date(filter.dueDate as string);
      });
    }
    
    if (filter.assigneeId) {
      tasks = tasks.filter(task => task.assigneeId === filter.assigneeId);
    }
    
    if (filter.creatorId) {
      tasks = tasks.filter(task => task.creatorId === filter.creatorId);
    }
    
    return tasks;
  } catch (error) {
    console.error("Error filtering tasks:", error);
    return [];
  }
};

// Dashboard methods
export const getUserDashboardData = (userId: string) => {
  try {
    const tasks = getTasks();
    
    const assignedTasks = tasks.filter(task => task.assigneeId === userId);
    const createdTasks = tasks.filter(task => task.creatorId === userId);
    
    const overdueTasks = assignedTasks.filter(task => {
      if (!task.dueDate) return false;
      if (task.status === "done") return false;
      return new Date(task.dueDate) < new Date();
    });
    
    const tasksByStatus = {
      todo: assignedTasks.filter(task => task.status === "todo").length,
      inProgress: assignedTasks.filter(task => task.status === "inProgress").length,
      review: assignedTasks.filter(task => task.status === "review").length,
      done: assignedTasks.filter(task => task.status === "done").length,
    };
    
    const tasksByPriority = {
      low: assignedTasks.filter(task => task.priority === "low").length,
      medium: assignedTasks.filter(task => task.priority === "medium").length,
      high: assignedTasks.filter(task => task.priority === "high").length,
    };
    
    return {
      assignedTasks,
      createdTasks,
      overdueTasks,
      tasksByStatus,
      tasksByPriority,
      completionRate: assignedTasks.length > 0 ? 
        (assignedTasks.filter(task => task.status === "done").length / assignedTasks.length) : 0,
    };
  } catch (error) {
    console.error("Error getting dashboard data:", error);
    return null;
  }
};

// Audit Log methods
export const getAuditLogs = (): AuditLog[] => {
  try {
    const logs = localStorage.getItem("auditLogs") || "[]";
    return JSON.parse(logs);
  } catch (error) {
    console.error("Error getting audit logs:", error);
    return [];
  }
};

export const createAuditLog = (log: Omit<AuditLog, "id" | "timestamp">): AuditLog => {
  try {
    const logs = getAuditLogs();
    const newLog: AuditLog = {
      ...log,
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    
    localStorage.setItem("auditLogs", JSON.stringify([...logs, newLog]));
    return newLog;
  } catch (error) {
    console.error("Error creating audit log:", error);
    return {} as AuditLog;
  }
};

// Notification methods
export const getNotifications = (userId: string): Notification[] => {
  try {
    const notifications = localStorage.getItem("notifications") || "[]";
    const parsedNotifications: Notification[] = JSON.parse(notifications);
    return parsedNotifications.filter(notification => notification.userId === userId);
  } catch (error) {
    console.error("Error getting notifications:", error);
    return [];
  }
};

export const createNotification = (notification: Omit<Notification, "id" | "read" | "createdAt">): Notification => {
  try {
    const notifications = localStorage.getItem("notifications") || "[]";
    const parsedNotifications: Notification[] = JSON.parse(notifications);
    
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    
    localStorage.setItem("notifications", JSON.stringify([...parsedNotifications, newNotification]));
    return newNotification;
  } catch (error) {
    console.error("Error creating notification:", error);
    return {} as Notification;
  }
};

export const markNotificationAsRead = (id: string): boolean => {
  try {
    const notifications = localStorage.getItem("notifications") || "[]";
    const parsedNotifications: Notification[] = JSON.parse(notifications);
    
    const notificationIndex = parsedNotifications.findIndex(n => n.id === id);
    if (notificationIndex === -1) return false;
    
    parsedNotifications[notificationIndex].read = true;
    localStorage.setItem("notifications", JSON.stringify(parsedNotifications));
    return true;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return false;
  }
};

// Check for and handle recurring tasks
export const processRecurringTasks = (): void => {
  try {
    const tasks = getTasks();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const updatedTasks: Task[] = [];
    let tasksCreated = false;
    
    tasks.forEach(task => {
      if (task.recurring && new Date(task.recurring.nextOccurrence) <= today) {
        const recurringDate = new Date(task.recurring.nextOccurrence);
        let newDueDate: Date;
        
        // Calculate next occurrence based on recurrence type
        if (task.recurring.type === "daily") {
          newDueDate = new Date(recurringDate);
          newDueDate.setDate(newDueDate.getDate() + 1);
        } else if (task.recurring.type === "weekly") {
          newDueDate = new Date(recurringDate);
          newDueDate.setDate(newDueDate.getDate() + 7);
        } else if (task.recurring.type === "monthly") {
          newDueDate = new Date(recurringDate);
          newDueDate.setMonth(newDueDate.getMonth() + 1);
        } else {
          return;
        }
        
        // Update the existing task's next occurrence date
        updatedTasks.push({
          ...task,
          recurring: {
            ...task.recurring,
            nextOccurrence: newDueDate.toISOString(),
          },
        });
        
        // Create a new task instance
        const newTask: Omit<Task, "id" | "createdAt" | "updatedAt"> = {
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
          priority: task.priority,
          status: "todo",
          assigneeId: task.assigneeId,
          creatorId: task.creatorId,
        };
        
        createTask(newTask);
        tasksCreated = true;
      }
    });
    
    if (updatedTasks.length > 0) {
      // Update the recurring tasks with new next occurrence dates
      const allTasks = getTasks();
      const updatedTaskIds = new Set(updatedTasks.map(task => task.id));
      
      const finalTasks = allTasks.map(task => {
        if (updatedTaskIds.has(task.id)) {
          return updatedTasks.find(t => t.id === task.id) || task;
        }
        return task;
      });
      
      localStorage.setItem("tasks", JSON.stringify(finalTasks));
      
      if (tasksCreated) {
        toast.success("Recurring tasks have been created");
      }
    }
  } catch (error) {
    console.error("Error processing recurring tasks:", error);
  }
};
