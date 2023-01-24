import { readdirSync } from "fs";

import type { GetStaticProps } from "next";

import getPostData, { postsDirectory } from "./lib/getPostData";
import { IPosts } from "./Posts.schema";

export function getPosts() {
  return readdirSync(postsDirectory)
    .map(getPostData)
    .filter((post) => post.isPublished);
}

interface Args {
  title: string;
}

export const getStaticProps = ({ title }: Args): GetStaticProps<IPosts> => {
  return async () => {
    const posts = getPosts();
    return { props: { title, posts } };
  };
};
