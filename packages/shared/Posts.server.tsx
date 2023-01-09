import { readdirSync } from "fs";

import { GetStaticProps } from "next";

import getPostData, { postsDirectory } from "./lib/getPostData";

export const getStaticProps: GetStaticProps = async () => {
  const posts = readdirSync(postsDirectory)
    .map(getPostData)
    .filter((post) => post.isPublished);

  return { props: { posts } };
};
