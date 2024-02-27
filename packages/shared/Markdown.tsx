import omit from "lodash.omit";
import ReactMarkdown from "react-markdown";
import Prism from "react-syntax-highlighter/dist/cjs/prism";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkGfm from "remark-gfm";

interface Props {
  children: string;
}

export default function Markdown({ children }: Props) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        pre({ children }) {
          return <>{children}</>;
        },
        code({ inline, className, children, ...props }) {
          const _props = omit(props, "node");
          const match = /language-(\w+)/.exec(className || "");
          if (inline) {
            return (
              <span className="not-prose text-primary dark:text-primary-invert">
                <code className={className} {..._props}>
                  {children}
                </code>
              </span>
            );
          }
          return (
            <Prism
              language={match?.[1] ?? undefined}
              {..._props}
              // "style" has to be under {..._props} because of style props are different.
              // https://github.com/react-syntax-highlighter/react-syntax-highlighter/issues/479#issuecomment-1369660231
              style={oneDark}
            >
              {children.toString()}
            </Prism>
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
