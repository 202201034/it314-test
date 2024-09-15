"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../lib/firebase_auth';
import { onAuthStateChanged } from 'firebase/auth';

import Navbar from './nav';
import BlogEditor from '../components/blog_editor';

export default function BlogWritePage() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        router.push('/login'); // Redirect to login page if not authenticated
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, router]);

  if (loading) {
    return <p>Loading...</p>; // Or a loading spinner
  }

  return (
    <div>
      {isAuthenticated && <BlogEditor />}
      <Navbar />
    </div>
  );
}
