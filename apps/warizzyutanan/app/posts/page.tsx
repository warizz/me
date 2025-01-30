import { readdirSync } from "fs";

import { Suspense } from "react";
import { z } from "zod";

import getPostData, {
  Post,
  postsDirectory,
} from "../../components/lib/getPostData";
import Posts from "../../components/Posts";

const PostsSchema = z.object({
  posts: Post.array(),
  title: z.string(),
});

function getPosts() {
  console.log("::postsDirectory", postsDirectory);

  return readdirSync(postsDirectory)
    .map(getPostData)
    .filter((post) => post !== null)
    .filter((post) => post.isPublished);
}

const SearchParamsSchema = z.object({
  tag: z.string().nullish().default(null),
});

export type IPostsPage = z.infer<typeof PostsSchema>;

interface Props {
  searchParams: Promise<unknown>;
}

async function PostsPage({ searchParams }: Props) {
  const s = SearchParamsSchema.parse(await searchParams);
  const posts = getPosts();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Posts tag={s.tag} posts={posts} title="Warizz Yutanan's blog" />
    </Suspense>
  );
}

export default PostsPage;
