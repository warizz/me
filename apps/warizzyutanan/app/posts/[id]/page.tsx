import BlogLayout from "../../../components/BlogLayout";
import { getContentFileNames } from "../../../components/lib/getContent";
import getPostData from "../../../components/lib/getPostData";
import Markdown from "../../../components/Markdown";
import Tag from "../../../components/Tag";

export async function generateStaticParams() {
  return getContentFileNames("post").map((fileName) => ({
    id: fileName.replace(/\.md$/, ""),
  }));
}

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const post = getPostData(`${id}.md`);
  return {
    title: `${post.title} - Warizz Yutanan`,
    description: post.description || post.tldr || undefined,
    robots: post.isPublished ? "index, follow" : "noindex, nofollow",
  };
}

export default async function PostPage({ params }: Props) {
  const { id } = await params;
  const post = getPostData(`${id}.md`);

  return (
    <BlogLayout
      bare
      breadcrumbs={[
        { text: "posts", href: "/posts" },
        { text: "current", href: "/posts" },
      ]}
      h1={
        <h1 className="text-3xl font-black tracking-tight text-primary lg:text-4xl dark:text-primary-invert">
          {post.title}
        </h1>
      }
      date={new Date(post.date)}
    >
      <div className="post-body">
        <Markdown>{post.markdownString}</Markdown>
      </div>
      <footer className="mt-12 flex flex-wrap items-baseline gap-x-3 gap-y-2 border-t border-gray-200 pt-6 font-sans text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
        🏷️
        {post.tags
          .filter((tag) => tag !== "post")
          .map((tag) => (
            <Tag key={tag} txt={tag} />
          ))}
      </footer>
    </BlogLayout>
  );
}
