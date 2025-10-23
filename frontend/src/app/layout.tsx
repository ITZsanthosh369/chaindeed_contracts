import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Web3Provider } from '@/context/Web3Context';
import { ThemeProvider } from '@/context/ThemeContext';
import { Navbar } from '@/components/Navbar';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ChainDeed - NFT Certificate Platform',
  description: 'Mint and manage your digital certificates on the blockchain',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <Web3Provider>
            <div className="min-h-screen">
              <Navbar />
              <main>{children}</main>
            </div>
            <Toaster position="top-right" />
          </Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
