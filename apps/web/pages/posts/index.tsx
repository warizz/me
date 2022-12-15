import { readdirSync, readFileSync } from "fs";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import path from "path";
import React from "react";
import matter from "gray-matter";

const Posts = ({ posts }: { posts: { title: string }[] }) => {
  return (
    <>
      <Head>
        <title>{"Warizz' blogs"}</title>
      </Head>
      <article className="prose lg:prose-xl mx-auto px-4 bg-white lg:pt-20 pt-12 dark:bg-black min-h-screen font-serif">
        <h1>Blogs</h1>
        <ul>
          {posts.map((post) => {
            return (
              <li>
                <a className="text-gray-300" href={"/posts/" + post.id}>
                  {post.title}
                </a>
              </li>
            );
          })}
        </ul>
      </article>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const postsDirectory = path.join(process.cwd(), "posts");
  const matters = readdirSync(postsDirectory).map((fileNames) => {
    const fullPath = path.join(postsDirectory, fileNames);
    const fileContents = readFileSync(fullPath, "utf8");
    const blogMetaData = matter(fileContents);
    return { ...blogMetaData.data, id: path.parse(fullPath).name };
  });

  return { props: { posts: matters } };
};

export default Posts;
