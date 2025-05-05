
import React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/contexts/NotificationContext";
import { formatDistanceToNow } from "date-fns";

export const NotificationList: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  if (notifications.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No notifications to display
      </div>
    );
  }

  return (
    <div className="space-y-2 p-1">
      <div className="flex justify-end px-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={markAllAsRead}
          className="text-xs"
        >
          Mark all as read
        </Button>
      </div>

      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-3 rounded-md ${
            notification.read ? "bg-secondary/50" : "bg-secondary"
          }`}
        >
          <div className="flex justify-between">
            <h4 className="font-medium text-sm">{notification.title}</h4>
            {!notification.read && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => markAsRead(notification.id)}
              >
                <Check className="h-4 w-4" />
              </Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {notification.message}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
            })}
          </p>
        </div>
      ))}
    </div>
  );
};
