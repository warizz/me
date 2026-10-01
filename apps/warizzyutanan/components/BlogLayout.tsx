import React, { ReactNode } from "react";

import { Breadcrumb } from "./Breadcrumbs";
import formatDate from "./lib/formatDate";
import ToolsBar from "./ToolsBar";

interface Props {
  bare?: boolean;
  children: ReactNode;
  breadcrumbs: Breadcrumb[];
  h1?: ReactNode;
  date?: Date;
}

export default function BlogLayout({
  bare,
  children,
  breadcrumbs,
  h1,
  date,
}: Props) {
  return (
    <main className="min-h-screen bg-white duration-100 ease-in lg:pt-20 dark:bg-black">
      <article
        className={
          bare
            ? "mx-auto max-w-2xl p-4 font-sans"
            : "mx-auto prose p-4 font-serif lg:prose-xl dark:prose-invert"
        }
      >
        <ToolsBar
          className="mb-3 lg:mb-2"
          breadcrumbs={[{ text: "home", href: "/" }].concat(breadcrumbs)}
        />
        {h1}
        {date ? (
          <div
            className={
              bare
                ? "mb-8 text-sm text-gray-500 dark:text-gray-400"
                : "prose-sm mb-16 font-sans"
            }
          >
            {formatDate(date)}
          </div>
        ) : null}
        {children}
      </article>
    </main>
  );
}
