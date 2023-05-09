import usePreferredColorScheme from "../utils/usePreferredColorScheme";

import Button from "./Button";

export default function ColorSchemeToggle() {
  const { preferredColorScheme, toggleColorScheme } = usePreferredColorScheme();

  return (
    <Button testId="theme" onClick={() => toggleColorScheme()}>
      {"Theme: "}
      <strong>
        <i>{preferredColorScheme}</i>
      </strong>
    </Button>
  );
}
