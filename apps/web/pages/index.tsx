import Head from "next/head";
import Link from "next/link";

import BlogLayout from "../components/BlogLayout";

export default function Web() {
  return (
    <>
      <Head>
        <title>Warizz Yutanan</title>
        <meta
          name="description"
          content="The homepage of Warizz Yutanan personal website."
        />
      </Head>
      <BlogLayout breadcrumbs={[]} h1={<h1>Warizz</h1>}>
        <ul>
          <li>
            <Link href="/posts">blogs</Link>
          </li>
        </ul>
      </BlogLayout>
    </>
  );
}
