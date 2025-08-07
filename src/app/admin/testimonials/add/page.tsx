'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function AddTestimonialPage() {
  const { user, loading, isConfigured } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    clientName: '',
    message: '',
    isActive: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.clientName.trim()) {
      setError('Client name is required');
      return false;
    }

    if (!formData.message.trim()) {
      setError('Message is required');
      return false;
    }

    if (formData.message.trim().length < 10) {
      setError('Message must be at least 10 characters long');
      return false;
    }

    if (formData.message.trim().length > 500) {
      setError('Message must be less than 500 characters');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      const testimonialData = {
        clientName: formData.clientName.trim(),
        message: formData.message.trim(),
        isActive: formData.isActive,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await addDoc(collection(db!, 'testimonials'), testimonialData);
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/testimonials');
      }, 2000);
    } catch (error) {
      console.error('Error adding testimonial:', error);
      setError('Failed to add testimonial. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !isConfigured) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add New Testimonial</h1>
              <p className="mt-2 text-gray-600">Add a new client testimonial to showcase on your website</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </Link>
              <Link
                href="/admin/testimonials"
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Testimonials
              </Link>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Testimonial Details</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex">
                  <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-green-600">Testimonial added successfully! Redirecting...</p>
                </div>
              </div>
            )}

            {/* Client Name */}
            <div className="space-y-2">
              <label htmlFor="clientName" className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
                <span>Client Name</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="clientName"
                id="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black"
                placeholder="Enter client's full name"
                disabled={isSubmitting}
                maxLength={100}
              />
              <p className="text-xs text-gray-500">
                {formData.clientName.length}/100 characters
              </p>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label htmlFor="message" className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
                <span>Testimonial Message</span>
                <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                id="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none text-black"
                placeholder="Enter the client's testimonial message..."
                disabled={isSubmitting}
                maxLength={500}
              />
              <p className="text-xs text-gray-500">
                {formData.message.length}/500 characters (minimum 10 characters)
              </p>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  disabled={isSubmitting}
                />
                <span className="text-sm font-semibold text-gray-700">Active</span>
              </label>
              <p className="text-xs text-gray-500">
                Active testimonials will be displayed on the website
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <Link
                href="/admin/testimonials"
                className="px-6 py-3 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
                disabled={isSubmitting}
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b border-white mr-2"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Testimonial
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 