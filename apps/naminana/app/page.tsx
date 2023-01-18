import Link from "next/link";
import Page from "shared/Page";

import { homeConfig } from "../app.config";

export default function Web() {
  return (
    <Page
      layout={{
        breadcrumbs: [],
        h1: (
          <h1 className="text-primary dark:text-primary-invert">
            {homeConfig.h1}
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
