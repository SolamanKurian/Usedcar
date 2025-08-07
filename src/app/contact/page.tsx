import Link from 'next/link';
import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Contact Us - PreCar | Get in Touch for Used Vehicles',
  description: 'Contact PreCar in Kakkanad, Kochi for used cars, bikes, and commercial vehicles. Call 8075091072 or WhatsApp us for inquiries. Park & Sale services available.',
keywords: 'contact PreCar, used car dealer Kakkanad, Kochi, WhatsApp, park and sale, vehicle inquiry, 8075091072',
  openGraph: {
    title: 'Contact Us - PreCar | Get in Touch for Used Vehicles',
    description: 'Contact PreCar in Kakkanad, Kochi for used cars, bikes, and commercial vehicles. Call 8075091072 or WhatsApp us for inquiries.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us - PreCar | Get in Touch for Used Vehicles',
    description: 'Contact PreCar in Kakkanad, Kochi for used cars, bikes, and commercial vehicles. Call 8075091072 or WhatsApp us for inquiries.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/contact1.jpg)'
          }}
        ></div>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/20 via-orange-600/20 to-red-600/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="block text-white">Get in</span>
              <span className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              Ready to find your perfect vehicle? Contact us today and let us help you with your automotive needs.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Details */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Contact Information
                </h2>
                <p className="text-xl text-yellow-200 leading-relaxed">
                  Visit us in Kakkanad, Kochi or get in touch through phone or WhatsApp. We&apos;re here to help you find the perfect vehicle.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-6">
                {/* Address Card */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Visit Us</h3>
                      <p className="text-gray-300">Our Showroom</p>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    <strong>PreCar</strong><br />
                    ABC Building<br />
                    Kakkanad, Kochi<br />
                    Kerala, India
                  </p>
                </div>

                {/* Phone Card */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Call Us</h3>
                      <p className="text-gray-300">Direct Line</p>
                    </div>
                  </div>
                  <a 
                    href="tel:8075091072" 
                    className="text-2xl font-bold text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
                  >
                    +91 8075091072
                  </a>
                </div>

                {/* WhatsApp Card */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">WhatsApp Us</h3>
                      <p className="text-gray-300">Quick Chat</p>
                    </div>
                  </div>
                  <a
                    href="https://wa.me/918075091072?text=Hi%2C%20I%20would%20like%20to%20inquire%20about%20your%20vehicles%20and%20services."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-green-500/25 transform hover:scale-105 flex items-center space-x-2 inline-block"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                    <span>Start Chat</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="relative">
              <div className="relative w-full h-96 lg:h-[500px] overflow-hidden rounded-2xl border border-yellow-500/30">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.8!2d76.3!3d10.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080d5145ecbd3f%3A0x6b3b8b8b8b8b8b8b!2sKakkanad%2C%20Kochi%2C%20Kerala!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="PreCar Location in Kakkanad, Kochi"
                ></iframe>
              </div>
              
              {/* Map Overlay Info */}
              <div className="absolute top-4 left-4 bg-gray-900/95 backdrop-blur-md rounded-xl p-4 border border-yellow-500/30 shadow-2xl">
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-400 mb-1">PreCar</div>
                  <div className="text-gray-300 text-sm">ABC Building, Kakkanad</div>
                  <div className="text-gray-300 text-sm">Kochi, Kerala</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Park & Sale Section */}
      <div className="py-20 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Want to Sell Your Vehicle?
            </h2>
            <p className="text-xl text-yellow-200 max-w-3xl mx-auto">
              Park your vehicle with us and let us handle the selling process. We&apos;ll take care of everything from marketing to finalizing the deal.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
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
          </div>
        </div>
      </div>

      {/* Special Business Section */}
      <div className="py-20 bg-gradient-to-r from-yellow-600/20 to-orange-600/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Do You Run a Used Car Business?
            </h2>
            <p className="text-xl text-yellow-200 max-w-3xl mx-auto">
              Want a website like this for your business? Get in touch with our technology partner.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-yellow-500/30">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Dexqbit Solutions Pvt Ltd</h3>
                      <p className="text-gray-300">Technology Partner</p>
                      <a 
                        href="https://www.dexqbit.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm transition-colors duration-200 flex items-center space-x-1 mt-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span>www.dexqbit.com</span>
                      </a>
                    </div>
                  </div>
                  
                  <div className="space-y-4 text-gray-300">
                    <p className="leading-relaxed">
                      Transform your used car business with a professional website just like PreCar. Our technology partner specializes in creating modern, responsive websites for automotive businesses.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Modern Design</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Mobile Responsive</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>SEO Optimized</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>WhatsApp Integration</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl p-8 border border-blue-500/30">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-4">Get Your Website</h4>
                    <p className="text-gray-300 mb-6">
                      Ready to take your business online? Contact Dexqbit Solutions for a custom website solution.
                    </p>
                    
                    <a
                      href="https://wa.me/918075091072?text=Hi%2C%20I%20run%20a%20used%20car%20business%20and%20would%20like%20to%20get%20a%20website%20similar%20to%20PreCar.%20Can%20you%20help%20me%20with%20this%3F"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 flex items-center justify-center space-x-3 mx-auto inline-block"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                      </svg>
                      <span>Contact Dexqbit</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

            <Footer />
    </div>
  );
} 