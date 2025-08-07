'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Poster {
  id: string;
  title: string;
  imageUrl: string;
  isActive: boolean;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function PosterCarousel() {
  const [posters, setPosters] = useState<Poster[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Function to handle image loading errors (simplified like product pages)
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Poster image failed to load:', e.currentTarget.src);
  };

  // Function to convert worker URLs back to R2 URLs for display
  const convertWorkerUrlToR2 = (url: string): string => {
    // If it's a worker URL, convert it back to R2 URL
    if (url.includes('workers.dev')) {
      const key = url.split('workers.dev/')[1];
      return `https://pub-09af7e48d72447348c2324f8e3f7453c.r2.dev/${key}`;
    }
    return url;
  };

  useEffect(() => {
    fetchActivePosters();
  }, []);

  useEffect(() => {
    if (posters.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % posters.length);
      }, 5000); // Change poster every 5 seconds

      return () => clearInterval(interval);
    }
  }, [posters.length]);

  const fetchActivePosters = async () => {
    try {
      setLoading(true);
      const postersCollection = collection(db!, 'posters');
      const postersSnapshot = await getDocs(postersCollection);

      const postersData = postersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Poster[];

      // Filter active posters and sort by priority on client side
      const activePosters = postersData
        .filter(poster => poster.isActive)
        .sort((a, b) => a.priority - b.priority);

      // Convert worker URLs to R2 URLs for display (same as product pages)
      activePosters.forEach(poster => {
        // Fix: If the image URL points to products folder, update it to posters folder
        if (poster.imageUrl.includes('/products/')) {
          poster.imageUrl = poster.imageUrl.replace('/products/', '/posters/');
          console.log('Fixed poster image URL from products to posters folder:', poster.imageUrl);
        }
        poster.imageUrl = convertWorkerUrlToR2(poster.imageUrl);
      });

      setPosters(activePosters);
    } catch (error) {
      console.error('Error fetching posters:', error);
    } finally {
      setLoading(false);
    }
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % posters.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + posters.length) % posters.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <div className="w-full h-48 sm:h-64 md:h-96 lg:h-[500px] xl:h-[600px] bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Loading posters...</div>
      </div>
    );
  }

  if (posters.length === 0) {
    return null; // Don't render anything if no active posters
  }

  return (
    <div className="relative w-full h-48 sm:h-64 md:h-96 lg:h-[500px] xl:h-[600px] overflow-hidden rounded-lg">
      {/* Poster Image */}
      <div className="w-full h-full relative bg-gradient-to-br from-gray-800 to-gray-900">
        <img
          src={posters[currentIndex].imageUrl}
          alt={posters[currentIndex].title}
          className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
          onError={handleImageError}
        />
      </div>

      {/* Navigation Arrows */}
      {posters.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 sm:left-4 md:left-6 top-1/2 transform -translate-y-1/2 bg-gray-900/80 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full hover:bg-gray-800/90 hover:scale-110 transition-all duration-300 border border-yellow-500/30 hover:border-yellow-400/50 shadow-2xl"
            aria-label="Previous poster"
          >
            <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 sm:right-4 md:right-6 top-1/2 transform -translate-y-1/2 bg-gray-900/80 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full hover:bg-gray-800/90 hover:scale-110 transition-all duration-300 border border-yellow-500/30 hover:border-yellow-400/50 shadow-2xl"
            aria-label="Next poster"
          >
            <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {posters.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {posters.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-yellow-400 scale-125' 
                  : 'bg-gray-400 hover:bg-gray-300'
              }`}
              aria-label={`Go to poster ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
} 