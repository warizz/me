import React, { ReactNode } from "react";

import { Breadcrumb } from "./Breadcrumbs";
import formatDate from "./lib/formatDate";
import ToolsBar from "./ToolsBar";

interface Props {
  children: ReactNode;
  breadcrumbs: Breadcrumb[];
  h1?: ReactNode;
  date?: Date;
}

export default function BlogLayout({ children, breadcrumbs, h1, date }: Props) {
  return (
    <div className="bg-white lg:pt-20 dark:bg-black min-h-screen ease-in duration-100">
      <article className="prose lg:prose-xl mx-auto p-4 font-serif dark:prose-invert">
        <ToolsBar
          className="mb-3 lg:mb-0"
          breadcrumbs={[{ text: "home", href: "/" }].concat(breadcrumbs)}
        />
        {h1}
        {date ? <div className="prose-sm mb-16">{formatDate(date)}</div> : null}
        {children}
      </article>
    </div>
  );
}
