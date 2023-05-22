export default function mapToSorting(value: string) {
  switch (value) {
    case "title":
      return "title";

    case "date":
    default:
      return "date";
  }
}
