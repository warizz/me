import clsx from "clsx";
import React from "react";

import Breadcrumbs, { Breadcrumb } from "./Breadcrumbs";
import ColorSchemeToggle from "./ColorSchemeToggle";

interface Props {
  breadcrumbs: Breadcrumb[];
  className?: string;
}

export default function ToolsBar({ breadcrumbs, className }: Props) {
  return (
    <div className={clsx("flex justify-between items-start", className)}>
      <Breadcrumbs list={breadcrumbs} />
      <ColorSchemeToggle className="shrink-0" />
    </div>
  );
}
