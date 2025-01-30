import omit from "lodash.omit";
import ReactMarkdown from "react-markdown";
import Prism from "react-syntax-highlighter/dist/cjs/prism";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

interface Props {
  children: string;
}

export default function Markdown({ children }: Props) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      // @ts-expect-error 3rd party plugin
      rehypePlugins={[rehypeRaw]}
      components={{
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
        img({ ...props }) {
          const _props = omit(props, "node");
          return (
            // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
            <img
              {..._props}
              className="w-full lg:w-auto lg:max-h-[300px] border-2 lg:border-1 border-black dark:border-0 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:shadow-white"
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
