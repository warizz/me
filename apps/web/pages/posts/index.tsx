import { readdirSync, readFileSync } from "fs";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import path from "path";
import React from "react";
import matter from "gray-matter";
import { BlogLayout } from "../../components/BlogLayout";

interface Post {
  id: string;
  title: string;
}

const Posts = ({ posts }: { posts: Post[] }) => {
  return (
    <>
      <Head>
        <title>{"Warizz' blogs"}</title>
      </Head>
      <BlogLayout>
        <h1>Blogs</h1>
        {posts.map((post) => {
          return (
            <a
              className="text-gray-300 no-underline block"
              href={"/posts/" + post.id}
            >
              {post.title}
            </a>
          );
        })}
      </BlogLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const postsDirectory = path.join(process.cwd(), "posts");
  const matters: Post[] = readdirSync(postsDirectory).map((fileNames) => {
    const fullPath = path.join(postsDirectory, fileNames);
    const fileContents = readFileSync(fullPath, "utf8");
    const blogMetaData = matter(fileContents);
    return {
      title: String(blogMetaData.data.title),
      id: path.parse(fullPath).name,
    };
  });

  return { props: { posts: matters } };
};

export default Posts;
