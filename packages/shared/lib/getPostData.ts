import fs from "fs";
import path from "path";

import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "posts");

export default async function getPostData(id: string): Promise<{
  date: string;
  description: string;
  id: string;
  isPublished: boolean;
  markdownString: string;
  title: string;
}> {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const matterResult = matter(fileContents);

  return {
    date: String(matterResult.data.date),
    description: String(matterResult.data.description),
    id,
    isPublished: !!matterResult.data.publish,
    markdownString: matterResult.content,
    title: String(matterResult.data.title),
  };
}
