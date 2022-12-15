import React, { ReactNode } from "react";

export const BlogLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-white lg:pt-20 dark:bg-black min-h-screen">
      <article className="prose lg:prose-xl mx-auto p-4 font-serif dark:prose-invert">
        <nav className="mb-2 flex gap-2 prose-sm">
          <a className="no-underline" href="/">
            {"home"}
          </a>
          /
          <a className="no-underline" href="/posts">
            {"posts"}
          </a>
        </nav>
        {children}
      </article>
    </div>
  );
};
