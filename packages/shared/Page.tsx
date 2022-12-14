import Head from "next/head";
import { ReactNode } from "react";

import BlogLayout from "./BlogLayout";
import { Breadcrumb } from "./Breadcrumbs";

interface Props {
  children: ReactNode;
  meta: {
    title: string;
    description: string;
    robots: "index, follow" | "noindex, nofollow";
  };
  layout: {
    h1: ReactNode;
    breadcrumbs: Breadcrumb[];
    date?: string;
  };
}

export default function Page({ children, meta, layout }: Props) {
  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="robots" content={meta.robots} />
      </Head>
      <BlogLayout
        date={layout.date ? new Date(layout.date) : undefined}
        breadcrumbs={layout.breadcrumbs}
        h1={layout.h1}
      >
        {children}
      </BlogLayout>
    </>
  );
}
