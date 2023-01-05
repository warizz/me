import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkGfm from "remark-gfm";

import Page from "./Page";

export interface IPost {
  contentHtml: string;
  title: string;
  description: string;
  date: string;
  isPublished: boolean;
  markdownString: string;
}

const Post = ({
  title,
  description,
  date,
  isPublished,
  markdownString,
}: IPost) => {
  return (
    <Page
      layout={{
        breadcrumbs: [
          { text: "posts", href: "/posts" },
          { text: "current", href: "/posts" },
        ],
        h1: <h1 className="!mb-0">{title}</h1>,
        date,
      }}
      meta={{
        title: `${title} - Warizz' blog`,
        description,
        robots: isPublished ? "index, follow" : "noindex, nofollow",
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre({ children }) {
            return <>{children}</>;
          },
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            if (inline) {
              return (
                <span className="not-prose text-primary dark:text-primary-invert">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </span>
              );
            }
            return (
              <SyntaxHighlighter
                style={oneDark}
                language={match?.[1] ?? undefined}
                {...props}
              >
                {children.toString()}
              </SyntaxHighlighter>
            );
          },
        }}
      >
        {markdownString}
      </ReactMarkdown>
    </Page>
  );
};

export default Post;
