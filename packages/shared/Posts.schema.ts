import { z } from "zod";

import { Post } from "./lib/getPostData";

export const zPosts = z.object({
  posts: Post.array(),
  title: z.string(),
  tag: z.string().optional(),
});

export type IPosts = z.infer<typeof zPosts>;
