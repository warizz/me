import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

const ID = "G-F7QMBWEZW5";

export default function Document() {
  return (
    <Html>
      <Head>
        {!process.env.NEXT_PUBLIC_IS_DISABLED_GA ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`function gtag(){window.dataLayer.push(arguments)}window.dataLayer=window.dataLayer||[],gtag("js",new Date),gtag("config","${ID}");`}
            </Script>
          </>
        ) : null}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
