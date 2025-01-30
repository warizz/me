import fs from "fs";
import path from "path";

import matter from "gray-matter";
import { z } from "zod";

console.log("::process.cwd()", process.cwd());

export const postsDirectory = path.join(process.cwd(), "posts");

export const Post = z.object({
  date: z.string(),
  description: z.string(),
  id: z.string(),
  isPublished: z.boolean(),
  markdownString: z.string(),
  tags: z.string().array(),
  title: z.string(),
  tldr: z.string().nullable().default(null),
});

export type IPost = z.infer<typeof Post>;

export default function getPostData(fileName: string) {
  try {
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const meta = matter(fileContents);
    const [id] = fileName.split(".");

    return Post.parse({
      date: meta.data.date,
      description: meta.data.description ?? "",
      id,
      isPublished: !!meta.data.publish,
      markdownString: meta.content,
      tags: meta.data.tags ?? [],
      title: meta.data.title,
      tldr: meta.data.tldr,
    });
  } catch (error) {
    return null;
  }
}
