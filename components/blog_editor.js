// BlogEditor.js
"use client";

import { useState } from 'react';
import { getAuth } from 'firebase/auth';
import Navbar from '../pages/nav';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { XIcon } from '@heroicons/react/solid';
import { db, storage } from '../lib/firebase_auth';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function BlogEditor() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [hashtagInput, setHashtagInput] = useState('');
  const [hashtags, setHashtags] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const auth = getAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const idToken = await auth.currentUser.getIdToken();

      let imageUrl = '';
      if (image) {
        const imageRef = ref(storage, `images/${Date.now()}_${image.name}`);
        await uploadString(imageRef, image, 'data_url');
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, 'blogs'), {
        title,
        content,
        hashtags,
        imageUrl,
        userId: auth.currentUser.uid,
        timestamp: new Date(),
      });

      alert('Blog submitted successfully!');
      setTitle('');
      setContent('');
      setHashtags([]);
      setImage(null);
    } catch (error) {
      console.error('Error submitting blog:', error);
      setError('Failed to submit blog. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addHashtag = () => {
    if (hashtagInput && !hashtags.includes(`#${hashtagInput}`)) {
      setHashtags([...hashtags, `#${hashtagInput}`]);
      setHashtagInput('');
    }
  };

  const removeHashtag = (hashtagToRemove) => {
    setHashtags(hashtags.filter(hashtag => hashtag !== hashtagToRemove));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <Navbar />
      <div className="pl-10 mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Create a Blog Post</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Blog Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your blog title"
                required
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Blog Content
              </label>
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                className="h-auto mb-8"
                placeholder="Write your blog content here..."
                modules={modules}
              />
            </div>

            <div>
              <label htmlFor="hashtags" className="block text-sm font-medium text-gray-700 mb-1">
                Hashtags
              </label>
              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="text"
                  id="hashtags"
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value)}
                  className="w-full px-4 py-2 border text-blue-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter a hashtag"
                />
                <button
                  type="button"
                  onClick={addHashtag}
                  className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap space-x-2">
                {hashtags.map((hashtag, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 mx-3 px-3 py-2 my-1 rounded-full text-sm flex items-center space-x-2">
                    <span>{hashtag}</span>
                    <button
                      type="button"
                      onClick={() => removeHashtag(hashtag)}
                      className="text-blue-500 hover:text-blue-700 focus:outline-none"
                    >
                      <XIcon className="h-5 w-5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Blog Image (optional)
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border text-black rounded-md shadow-sm"
              />
              {image && <img src={image} alt="Blog Image Preview" className="mt-4 max-w-full h-auto rounded-md" />}
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Publish Blog
            </button>
            {error && <p className="text-red-500">{error}</p>}
            {loading && <p>Submitting...</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

const modules = {
  toolbar: [
    [{ 'font': [] }],
    [{ 'size': ['small', 'medium', 'large', 'huge'] }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['link', 'image', 'video'],
    [{ 'color': [] }, { 'background': [] }],
    ['clean']
  ],
};
