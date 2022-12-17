import Link from "next/link";
import React, { Fragment } from "react";

type Item = {
  text: string;
  href: string;
};

export type Breadcrumb = Item;

export default function Breadcrumbs({ list }: { list: Item[] }) {
  return (
    <nav className="flex gap-2 prose-sm font-sans flex-wrap">
      {list.map((item, index) => {
        if (index + 1 !== list.length) {
          return (
            <Fragment key={index}>
              <Link href={item.href}>{item.text}</Link>
              <span>/</span>
            </Fragment>
          );
        }
        return (
          <Fragment key={index}>
            <span className="dark:text-white">{item.text}</span>
          </Fragment>
        );
      })}
    </nav>
  );
}
