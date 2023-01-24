"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import Page from "./Page";
import { IPosts } from "./Posts.schema";
import Tag from "./Tag";

type Props = IPosts;

const Posts = ({ posts }: Props) => {
  const searchParams = useSearchParams();
  const tag = searchParams?.get("tag");

  const breadcrumbs = [{ text: "posts", href: "/posts" }];
  if (tag) {
    breadcrumbs.push({ text: `tag: ${tag}`, href: `/posts?tag=${tag}` });
  }

  return (
    <Page
      layout={{ breadcrumbs, h1: <h1 className="dark:text-white">Blog</h1> }}
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
            if (tag) return post.tags.includes(tag);
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
