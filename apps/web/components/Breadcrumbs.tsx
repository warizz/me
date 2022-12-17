import Link from "next/link";
import React, { Fragment } from "react";

type Item =
  | {
      type: "link";
      text: string;
      href: string;
    }
  | {
      type: "text";
      text: string;
    };

export default function Breadcrumbs({ list }: { list: Item[] }) {
  return (
    <nav className="mb-2 flex gap-2 prose-sm font-sans">
      {list.map((item, index) => {
        if (item.type === "link") {
          return (
            <Fragment key={index}>
              <Link key={index} className="no-underline" href={item.href}>
                {item.text}
              </Link>
            </Fragment>
          );
        }
        return (
          <Fragment key={index}>
            <span key={index} className="text-white">
              {item.text}
            </span>
          </Fragment>
        );
      })}
    </nav>
  );
}
