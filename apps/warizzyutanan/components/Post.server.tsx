import { readdirSync } from "fs";
import path from "path";

import { GetStaticPaths, GetStaticProps } from "next";

import getPostData from "./lib/getPostData";
import type { IPost } from "./lib/getPostData";

export type IPostPage = { siteTitle: string; post: IPost };

export const getStaticPaths: GetStaticPaths = () => {
  const postsDirectory = path.join(process.cwd(), "posts");
  const fileNames = readdirSync(postsDirectory);

  return {
    paths: fileNames.map((fileName) => {
      return { params: { id: path.parse(fileName).name } };
    }),
    fallback: false,
  };
};

export const getStaticProps = ({
  siteTitle,
}: {
  siteTitle: string;
}): GetStaticProps<IPostPage> => {
  return async ({ params }) => {
    const id = params?.id;
    if (!id) return { notFound: true };

    const post = await getPostData(`${id}.md`);

    return { props: { siteTitle, post } };
  };
};
