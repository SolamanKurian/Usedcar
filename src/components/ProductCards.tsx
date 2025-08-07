'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

interface Product {
  id: string;
  category: string;
  brand: string;
  modelName?: string;
  yearOfManufacture: number;
  kilometersDriven: number;
  fuel?: string | null;
  transmission?: string | null;
  description: string;
  images?: string[];
  imageUrls?: string[];
  isSold: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function ProductCards() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to convert worker URLs back to R2 URLs for display
  const convertWorkerUrlToR2 = (url: string): string => {
    if (url.includes('workers.dev')) {
      const key = url.split('workers.dev/')[1];
      return `https://pub-09af7e48d72447348c2324f8e3f7453c.r2.dev/${key}`;
    }
    return url;
  };

  // Function to handle image loading errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Product image failed to load:', e.currentTarget.src);
    e.currentTarget.style.display = 'none';
  };

  // Function to handle WhatsApp chat
  const handleGetPrice = (product: Product) => {
    const modelInfo = product.modelName ? `${product.brand} ${product.modelName}` : product.brand;
    const message = `Hi, I would like to get the price of vehicle - ${modelInfo} ${product.category} (${product.yearOfManufacture}) with ${product.kilometersDriven.toLocaleString()} km`;
    const whatsappUrl = `https://wa.me/8075091072?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsCollection = collection(db!, 'products');
      const productsSnapshot = await getDocs(productsCollection);
      
      const productsData = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Product[];
      
      // Convert worker URLs to R2 URLs for display
      productsData.forEach(product => {
        if (product.images && product.images.length > 0) {
          product.images = product.images.map(convertWorkerUrlToR2);
        }
        if (product.imageUrls && product.imageUrls.length > 0) {
          product.imageUrls = product.imageUrls.map(convertWorkerUrlToR2);
        }
      });
      
      // Filter out sold products and sort by creation date (newest first)
      const availableProducts = productsData
        .filter(product => !product.isSold)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      setProducts(availableProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              New Arrivals
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-gray-800/50 rounded-2xl border border-yellow-500/30 p-6 animate-pulse">
                <div className="w-full h-48 bg-gray-700 rounded-xl mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                  <div className="flex space-x-2 pt-4">
                    <div className="h-10 bg-gray-700 rounded-lg flex-1"></div>
                    <div className="h-10 bg-gray-700 rounded-lg flex-1"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            New Arrivals
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            No new arrivals at the moment. Please check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            New Arrivals
          </h2>
        </div>
        
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {products.slice(0, 4).map((product) => {
            const mainImage = (product.images && product.images.length > 0) 
              ? product.images[0] 
              : (product.imageUrls && product.imageUrls.length > 0) 
                ? product.imageUrls[0] 
                : null;
            
            return (
                             <div key={product.id} className="group bg-gray-900/80 backdrop-blur-sm rounded-3xl border border-gray-700 hover:border-gray-600 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-black/50">
                {/* Product Image */}
                <div className="relative w-full h-56 overflow-hidden rounded-t-3xl">
                  {mainImage ? (
                    <img
                      src={mainImage}
                      alt={`${product.brand} ${product.modelName || ''} ${product.category}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  
                                     {/* Brand Badge */}
                   <div className="absolute top-4 left-4">
                     <span className="bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                       {product.brand}
                     </span>
                   </div>
                  
                  {/* Year Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {product.yearOfManufacture}
                    </span>
                  </div>
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                                 {/* Product Details */}
                 <div className="p-6">
                   <div className="mb-6">
                     {product.modelName && (
                       <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gray-200 transition-colors duration-300">
                         {product.modelName}
                       </h3>
                     )}
                    
                                            <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className="text-gray-300 text-sm font-medium">
                              {product.kilometersDriven.toLocaleString()} km
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-gray-300 text-sm font-medium">
                              Available
                            </span>
                          </div>
                        </div>
                        
                                    {product.fuel && (
              <div className="flex items-center space-x-2 mb-4">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.36 11.64a9 9 0 11-12.73 0L12 2l6.36 9.64z" />
                </svg>
                <span className="text-gray-300 text-sm font-medium">
                  {product.fuel}
                </span>
              </div>
            )}

            {product.transmission && (
              <div className="flex items-center space-x-2 mb-4">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-300 text-sm font-medium">
                  {product.transmission}
                </span>
              </div>
            )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleGetPrice(product)}
                      className="flex-1 bg-gradient-to-r from-gray-700 to-gray-800 text-white py-3 px-4 rounded-xl text-sm font-bold hover:from-gray-600 hover:to-gray-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:shadow-black/25 transform hover:scale-105"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                      </svg>
                      <span>Get Price</span>
                    </button>
                    
                    <Link
                      href={`/product/${product.id}`}
                      className="flex-1 border-2 border-gray-600 text-gray-300 py-3 px-4 rounded-xl text-sm font-bold hover:border-gray-500 hover:text-gray-200 hover:bg-gray-700/20 transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>View</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
                     })}
         </div>
         
         {/* View All Button */}
         {products.length > 4 && (
           <div className="text-center mt-12">
             <Link
               href="/all-products"
               className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-800 text-white text-lg font-bold rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-black/25 transform hover:scale-105"
             >
               <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
               </svg>
               View All Listed Cars and Machinery
             </Link>
           </div>
         )}
       </div>
     </div>
   );
} 