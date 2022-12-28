import { readdirSync, readFileSync } from "fs";
import path from "path";

import matter from "gray-matter";
import { GetStaticProps } from "next";

export const getStaticProps: GetStaticProps = async () => {
  const postsDirectory = path.join(process.cwd(), "posts");
  const matters = readdirSync(postsDirectory)
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
