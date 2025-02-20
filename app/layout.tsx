import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "AI Text Processor",
  description: "Process texts using Chrome AI APIs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const includeMetaTag = process.env.NEXT_PUBLIC_INCLUDE_META_TAG === 'true';

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {includeMetaTag && (
          <><meta httpEquiv="origin-trial" content="AiTFG2cRssYEcIfJun+0k9D4rxw6HaD4FJCN/UP10Cfv7Z2ORpEBFJaHQjDKRRo1aaTYibc7LP+KydrB9nXr7wkAAAB8eyJvcmlnaW4iOiJodHRwczovL2FpLXRleHQtcHJvY2Vzc29yLW5pbmUudmVyY2VsLmFwcDo0NDMiLCJmZWF0dXJlIjoiVHJhbnNsYXRpb25BUEkiLCJleHBpcnkiOjE3NTMxNDI0MDAsImlzU3ViZG9tYWluIjp0cnVlfQ==" />
          <meta httpEquiv="origin-trial" content="Aji+Z/d5aYG3E6jO3jOaHOXFqevlZWkR5gSoUb1AP9OAeZMPSV0GZHkiB+z5i2RVpivqF+ZaeGiEVE3d7GZViwEAAACCeyJvcmlnaW4iOiJodHRwczovL2FpLXRleHQtcHJvY2Vzc29yLW5pbmUudmVyY2VsLmFwcDo0NDMiLCJmZWF0dXJlIjoiTGFuZ3VhZ2VEZXRlY3Rpb25BUEkiLCJleHBpcnkiOjE3NDk1OTk5OTksImlzU3ViZG9tYWluIjp0cnVlfQ==" />
          <meta httpEquiv="origin-trial" content="AvdyQMFdavMX6YK/H+VTbH1HZTG/hrZeKsWpW0vCDKBtHxGGwuGXrRFRaGrZLJBMfN+SlK2vmTRoEpxeT+CSTQIAAACAeyJvcmlnaW4iOiJodHRwczovL2FpLXRleHQtcHJvY2Vzc29yLW5pbmUudmVyY2VsLmFwcDo0NDMiLCJmZWF0dXJlIjoiQUlTdW1tYXJpemF0aW9uQVBJIiwiZXhwaXJ5IjoxNzUzMTQyNDAwLCJpc1N1YmRvbWFpbiI6dHJ1ZX0=" />
          </>
        )}
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >

          {children}
        </ThemeProvider>
        
      </body>
    </html>
  );
}
