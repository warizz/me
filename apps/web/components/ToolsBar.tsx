import clsx from "clsx";
import React from "react";

import Breadcrumbs, { Breadcrumb } from "./Breadcrumbs";
import ColorSchemeToggle from "./color_scheme/ColorSchemeToggle";

export default function ToolsBar({
  breadcrumbs,
  className,
}: {
  breadcrumbs: Breadcrumb[];
  className?: string;
}) {
  return (
    <div className={clsx("flex justify-between items-start", className)}>
      <Breadcrumbs list={breadcrumbs} />
      <ColorSchemeToggle className=" shrink-0" />
    </div>
  );
}
