import { readdirSync, readFileSync } from "fs";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import path from "path";
import React from "react";
import matter from "gray-matter";
import { BlogLayout } from "../../components/BlogLayout";
import { useRouter } from "next/router";

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
        <h1>Blogs</h1>
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
                    <a
                      className="text-gray-300 no-underline prose-xl"
                      href={"/posts/" + post.id}
                    >
                      {post.title}
                    </a>
                  </div>
                  <div className="prose-sm font-sans flex gap-2">
                    {post.tags.map((tag) => {
                      return (
                        <a
                          key={tag}
                          href={"/posts?tag=" + tag}
                          className="no-underline text-gray-400"
                        >
                          #{tag}
                        </a>
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
