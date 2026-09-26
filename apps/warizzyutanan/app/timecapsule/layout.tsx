import { ReactNode } from "react";

import ToolsBar from "../../components/ToolsBar";

import "./photo-id.css";

interface Props {
  children: ReactNode;
}

export default function TimecapsuleLayout({ children }: Props) {
  return (
    <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-sans antialiased">
      <div className="max-w-3xl mx-auto px-5 py-8 md:py-12">
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
