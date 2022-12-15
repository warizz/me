import { readdirSync } from "fs";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import path from "path";
import React from "react";
import { BlogLayout } from "../../components/BlogLayout";
import getPostData from "../../lib/getPostData";

interface Post {
  contentHtml: string;
  title: string;
}

const Post = ({ contentHtml, title }: Post) => {
  return (
    <>
      <Head>
        <title>{title + " - Warizz' blog"}</title>
      </Head>
      <BlogLayout>
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
