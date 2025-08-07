'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import PosterCarousel from '@/components/PosterCarousel';
import ProductCards from '@/components/ProductCards';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';

export default function Home() {
  const { user } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Handle hash navigation for park-and-sale section
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash === '#park-and-sale') {
        // Small delay to ensure the page is fully loaded
        setTimeout(() => {
          const element = document.getElementById('park-and-sale');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      {/* Hero Section with hero1.jpg background */}
      <div className="relative overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/hero1.jpg" 
            alt="Hero background" 
            className="w-full h-full object-cover"
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="block text-white">Find Your Perfect</span>
                <span className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                  Used Car
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
                Discover premium used cars with detailed inspections, competitive pricing, and exceptional customer service. 
                Your journey to the perfect vehicle starts here.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  href="/all-products" 
                  className="group bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-yellow-700 hover:to-orange-700 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/25 transform hover:scale-105 flex items-center space-x-2"
                >
                  <span>Browse Cars</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link 
                  href="/about" 
                  className="group border-2 border-yellow-500/50 text-yellow-300 px-8 py-4 rounded-xl text-lg font-semibold hover:border-yellow-400 hover:text-yellow-200 transition-all duration-300 flex items-center space-x-2"
                >
                  <span>Learn More</span>
                  <svg className="w-5 h-5 group-hover:rotate-45 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">1000+</h3>
              <p className="text-yellow-200">Quality Cars</p>
            </div>
            <div className="text-center p-6 bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">5000+</h3>
              <p className="text-yellow-200">Happy Customers</p>
            </div>
            <div className="text-center p-6 bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">24/7</h3>
              <p className="text-yellow-200">Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Posters Section */}
      <div className="py-12 sm:py-16 md:py-20 bg-gray-900">
        <div className="text-center mb-8 sm:mb-12 px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
            Hot Deals & Big News!
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-yellow-200 max-w-3xl mx-auto px-4">
            Check out our latest offers, seasonal sales, and important updates – all in one place!
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PosterCarousel />
        </div>
      </div>

      {/* Products Section */}
      <ProductCards />

      {/* Features Section */}
      <div className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose Precars?
            </h2>
            <p className="text-xl text-yellow-200 max-w-3xl mx-auto">
              At Precars, we offer a smooth and trusted way to buy and sell used cars, bikes, scooters, jeeps, and commercial vehicles. Here&apos;s what makes us stand out:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            <div className="group p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🚗</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">All Types of Vehicles</h3>
              <p className="text-yellow-200 leading-relaxed">
                We have a large collection of cars, jeeps, bikes, scooters, and commercial vehicles. Whether for personal use or business, you&apos;ll find the right one with us.
              </p>
            </div>

            <div className="group p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🛠️</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Quality & Trust</h3>
              <p className="text-yellow-200 leading-relaxed">
                Every vehicle is thoroughly inspected by experts. We also handle paperwork and ownership transfer with full trust and transparency.
              </p>
            </div>

            <div className="group p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Easy Finance & Fair Pricing</h3>
              <p className="text-yellow-200 leading-relaxed">
                We offer loan assistance for all purchases and provide clear, competitive prices with no hidden charges.
              </p>
            </div>

            <div className="group p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Fast Service & Full Support</h3>
              <p className="text-yellow-200 leading-relaxed">
                Enjoy a quick and simple process from start to finish. Our team is ready to help you 24/7 with anything you need.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Park & Sale Section */}
      <div id="park-and-sale" className="relative py-20 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/sell1.jpg)'
          }}
        ></div>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/20 via-orange-600/20 to-red-600/20"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Want to Sell Your Vehicle?
                </h2>
                <p className="text-xl text-yellow-200 leading-relaxed">
                  Park your vehicle with us and let us handle the entire selling process. No hassle, no stress - just a smooth transaction from start to finish.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Professional Marketing</h3>
                    <p className="text-gray-300">We&apos;ll showcase your vehicle to thousands of potential buyers</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Secure Facility</h3>
                    <p className="text-gray-300">Your vehicle is safely stored in our monitored facility</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Best Market Price</h3>
                    <p className="text-gray-300">Get the maximum value for your vehicle with our expertise</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Complete Process</h3>
                    <p className="text-gray-300">From listing to final sale, we handle everything for you</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Card */}
            <div className="relative">
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-yellow-500/30">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Park & Sale Service</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Simply park your vehicle at our facility and we&apos;ll handle the entire selling process. No hassle, no stress - just a smooth transaction.
                  </p>
                </div>
                
                <a
                  href="https://wa.me/918075091072?text=Hi%2C%20I%20would%20like%20to%20use%20your%20Park%20%26%20Sale%20service.%20Can%20you%20provide%20more%20details%20about%20the%20process%3F"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 text-white py-4 px-6 rounded-xl text-lg font-bold hover:from-yellow-700 hover:to-orange-700 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/25 transform hover:scale-105 flex items-center justify-center space-x-3 inline-block"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  <span>Inquire About Park & Sale</span>
                </a>
              </div>
              
              {/* Floating Stats */}
              <div className="absolute -bottom-6 -right-6 bg-gray-900/95 backdrop-blur-md rounded-2xl p-6 border border-yellow-500/30 shadow-2xl">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400 mb-1">500+</div>
                  <div className="text-gray-300 text-sm">Vehicles Sold</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <TestimonialsCarousel />

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-yellow-600/20 to-orange-600/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Find Your Dream Car?
          </h2>
          <p className="text-xl text-yellow-200 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their perfect vehicle with PreCar.
          </p>
          <Link 
            href="/all-products" 
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-600 to-orange-600 text-white text-lg font-semibold rounded-xl hover:from-yellow-700 hover:to-orange-700 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/25 transform hover:scale-105"
          >
            Start Browsing Now
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
