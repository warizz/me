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
    <nav className="flex gap-2 prose-sm font-sans flex-wrap">
      {list.map((item, index) => {
        if (index + 1 !== list.length) {
          return (
            <Fragment key={index}>
              <Link
                href={item.href}
                className="text-primary dark:text-primary-invert hover:underline"
              >
                {item.text}
              </Link>
              <span className="text-gray-400 dark:text-gray-500">/</span>
            </Fragment>
          );
        }
        return (
          <span key={index} className="dark:text-white text-black">
            {item.text}
          </span>
        );
      })}
    </nav>
  );
}
