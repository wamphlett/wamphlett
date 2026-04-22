import './globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';
import { Heebo } from 'next/font/google';

const heebo = Heebo({
  weight: ['100', '300', '900'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://blog.warrenamphlett.co.uk'),
  title: {
    template: '%s | Warren Amphlett Blog',
    default: 'Warren Amphlett Blog',
  },
  description: 'The Ramblings of a software engineer',
  authors: { name: 'Warren Amphlett' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={heebo.className}>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-DLXPGV6ZK1" />
        <Script id="google-analytics">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'G-DLXPGV6ZK1');
        `}
        </Script>
        {children}
      </body>
    </html>
  );
}
