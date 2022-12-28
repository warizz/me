import Link from "next/link";
import Page from "shared/Page";

export default function Web() {
  return (
    <Page
      meta={{
        title: "Nami Nana",
        description: "Nami Nana",
        robots: "index, follow",
      }}
      layout={{
        breadcrumbs: [],
        h1: (
          <h1 className="text-primary dark:text-primary-invert">
            {"Nami Nana"}
          </h1>
        ),
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
