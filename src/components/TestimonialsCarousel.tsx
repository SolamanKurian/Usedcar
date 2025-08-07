'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Testimonial {
  id: string;
  clientName: string;
  message: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function TestimonialsCarousel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (testimonials.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
        );
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [testimonials.length]);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const testimonialsCollection = collection(db!, 'testimonials');
      const q = query(testimonialsCollection, where('isActive', '==', true));
      const testimonialsSnapshot = await getDocs(q);
      
      const testimonialsData = testimonialsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Testimonial[];
      
      const sortedTestimonials = testimonialsData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setTestimonials(sortedTestimonials);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1);
  };

  if (loading) {
    return (
      <div className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-yellow-200">Loading testimonials...</p>
          </div>
        </div>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <div className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-yellow-200 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our satisfied customers have to say about their experience with PreCar.
          </p>
        </div>

                 <div className="relative">
           <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-yellow-500/30">
             <div className="px-8 py-12 md:px-16 md:py-16">
               <div className="text-center">
                 <div className="mb-8">
                   <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-4xl mx-auto">
                     {testimonials[currentIndex]?.message}
                   </p>
                 </div>
                 
                 <div className="flex items-center justify-center space-x-3">
                   <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                     <span className="text-white font-semibold text-lg">
                       {testimonials[currentIndex]?.clientName.charAt(0).toUpperCase()}
                     </span>
                   </div>
                   <div className="text-left">
                     <h4 className="text-white font-semibold text-lg">
                       {testimonials[currentIndex]?.clientName}
                     </h4>
                   </div>
                 </div>
               </div>
             </div>
           </div>

           {/* Navigation Arrows */}
           <button
             onClick={goToPrevious}
             className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-gray-800/80 backdrop-blur-sm border border-yellow-500/30 rounded-full flex items-center justify-center text-yellow-400 hover:text-yellow-300 hover:border-yellow-400/50 transition-all duration-300 group"
           >
             <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
             </svg>
           </button>
           
           <button
             onClick={goToNext}
             className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-gray-800/80 backdrop-blur-sm border border-yellow-500/30 rounded-full flex items-center justify-center text-yellow-400 hover:text-yellow-300 hover:border-yellow-400/50 transition-all duration-300 group"
           >
             <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
             </svg>
           </button>

          <div className="flex justify-center mt-8 space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-yellow-500 scale-125'
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 max-w-md mx-auto">
          <div className="w-full bg-gray-700 rounded-full h-1">
            <div 
              className="bg-gradient-to-r from-yellow-500 to-orange-500 h-1 rounded-full transition-all duration-300 ease-linear"
              style={{ 
                width: `${((currentIndex + 1) / testimonials.length) * 100}%` 
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 