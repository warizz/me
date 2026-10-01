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
  { url: "/games", title: "games" },
  { url: "/logs", title: "logs" },
  { url: "/trips", title: "trips" },
  { url: "/notes", title: "notes" },
  { url: "/movies", title: "movies" },
  { url: "/timecapsule", title: "timecapsule" },
];

const TOOLS = [
  { url: "/life-in-weeks", title: "life in weeks" },
  { url: "/watermark", title: "watermark" },
  { url: "/compress", title: "compress images" },
];

export default function Home() {
  return (
    <main className="flex h-screen flex-col justify-between overflow-hidden bg-white text-black transition-colors duration-300 selection:bg-primary/20 selection:text-white dark:bg-black dark:text-white">
      {/* Skip to Content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:px-4 focus:py-2 focus:font-black focus:text-white"
      >
        Skip To Content
      </a>

      <div
        id="main-content"
        className="mx-auto flex h-full w-full max-w-7xl flex-col justify-between px-4 py-4 md:px-8 md:py-8"
      >
        {/* Color Scheme Toggle - Floating Raw */}
        <div className="mb-4 flex justify-end">
          <ColorSchemeToggle className="transition-colors hover:text-primary dark:hover:text-primary-invert" />
        </div>

        {/* Mega Headline */}
        <div className="mb-8 md:mb-12">
          <h1 className="mb-4 raw-heading text-[11vw] md:text-[9vw]">
            {homeConfig.h1.split("'")[0]}
            <br />
            Archive
          </h1>
          <div className="flex flex-col items-baseline gap-4 md:flex-row md:gap-8">
            <p className="max-w-sm raw-mono text-[9px] opacity-90 md:text-[11px]">
              --
              <br />I don’t tip because society says I have to. I tip when
              somebody deserves a tip. — Mr. Pink, Reservoir Dogs (1992)
            </p>
            <div className="raw-mono font-black text-primary uppercase dark:text-primary-invert">
              Est. 2026 / {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16">
          {/* Logs Section */}
          <section aria-labelledby="logs-heading" className="min-h-0">
            <h2
              id="logs-heading"
              className="mb-2 raw-mono font-black text-primary uppercase dark:text-primary-invert"
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
                      className="block px-1 raw-heading text-2xl transition-all hover:bg-primary hover:text-white md:text-3xl dark:hover:bg-primary-invert"
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
              className="mb-2 raw-mono font-black text-primary uppercase dark:text-primary-invert"
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
                      className="block px-1 raw-heading text-2xl transition-all hover:bg-primary hover:text-white md:text-3xl dark:hover:bg-primary-invert"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </section>
        </div>

        <footer className="mt-8 flex items-baseline justify-between border-t border-black pt-2 raw-mono uppercase opacity-60 dark:border-white">
          <div className="text-[9px]">{homeConfig.description}</div>
          <div className="text-[9px]">{new Date().getFullYear()}</div>
        </footer>
      </div>
    </main>
  );
}
