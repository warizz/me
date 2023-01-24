import Posts from "shared/Posts";
import { getPosts } from "shared/Posts.server";

import { OWNER_NAME } from "../../app.config";

interface Props {
  params: {
    slug: string;
  };
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function Page({ searchParams }: Props) {
  const posts = getPosts();
  const tag =
    typeof searchParams?.tag === "string" ? searchParams?.tag : undefined;

  return <Posts posts={posts} title={`${OWNER_NAME}'s blog`} tag={tag} />;
}
