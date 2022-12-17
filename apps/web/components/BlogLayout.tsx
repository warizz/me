import React, { ReactNode } from "react";

import { Breadcrumb } from "./Breadcrumbs";
import ToolsBar from "./ToolsBar";

interface Props {
  children: ReactNode;
  breadcrumbs: Breadcrumb[];
  h1?: ReactNode;
}

export default function BlogLayout({ children, breadcrumbs, h1 }: Props) {
  return (
    <div className="bg-white lg:pt-20 dark:bg-gray-900 min-h-screen">
      <article className="prose lg:prose-xl mx-auto p-4 font-serif dark:prose-invert">
        <ToolsBar
          className="mb-3"
          breadcrumbs={[{ text: "home", href: "/" }].concat(breadcrumbs)}
        />
        {h1}
        {children}
      </article>
    </div>
  );
}
