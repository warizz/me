import BlogLayout from "../../components/BlogLayout";
import { getContentFileNames } from "../../components/lib/getContent";
import getPostData from "../../components/lib/getPostData";
import PostsList from "../../components/PostsList";

function getPosts() {
  return getContentFileNames("post")
    .map(getPostData)
    .filter((post) => post.isPublished);
}

export async function generateMetadata() {
  return {
    title: "Posts - Warizz Yutanan",
    description: "In my humble opinions",
    robots: "index, follow",
  };
}

interface Props {
  searchParams: Promise<{ tag?: string | string[] }>;
}

async function PostsPage({ searchParams }: Props) {
  const { tag } = await searchParams;
  const activeTags = Array.from(
    new Set((Array.isArray(tag) ? tag : tag ? [tag] : []).filter(Boolean)),
  );

  const posts = getPosts().map(({ date, id, tags, title, tldr }) => ({
    date,
    id,
    tags,
    title,
    tldr,
  }));

  return (
    <BlogLayout
      breadcrumbs={[{ text: "posts", href: "/posts" }]}
      h1={<h1 className="text-primary dark:text-primary-invert">Posts</h1>}
    >
      <PostsList activeTags={activeTags} posts={posts} />
    </BlogLayout>
  );
}

export default PostsPage;
