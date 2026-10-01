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
        <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-primary dark:text-primary-invert">
          {post.title}
        </h1>
      }
      date={new Date(post.date)}
    >
      <div className="post-body">
        <Markdown>{post.markdownString}</Markdown>
      </div>
      <footer className="font-sans mt-12 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-wrap gap-x-3 gap-y-2 items-baseline text-sm text-gray-500 dark:text-gray-400">
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
