import "./global.css";

import Script from "next/script";
import { ReactNode } from "react";

import { GA_ID } from "../app.config";

interface Props {
  children: ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" suppressHydrationWarning>
      {!process.env.NEXT_PUBLIC_IS_DISABLED_GA ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
            data-testid="ga_lib"
          />
          <Script id="ga_datalayer" strategy="afterInteractive">
            {`function gtag(){window.dataLayer.push(arguments)}window.dataLayer=window.dataLayer||[],gtag("js",new Date),gtag("config","${GA_ID}");`}
          </Script>
        </>
      ) : null}

      <body suppressHydrationWarning>
        <div className="bg-white dark:bg-black min-h-screen ease-in duration-100">
          {children}
        </div>
      </body>
    </html>
  );
}
