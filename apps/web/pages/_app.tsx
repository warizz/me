import "../public/global.css";

import type { AppProps } from "next/app";

// This default export is required in a new `pages/_app.js` file.
export default function Web({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
