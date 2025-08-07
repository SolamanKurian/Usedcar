'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import PosterImageUpload from '@/components/PosterImageUpload';

interface Poster {
  id: string;
  title: string;
  imageUrl: string;
  isActive: boolean;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function EditPoster() {
  const { user, loading, isConfigured } = useAuth();
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const posterId = params.id as string;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    priority: 1,
    isActive: true
  });
  const [existingImage, setExistingImage] = useState<string>('');
  const [newImage, setNewImage] = useState<File | null>(null);
  const [loadingPoster, setLoadingPoster] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const sidebarItems = [
    { name: 'Dashboard', href: '/admin', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" /></svg> },
    { name: 'Products', href: '/admin/products', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
    { name: 'Brands', href: '/admin/brands', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg> },
    { name: 'Categories', href: '/admin/categories', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> },
    { name: 'Fuel Types', href: '/admin/fuel-types', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
    { name: 'Transmissions', href: '/admin/transmissions', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
    { name: 'Posters', href: '/admin/posters', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> }
  ];

  // Function to convert worker URLs back to R2 URLs for display (same as product edit page)
  const convertWorkerUrlToR2 = (url: string): string => {
    // If it's a worker URL, convert it back to R2 URL
    if (url.includes('workers.dev')) {
      const key = url.split('workers.dev/')[1];
      return `https://pub-09af7e48d72447348c2324f8e3f7453c.r2.dev/${key}`;
    }
    return url;
  };

  // Function to handle image loading errors (simplified like product pages)
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Image failed to load:', e.currentTarget.src);
  };

  useEffect(() => {
    if (!loading && !user && isConfigured) {
      router.push('/admin/login');
    }
  }, [user, loading, router, isConfigured]);

  useEffect(() => {
    if (user && posterId) {
      fetchPoster();
    }
  }, [user, posterId]);

  const fetchPoster = async () => {
    try {
      setLoadingPoster(true);
      const posterRef = doc(db!, 'posters', posterId);
      const posterSnapshot = await getDoc(posterRef);
      
      if (!posterSnapshot.exists()) {
        setError('Poster not found');
        return;
      }

      const posterData = posterSnapshot.data() as Poster;
      setFormData({
        title: posterData.title,
        priority: posterData.priority,
        isActive: posterData.isActive
      });
      
      // Convert worker URL back to R2 URL for display (same as product edit page)
      let imageUrl = posterData.imageUrl;
      
      // Fix: If the image URL points to products folder, update it to posters folder and save to database
      if (imageUrl.includes('/products/')) {
        const correctedImageUrl = imageUrl.replace('/products/', '/posters/');
        console.log('Fixed poster image URL from products to posters folder:', correctedImageUrl);
        
        // Update the poster's image URL in the database
        try {
          await updateDoc(posterRef, {
            imageUrl: correctedImageUrl,
            updatedAt: new Date()
          });
          console.log('Updated poster image URL in database');
          imageUrl = correctedImageUrl;
        } catch (error) {
          console.error('Failed to update poster image URL in database:', error);
        }
      }
      
      const convertedImageUrl = convertWorkerUrlToR2(imageUrl);
      setExistingImage(convertedImageUrl);
      console.log('Loaded existing poster image (converted to R2):', convertedImageUrl);
    } catch (error) {
      console.error('Error fetching poster:', error);
      setError('Failed to fetch poster');
    } finally {
      setLoadingPoster(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleImageChange = (file: File | null) => {
    setNewImage(file);
    setError('');
  };

  const handleRemoveExistingImage = () => {
    setExistingImage('');
  };

  const uploadImageToR2 = async (file: File): Promise<string> => {
    try {
      console.log('Uploading poster image:', file.name, file.type);
      
      // Upload directly to Cloudflare Worker
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'poster'); // Specify this is a poster upload
      
      const response = await fetch('https://frosty-tooth-003c.solaman-dexstack.workers.dev', {
        method: 'POST',
        body: formData,
      });

      console.log('Upload API response status:', response.status);
      console.log('Upload API response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload API error response:', errorText);
        throw new Error('Failed to upload image');
      }

      const responseData = await response.json();
      console.log('Upload API response data:', responseData);
      
      const { fileUrl } = responseData;
      console.log('Generated file URL:', fileUrl);
      return fileUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error(`Failed to upload ${file.name}`);
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!existingImage && !newImage) {
      setError('Poster image is required');
      return false;
    }
    if (formData.priority < 1 || formData.priority > 10) {
      setError('Priority must be between 1 and 10');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setUploading(true);
      setError('');

      let imageUrl = existingImage;

      // Upload new image if provided
      if (newImage) {
        imageUrl = await uploadImageToR2(newImage);
      }

      // Update poster data in Firestore
      const posterRef = doc(db!, 'posters', posterId);
      const updateData = {
        title: formData.title.trim(),
        imageUrl,
        priority: parseInt(formData.priority.toString()),
        isActive: formData.isActive,
        updatedAt: new Date()
      };

      await updateDoc(posterRef, updateData);

      // Redirect to posters list
      router.push('/admin/posters');
    } catch (error) {
      console.error('Error updating poster:', error);
      setError('Failed to update poster. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (loading || loadingPoster) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Setup Required
                </h2>
                <p className="text-gray-600">
                  Firebase is not configured. Please set up your environment variables to access the admin dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (error && error === 'Poster not found') {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Poster Not Found</h2>
                              <p className="text-gray-600 mb-4">The poster you&apos;re looking for doesn&apos;t exist.</p>
              <Link
                href="/admin/posters"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Back to Posters
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Sidebar Header */}
        <div className="flex items-center h-16 px-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">PreCar Admin</h1>
              <p className="text-blue-100 text-xs">Management Panel</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden ml-auto p-1 rounded text-white/80 hover:text-white hover:bg-white/10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-4 px-3">
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className={`mr-3 ${isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'}`}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User info and logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.email}
              </p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
          <Link
            href="/"
            className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 mb-2"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View Website
          </Link>
          <button
            onClick={() => router.push('/admin/login')}
            className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="flex items-center justify-between flex-1">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Edit Poster</h1>
                  </div>
                  <p className="text-gray-600">Update poster information and settings</p>
                </div>
                <Link
                  href="/admin/posters"
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Posters
                </Link>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Poster Information</h3>
              <p className="text-sm text-gray-600">Update the details below to modify your poster</p>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <p className="text-sm font-medium text-red-700">{error}</p>
                    </div>
                  </div>
                )}

                {/* Title */}
                <div className="space-y-2">
                  <label htmlFor="title" className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
                    <span>Poster Title</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-black"
                    placeholder="Enter poster title"
                    required
                    disabled={uploading}
                  />
                </div>

                {/* Priority */}
                <div className="space-y-2">
                  <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
                    <span>Priority</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-black"
                      required
                      disabled={uploading}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <option key={num} value={num}>
                          Priority {num}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Lower numbers have higher priority and will be displayed first
                  </p>
                </div>

                {/* Active Status */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">Status</label>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="isActive"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-200"
                        disabled={uploading}
                      />
                      <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                        Active (visible on landing page)
                      </label>
                    </div>
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
                    <span>Poster Image</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <PosterImageUpload
                    onImageChange={handleImageChange}
                    existingImage={existingImage}
                    onRemoveExisting={handleRemoveExistingImage}
                    label="Poster Image"
                    aspectRatio={16/9}
                  />
                  <p className="text-sm text-gray-500">
                    Upload a new image or keep the existing one. The image will be cropped to maintain 16:9 aspect ratio.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {uploading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating Poster...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Update Poster
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 