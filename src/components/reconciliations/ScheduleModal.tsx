"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Repeat } from "lucide-react";

interface ScheduleModalProps {
  open: boolean;
  onClose: () => void;
  onSchedule: (scheduleData: any) => void;
}

export function ScheduleModal({ open, onClose, onSchedule }: ScheduleModalProps) {
  const [scheduleType, setScheduleType] = useState<"once" | "recurring">("once");
  const [scheduleName, setScheduleName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [cronExpression, setCronExpression] = useState("");
  const [isActive, setIsActive] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const scheduleData = {
      name: scheduleName,
      type: scheduleType,
      startDate,
      startTime,
      frequency: scheduleType === "recurring" ? frequency : null,
      cronExpression: scheduleType === "recurring" ? cronExpression : null,
      isActive,
    };

    onSchedule(scheduleData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Schedule Reconciliation Job
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Schedule Name */}
          <div className="space-y-2">
            <Label htmlFor="scheduleName">Schedule Name</Label>
            <Input
              id="scheduleName"
              placeholder="e.g., Daily Bank Reconciliation"
              value={scheduleName}
              onChange={(e) => setScheduleName(e.target.value)}
              required
            />
          </div>

          {/* Schedule Type */}
          <div className="space-y-2">
            <Label>Schedule Type</Label>
            <Select value={scheduleType} onValueChange={(value: "once" | "recurring") => setScheduleType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="once">Run Once</SelectItem>
                <SelectItem value="recurring">Recurring</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Start Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Recurring Schedule Options */}
          {scheduleType === "recurring" && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Repeat className="w-4 h-4" />
                  Recurring Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Select value={frequency} onValueChange={setFrequency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="custom">Custom Cron</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {frequency === "custom" && (
                  <div className="space-y-2">
                    <Label htmlFor="cronExpression">Cron Expression</Label>
                    <Input
                      id="cronExpression"
                      placeholder="0 0 * * * (daily at midnight)"
                      value={cronExpression}
                      onChange={(e) => setCronExpression(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">
                      Format: minute hour day month weekday
                    </p>
                  </div>
                )}

                {frequency !== "custom" && (
                  <div className="text-sm text-gray-600">
                    {frequency === "daily" && "Runs every day at the specified time"}
                    {frequency === "weekly" && "Runs every week on the specified day and time"}
                    {frequency === "monthly" && "Runs every month on the specified date and time"}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Active Toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="isActive">Active</Label>
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Schedule Job
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
