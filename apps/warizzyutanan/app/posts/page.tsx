import { readdirSync } from "fs";

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
  return readdirSync(postsDirectory)
    .map(getPostData)
    .filter((post) => post.isPublished);
}

export type IPostsPage = z.infer<typeof PostsSchema>;

async function PostsPage() {
  const posts = getPosts();
  return <Posts posts={posts} title="Warizz Yutanan's blog" />;
}

export default PostsPage;
