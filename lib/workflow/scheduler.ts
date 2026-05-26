/**
 * Calculate the next scheduled run time based on day of week and time.
 * Used by workflows to sleep until the configured schedule.
 */

export function getNextScheduledRun(loopDay: string, loopTime: string): Date {
  const now = new Date();
  const [hours, minutes] = loopTime.split(":").map(Number);

  // Map day names to JavaScript day numbers (0 = Sunday, 1 = Monday, etc.)
  const dayMap: Record<string, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  const targetDay = dayMap[loopDay.toLowerCase()] || 1; // Default to Monday
  const targetDate = new Date(now);
  targetDate.setUTCHours(hours, minutes, 0, 0);

  // If the target day/time has already passed this week, schedule for next week
  if (targetDate.getTime() <= now.getTime() || targetDate.getUTCDay() !== targetDay) {
    targetDate.setUTCDate(targetDate.getUTCDate() + (7 - (targetDate.getUTCDay() - targetDay + 7) % 7));
  }

  // Ensure we're on the correct day
  while (targetDate.getUTCDay() !== targetDay) {
    targetDate.setUTCDate(targetDate.getUTCDate() + 1);
  }

  return targetDate;
}
