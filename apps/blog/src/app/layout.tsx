import './globals.css';
import type { Metadata } from 'next';
import { Heebo } from 'next/font/google';

const heebo = Heebo({
  weight: ['100', '300', '900'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Warren Amphlett Blog',
  description: 'Software engineer and Photographer',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={heebo.className}>{children}</body>
    </html>
  );
}
