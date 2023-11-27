import './globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';
import { Heebo } from 'next/font/google';

const heebo = Heebo({
  weight: ['100', '300', '900'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://warrenamphlett.co.uk'),
  title: {
    template: '%s | Warren Amphlett',
    default: 'Warren Amphlett',
  },
  description: 'Software engineer and Photographer',
  authors: { name: 'Warren Amphlett' },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://warrenamphlett.co.uk',
    images:
      'https://library.wamphlett.net/photos/website/2023/albania/three-of-a-kind.jpg',
    siteName: 'Warren Amphlett',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={heebo.className}>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-WB51J1WT4Q" />
        <Script id="google-analytics">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'G-WB51J1WT4Q');
        `}
        </Script>
        {children}
      </body>
    </html>
  );
}
