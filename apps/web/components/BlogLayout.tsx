import React, { ReactNode } from "react";

export const BlogLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-white lg:pt-20 dark:bg-black min-h-screen">
      <article className="prose lg:prose-xl mx-auto p-4 font-serif">
        {children}
      </article>
    </div>
  );
};
