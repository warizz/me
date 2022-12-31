import "prismjs/themes/prism-tomorrow.min.css";

import { readdirSync } from "fs";
import path from "path";

import { GetStaticPaths, GetStaticProps } from "next";

import getPostData from "./lib/getPostData";

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

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params?.id;
  if (!id) return { notFound: true };

  const { contentHtml, title, description, date, isPublished } =
    await getPostData(id.toString());

  return { props: { contentHtml, title, description, date, isPublished } };
};
