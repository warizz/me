export default function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    day: "numeric",
    month: "short",
  }).format(date);
}
