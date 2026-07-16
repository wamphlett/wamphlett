import './globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';
import { brandFont } from '@wamphlett/ui';

const photosSiteUrl =
  process.env.PHOTOS_SITE_URL ?? 'https://photos.warrenamphlett.co.uk';

export const metadata: Metadata = {
  metadataBase: new URL(photosSiteUrl),
  title: {
    template: '%s | Warren Amphlett Photos',
    default: 'Warren Amphlett Photos',
  },
  description: 'A collection of my favourite photos.',
  authors: { name: 'Warren Amphlett' },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: photosSiteUrl,
    images: `${process.env.LIBRARY_URL ?? 'https://library.wamphlett.net'}/photos/website/2023/albania/lifes-better-by-the-sea.jpg`,
    siteName: 'Warren Amphlett Photos',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={brandFont.className}>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-5BMLMFL5P2" />
        <Script id="google-analytics">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'G-5BMLMFL5P2');
        `}
        </Script>
        {children}
      </body>
    </html>
  );
}
