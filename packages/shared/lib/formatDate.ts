export default function formatDate(date: Date) {
  return new Intl.DateTimeFormat("default", {
    year: "numeric",
    day: "numeric",
    month: "short",
  }).format(date);
}
