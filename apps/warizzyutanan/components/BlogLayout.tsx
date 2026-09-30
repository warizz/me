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
    <div className="bg-white lg:pt-20 dark:bg-black min-h-screen ease-in duration-100">
      <article
        className={
          bare
            ? "font-sans max-w-2xl mx-auto p-4"
            : "prose lg:prose-xl mx-auto p-4 font-serif dark:prose-invert"
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
                ? "text-sm mb-8 text-gray-500 dark:text-gray-400"
                : "prose-sm mb-16 font-sans"
            }
          >
            {formatDate(date)}
          </div>
        ) : null}
        {children}
      </article>
    </div>
  );
}
