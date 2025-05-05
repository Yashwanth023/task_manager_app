
import { createAuditLog, getCurrentUser } from "./local-storage-db";
import { AuditAction, EntityType } from "@/types";

/**
 * Creates sample audit logs for testing
 */
export const createSampleAuditLogs = () => {
  const currentUser = getCurrentUser();
  
  if (!currentUser) return;
  
  const userId = currentUser.id;
  const now = new Date();
  
  // Sample log entries with different times
  const logEntries = [
    {
      userId,
      action: "create" as AuditAction,
      entityType: "task" as EntityType,
      entityId: "sample-task-1",
      details: "Created sample task 'Project Setup'",
      timestamp: new Date(now.getTime() - 3600000).toISOString() // 1 hour ago
    },
    {
      userId,
      action: "update" as AuditAction,
      entityType: "task" as EntityType,
      entityId: "sample-task-1",
      details: "Updated priority of 'Project Setup' to High",
      timestamp: new Date(now.getTime() - 1800000).toISOString() // 30 mins ago
    },
    {
      userId,
      action: "assign" as AuditAction,
      entityType: "task" as EntityType,
      entityId: "sample-task-1",
      details: "Assigned 'Project Setup' to Team Member",
      timestamp: new Date(now.getTime() - 900000).toISOString() // 15 mins ago
    }
  ];
  
  logEntries.forEach(entry => {
    try {
      createAuditLog({
        userId: entry.userId,
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId,
        details: entry.details
      });
    } catch (error) {
      console.error("Error creating sample audit log:", error);
    }
  });
  
  console.log("Sample audit logs created for testing");
};
