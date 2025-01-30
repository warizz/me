import type { IPost } from "./lib/getPostData";
import Markdown from "./Markdown";
import Page from "./Page";
import Tag from "./Tag";

interface Props {
  siteTitle: string;
  post: IPost;
}

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
      <Markdown>{markdownString}</Markdown>
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
