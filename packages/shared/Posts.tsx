import Link from "next/link";
import { useRouter } from "next/router";

import Page from "./Page";
import type { IPostsPage } from "./Posts.server";
import Tag from "./Tag";

type Props = IPostsPage;

const Posts = ({ posts, title }: Props) => {
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
        title,
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
                <p className="!m-0 prose-base italic">{post.tldr}</p>
                <div className="prose-sm font-sans flex gap-2 items-center flex-wrap">
                  <span className="font-serif">
                    {new Intl.DateTimeFormat("default", {
                      year: "numeric",
                      day: "numeric",
                      month: "short",
                    }).format(new Date(post.date))}
                  </span>
                  <span>•</span>
                  {post.tags.map((tag) => (
                    <Tag key={tag} txt={tag} />
                  ))}
                </div>
              </div>
            );
          })}
      </div>
    </Page>
  );
};

export default Posts;
