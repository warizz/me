import type { GetStaticPaths, GetStaticProps } from "next";
import type { IPost } from "shared/lib/getPostData";
import Post from "shared/Post";
import {
  getStaticPaths as _getStaticPaths,
  getStaticProps as _getStaticProps,
} from "shared/Post.server";

export default function PostPage(props: IPost) {
  return <Post {...props} />;
}

export const getStaticPaths: GetStaticPaths = (context) =>
  _getStaticPaths(context);
export const getStaticProps: GetStaticProps = (context) =>
  _getStaticProps(context);
