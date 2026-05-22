"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  CalendarIcon,
  PowerIcon,
  Loader2Icon,
  CheckCircleIcon,
  XCircleIcon,
  LanguagesIcon,
} from "lucide-react";
import { toast } from "sonner";
import type { UseMutationResult } from "@tanstack/react-query";

interface LoopConfigCardProps {
  weeklyLoopEnabled: boolean;
  loopDay: string | null;
  loopTime: string | null;
  supportedLanguages: string[];
  updateSystemConfig: UseMutationResult<
    AdminSystemConfigItem,
    Error,
    { key: string; value: string },
    unknown
  >;
  isLoading?: boolean;
}

type AdminSystemConfigItem = {
  key: string;
  value: string;
  updatedBy: string | null;
  updatedAt: string | null;
};

const DAYS = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

export function LoopConfigCard({
  weeklyLoopEnabled,
  loopDay,
  loopTime,
  supportedLanguages,
  updateSystemConfig,
  isLoading,
}: LoopConfigCardProps) {
  const [localEnabled, setLocalEnabled] = useState(weeklyLoopEnabled);
  const [localDay, setLocalDay] = useState(loopDay || "monday");
  const [localTime, setLocalTime] = useState(loopTime || "09:00");

  const handleToggleEnabled = () => {
    const newValue = !localEnabled;
    updateSystemConfig.mutate(
      { key: "weekly_loop_enabled", value: newValue.toString() },
      {
        onSuccess: () => {
          toast.success("Weekly loop status updated");
          setLocalEnabled(newValue);

          // When enabling the loop, ensure loop_day and loop_time are set
          if (newValue && (!loopDay || !loopTime)) {
            const dayToSet = localDay;
            const timeToSet = localTime;

            updateSystemConfig.mutate(
              { key: "loop_day", value: dayToSet },
              {
                onSuccess: () => {
                  updateSystemConfig.mutate(
                    { key: "loop_time", value: timeToSet },
                    {
                      onSuccess: () => {
                        toast.success("Loop schedule configured");
                      },
                    }
                  );
                },
              }
            );
          }
        },
        onError: (error) => {
          toast.error(error instanceof Error ? error.message : "Failed to update loop status");
        },
      }
    );
  };

  const handleUpdateDay = (value: string) => {
    setLocalDay(value);
    updateSystemConfig.mutate(
      { key: "loop_day", value },
      {
        onSuccess: () => {
          toast.success("Loop day updated");
        },
        onError: (error) => {
          toast.error(error instanceof Error ? error.message : "Failed to update loop day");
        },
      }
    );
  };

  const handleUpdateTime = (value: string) => {
    setLocalTime(value);
    updateSystemConfig.mutate(
      { key: "loop_time", value },
      {
        onSuccess: () => {
          toast.success("Loop time updated");
        },
        onError: (error) => {
          toast.error(error instanceof Error ? error.message : "Failed to update loop time");
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          <CardTitle>Weekly Loop Schedule</CardTitle>
        </div>
        <CardDescription>
          Configure when the automated content generation loop runs.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-full ${
                localEnabled ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
              }`}
            >
              {localEnabled ? (
                <CheckCircleIcon className="h-5 w-5" />
              ) : (
                <XCircleIcon className="h-5 w-5" />
              )}
            </div>
            <div>
              <div className="font-medium">Weekly Loop</div>
              <div className="text-sm text-muted-foreground">
                {localEnabled ? "Active" : "Paused (Emergency Stop)"}
              </div>
            </div>
          </div>
          <Button
            variant={localEnabled ? "destructive" : "default"}
            onClick={handleToggleEnabled}
            disabled={isLoading || updateSystemConfig.isPending}
          >
            {updateSystemConfig.isPending ? (
              <Loader2Icon className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <PowerIcon className="h-4 w-4 mr-2" />
            )}
            {localEnabled ? "Stop Loop" : "Start Loop"}
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="loop-day">Day of Week</Label>
            <Select
              value={localDay}
              onValueChange={handleUpdateDay}
              disabled={isLoading || updateSystemConfig.isPending || !localEnabled}
            >
              <SelectTrigger id="loop-day" className="w-full">
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                {DAYS.map((day) => (
                  <SelectItem key={day.value} value={day.value}>
                    {day.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="loop-time">Time (UTC)</Label>
            <Input
              id="loop-time"
              type="time"
              value={localTime}
              onChange={(e) => handleUpdateTime(e.target.value)}
              disabled={isLoading || updateSystemConfig.isPending || !localEnabled}
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Supported Languages</Label>
          <div className="flex flex-wrap gap-2">
            {supportedLanguages.length > 0 ? (
              supportedLanguages.map((lang) => (
                <div
                  key={lang}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                >
                  <LanguagesIcon className="h-3.5 w-3.5" />
                  {lang.toUpperCase()}
                </div>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">No languages configured</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
