
import React, { createContext, useContext, useState, useEffect } from "react";
import { Notification } from "@/types";
import {
  getNotifications as getDbNotifications,
  createNotification as createDbNotification,
  markNotificationAsRead as markDbNotificationAsRead
} from "@/lib/local-storage-db";
import { useAuth } from "./AuthContext";
import { toast } from "@/components/ui/sonner";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  createNotification: (notification: Omit<Notification, "id" | "read" | "createdAt">) => Promise<Notification | null>;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  refreshNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshNotifications = () => {
    if (user) {
      setNotifications(getDbNotifications(user.id));
    } else {
      setNotifications([]);
    }
  };

  useEffect(() => {
    refreshNotifications();
    setLoading(false);

    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      refreshNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, [user]);

  const createNotification = async (
    notification: Omit<Notification, "id" | "read" | "createdAt">
  ): Promise<Notification | null> => {
    try {
      const newNotification = createDbNotification(notification);
      refreshNotifications();
      return newNotification;
    } catch (error) {
      console.error("Create notification error:", error);
      return null;
    }
  };

  const markAsRead = (id: string) => {
    try {
      const success = markDbNotificationAsRead(id);
      
      if (success) {
        refreshNotifications();
      }
    } catch (error) {
      console.error("Mark notification as read error:", error);
    }
  };

  const markAllAsRead = () => {
    try {
      let allMarked = true;
      
      notifications
        .filter(n => !n.read)
        .forEach(n => {
          const success = markDbNotificationAsRead(n.id);
          if (!success) allMarked = false;
        });
      
      if (allMarked) {
        refreshNotifications();
        toast.success("All notifications marked as read");
      }
    } catch (error) {
      console.error("Mark all notifications as read error:", error);
      toast.error("Failed to mark all notifications as read");
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        createNotification,
        markAsRead,
        markAllAsRead,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  
  return context;
};
