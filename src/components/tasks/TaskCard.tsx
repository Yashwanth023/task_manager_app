
import React from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Task, TaskStatus, TaskPriority } from "@/types";
import { getUserById } from "@/lib/local-storage-db";

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const [assignee, setAssignee] = React.useState<{ name: string; initials: string } | null>(null);

  React.useEffect(() => {
    if (task.assigneeId) {
      const user = getUserById(task.assigneeId);
      if (user) {
        const initials = user.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase();
        setAssignee({ name: user.name, initials });
      }
    }
  }, [task.assigneeId]);

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH:
        return "bg-destructive text-destructive-foreground";
      case TaskPriority.MEDIUM:
        return "bg-yellow-600 text-white";
      default:
        return "bg-green-600 text-white";
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.DONE:
        return "bg-green-600 text-white";
      case TaskStatus.IN_PROGRESS:
        return "bg-blue-600 text-white";
      case TaskStatus.REVIEW:
        return "bg-yellow-600 text-white";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const isOverdue =
    task.dueDate &&
    task.status !== TaskStatus.DONE &&
    new Date(task.dueDate) < new Date();

  return (
    <Card className={isOverdue ? "border-destructive" : ""}>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{task.title}</CardTitle>
            <CardDescription>
              {task.dueDate && (
                <div className="flex items-center">
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  <span className={isOverdue ? "text-destructive" : ""}>
                    {format(new Date(task.dueDate), "MMM d, yyyy")}
                  </span>
                  {isOverdue && <span className="ml-1">(Overdue)</span>}
                </div>
              )}
            </CardDescription>
          </div>

          <div className="flex space-x-2">
            <Badge className={getStatusColor(task.status)}>
              {task.status === TaskStatus.IN_PROGRESS
                ? "In Progress"
                : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
            </Badge>
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <p className="text-sm whitespace-pre-wrap">{task.description}</p>
        {task.recurring && (
          <div className="mt-3 flex items-center space-x-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>
              {task.recurring.type.charAt(0).toUpperCase() + task.recurring.type.slice(1)} recurring task
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <div className="flex items-center">
          {assignee ? (
            <div className="flex items-center">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarFallback className="text-xs">
                  {assignee.initials}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">{assignee.name}</span>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">Unassigned</span>
          )}
        </div>

        {(onEdit || onDelete) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  Edit
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  onClick={() => onDelete(task)}
                  className="text-destructive"
                >
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardFooter>
    </Card>
  );
};
