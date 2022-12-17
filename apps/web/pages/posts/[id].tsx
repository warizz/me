import { readdirSync } from "fs";
import path from "path";

import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import React from "react";

import BlogLayout from "../../components/BlogLayout";
import getPostData from "../../lib/getPostData";

import "prismjs/themes/prism-tomorrow.min.css";

interface IPost {
  contentHtml: string;
  title: string;
}

const Post = ({ contentHtml, title }: IPost) => {
  return (
    <>
      <Head>
        <title>{title + " - Warizz' blog"}</title>
      </Head>
      <BlogLayout
        breadcrumbs={[
          { text: "posts", href: "/posts" },
          { text: "current", href: "/posts" },
        ]}
      >
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </BlogLayout>
    </>
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

  const { contentHtml, title } = await getPostData(id.toString());

  return { props: { contentHtml, title } };
};

export default Post;
