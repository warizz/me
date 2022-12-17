import Link from "next/link";

import Page from "../components/Page";

export default function Web() {
  return (
    <Page
      meta={{
        title: "Warizz Yutanan",
        description: "Warizz's whatever",
      }}
      layout={{
        breadcrumbs: [],
        h1: <h1>{"Warizz's whatever"}</h1>,
      }}
    >
      <ul>
        <li>
          <Link href="/posts">blogs</Link>
        </li>
      </ul>
    </Page>
  );
}
