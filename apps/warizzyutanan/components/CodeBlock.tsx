import { Prism } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CodeBlock({
  language,
  children,
  ...props
}: {
  language?: string;
  children: string;
  [key: string]: unknown;
}) {
  return (
    <Prism language={language} style={oneDark} {...(props as any)}>
      {children}
    </Prism>
  );
}
