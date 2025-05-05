
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AuditLogProvider } from "@/contexts/AuditLogContext";
import { AuditLogList } from "@/components/audit/AuditLogList";

const AuditLogsPage: React.FC = () => {
  const { isAdmin } = useAuth();

  if (!isAdmin()) {
    return (
      <div className="container mx-auto py-6 text-center">
        <h2 className="text-xl">You don't have permission to access this page</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Audit Logs</h1>
        <p className="text-muted-foreground mt-2">
          Track all activities in the system for transparency and security
        </p>
      </div>

      <AuditLogProvider>
        <AuditLogList />
      </AuditLogProvider>
    </div>
  );
};

export default AuditLogsPage;
