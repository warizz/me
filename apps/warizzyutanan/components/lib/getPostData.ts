import { z } from "zod";

import { getContent } from "./getContent";

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
    const { data, markdownString, id } = getContent(fileName);

    return Post.parse({
      date: data.date,
      description: data.description ?? "",
      id,
      isPublished: !!data.publish,
      markdownString,
      tags: data.tags ?? [],
      title: data.title,
      tldr: data.tldr,
    });
  } catch (error) {
    console.error(`::error::getPostData::${fileName}`, error);
    throw error;
  }
}
