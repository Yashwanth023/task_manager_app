
import React, { createContext, useContext, useState, useEffect } from "react";
import { AuditLog } from "@/types";
import { getAuditLogs, createAuditLog } from "@/lib/local-storage-db";
import { useAuth } from "./AuthContext";
import { checkAuditLogsStatus } from "@/lib/debug-utils";

interface AuditLogContextType {
  logs: AuditLog[];
  loading: boolean;
  refreshLogs: () => void;
}

const AuditLogContext = createContext<AuditLogContextType | undefined>(undefined);

export const AuditLogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshLogs = () => {
    // Only admins can see all logs
    if (user && isAdmin()) {
      const allLogs = getAuditLogs();
      
      // Sort logs by timestamp, most recent first
      const sortedLogs = [...allLogs].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      setLogs(sortedLogs);
      
      // If no logs found, check status in development
      if (process.env.NODE_ENV !== 'production' && sortedLogs.length === 0) {
        checkAuditLogsStatus();
      }
    } else {
      setLogs([]);
    }
  };

  useEffect(() => {
    refreshLogs();
    setLoading(false);
  }, [user, isAdmin]);

  return (
    <AuditLogContext.Provider
      value={{
        logs,
        loading,
        refreshLogs,
      }}
    >
      {children}
    </AuditLogContext.Provider>
  );
};

export const useAuditLogs = (): AuditLogContextType => {
  const context = useContext(AuditLogContext);
  
  if (context === undefined) {
    throw new Error("useAuditLogs must be used within an AuditLogProvider");
  }
  
  return context;
};
