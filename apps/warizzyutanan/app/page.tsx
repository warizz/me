import Link from "next/link";

import { homeConfig } from "../app.config";
import ColorSchemeToggle from "../components/ColorSchemeToggle";

export async function generateMetadata() {
  return {
    title: homeConfig.title,
    description: homeConfig.description,
    robots: "index, follow",
  };
}

const LOGS = [
  { url: "/posts", title: "blogs" },
  { url: "/logs", title: "logs" },
  { url: "/trips", title: "trips" },
  { url: "/notes", title: "notes" },
  { url: "/movies", title: "movies" },
];

const TOOLS = [
  { url: "/life-in-weeks", title: "life in weeks" },
  { url: "/watermark", title: "watermark" },
  { url: "/compress", title: "compress images" },
];

export default function Home() {
  return (
    <main className="h-screen bg-white dark:bg-black text-black dark:text-white selection:bg-primary/20 selection:text-white transition-colors duration-300 overflow-hidden flex flex-col justify-between">
      {/* Skip to Content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:font-black"
      >
        Skip To Content
      </a>

      <div
        id="main-content"
        className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-8 w-full flex flex-col justify-between h-full"
      >
        {/* Color Scheme Toggle - Floating Raw */}
        <div className="flex justify-end mb-4">
          <ColorSchemeToggle className="hover:text-primary dark:hover:text-primary-invert transition-colors" />
        </div>

        {/* Mega Headline */}
        <div className="mb-8 md:mb-12">
          <h1 className="raw-heading text-[11vw] md:text-[9vw] mb-4">
            {homeConfig.h1.split("'")[0]}
            <br />
            Archive
          </h1>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-baseline">
            <p className="raw-mono max-w-sm opacity-90 text-[9px] md:text-[11px]">
              --
              <br />I don’t tip because society says I have to. I tip when
              somebody deserves a tip. — Mr. Pink, Reservoir Dogs (1992)
            </p>
            <div className="raw-mono font-black uppercase text-primary dark:text-primary-invert">
              Est. 2026 / {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          {/* Logs Section */}
          <section aria-labelledby="logs-heading" className="min-h-0">
            <h2
              id="logs-heading"
              className="raw-mono font-black uppercase mb-2 text-primary dark:text-primary-invert"
            >
              [ 01 / LOGS ]
            </h2>
            <nav aria-label="Logs navigation">
              <ul className="flex flex-col">
                {LOGS.map((item) => (
                  <li
                    key={item.url}
                    className="border-t border-black/10 dark:border-white/10"
                  >
                    <Link
                      href={item.url}
                      className="raw-heading text-2xl md:text-3xl hover:bg-primary hover:text-white dark:hover:bg-primary-invert transition-all block px-1"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </section>

          {/* Tools Section */}
          <section aria-labelledby="tools-heading" className="min-h-0">
            <h2
              id="tools-heading"
              className="raw-mono font-black uppercase mb-2 text-primary dark:text-primary-invert"
            >
              [ 02 / TOOLS ]
            </h2>
            <nav aria-label="Tools navigation">
              <ul className="flex flex-col">
                {TOOLS.map((item) => (
                  <li
                    key={item.url}
                    className="border-t border-black/10 dark:border-white/10"
                  >
                    <Link
                      href={item.url}
                      className="raw-heading text-2xl md:text-3xl hover:bg-primary hover:text-white dark:hover:bg-primary-invert transition-all block px-1"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </section>
        </div>

        <footer className="mt-8 border-t border-black dark:border-white pt-2 flex justify-between items-baseline raw-mono uppercase opacity-60">
          <div className="text-[9px]">{homeConfig.description}</div>
          <div className="text-[9px]">{new Date().getFullYear()}</div>
        </footer>
      </div>
    </main>
  );
}
