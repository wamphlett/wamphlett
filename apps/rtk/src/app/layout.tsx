import './globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';
import { Heebo } from 'next/font/google';

const heebo = Heebo({
  weight: ['100', '300', '900'],
  subsets: ['latin'],
});

const rtkSiteUrl =
  process.env.RTK_SITE_URL ?? 'https://rtk.warrenamphlett.co.uk';

export const metadata: Metadata = {
  metadataBase: new URL(rtkSiteUrl),
  title: {
    template: '%s | Warren Amphlett',
    default: 'Remembering the Kanji | Warren Amphlett',
  },
  description: 'Remembering the Kanji - How I remembered the Kanji.',
  authors: { name: 'Warren Amphlett' },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: rtkSiteUrl,
    images: `${process.env.LIBRARY_URL ?? 'https://library.wamphlett.net'}/photos/website/2025/remembering-the-kanji.jpg`,
    siteName: 'Remembering the Kanji',
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
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-5D5DFD8S'); 
          `}
        </Script>

        {children}
      </body>
    </html>
  );
}
