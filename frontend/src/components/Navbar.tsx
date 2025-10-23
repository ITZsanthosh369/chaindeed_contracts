'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { WalletConnect } from './WalletConnect';
import { useWeb3 } from '@/context/Web3Context';
import { useTheme } from '@/context/ThemeContext';

export const Navbar: React.FC = () => {
  const { isOwner } = useWeb3();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 shadow-md backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-smooth">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                ChainDeed
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-4">
                <Link
                  href="/"
                  className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-smooth hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Home
                </Link>
                
                {/* User-specific navigation */}
                {!isOwner && (
                  <>
                    <Link
                      href="/request"
                      className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-smooth hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Request Certificate
                    </Link>
                    <Link
                      href="/my-requests"
                      className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-smooth hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      My Requests
                    </Link>
                  </>
                )}
                
                {/* Common navigation */}
                <Link
                  href="/my-deeds"
                  className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-smooth hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {isOwner ? 'My NFTs' : 'My Deeds'}
                </Link>
                
                {/* Admin-specific navigation */}
                {isOwner && (
                  <>
                    <Link
                      href="/admin"
                      className="bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 px-4 py-2 rounded-md text-sm font-medium transition-smooth shadow-md hover:shadow-lg"
                    >
                      ⭐ Admin Panel
                    </Link>
                    <Link
                      href="/mint"
                      className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-smooth hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Direct Mint
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Right side: Theme toggle, wallet, and mobile menu button */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-smooth"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
            
            {/* Wallet Connect - hidden on mobile */}
            <div className="hidden sm:block">
              <WalletConnect />
            </div>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-smooth"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md text-base font-medium transition-smooth hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Home
            </Link>
            
            {/* User-specific navigation */}
            {!isOwner && (
              <>
                <Link
                  href="/request"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md text-base font-medium transition-smooth hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Request Certificate
                </Link>
                <Link
                  href="/my-requests"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md text-base font-medium transition-smooth hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  My Requests
                </Link>
              </>
            )}
            
            {/* Common navigation */}
            <Link
              href="/my-deeds"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md text-base font-medium transition-smooth hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isOwner ? 'My NFTs' : 'My Deeds'}
            </Link>
            
            {/* Admin-specific navigation */}
            {isOwner && (
              <>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 px-4 py-2 rounded-md text-base font-medium transition-smooth shadow-md"
                >
                  ⭐ Admin Panel
                </Link>
                <Link
                  href="/mint"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md text-base font-medium transition-smooth hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Direct Mint
                </Link>
              </>
            )}
            
            {/* Wallet Connect in mobile menu */}
            <div className="sm:hidden px-3 py-2">
              <WalletConnect />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
