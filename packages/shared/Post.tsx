import omit from "lodash.omit";
import ReactMarkdown from "react-markdown";
import Prism from "react-syntax-highlighter/dist/cjs/prism";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkGfm from "remark-gfm";

import type { IPost } from "./lib/getPostData";
import Page from "./Page";
import Tag from "./Tag";

type Props = {
  siteTitle: string;
  post: IPost;
};

const Post = ({
  siteTitle,
  post: { date, description, isPublished, markdownString, tags, title },
}: Props) => {
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
        title: `${title} - ${siteTitle}`,
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
                style={oneDark}
                language={match?.[1] ?? undefined}
                {..._props}
              >
                {children.toString()}
              </Prism>
            );
          },
        }}
      >
        {markdownString}
      </ReactMarkdown>
      <hr />
      <div className="flex gap-4">
        🏷️
        {tags.map((tag) => (
          <Tag key={tag} txt={tag} />
        ))}
      </div>
    </Page>
  );
};

export default Post;
