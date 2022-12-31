import type { GetStaticProps } from "next";
import Posts from "shared/Posts";
import { getStaticProps as _getStaticProps } from "shared/Posts.server";

interface Post {
  id: string;
  title: string;
  tags: string[];
  date: string;
  isPublished: boolean;
}

interface Props {
  posts: Post[];
}
const PostsPage = (props: Props) => {
  return <Posts {...props} />;
};

export const getStaticProps: GetStaticProps = (context) =>
  _getStaticProps(context);

export default PostsPage;
