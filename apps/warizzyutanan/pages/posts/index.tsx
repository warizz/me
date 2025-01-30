import Posts from "../../component/shared/Posts";
import { getStaticProps as _getStaticProps } from "../../component/shared/Posts.server";
import type { IPostsPage } from "../../component/shared/Posts.server";

type Props = IPostsPage;

const PostsPage = (props: Props) => {
  return <Posts {...props} />;
};

export const getStaticProps = _getStaticProps({
  title: "Warizz Yutanan's blog",
});

export default PostsPage;
