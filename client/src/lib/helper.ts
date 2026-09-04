import { getHours } from "date-fns";

export function getGreeting() {
  const hour = getHours(new Date());

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
}
