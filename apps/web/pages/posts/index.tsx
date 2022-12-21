import { readdirSync, readFileSync } from "fs";
import path from "path";

import matter from "gray-matter";
import { GetStaticProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

import Page from "../../components/Page";

interface Post {
  id: string;
  title: string;
  tags: string[];
  date: string;
  isPublished: boolean;
}

const Posts = ({ posts }: { posts: Post[] }) => {
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
                    className="text-red-800 font-bold dark:text-amber-500 no-underline prose-xl dark:hover:text-amber-600"
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

export const getStaticProps: GetStaticProps = async () => {
  const postsDirectory = path.join(process.cwd(), "posts");
  const matters: Post[] = readdirSync(postsDirectory)
    .map((fileNames) => {
      const fullPath = path.join(postsDirectory, fileNames);
      const fileContents = readFileSync(fullPath, "utf8");
      const blogMetaData = matter(fileContents);
      return {
        title: String(blogMetaData.data.title),
        id: path.parse(fullPath).name,
        tags: blogMetaData.data.tags ?? [],
        isPublished: !!blogMetaData.data.publish,
        date: blogMetaData.data.date, // Date can't be serialized to JSON
      };
    })
    .filter((post) => post.isPublished);

  return { props: { posts: matters } };
};

export default Posts;
