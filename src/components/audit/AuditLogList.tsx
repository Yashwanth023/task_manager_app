
import React, { useState } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuditLog } from "@/types";
import { getUserById } from "@/lib/local-storage-db";
import { useAuditLogs } from "@/contexts/AuditLogContext";

export const AuditLogList: React.FC = () => {
  const { logs } = useAuditLogs();
  const [actionFilter, setActionFilter] = useState<string>("");
  const [entityFilter, setEntityFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Format date for display
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy - h:mm a");
  };

  // Get user name by ID
  const getUserName = (userId: string) => {
    const user = getUserById(userId);
    return user ? user.name : "Unknown User";
  };

  // Apply filters
  const filteredLogs = logs.filter((log) => {
    const matchesAction = actionFilter ? log.action === actionFilter : true;
    const matchesEntity = entityFilter ? log.entityType === entityFilter : true;
    const matchesSearch = searchQuery
      ? log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getUserName(log.userId).toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesAction && matchesEntity && matchesSearch;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search logs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-auto"
        />

        <div className="flex flex-wrap gap-2">
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Actions</SelectItem>
              <SelectItem value="create">Create</SelectItem>
              <SelectItem value="update">Update</SelectItem>
              <SelectItem value="delete">Delete</SelectItem>
              <SelectItem value="assign">Assign</SelectItem>
            </SelectContent>
          </Select>

          <Select value={entityFilter} onValueChange={setEntityFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by entity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Entities</SelectItem>
              <SelectItem value="task">Task</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>

          {(searchQuery || actionFilter || entityFilter) && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setActionFilter("");
                setEntityFilter("");
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entity Type</TableHead>
              <TableHead className="w-[300px]">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap">
                    {formatDate(log.timestamp)}
                  </TableCell>
                  <TableCell>{getUserName(log.userId)}</TableCell>
                  <TableCell className="capitalize">{log.action}</TableCell>
                  <TableCell className="capitalize">{log.entityType}</TableCell>
                  <TableCell className="max-w-[300px] break-words">
                    {log.details}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No audit logs found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
