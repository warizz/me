export default function mapToColorScheme(value: string) {
  switch (value) {
    case "light":
      return "light";

    case "dark":
      return "dark";

    case "system":
    default:
      return "system";
  }
}
