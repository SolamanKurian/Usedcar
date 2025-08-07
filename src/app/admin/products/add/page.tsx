'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ImageUploadWithCrop from '@/components/ImageUploadWithCrop';

interface Category {
  id: string;
  name: string;
}

interface Brand {
  id: string;
  name: string;
}

interface FuelType {
  id: string;
  name: string;
}

interface Transmission {
  id: string;
  name: string;
}

export default function AddProduct() {
  const { user, loading, isConfigured } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    brand: '',
    modelName: '',
    yearOfManufacture: '',
    kilometersDriven: '',
    fuel: '',
    transmission: '',
    description: '',
    includedInOffer: false,
    priorityNumber: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [fuelTypes, setFuelTypes] = useState<FuelType[]>([]);
  const [transmissions, setTransmissions] = useState<Transmission[]>([]);
  const [images, setImages] = useState<(File | null)[]>([null, null, null, null]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const sidebarItems = [
    { name: 'Dashboard', href: '/admin', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" /></svg> },
    { name: 'Products', href: '/admin/products', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
    { name: 'Brands', href: '/admin/brands', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg> },
    { name: 'Categories', href: '/admin/categories', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> },
    { name: 'Fuel Types', href: '/admin/fuel-types', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
    { name: 'Transmissions', href: '/admin/transmissions', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
    { name: 'Posters', href: '/admin/posters', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
    { name: 'Testimonials', href: '/admin/testimonials', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg> }
  ];

  useEffect(() => {
    if (!loading && !user && isConfigured) {
      router.push('/admin/login');
    }
  }, [user, loading, router, isConfigured]);

  useEffect(() => {
    if (isConfigured && db) {
      fetchCategories();
      fetchBrands();
      fetchFuelTypes();
      fetchTransmissions();
    }
  }, [isConfigured]);

  const fetchCategories = async () => {
    try {
      const categoriesCollection = collection(db!, 'categories');
      const categoriesSnapshot = await getDocs(categoriesCollection);
      const categoriesData = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name
      }));
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const brandsCollection = collection(db!, 'brands');
      const brandsSnapshot = await getDocs(brandsCollection);
      const brandsData = brandsSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name
      }));
      setBrands(brandsData);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const fetchFuelTypes = async () => {
    try {
      const fuelTypesCollection = collection(db!, 'fuelTypes');
      const fuelTypesSnapshot = await getDocs(fuelTypesCollection);
      const fuelTypesData = fuelTypesSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name
      }));
      setFuelTypes(fuelTypesData);
    } catch (error) {
      console.error('Error fetching fuel types:', error);
    }
  };

  const fetchTransmissions = async () => {
    try {
      const transmissionsCollection = collection(db!, 'transmissions');
      const transmissionsSnapshot = await getDocs(transmissionsCollection);
      const transmissionsData = transmissionsSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name
      }));
      setTransmissions(transmissionsData);
    } catch (error) {
      console.error('Error fetching transmissions:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError(''); // Clear error when user starts typing
  };

  const handleImageChange = (index: number, file: File | null) => {
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);
    setError('');
  };

  const uploadImagesToR2 = async (files: (File | null)[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    
    for (const file of files) {
      if (file) {
        try {
          console.log('Uploading file:', file.name, file.type);
          
          // Upload directly to Cloudflare Worker
          const formData = new FormData();
          formData.append('file', file);
          
          const response = await fetch('https://frosty-tooth-003c.solaman-dexstack.workers.dev', {
            method: 'POST',
            body: formData,
          });

          console.log('Upload API response status:', response.status);
          console.log('Upload API response ok:', response.ok);

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Upload API error response:', errorText);
            throw new Error('Failed to upload file');
          }

          const responseData = await response.json();
          console.log('Upload API response data:', responseData);
          
          const { fileUrl } = responseData;
          console.log('Generated file URL:', fileUrl);
          uploadedUrls.push(fileUrl);
        } catch (error) {
          console.error('Error uploading image:', error);
          throw new Error(`Failed to upload ${file.name}`);
        }
      }
    }

    return uploadedUrls;
  };

  const validateForm = () => {
    if (!formData.category) {
      setError('Please select a category');
      return false;
    }

    if (!formData.brand) {
      setError('Please select a brand');
      return false;
    }

    if (!formData.modelName.trim()) {
      setError('Model name is required');
      return false;
    }

    if (!formData.yearOfManufacture) {
      setError('Year of manufacture is required');
      return false;
    }

    const year = parseInt(formData.yearOfManufacture);
    const currentYear = new Date().getFullYear();
    if (year < 1900 || year > currentYear + 1) {
      setError('Please enter a valid year of manufacture');
      return false;
    }

    if (!formData.kilometersDriven) {
      setError('Kilometers driven is required');
      return false;
    }

    const kilometers = parseInt(formData.kilometersDriven);
    if (kilometers < 0) {
      setError('Kilometers driven must be a positive number');
      return false;
    }

    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }

    if (formData.description.trim().length < 10) {
      setError('Description must be at least 10 characters long');
      return false;
    }

    // Validate priority number if provided
    if (formData.priorityNumber && formData.priorityNumber.trim() !== '') {
      const priority = parseInt(formData.priorityNumber);
      if (isNaN(priority) || priority < 0) {
        setError('Priority number must be a positive number');
        return false;
      }
    }

    const hasImages = images.some(img => img !== null);
    if (!hasImages) {
      setError('Please upload at least one image');
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
      setIsSubmitting(true);
      setUploadingImages(true);
      setError('');

      // Upload images to R2
      const uploadedImageUrls = await uploadImagesToR2(images);

      const productData = {
        category: formData.category,
        brand: formData.brand,
        modelName: formData.modelName.trim(),
        yearOfManufacture: parseInt(formData.yearOfManufacture),
        kilometersDriven: parseInt(formData.kilometersDriven),
        fuel: formData.fuel || null,
        transmission: formData.transmission || null,
        description: formData.description.trim(),
        includedInOffer: formData.includedInOffer,
        priorityNumber: formData.priorityNumber ? parseInt(formData.priorityNumber) : null,
        images: uploadedImageUrls,
        isSold: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('Saving product data to Firestore:', productData);

      await addDoc(collection(db!, 'products'), productData);
      
      // Reset form
      setFormData({
        category: '',
        brand: '',
        modelName: '',
        yearOfManufacture: '',
        kilometersDriven: '',
        fuel: '',
        transmission: '',
        description: '',
        includedInOffer: false,
        priorityNumber: ''
      });
      setImages([null, null, null, null]);
      
      // Redirect to products list
      router.push('/admin/products');
    } catch (error) {
      console.error('Error adding product:', error);
      setError('Failed to add product. Please try again.');
    } finally {
      setIsSubmitting(false);
      setUploadingImages(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">PreCar Admin</h1>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg">
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
          <div className="px-4 py-8 sm:px-0">
            <div className="text-center">
              <div className="mx-auto h-24 w-24 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center mb-6">
                <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Firebase Not Configured</h2>
              <p className="text-gray-600 text-lg">Please configure Firebase to access product management.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
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

        {/* View Website Button */}
        <div className="mt-6 px-3">
          <Link
            href="/"
            className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-3 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View Website
          </Link>
        </div>

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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
                  </div>
                  <p className="text-gray-600">Add a new vehicle or machine to your inventory</p>
                </div>
              </div>
              <Link
                href="/admin/products"
                className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Products
              </Link>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Product Information</h3>
              <p className="text-sm text-gray-600">Fill in the details below to add your new product</p>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information Section */}
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-4 mb-6">
                    <h4 className="text-lg font-medium text-gray-900">Basic Information</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Category */}
                    <div className="space-y-2">
                      <label htmlFor="category" className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
                        <span>Category</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="category"
                          id="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-black"
                          disabled={isSubmitting}
                        >
                          <option value="">Select a category</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.name}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Brand */}
                    <div className="space-y-2">
                      <label htmlFor="brand" className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
                        <span>Brand</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="brand"
                          id="brand"
                          value={formData.brand}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-black"
                          disabled={isSubmitting}
                        >
                          <option value="">Select a brand</option>
                          {brands.map((brand) => (
                            <option key={brand.id} value={brand.name}>
                              {brand.name}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Model Name */}
                    <div className="space-y-2">
                      <label htmlFor="modelName" className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
                        <span>Model Name</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="modelName"
                        id="modelName"
                        value={formData.modelName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-black"
                        placeholder="e.g., Civic, Corolla, F-150"
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Year of Manufacture */}
                    <div className="space-y-2">
                      <label htmlFor="yearOfManufacture" className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
                        <span>Year of Manufacture</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="yearOfManufacture"
                        id="yearOfManufacture"
                        value={formData.yearOfManufacture}
                        onChange={handleInputChange}
                        min="1900"
                        max={new Date().getFullYear() + 1}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-black"
                        placeholder="e.g., 2020"
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Kilometers Driven */}
                    <div className="space-y-2">
                      <label htmlFor="kilometersDriven" className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
                        <span>Kilometers Driven</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="kilometersDriven"
                        id="kilometersDriven"
                        value={formData.kilometersDriven}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-black"
                        placeholder="e.g., 50000"
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Fuel Type */}
                    <div className="space-y-2">
                      <label htmlFor="fuel" className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
                        <span>Fuel Type</span>
                      </label>
                      <div className="relative">
                        <select
                          name="fuel"
                          id="fuel"
                          value={formData.fuel}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-black"
                          disabled={isSubmitting}
                        >
                          <option value="">Select fuel type (optional)</option>
                          {fuelTypes.map((fuelType) => (
                            <option key={fuelType.id} value={fuelType.name}>
                              {fuelType.name}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Transmission Type */}
                    <div className="space-y-2">
                      <label htmlFor="transmission" className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
                        <span>Transmission Type</span>
                      </label>
                      <div className="relative">
                        <select
                          name="transmission"
                          id="transmission"
                          value={formData.transmission}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-black"
                          disabled={isSubmitting}
                        >
                          <option value="">Select transmission type (optional)</option>
                          {transmissions.map((transmission) => (
                            <option key={transmission.id} value={transmission.name}>
                              {transmission.name}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
                      <span>Description</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm resize-none text-black"
                      placeholder="Describe the vehicle/machine, its condition, features, etc."
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Additional Settings Section */}
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-4 mb-6">
                    <h4 className="text-lg font-medium text-gray-900">Additional Settings</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* Included in Offer */}
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700">Offer Settings</label>
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            name="includedInOffer"
                            id="includedInOffer"
                            checked={formData.includedInOffer}
                            onChange={handleInputChange}
                            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-200"
                            disabled={isSubmitting}
                          />
                          <label htmlFor="includedInOffer" className="text-sm font-medium text-gray-700">
                            Include in Special Offers
                          </label>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 ml-8">
                          Check this box if this product should be featured in promotional campaigns
                        </p>
                      </div>
                    </div>

                    {/* Priority Number */}
                    <div className="space-y-2">
                      <label htmlFor="priorityNumber" className="block text-sm font-semibold text-gray-700">
                        Priority Number
                      </label>
                      <input
                        type="number"
                        name="priorityNumber"
                        id="priorityNumber"
                        value={formData.priorityNumber}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-black"
                        placeholder="e.g., 1, 2, 3..."
                        disabled={isSubmitting}
                      />
                      <p className="text-xs text-gray-500">
                        Higher numbers have higher priority. Same number can be given to multiple products.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Images Section */}
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-4 mb-6">
                    <h4 className="text-lg font-medium text-gray-900">Product Images</h4>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Images <span className="text-red-500">*</span>
                      </label>
                      <p className="text-sm text-gray-600 mb-4">Upload high-quality images to showcase your product. Up to 4 images allowed.</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {[0, 1, 2, 3].map((index) => (
                        <ImageUploadWithCrop
                          key={index}
                          onImageChange={(file) => handleImageChange(index, file)}
                          disabled={isSubmitting}
                          label={`Image ${index + 1}`}
                          index={index}
                        />
                      ))}
                    </div>
                    
                    <div className="mt-4 text-center">
                      <span className="text-sm text-gray-600">
                        {images.filter(img => img !== null).length} of 4 images selected
                      </span>
                    </div>
                  </div>
                </div>

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

                {/* Submit Button */}
                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {uploadingImages ? 'Uploading Images...' : 'Adding Product...'}
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Product
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