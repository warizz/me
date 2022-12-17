import { readdirSync, readFileSync } from "fs";
import path from "path";

import matter from "gray-matter";
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

import BlogLayout from "../../components/BlogLayout";
import Breadcrumbs from "../../components/Breadcrumbs";

interface Post {
  id: string;
  title: string;
  tags: string[];
}

const Posts = ({ posts }: { posts: Post[] }) => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{"Warizz' blogs"}</title>
      </Head>
      <BlogLayout>
        <Breadcrumbs
          list={[
            { type: "link", text: "home", href: "/" },
            { type: "text", text: "posts" },
          ]}
        />
        <h1 className="dark:text-white">Blogs</h1>
        <div data-testid="posts">
          {posts
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
                      className="text-amber-500 no-underline prose-xl hover:text-amber-600"
                      href={"/posts/" + post.id}
                    >
                      {post.title}
                    </Link>
                  </div>
                  <div className="prose-sm font-sans flex gap-2">
                    {post.tags.map((tag) => {
                      return (
                        <Link
                          key={tag}
                          href={"/posts?tag=" + tag}
                          className="no-underline text-gray-50 hover:text-gray-300"
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
      </BlogLayout>
    </>
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
      };
    })
    .filter((post) => post.isPublished);

  return { props: { posts: matters } };
};

export default Posts;
