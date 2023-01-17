import { ReactNode } from "react";

import BlogLayout from "./BlogLayout";
import { Breadcrumb } from "./Breadcrumbs";

interface Props {
  children: ReactNode;
  layout: {
    h1: ReactNode;
    breadcrumbs: Breadcrumb[];
    date?: string;
  };
}

export default function Page({ children, layout }: Props) {
  return (
    <BlogLayout
      date={layout.date ? new Date(layout.date) : undefined}
      breadcrumbs={layout.breadcrumbs}
      h1={layout.h1}
    >
      {children}
    </BlogLayout>
  );
}
