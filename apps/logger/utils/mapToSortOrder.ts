export default function mapToSortOrder(value: string) {
  switch (value) {
    case "desc":
      return "desc";

    case "asc":
    default:
      return "asc";
  }
}
