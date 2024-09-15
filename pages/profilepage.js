"use client";

import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase_auth'; // Ensure this import is correct
import { useRouter } from 'next/router';
import {auth} from '../lib/firebase_auth';


export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data());
          setName(userDoc.data().name);
          setBio(userDoc.data().bio || '');

          const blogsQuery = query(collection(db, 'blogs'), where('userId', '==', auth.currentUser.uid));
          const querySnapshot = await getDocs(blogsQuery);
          setBlogs(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
      } catch (error) {
        setError('Failed to fetch data: ' + error.message);
      }
    };

    fetchData();
  }, []);

  const handleEdit = async () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        name,
        bio
      });
      setUser({ ...user, name, bio });
      setIsEditing(false);
    } catch (error) {
      setError('Failed to update profile: ' + error.message);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setName(user.name);
    setBio(user.bio || '');
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg border border-gray-200">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">Profile</h1>
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-md">
            {error}
          </div>
        )}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Profile Information</h2>
          {isEditing ? (
            <div>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-lg font-semibold text-gray-800">{user?.name}</p>
              <p className="text-sm text-gray-600">{user?.bio}</p>
              <button
                onClick={handleEdit}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Edit
              </button>
            </div>
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-700">My Blogs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {blogs.map((blog) => (
              <div key={blog.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                {blog.imageUrl && (
                  <img
                    src={blog.imageUrl}
                    alt={blog.title}
                    className="w-full h-32 object-cover mb-2 rounded"
                  />
                )}
                <h3 className="text-lg font-semibold mb-2 text-gray-800">{blog.title}</h3>
                <p className="text-sm text-gray-600">{blog.content.substring(0, 100)}...</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}