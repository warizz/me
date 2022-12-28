import Link from "next/link";
import { useRouter } from "next/router";

import Page from "./Page";

interface Post {
  id: string;
  title: string;
  tags: string[];
  date: string;
  isPublished: boolean;
}

interface Props {
  posts: Post[];
}

const Posts = ({ posts }: Props) => {
  const router = useRouter();
  const tag =
    typeof router.query.tag === "string" ? router.query.tag : undefined;
  const breadcrumbs = [{ text: "posts", href: "/posts" }];
  if (tag) {
    breadcrumbs.push({ text: `tag: ${tag}`, href: `/post?tag=${tag}` });
  }

  return (
    <Page
      meta={{
        title: "Warizz's Blog",
        description: "In my humble opinions",
        robots: "index, follow",
      }}
      layout={{ breadcrumbs, h1: <h1 className="dark:text-white">Blogs</h1> }}
    >
      <div data-testid="posts">
        {posts
          .sort((a, b) => {
            const aDate = new Date(a.date);
            const bDate = new Date(b.date);
            if (aDate > bDate) return -1;
            return 1;
          })
          .filter((post) => {
            if (router.query.tag)
              return post.tags.includes(String(router.query.tag));
            return true;
          })
          .map((post) => {
            return (
              <div key={post.id} className="mb-8 lg:mb-12">
                <div>
                  <Link
                    className="text-primary font-bold dark:text-primary-invert no-underline prose-xl dark:hover:underline"
                    href={`/posts/${post.id}`}
                  >
                    {post.title}
                  </Link>
                </div>
                <div className="prose-sm font-sans flex gap-2 items-center">
                  <span className="font-serif">
                    {new Intl.DateTimeFormat("default", {
                      year: "numeric",
                      day: "numeric",
                      month: "short",
                    }).format(new Date(post.date))}
                  </span>
                  <span>•</span>
                  {post.tags.map((tag) => {
                    return (
                      <Link
                        key={tag}
                        href={`/posts?tag=${tag}`}
                        className="text-black hover:text-gray-800 dark:text-gray-50 dark:hover:text-gray-300"
                      >
                        #{tag}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>
    </Page>
  );
};

export default Posts;
