
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { User, UserRole } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUser as updateExistingUser, createUser as createNewUser } from "@/lib/local-storage-db";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  role: z.enum([UserRole.ADMIN, UserRole.MANAGER, UserRole.USER]),
  notifyEmail: z.boolean().default(true),
  notifyInApp: z.boolean().default(true),
  muteAll: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

interface UserFormProps {
  user?: User;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({ user, onSuccess, onCancel }) => {
  const { isAdmin } = useAuth();

  const defaultValues: FormData = {
    name: user?.name || "",
    email: user?.email || "",
    password: "",  // don't pre-fill password
    role: user?.role || UserRole.USER,
    notifyEmail: user?.notificationPreferences?.email ?? true,
    notifyInApp: user?.notificationPreferences?.inApp ?? true,
    muteAll: user?.notificationPreferences?.muted ?? false,
  };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: FormData) => {
    try {
      const notificationPreferences = {
        email: data.notifyEmail,
        inApp: data.notifyInApp,
        muted: data.muteAll,
      };

      if (user) {
        // Update existing user
        const userData: Partial<User> = {
          name: data.name,
          role: data.role,
          notificationPreferences,
        };

        // Only update email and password if they were changed
        if (data.email !== user.email) {
          userData.email = data.email;
        }

        if (data.password && data.password.length > 0) {
          userData.password = data.password;
        }

        await updateExistingUser(user.id, userData);
      } else {
        // Create new user
        if (!data.password) {
          form.setError("password", {
            type: "manual",
            message: "Password is required for new users",
          });
          return;
        }

        await createNewUser({
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
          notificationPreferences,
        });
      }

      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("User form submission error:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {user ? "Password (leave blank to keep current)" : "Password"}
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isAdmin() && (
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={UserRole.USER}>User</SelectItem>
                    <SelectItem value={UserRole.MANAGER}>Manager</SelectItem>
                    <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="space-y-3">
          <h3 className="text-sm font-medium">Notification Preferences</h3>
          
          <FormField
            control={form.control}
            name="notifyEmail"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  Receive email notifications
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notifyInApp"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  Receive in-app notifications
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="muteAll"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  Mute all notifications
                </FormLabel>
              </FormItem>
            )}
          />
        </div>

        <div className="flex space-x-2 justify-end pt-2">
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">
            {user ? "Update User" : "Create User"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
