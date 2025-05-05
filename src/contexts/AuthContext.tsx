
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types";
import { 
  getCurrentUser, 
  login as loginUser, 
  logout as logoutUser,
  createUser as createNewUser,
  updateUser as updateExistingUser,
  getUserByEmail
} from "@/lib/local-storage-db";
import { toast } from "@/components/ui/sonner";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<User | null>;
  isAdmin: () => boolean;
  isManager: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on app init
    const loadUser = () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const loggedInUser = loginUser(email, password);
      
      if (loggedInUser) {
        setUser(loggedInUser);
        toast.success("Login successful");
        return true;
      } else {
        toast.error("Invalid email or password");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed");
      return false;
    }
  };

  const register = async (
    name: string, 
    email: string, 
    password: string, 
    role: UserRole = UserRole.USER
  ): Promise<boolean> => {
    try {
      // Check if user already exists
      const existingUser = getUserByEmail(email);
      
      if (existingUser) {
        toast.error("User with this email already exists");
        return false;
      }
      
      // Create new user
      const newUser = createNewUser({
        name,
        email,
        password,
        role,
        notificationPreferences: {
          email: true,
          inApp: true,
          muted: false,
        },
      });
      
      // Auto login after registration
      setUser(newUser);
      toast.success("Registration successful");
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed");
      return false;
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    toast.success("Logged out successfully");
  };

  const updateUser = async (userData: Partial<User>): Promise<User | null> => {
    if (!user) return null;
    
    try {
      const updatedUser = updateExistingUser(user.id, userData);
      
      if (updatedUser) {
        setUser(updatedUser);
        toast.success("Profile updated successfully");
        return updatedUser;
      }
      
      return null;
    } catch (error) {
      console.error("Update user error:", error);
      toast.error("Failed to update profile");
      return null;
    }
  };

  const isAdmin = (): boolean => {
    return user?.role === UserRole.ADMIN;
  };

  const isManager = (): boolean => {
    return user?.role === UserRole.MANAGER || user?.role === UserRole.ADMIN;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAdmin,
        isManager,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};
