
import React from "react";
import { format } from "date-fns";
import { User, UserRole } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  currentUser?: User | null;
}

export const UserCard: React.FC<UserCardProps> = ({ 
  user, 
  onEdit, 
  onDelete,
  currentUser,
}) => {
  const userInitials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return "bg-primary text-primary-foreground";
      case UserRole.MANAGER:
        return "bg-blue-600 text-white";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  // Don't allow deleting your own account or the admin account
  const canDelete = 
    onDelete && 
    currentUser?.id !== user.id && 
    user.id !== "admin-1";

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-start">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <div>
              <div>{user.name}</div>
              <div className="text-sm font-normal text-muted-foreground">
                {user.email}
              </div>
            </div>
          </div>
          <Badge className={getRoleBadgeColor(user.role)}>
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-sm text-muted-foreground">
          Member since: {format(new Date(user.createdAt), "MMM d, yyyy")}
        </div>
        <div className="text-sm">
          <span className="font-medium">Notification preferences:</span>
          <ul className="mt-1 list-disc list-inside">
            {user.notificationPreferences.email && <li>Email notifications</li>}
            {user.notificationPreferences.inApp && <li>In-app notifications</li>}
            {user.notificationPreferences.muted && <li>All notifications muted</li>}
          </ul>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          {onEdit && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit(user)}
            >
              Edit
            </Button>
          )}
          {canDelete && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => onDelete(user)}
            >
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
