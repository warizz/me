import { readdirSync } from "fs";
import path from "path";

import getPostData from "../../../components/lib/getPostData";
import Post from "../../../components/Post";

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), "posts");
  const fileNames = readdirSync(postsDirectory);

  return fileNames.map((fileName) => {
    const id = path.parse(fileName).name;
    return { id };
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = getPostData(`${id}.md`);

  return <Post post={post} siteTitle="Warizz Yutanan" />;
}
