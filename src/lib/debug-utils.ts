
import { getAuditLogs, createAuditLog } from "./local-storage-db";
import { AuditAction, EntityType } from "@/types";

/**
 * Debug helper function to check if audit logs are being properly recorded
 */
export const checkAuditLogsStatus = () => {
  const logs = getAuditLogs();
  
  console.group("🔍 Audit Logs Status");
  console.log(`Total logs in the system: ${logs.length}`);
  
  if (logs.length > 0) {
    console.log("Most recent logs:", logs.slice(0, 3));
  } else {
    console.log("No audit logs found in the system");
    console.log("Creating a test audit log...");
    
    try {
      createAuditLog({
        userId: "system",
        action: "debug" as AuditAction,
        entityType: "system" as EntityType,
        entityId: "debug-check",
        details: "System debug check for audit logs",
      });
      
      const updatedLogs = getAuditLogs();
      console.log(`After test: ${updatedLogs.length} logs found`);
      console.log("Test log created successfully!");
    } catch (error) {
      console.error("Error creating test audit log:", error);
    }
  }
  
  console.groupEnd();
};

/**
 * Creates a set of sample audit logs for testing and demonstration purposes
 */
export const createSampleAuditLogs = () => {
  const existingLogs = getAuditLogs();
  
  // Only create sample logs if there aren't many logs yet
  if (existingLogs.length < 5) {
    console.log("Creating sample audit logs for demonstration...");
    
    const sampleLogData = [
      {
        userId: "system",
        action: "system" as AuditAction,
        entityType: "system" as EntityType,
        entityId: "system-initialization",
        details: "System initialized with default settings",
      },
      {
        userId: "admin-1",
        action: "create" as AuditAction,
        entityType: "task" as EntityType,
        entityId: "sample-task-1",
        details: "Created sample task: Project kickoff",
      },
      {
        userId: "admin-1",
        action: "update" as AuditAction,
        entityType: "task" as EntityType,
        entityId: "sample-task-1",
        details: "Updated sample task status to In Progress",
      },
      {
        userId: "admin-1",
        action: "create" as AuditAction, 
        entityType: "user" as EntityType,
        entityId: "sample-user-1",
        details: "Created sample user: John Doe",
      },
      {
        userId: "admin-1",
        action: "assign" as AuditAction,
        entityType: "task" as EntityType,
        entityId: "sample-task-1",
        details: "Assigned task to John Doe",
      }
    ];
    
    sampleLogData.forEach(logData => {
      createAuditLog(logData);
    });
    
    console.log("Sample audit logs created successfully!");
  }
};

