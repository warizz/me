import type { GetStaticPaths } from "next";
import Post from "shared/Post";
import {
  getStaticPaths as _getStaticPaths,
  getStaticProps as _getStaticProps,
} from "shared/Post.server";
import type { IPostPage } from "shared/Post.server";

export default function PostPage(props: IPostPage) {
  return <Post {...props} />;
}

export const getStaticPaths: GetStaticPaths = (context) =>
  _getStaticPaths(context);
export const getStaticProps = _getStaticProps({ siteTitle: "Warizz Yutanan" });
