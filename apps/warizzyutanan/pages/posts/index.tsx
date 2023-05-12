import { useEffect } from "react";
import Posts from "shared/Posts";
import { getStaticProps as _getStaticProps } from "shared/Posts.server";
import type { IPostsPage } from "shared/Posts.server";

type Props = IPostsPage;

const PostsPage = (props: Props) => {
  useEffect(() => {
    if (process.env.IS_CONSERVATIVE) {
      console.log("พลังประชารัฐ เบอร์ 37");
    } else {
      console.log("ก้าวไกล เบอร์ 31");
    }
  }, []);
  return <Posts {...props} />;
};

export const getStaticProps = _getStaticProps({
  title: "Warizz Yutanan's blog",
});

export default PostsPage;
