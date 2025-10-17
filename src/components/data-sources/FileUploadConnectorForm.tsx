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
import { Calendar, Clock, Upload, FileText } from "lucide-react";

// Validation schema for file upload connector
const fileUploadConnectorSchema = z.object({
  name: z.string().min(1, "Connector name is required").max(100, "Name too long"),
  uploadPath: z.string().min(1, "Upload path is required"),
  fileTypes: z.array(z.string()).min(1, "At least one file type must be selected"),
  maxFileSize: z.number().min(1).max(1000).default(100), // MB
  autoProcess: z.boolean().default(true),
  processSchedule: z.enum(["immediate", "hourly", "daily", "weekly"]),
  scheduleTime: z.string().optional(),
  backupOriginal: z.boolean().default(true),
  validateHeaders: z.boolean().default(true),
  skipDuplicates: z.boolean().default(false),
  archiveProcessed: z.boolean().default(true),
  notificationEmail: z.string().email().optional().or(z.literal("")),
  description: z.string().max(500, "Description too long").optional(),
}).refine(
  (data) =>
    data.processSchedule === "immediate" ||
    (data.scheduleTime && data.scheduleTime.length > 0),
  {
    message: "Schedule time is required when processing schedule is not immediate",
    path: ["scheduleTime"],
  }
);

type FileUploadConnectorFormData = z.infer<typeof fileUploadConnectorSchema>;

interface FileUploadConnectorFormProps {
  onSubmit: (data: FileUploadConnectorFormData) => void;
  initialData?: Partial<FileUploadConnectorFormData>;
  isLoading?: boolean;
}

const FILE_TYPE_OPTIONS = [
  { value: "csv", label: "CSV Files" },
  { value: "xlsx", label: "Excel Files" },
  { value: "xls", label: "Excel (Legacy)" },
  { value: "json", label: "JSON Files" },
  { value: "xml", label: "XML Files" },
  { value: "txt", label: "Text Files" },
  { value: "tsv", label: "Tab-Separated Values" },
];

export function FileUploadConnectorForm({ onSubmit, initialData, isLoading }: FileUploadConnectorFormProps) {
  const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>(
    initialData?.fileTypes || ["csv"]
  );

  const form = useForm<FileUploadConnectorFormData>({
    resolver: zodResolver(fileUploadConnectorSchema),
    defaultValues: {
      name: initialData?.name || "",
      uploadPath: initialData?.uploadPath || "/data/uploads",
      fileTypes: initialData?.fileTypes || ["csv"],
      maxFileSize: initialData?.maxFileSize || 100,
      autoProcess: initialData?.autoProcess ?? true,
      processSchedule: initialData?.processSchedule || "immediate",
      scheduleTime: initialData?.scheduleTime || "09:00",
      backupOriginal: initialData?.backupOriginal ?? true,
      validateHeaders: initialData?.validateHeaders ?? true,
      skipDuplicates: initialData?.skipDuplicates ?? false,
      archiveProcessed: initialData?.archiveProcessed ?? true,
      notificationEmail: initialData?.notificationEmail || "",
      description: initialData?.description || "",
    },
  });

  const { watch, setValue } = form;
  const processSchedule = watch("processSchedule");

  // Update file types in form when they change
  useEffect(() => {
    setValue("fileTypes", selectedFileTypes);
  }, [selectedFileTypes, setValue]);

  const toggleFileType = (fileType: string) => {
    setSelectedFileTypes(prev =>
      prev.includes(fileType)
        ? prev.filter(type => type !== fileType)
        : [...prev, fileType]
    );
  };

  const handleSubmit = (data: FileUploadConnectorFormData) => {
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
                    <Input placeholder="e.g., Daily Transaction Files" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="uploadPath"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Path</FormLabel>
                  <FormControl>
                    <Input placeholder="/data/uploads" {...field} />
                  </FormControl>
                  <FormDescription>
                    Directory where uploaded files will be stored
                  </FormDescription>
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
                      placeholder="Brief description of this file upload connector"
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

        {/* File Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">File Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* File Types */}
          <FormField
            control={form.control}
            name="fileTypes"
            render={() => (
              <FormItem>
                <FormLabel>Supported File Types</FormLabel>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {FILE_TYPE_OPTIONS.map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={selectedFileTypes.includes(option.value) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleFileType(option.value)}
                      className="justify-start"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      {option.label}
                    </Button>
                  ))}
                </div>
                <FormDescription>
                  Select the file types this connector will accept
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

            <FormField
              control={form.control}
              name="maxFileSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max File Size (MB)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="1000"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Maximum size for individual uploaded files
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Processing Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Processing Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="autoProcess"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Auto-Process Files</FormLabel>
                    <FormDescription>
                      Automatically process uploaded files as soon as they&apos;re uploaded
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

            <FormField
              control={form.control}
              name="processSchedule"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Processing Schedule</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select processing schedule" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="immediate">Process Immediately</SelectItem>
                      <SelectItem value="hourly">Every Hour</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Schedule Time (only show if not immediate) */}
            {processSchedule !== "immediate" && (
              <FormField
                control={form.control}
                name="scheduleTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Schedule Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormDescription>
                      Time when scheduled processing should occur
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
        </Card>

        {/* Advanced Options */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Advanced Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="backupOriginal"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Backup Original Files</FormLabel>
                      <FormDescription>
                        Keep copies of original uploaded files
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

              <FormField
                control={form.control}
                name="validateHeaders"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Validate Headers</FormLabel>
                      <FormDescription>
                        Check file headers before processing
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

              <FormField
                control={form.control}
                name="skipDuplicates"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Skip Duplicates</FormLabel>
                      <FormDescription>
                        Skip processing duplicate records
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

              <FormField
                control={form.control}
                name="archiveProcessed"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Archive Processed Files</FormLabel>
                      <FormDescription>
                        Move processed files to archive folder
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
            </div>

            <FormField
              control={form.control}
              name="notificationEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notification Email (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="admin@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Email address to notify on processing completion or errors
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create File Upload Connector"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
