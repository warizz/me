import type { GetStaticPaths } from "next";

import Post from "../../component/shared/Post";
import {
  getStaticPaths as _getStaticPaths,
  getStaticProps as _getStaticProps,
  IPostPage,
} from "../../component/shared/Post.server";

export default function PostPage(props: IPostPage) {
  return <Post {...props} />;
}

export const getStaticPaths: GetStaticPaths = (context) =>
  _getStaticPaths(context);
export const getStaticProps = _getStaticProps({ siteTitle: "Warizz Yutanan" });
