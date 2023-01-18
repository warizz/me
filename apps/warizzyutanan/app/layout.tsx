import "../public/global.css";

import Script from "next/script";

import { GA_ID, NEXT_PUBLIC_IS_DISABLED_GA } from "../app.config";

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <html>
      <head>
        {!NEXT_PUBLIC_IS_DISABLED_GA && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              id="ga_lib"
              strategy="afterInteractive"
              async
            />
            <Script id="ga_datalayer" strategy="afterInteractive" async>
              {`function gtag(){window.dataLayer.push(arguments)}window.dataLayer=window.dataLayer||[],gtag("js",new Date),gtag("config","${GA_ID}");`}
            </Script>
          </>
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
