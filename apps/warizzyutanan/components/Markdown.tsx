import omit from "lodash/omit";
import ReactMarkdown from "react-markdown";
import { Prism } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

interface Props {
  children: string;
}

export default function Markdown({ children }: Props) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        code(props) {
          const { className, children } = props;
          const inline = !className; // Basic heuristic for react-markdown 9+
          const _props = omit(props, ["node", "inline"]);
          const match = /language-(\w+)/.exec(className || "");
          if (inline) {
            return (
              <span className="not-prose text-primary dark:text-primary-invert">
                <code className={className}>{children}</code>
              </span>
            );
          }
          return (
            <Prism
              language={match?.[1] ?? undefined}
              style={oneDark}
              {...(_props as any)}
            >
              {String(children).replace(/\n$/, "")}
            </Prism>
          );
        },
        img({ ...props }) {
          const _props = omit(props, "node");
          return (
            <img
              {..._props}
              className="w-full lg:w-auto lg:max-h-[300px] border-2 lg:border-1 border-black dark:border-0"
            />
          );
        },
        pre({ children }) {
          return <>{children}</>;
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
