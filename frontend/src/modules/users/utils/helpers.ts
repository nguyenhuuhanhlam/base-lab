export function getInitials(name?: string, email?: string): string {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return "??";
}

export function formatDate(ts?: { seconds: number } | null): string {
  if (!ts?.seconds) return "—";
  return new Date(ts.seconds * 1000).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
