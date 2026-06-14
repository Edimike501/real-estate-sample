export function timeAgo(dateInput: Date | string): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const now = new Date();
  
  // Calculate midnight-to-midnight difference in calendar days, or simple difference
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 1) {
    return "Listed today";
  }
  if (diffDays === 1) {
    return "Listed yesterday";
  }
  if (diffDays < 7) {
    return `Listed ${diffDays} days ago`;
  }
  
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks === 1) {
    return "Listed 1 week ago";
  }
  if (diffWeeks < 4) {
    return `Listed ${diffWeeks} weeks ago`;
  }

  // 1+ month: "Listed May 2025"
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  });
  return `Listed ${formatter.format(date)}`;
}
