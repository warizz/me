import omit from "lodash/omit";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import photoMeta from "../app/timecapsule/photo-meta";

const CodeBlock = dynamic(() => import("./CodeBlock"));

interface Props {
  children: string;
}

export default function Markdown({ children }: Props) {
  const firstImgSrc = children.match(/!\[[^\]]*\]\(([^)\s]+)[^)]*\)/)?.[1];
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
            <CodeBlock language={match?.[1] ?? undefined} {...(_props as any)}>
              {String(children).replace(/\n$/, "")}
            </CodeBlock>
          );
        },
        iframe({ width, height, ...props }) {
          const _props = omit(props, "node");
          const w = Number(width);
          const h = Number(height);
          return (
            <iframe
              {..._props}
              className="w-full max-w-[560px] h-auto"
              style={{ aspectRatio: w && h ? `${w} / ${h}` : "16 / 9" }}
            />
          );
        },
        img({ ...props }) {
          const _props = omit(props, ["node"]);
          const meta =
            !_props.srcSet && typeof _props.src === "string"
              ? photoMeta[_props.src]
              : undefined;
          const isLcp = firstImgSrc != null && _props.src === firstImgSrc;
          return (
            <img
              {..._props}
              {...(meta
                ? {
                    width: meta.w,
                    height: meta.h,
                    srcSet: meta.srcset,
                    sizes: meta.sizes,
                  }
                : {})}
              loading={
                isLcp
                  ? "eager"
                  : (_props.loading ?? (meta ? "lazy" : undefined))
              }
              fetchPriority={isLcp ? "high" : undefined}
              className="w-full h-auto lg:w-auto lg:max-h-[300px] border-2 lg:border border-black dark:border-0"
            />
          );
        },
        video({ ...props }) {
          const _props = omit(props, ["node"]);
          return (
            <video
              {..._props}
              className="w-full h-auto lg:max-h-[300px] border-2 lg:border border-black dark:border-0"
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
