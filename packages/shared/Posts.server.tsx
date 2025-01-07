import { readdirSync } from "fs";

import type { GetStaticProps } from "next";
import { z } from "zod";

import getPostData, { postsDirectory, Post } from "./lib/getPostData";

const PostsPage = z.object({
  posts: Post.array(),
  title: z.string(),
});

export function getPosts() {
  return readdirSync(postsDirectory)
    .map(getPostData)
    .filter((post) => post.isPublished);
}

export type IPostsPage = z.infer<typeof PostsPage>;

interface Args {
  title: string;
}

export const getStaticProps = ({ title }: Args): GetStaticProps<IPostsPage> => {
  return async () => {
    const posts = getPosts();
    return { props: PostsPage.parse({ posts, title }) };
  };
};
