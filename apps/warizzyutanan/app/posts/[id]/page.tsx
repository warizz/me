import { readdirSync } from "fs";
import path from "path";

import getPostData from "../../../components/lib/getPostData";
import Post from "../../../components/Post";

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), "posts");
  const fileNames = readdirSync(postsDirectory);

  return fileNames.map((fileName) => {
    return { params: { id: path.parse(fileName).name } };
  });
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const id = params?.id;

  const post = await getPostData(`${id}.md`);

  return <Post post={post} siteTitle="Warizz Yutanan" />;
}
