import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Web3Provider } from '@/context/Web3Context';
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
    <html lang="en">
      <body className={inter.className}>
        <Web3Provider>
          <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <Navbar />
            <main>{children}</main>
          </div>
          <Toaster position="top-right" />
        </Web3Provider>
      </body>
    </html>
  );
}
