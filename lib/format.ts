export function formatDate(dateString: string | null): string {
  if (!dateString) return "Never";
  return new Date(dateString).toLocaleString();
}

export function formatKey(key: string): string {
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatConfigValue(key: string, value: string): string {
  // Format boolean values
  if (key === "weekly_loop_enabled") {
    return value === "true" ? "Enabled" : "Disabled";
  }

  // Format day of week
  if (key === "loop_day") {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  // Return as-is for other values
  return value;
}
