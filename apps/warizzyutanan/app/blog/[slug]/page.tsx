import { readdirSync } from "fs";
import path from "path";

import getPostData from "shared/lib/getPostData";
import Post from "shared/Post";

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), "posts");
  const fileNames = readdirSync(postsDirectory);

  return fileNames.map((fileName) => {
    return { slug: path.parse(fileName).name };
  });
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { date, description, isPublished, markdownString, tags, title } =
    await getPostData(`${params.slug}.md`);
  return (
    <Post
      siteTitle="slug"
      post={{
        id: params.slug,
        date,
        description,
        isPublished,
        markdownString,
        tags,
        title,
      }}
    />
  );
}
