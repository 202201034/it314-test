"use client";

import Link from 'next/link';
import { HomeIcon, SearchIcon, GlobeAltIcon, UserIcon, PencilAltIcon } from '@heroicons/react/solid';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white w-auto fixed top-4 left-4 bottom-4 flex flex-col justify-between p-2 rounded-lg shadow-lg">
      
      {/* Blog Me - At the top */}
      <div className="flex flex-col items-center">
        <h1 className="text-2xl text-indigo-600 font-bold">Blog</h1>
        <h1 className="text-2xl font-bold">Me</h1>
      </div>

      {/* Navigation Links - Centered */}
      <div className="flex flex-col space-y-6 items-center justify-center flex-grow">
        <Link href="/" className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded flex items-center space-x-2">
          <HomeIcon className="h-8 w-8" />
        </Link>
        <Link href="/home" className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded flex items-center space-x-2">
          <SearchIcon className="h-8 w-8" />
        </Link>
        <Link href="/home" className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded flex items-center space-x-2">
          <GlobeAltIcon className="h-8 w-8" />
        </Link>
        <Link href="/home" className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded flex items-center space-x-2">
          <UserIcon className="h-8 w-8" />
        </Link>
      </div>

      {/* Create Blog Post Button - At the bottom */}
      <div className="flex justify-center">
        <Link href="/blog_write" className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded flex items-center space-x-2">
          <PencilAltIcon className="h-8 w-8" />
        </Link>
      </div>
    </nav>
  );
}
