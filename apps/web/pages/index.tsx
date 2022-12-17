import Link from "next/link";

import BlogLayout from "../components/BlogLayout";

export default function Web() {
  return (
    <BlogLayout breadcrumbs={[]} h1={<h1>Warizz</h1>}>
      <ul>
        <li>
          <Link href="/posts">blogs</Link>
        </li>
      </ul>
    </BlogLayout>
  );
}
