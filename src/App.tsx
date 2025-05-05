
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "@/contexts/AuthContext";
import { TaskProvider } from "@/contexts/TaskContext";
import { NotificationProvider } from "@/contexts/NotificationContext";

import { AuthLayout, ProtectedLayout } from "@/components/layout/AuthLayout";
import Dashboard from "@/pages/Dashboard";
import TasksPage from "@/pages/TasksPage";
import TeamPage from "@/pages/TeamPage";
import AuditLogsPage from "@/pages/AuditLogsPage";
import ProfilePage from "@/pages/ProfilePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import NotFoundPage from "@/pages/NotFoundPage";

const App: React.FC = () => {
  return (
    <TooltipProvider>
      <AuthProvider>
        <TaskProvider>
          <NotificationProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Auth routes that don't require authentication */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>

              {/* Protected routes that require authentication */}
              <Route element={<ProtectedLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/team" element={<TeamPage />} />
                <Route path="/audit-logs" element={<AuditLogsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<ProfilePage />} />
              </Route>

              {/* Fallback routes */}
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" />} />
            </Routes>
          </NotificationProvider>
        </TaskProvider>
      </AuthProvider>
    </TooltipProvider>
  );
};

export default App;
