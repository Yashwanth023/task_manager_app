
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "./Navbar";
import { initDatabase } from "@/lib/local-storage-db";
import { createSampleAuditLogs } from "@/lib/init-test-data";
import { toast } from "@/components/ui/sonner";

export const AuthLayout: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Initialize database on first load
  useEffect(() => {
    initDatabase();
    
    // For debugging - create sample audit logs if none exist
    // This will help ensure audit logs are always available for testing
    const debugMode = localStorage.getItem("debugMode") === "true";
    
    if (debugMode) {
      createSampleAuditLogs();
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export const ProtectedLayout: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  // Enable debug mode for admins
  useEffect(() => {
    if (user?.role === 'admin') {
      const debugMode = localStorage.getItem("debugMode") === "true";
      
      // Admin users can enable debug mode with keyboard shortcut Alt+D
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.altKey && e.key === 'd') {
          const newDebugMode = !debugMode;
          localStorage.setItem("debugMode", newDebugMode.toString());
          toast.success(`Debug mode ${newDebugMode ? 'enabled' : 'disabled'}`);
          
          if (newDebugMode) {
            createSampleAuditLogs();
            toast.info("Sample audit logs created");
          }
        }
      };
      
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
