import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Poppins, Inter } from 'next/font/google';

export const metadata: Metadata = {
  title: 'PetMoji - What\'s Your Pet Thinking?',
  description: "Upload a picture of your pet and let our AI guess their personality with an emoji!",
};

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-poppins',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <div className="fixed top-0 left-0 w-full h-full aurora-bg opacity-40 -z-10"></div>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
