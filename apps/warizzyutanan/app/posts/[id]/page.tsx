import { readdirSync } from "fs";
import path from "path";

import BlogLayout from "../../../components/BlogLayout";
import getPostData from "../../../components/lib/getPostData";
import Markdown from "../../../components/Markdown";
import Tag from "../../../components/Tag";

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), "posts");
  const fileNames = readdirSync(postsDirectory);

  return fileNames.map((fileName) => {
    const id = path.parse(fileName).name;
    return { id };
  });
}

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const post = getPostData(`${id}.md`);
  return {
    title: `${post.title} - Warizz Yutanan`,
    description: post.description,
    robots: post.isPublished ? "index, follow" : "noindex, nofollow",
  };
}

export default async function PostPage({ params }: Props) {
  const { id } = await params;
  const post = getPostData(`${id}.md`);

  return (
    <BlogLayout
      breadcrumbs={[
        { text: "posts", href: "/posts" },
        { text: "current", href: "/posts" },
      ]}
      h1={<h1 className="!mb-0">{post.title}</h1>}
      date={new Date(post.date)}
    >
      <Markdown>{post.markdownString}</Markdown>
      <hr />
      <div className="flex gap-4">
        🏷️
        {post.tags.map((tag) => (
          <Tag key={tag} txt={tag} />
        ))}
      </div>
    </BlogLayout>
  );
}
