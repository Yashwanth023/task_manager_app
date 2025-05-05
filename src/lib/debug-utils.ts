
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
