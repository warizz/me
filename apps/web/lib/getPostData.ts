import fs from "fs";
import path from "path";

import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";
import prism from "remark-prism";

const postsDirectory = path.join(process.cwd(), "posts");

export default async function getPostData(id: string): Promise<{
  id: string;
  contentHtml: string;
  title: string;
  description: string;
  date: string;
}> {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(remarkGfm)
    .use(html, { sanitize: false })
    .use(prism, {
      transformInlineCode: true,
    })
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    title: String(matterResult.data.title),
    description: String(matterResult.data.description),
    date: String(matterResult.data.date),
  };
}
