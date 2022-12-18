import { readdirSync } from "fs";
import path from "path";

import { GetStaticPaths, GetStaticProps } from "next";
import React from "react";

import "prismjs/themes/prism-tomorrow.min.css";

import Page from "../../components/Page";
import getPostData from "../../lib/getPostData";

interface IPost {
  contentHtml: string;
  title: string;
  description: string;
}

const Post = ({ contentHtml, title, description }: IPost) => {
  return (
    <Page
      layout={{
        breadcrumbs: [
          { text: "posts", href: "/posts" },
          { text: "current", href: "/posts" },
        ],
        h1: null,
      }}
      meta={{
        title: title + " - Warizz' blog",
        description,
      }}
    >
      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </Page>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  const postsDirectory = path.join(process.cwd(), "posts");
  const fileNames = readdirSync(postsDirectory);

  return {
    paths: fileNames.map((fileName) => {
      return { params: { id: path.parse(fileName).name } };
    }),
    fallback: false, // can also be true or 'blocking'
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params?.id;
  if (!id) return { notFound: true };

  const { contentHtml, title, description } = await getPostData(id.toString());

  return { props: { contentHtml, title, description } };
};

export default Post;
