import Link from 'next/link';
import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'About Us - PreCar | Your Trusted Partner for Used Vehicles',
  description: 'PreCar specializes in high-quality used cars, bikes, and commercial vehicles. Located in Kakkanad, Kerala, we offer premium and budget-friendly options with easy financing and delivery across South India.',
  keywords: 'used cars, used bikes, commercial vehicles, car financing, vehicle sales, Kakkanad, Kerala, South India, PreCar',
  openGraph: {
    title: 'About Us - PreCar | Your Trusted Partner for Used Vehicles',
    description: 'PreCar specializes in high-quality used cars, bikes, and commercial vehicles. Located in Kakkanad, Kerala, we offer premium and budget-friendly options with easy financing and delivery across South India.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us - PreCar | Your Trusted Partner for Used Vehicles',
    description: 'PreCar specializes in high-quality used cars, bikes, and commercial vehicles. Located in Kakkanad, Kerala, we offer premium and budget-friendly options with easy financing and delivery across South India.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/about1.jpg" 
            alt="PreCar about us background" 
            className="w-full h-full object-cover"
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="block text-white">About</span>
              <span className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                PreCar
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              Your trusted partner for high-quality used vehicles in Kerala and across South India
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Welcome to PreCar – Your Trusted Partner for Used Vehicles
                </h2>
                <p className="text-xl text-yellow-200 leading-relaxed">
                  At PreCar, we specialize in the sale and finance of high-quality used cars, bikes, and commercial vehicles, offering both premium and budget-friendly options to suit every need and lifestyle. Whether you&apos;re looking for your first car, upgrading to a better ride, or expanding your business fleet, PreCar is here to make the process simple, transparent, and hassle-free.
                </p>
              </div>

              {/* What We Offer Section */}
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-white mb-6">What We Offer:</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800/50 rounded-xl p-6 border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h4 className="text-xl font-bold text-white">Verified Vehicles</h4>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      Used Cars, Bikes & Commercial Vehicles – Verified vehicles across a wide range of brands and models.
                    </p>
                  </div>

                  <div className="bg-gray-800/50 rounded-xl p-6 border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <h4 className="text-xl font-bold text-white">Premium & Economy</h4>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      Premium & Economy Segments – From luxury cars to affordable daily rides.
                    </p>
                  </div>

                  <div className="bg-gray-800/50 rounded-xl p-6 border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h4 className="text-xl font-bold text-white">Easy Financing</h4>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      Easy Financing Solutions – Flexible finance plans with trusted partners to fit your budget.
                    </p>
                  </div>

                  <div className="bg-gray-800/50 rounded-xl p-6 border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <h4 className="text-xl font-bold text-white">Park & Sale</h4>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      Park & Sale Option – Want to sell your vehicle? Park it with us and let us handle the rest.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="relative w-full h-96 lg:h-[500px] overflow-hidden rounded-2xl border border-yellow-500/30">
                <img 
                  src="/about1.jpg" 
                  alt="PreCar showroom and vehicles" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>
              
              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -left-6 bg-gray-900/95 backdrop-blur-md rounded-2xl p-6 border border-yellow-500/30 shadow-2xl">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">1000+</div>
                  <div className="text-gray-300 text-sm">Happy Customers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-20 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose PreCar?
            </h2>
            <p className="text-xl text-yellow-200 max-w-3xl mx-auto">
              We&apos;re committed to providing exceptional service and the best vehicles at competitive prices
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group text-center p-8 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Prime Location</h3>
              <p className="text-yellow-200 leading-relaxed">
                Located in Kakkanad, we&apos;re at the heart of Kerala&apos;s growing automotive needs.
              </p>
            </div>

            <div className="group text-center p-8 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">South India Delivery</h3>
              <p className="text-yellow-200 leading-relaxed">
                Delivery Across South India – No matter where you are in the South, we&apos;ll get your vehicle delivered to your doorstep.
              </p>
            </div>

            <div className="group text-center p-8 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Trusted by Hundreds</h3>
              <p className="text-yellow-200 leading-relaxed">
                Known for our customer-first approach, fair pricing, and genuine service.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-yellow-600/20 to-orange-600/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Find Your Perfect Vehicle?
          </h2>
          <p className="text-xl text-yellow-200 mb-8 max-w-2xl mx-auto">
            Whether buying, selling, or financing a used vehicle, PreCar is your one-stop destination. Discover a better way to own your next ride.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/all-products" 
              className="group bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-yellow-700 hover:to-orange-700 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/25 transform hover:scale-105 flex items-center space-x-2"
            >
              <span>Browse Our Vehicles</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link 
              href="/contact" 
              className="group border-2 border-yellow-500/50 text-yellow-300 px-8 py-4 rounded-xl text-lg font-semibold hover:border-yellow-400 hover:text-yellow-200 transition-all duration-300 flex items-center space-x-2"
            >
              <span>Contact Us</span>
              <svg className="w-5 h-5 group-hover:rotate-45 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 