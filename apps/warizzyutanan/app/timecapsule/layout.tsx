import { ReactNode } from "react";

import ToolsBar from "../../components/ToolsBar";

import "./photo-id.css";

interface Props {
  children: ReactNode;
}

export default function TimecapsuleLayout({ children }: Props) {
  return (
    <main className="min-h-screen bg-white font-sans text-black antialiased dark:bg-black dark:text-white">
      <div className="mx-auto max-w-3xl px-5 py-8 md:py-12">
        <ToolsBar
          breadcrumbs={[
            { text: "home", href: "/" },
            { text: "timecapsule", href: "/timecapsule" },
          ]}
        />
        {children}
      </div>
    </main>
  );
}
