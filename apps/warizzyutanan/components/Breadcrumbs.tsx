import Link from "next/link";
import React, { Fragment } from "react";

interface Item {
  text: string;
  href: string;
}

export type Breadcrumb = Item;

interface Props {
  list: Item[];
}

export default function Breadcrumbs({ list }: Props) {
  return (
    <nav className="prose-sm flex flex-wrap gap-2 font-sans">
      {list.map((item, index) => {
        if (index + 1 !== list.length) {
          return (
            <Fragment key={index}>
              <Link
                href={item.href}
                className="text-primary hover:underline dark:text-primary-invert"
              >
                {item.text}
              </Link>
              <span className="text-gray-400 dark:text-gray-500">/</span>
            </Fragment>
          );
        }
        return (
          <span key={index} className="text-black dark:text-white">
            {item.text}
          </span>
        );
      })}
    </nav>
  );
}
