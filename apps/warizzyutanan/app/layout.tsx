import "./global.css";

import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body>
        <div className="bg-white lg:pt-20 dark:bg-black min-h-screen ease-in duration-100">
          <article className="prose lg:prose-xl mx-auto p-4 font-serif dark:prose-invert">
            {children}
          </article>
        </div>
      </body>
    </html>
  );
}
