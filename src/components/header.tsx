import React from 'react';
import Link from 'next/link';
import { Logo } from './icons/logo';

export default function Header() {
  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8 border-b border-white/10">
      <div className="container mx-auto">
        <Link href="/" className="flex items-center gap-2 text-primary w-fit">
          <Logo className="h-8 w-auto" />
        </Link>
      </div>
    </header>
  );
}
