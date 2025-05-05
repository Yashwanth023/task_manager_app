
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AuditLogProvider } from "@/contexts/AuditLogContext";
import { AuditLogList } from "@/components/audit/AuditLogList";
import { Shield, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AuditLogsPage: React.FC = () => {
  const { isAdmin } = useAuth();

  if (!isAdmin()) {
    return (
      <div className="container mx-auto py-6 text-center">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center justify-center gap-2">
              <Shield className="h-5 w-5" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>You don't have permission to access this page. Only administrators can view audit logs.</p>
          </CardContent>
        </Card>
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

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Audit logs track all system activities including task creation, updates, assignments, and user management. 
          These logs cannot be modified for security and compliance purposes.
        </AlertDescription>
      </Alert>

      <AuditLogProvider>
        <AuditLogList />
      </AuditLogProvider>
    </div>
  );
};

export default AuditLogsPage;
