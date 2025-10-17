"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Database, Settings } from "lucide-react";

// Validation schema for database connector
const databaseConnectorSchema = z.object({
  name: z.string().min(1, "Connector name is required").max(100, "Name too long"),
  host: z.string().min(1, "Host is required"),
  port: z.number().min(1).max(65535),
  database: z.string().min(1, "Database name is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  sslMode: z.enum(["disable", "require", "verify-ca", "verify-full"]),
  connectionTimeout: z.number().min(1).max(300).catch(30),
  queryTimeout: z.number().min(1).max(3600).catch(300),
  maxConnections: z.number().min(1).max(100).catch(10),
  enableConnectionPooling: z.boolean().catch(true),
  testQuery: z.string().optional(),
  description: z.string().max(500, "Description too long").optional(),
});

type DatabaseConnectorFormData = z.infer<typeof databaseConnectorSchema>;

interface DatabaseConnectorFormProps {
  onSubmit: (data: DatabaseConnectorFormData) => void;
  initialData?: Partial<DatabaseConnectorFormData>;
  isLoading?: boolean;
}

export function DatabaseConnectorForm({ onSubmit, initialData, isLoading }: DatabaseConnectorFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<DatabaseConnectorFormData>({
    resolver: zodResolver(databaseConnectorSchema),
    defaultValues: {
      name: initialData?.name || "",
      host: initialData?.host || "",
      port: initialData?.port || 5432,
      database: initialData?.database || "",
      username: initialData?.username || "",
      password: initialData?.password || "",
      sslMode: initialData?.sslMode || "require",
      connectionTimeout: initialData?.connectionTimeout || 30,
      queryTimeout: initialData?.queryTimeout || 300,
      maxConnections: initialData?.maxConnections || 10,
      enableConnectionPooling: initialData?.enableConnectionPooling ?? true,
      testQuery: initialData?.testQuery || "SELECT 1",
      description: initialData?.description || "",
    },
  });

  const handleSubmit = (data: DatabaseConnectorFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Connector Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Production Database" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of this database connection"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Connection Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Connection Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="host"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Host</FormLabel>
                    <FormControl>
                      <Input placeholder="database.example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="port"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Port</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="5432"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="database"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Database Name</FormLabel>
                  <FormControl>
                    <Input placeholder="production_db" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="db_user" {...field} />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Database password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="sslMode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SSL Mode</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select SSL mode" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="disable">Disable SSL</SelectItem>
                      <SelectItem value="require">Require SSL</SelectItem>
                      <SelectItem value="verify-ca">Verify CA</SelectItem>
                      <SelectItem value="verify-full">Verify Full</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the appropriate SSL encryption level for your connection
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Advanced Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Advanced Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="connectionTimeout"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Connection Timeout (seconds)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="300"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="queryTimeout"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Query Timeout (seconds)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="3600"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="maxConnections"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Connections</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="100"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="testQuery"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Test Query (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="SELECT 1" {...field} />
                    </FormControl>
                    <FormDescription>
                      Query to run when testing the connection
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="enableConnectionPooling"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Enable Connection Pooling</FormLabel>
                    <FormDescription>
                      Reuse database connections for better performance
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Database Connector"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
