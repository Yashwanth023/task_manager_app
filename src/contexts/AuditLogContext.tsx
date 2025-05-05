
import React, { createContext, useContext, useState, useEffect } from "react";
import { AuditLog } from "@/types";
import { getAuditLogs } from "@/lib/local-storage-db";
import { useAuth } from "./AuthContext";

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
      setLogs(getAuditLogs());
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
