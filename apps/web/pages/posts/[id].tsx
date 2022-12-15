import { readdirSync } from "fs";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import path from "path";
import React from "react";
import getPostData from "../../lib/getPostData";

const Post = ({
  postData,
}: {
  postData: { id: string; contentHtml: string; title: string; date: string };
}) => {
  console.log("postData", postData);

  return (
    <>
      <Head>
        <title>{postData.title + " - Warizz' blog"}</title>
      </Head>
      <article className="prose lg:prose-xl mx-auto px-4 bg-white lg:pt-20 pt-12 dark:bg-black min-h-screen font-serif">
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
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

  const postData = await getPostData(id.toString());

  return { props: { postData } };
};

export default Post;
