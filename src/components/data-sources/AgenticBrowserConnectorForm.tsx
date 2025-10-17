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
import { Eye, EyeOff, Bot, Code, Globe, Zap } from "lucide-react";

// Validation schema for agentic browser connector
const agenticBrowserConnectorSchema = z.object({
  name: z.string().min(1, "Connector name is required").max(100, "Name too long"),
  targetUrls: z.array(z.string().url("Invalid URL")).min(1, "At least one target URL is required"),
  extractionRules: z.string().min(1, "Extraction rules are required"),
  schedule: z.enum(["manual", "hourly", "daily", "weekly"]),
  scheduleTime: z.string().catch(""),
  maxPages: z.number().catch(50),
  waitTime: z.number().catch(5),
  userAgent: z.string().catch(""),
  enableJavaScript: z.boolean().catch(true),
  enableImages: z.boolean().catch(false),
  enableCookies: z.boolean().catch(true),
  retryAttempts: z.number().catch(3),
  timeout: z.number().catch(60),
  description: z.string().catch(""),
}).refine(
  (data) => data.schedule === "manual" || (data.scheduleTime && data.scheduleTime.trim() !== ""),
  {
    message: "Schedule time is required for automated schedules",
    path: ["scheduleTime"],
  }
);

type AgenticBrowserConnectorFormData = z.infer<typeof agenticBrowserConnectorSchema>;

interface AgenticBrowserConnectorFormProps {
  onSubmit: (data: AgenticBrowserConnectorFormData) => void;
  initialData?: Partial<AgenticBrowserConnectorFormData>;
  isLoading?: boolean;
}

export function AgenticBrowserConnectorForm({ onSubmit, initialData, isLoading }: AgenticBrowserConnectorFormProps) {
  const [targetUrls, setTargetUrls] = useState<string[]>(
    initialData?.targetUrls || [""]
  );
  const [newUrl, setNewUrl] = useState("");

  const form = useForm<AgenticBrowserConnectorFormData>({
    resolver: zodResolver(agenticBrowserConnectorSchema),
    mode: "onChange",
    defaultValues: {
      name: initialData?.name ?? "",
      targetUrls: initialData?.targetUrls || [],
      extractionRules: initialData?.extractionRules || "// Example: Extract all table data\n// document.querySelectorAll('table tr').forEach(row => { ... });",
      schedule: initialData?.schedule || "manual",
      scheduleTime: initialData?.scheduleTime || "09:00",
      maxPages: initialData?.maxPages || 50,
      waitTime: initialData?.waitTime || 5,
      userAgent: initialData?.userAgent || "",
      enableJavaScript: initialData?.enableJavaScript ?? true,
      enableImages: initialData?.enableImages ?? false,
      enableCookies: initialData?.enableCookies ?? true,
      retryAttempts: initialData?.retryAttempts || 3,
      timeout: initialData?.timeout || 60,
      description: initialData?.description || "",
    },
  });

  const { watch, setValue } = form;
  const schedule = watch("schedule");

  // Update target URLs in form when they change
  useEffect(() => {
    setValue("targetUrls", targetUrls.filter(url => url.trim() !== ""));
  }, [targetUrls, setValue]);

  const addUrl = () => {
    if (newUrl.trim() && !targetUrls.includes(newUrl.trim())) {
      setTargetUrls([...targetUrls, newUrl.trim()]);
      setNewUrl("");
    }
  };

  const removeUrl = (index: number) => {
    setTargetUrls(targetUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = (data: AgenticBrowserConnectorFormData) => {
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
                    <Input placeholder="e.g., Product Catalog Scraper" {...field} />
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
                      placeholder="Brief description of this web scraping connector"
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

        {/* Target URLs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Target URLs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="https://example.com/products"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addUrl();
                  }
                }}
              />
              <Button type="button" onClick={addUrl} disabled={!newUrl.trim()}>
                <Zap className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>

            {targetUrls.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Target URLs:</p>
                {targetUrls.map((url, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <span className="flex-1 text-sm font-mono">{url}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeUrl(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Extraction Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Extraction Rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="extractionRules"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>JavaScript Extraction Code</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="// Example: Extract product data
// const products = [];
// document.querySelectorAll('.product').forEach(item => {
//   products.push({
//     name: item.querySelector('.name')?.textContent,
//     price: item.querySelector('.price')?.textContent,
//     description: item.querySelector('.description')?.textContent
//   });
// });
// return products;"
                      className="font-mono text-sm"
                      rows={12}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Write JavaScript code to extract data from web pages. The code should return an array of objects.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Code Example:</h4>
              <pre className="text-xs text-blue-800 bg-blue-100 p-2 rounded overflow-x-auto">
{`// Extract table data
const data = [];
document.querySelectorAll('table tbody tr').forEach(row => {
  const cells = row.querySelectorAll('td');
  if (cells.length >= 3) {
    data.push({
      name: cells[0]?.textContent?.trim(),
      amount: cells[1]?.textContent?.trim(),
      date: cells[2]?.textContent?.trim()
    });
  }
});
return data;`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Schedule Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="schedule"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scraping Schedule</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select scraping schedule" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="manual">Manual Only</SelectItem>
                      <SelectItem value="hourly">Every Hour</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Schedule Time (only show if not manual) */}
            {schedule !== "manual" && (
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
                      Time when scheduled scraping should occur
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
        </Card>

        {/* Browser Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Browser Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="maxPages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Pages to Crawl</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="1000"
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
                name="waitTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wait Time (seconds)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="30"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Time to wait between page loads
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="userAgent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Agent (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Mozilla/5.0 (compatible; MyBot/1.0)"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Custom user agent string for the browser
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="enableJavaScript"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Enable JavaScript</FormLabel>
                      <FormDescription>
                        Execute JavaScript on pages
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
                name="enableImages"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Load Images</FormLabel>
                      <FormDescription>
                        Download images on pages
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
                name="enableCookies"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Enable Cookies</FormLabel>
                      <FormDescription>
                        Handle cookies and sessions
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="retryAttempts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Retry Attempts</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="5"
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
                name="timeout"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timeout (seconds)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="10"
                        max="300"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Maximum time per page load
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Agentic Browser Connector"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
