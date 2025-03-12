import sortBy from "lodash/sortBy";
import Link from "next/link";

import { homeConfig } from "../app.config";
import BlogLayout from "../components/BlogLayout";

export async function generateMetadata() {
  return {
    title: homeConfig.title,
    description: homeConfig.description,
    robots: "index, follow",
  };
}

export default function Home() {
  return (
    <BlogLayout
      breadcrumbs={[]}
      h1={
        <h1 className="text-primary dark:text-primary-invert">
          {homeConfig.h1}
        </h1>
      }
    >
      <ul>
        {sortBy(
          [
            { url: "/posts", title: "blogs", id: 1 },
            { url: "/movies", title: "movies", id: 3 },
            { url: "/logs", title: "logs", id: 2 },
            { url: "/trips", title: "trips", id: 4 },
            { url: "/life-in-weeks", title: "Life in Weeks", id: 5 },
          ],
          "id",
        ).map((item) => {
          return (
            <li key={item.id}>
              <Link href={item.url}>{item.title}</Link>
            </li>
          );
        })}
      </ul>
    </BlogLayout>
  );
}
