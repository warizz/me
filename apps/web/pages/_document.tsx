import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

const ID = "G-F7QMBWEZW5";

export default function Document() {
  return (
    <Html>
      <Head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`function gtag(){window.dataLayer.push(arguments)}window.dataLayer=window.dataLayer||[],gtag("js",new Date),gtag("config","${ID}");`}
        </Script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
