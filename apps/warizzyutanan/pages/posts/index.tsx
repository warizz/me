import Posts from "shared/Posts";
import { getStaticProps as _getStaticProps } from "shared/Posts.server";
import type { IPostsPage } from "shared/Posts.server";

type Props = IPostsPage;

const PostsPage = (props: Props) => {
  return <Posts {...props} />;
};

export const getStaticProps = _getStaticProps({
  title: "Warizz Yutanan's blog",
});

export default PostsPage;
