import "../public/global.css";

import type { AppProps } from "next/app";

export default function Web({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
