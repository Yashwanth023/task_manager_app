
export enum UserRole {
  ADMIN = "admin",
  MANAGER = "manager",
  USER = "user",
}

export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "inProgress",
  REVIEW = "review",
  DONE = "done",
}

export type User = {
  id: string;
  name: string;
  email: string;
  password: string; // In a real app, this would be hashed
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  notificationPreferences: {
    email: boolean;
    inApp: boolean;
    muted: boolean;
  };
};

export type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  assigneeId: string | null;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  recurring?: {
    type: "daily" | "weekly" | "monthly";
    nextOccurrence: string;
  } | null;
};

export type AuditLog = {
  id: string;
  userId: string;
  action: "create" | "update" | "delete" | "assign";
  entityType: "task" | "user";
  entityId: string;
  details: string;
  timestamp: string;
};

export type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export type TaskFilter = {
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  search?: string;
  assigneeId?: string;
  creatorId?: string;
};
