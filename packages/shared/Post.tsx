import "prismjs/themes/prism-tomorrow.min.css";

import Page from "./Page";

export interface IPost {
  contentHtml: string;
  title: string;
  description: string;
  date: string;
  isPublished: boolean;
}

const Post = ({
  contentHtml,
  title,
  description,
  date,
  isPublished,
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
      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </Page>
  );
};

export default Post;
