"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";

import Page from "./Page";
import PostDate from "./PostDate";
import type { IPostsPage } from "./Posts.server";
import Tag from "./Tag";

type Props = IPostsPage;

function useTag() {
  "use client";

  const [tag, setTag] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const t = z
      .string()
      .nullish()
      .default(null)
      .parse(searchParams?.get("tag"));
    setTag(t);
  }, [searchParams]);

  return tag;
}

const Posts = ({ posts, title }: Props) => {
  const tag = useTag();
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
                <p className="!m-0 prose-base italic">{post.tldr}</p>
                <div className="prose-sm font-sans flex gap-2 items-center flex-wrap">
                  <PostDate value={new Date(post.date)} />
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
