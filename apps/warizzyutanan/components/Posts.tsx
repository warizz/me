import Link from "next/link";

import Page from "./Page";
import PostDate from "./PostDate";
import type { IPostsPage } from "./Posts.server";

type Props = IPostsPage;

const breadcrumbs = [{ text: "posts", href: "/posts" }];

const Posts = ({ posts, title }: Props) => {
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
                  <PostDate value={new Date(post.date)} />
                  <span>•</span>
                </div>
              </div>
            );
          })}
      </div>
    </Page>
  );
};

export default Posts;
