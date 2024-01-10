import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  params: { year: string };
}

export default function MoviesLayout({ children }: Props) {
  return (
    <div className="bg-white lg:pt-20 dark:bg-black min-h-screen ease-in duration-100">
      <article className="prose lg:prose-xl mx-auto p-4 font-serif dark:prose-invert">
        {children}
      </article>
    </div>
  );
}
