import "prismjs/themes/prism-tomorrow.min.css";

import { readdirSync } from "fs";
import path from "path";

import { GetStaticPaths, GetStaticProps } from "next";
import React from "react";

import Page from "../../components/Page";
import getPostData from "../../lib/getPostData";

interface IPost {
  contentHtml: string;
  title: string;
  description: string;
  date: string;
  isPublished: boolean;
}

const Post = ({
  contentHtml,
  title,
  description,
  date,
  isPublished,
}: IPost) => {
  return (
    <Page
      layout={{
        breadcrumbs: [
          { text: "posts", href: "/posts" },
          { text: "current", href: "/posts" },
        ],
        h1: <h1 className="!mb-0">{title}</h1>,
        date,
      }}
      meta={{
        title: `${title} - Warizz' blog`,
        description,
        robots: isPublished ? "index, follow" : "noindex, nofollow",
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

  const { contentHtml, title, description, date, isPublished } =
    await getPostData(id.toString());

  return { props: { contentHtml, title, description, date, isPublished } };
};

export default Post;
