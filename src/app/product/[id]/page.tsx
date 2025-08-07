'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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
  const handleWhatsAppInquiry = (product: Product) => {
    const modelInfo = product.modelName ? `${product.brand} ${product.modelName}` : product.brand;
    const message = `Hi, I would like to get the price of vehicle - ${modelInfo} ${product.category} (${product.yearOfManufacture}) with ${product.kilometersDriven.toLocaleString()} km`;
    const whatsappUrl = `https://wa.me/918075091072?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string);
    }
  }, [params.id]);

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true);
      const productDoc = doc(db!, 'products', productId);
      const productSnapshot = await getDoc(productDoc);
      
      if (productSnapshot.exists()) {
        const productData = {
          id: productSnapshot.id,
          ...productSnapshot.data(),
          createdAt: productSnapshot.data().createdAt?.toDate() || new Date(),
          updatedAt: productSnapshot.data().updatedAt?.toDate() || new Date(),
        } as Product;
        
        // Convert worker URLs to R2 URLs for display
        if (productData.images && productData.images.length > 0) {
          productData.images = productData.images.map(convertWorkerUrlToR2);
        }
        if (productData.imageUrls && productData.imageUrls.length > 0) {
          productData.imageUrls = productData.imageUrls.map(convertWorkerUrlToR2);
        }
        
        setProduct(productData);
        
        // Fetch related products from the same category
        if (productData.category) {
          fetchRelatedProducts(productData.category, productId);
        }
      } else {
        router.push('/all-products');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      router.push('/all-products');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (category: string, excludeProductId: string) => {
    try {
      const productsCollection = collection(db!, 'products');
      const q = query(
        productsCollection,
        where('category', '==', category),
        where('isSold', '==', false),
        limit(4)
      );
      
      const productsSnapshot = await getDocs(q);
      const productsData = productsSnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        }))
        .filter(product => product.id !== excludeProductId) as Product[];
      
      // Convert worker URLs to R2 URLs for display
      productsData.forEach(product => {
        if (product.images && product.images.length > 0) {
          product.images = product.images.map(convertWorkerUrlToR2);
        }
        if (product.imageUrls && product.imageUrls.length > 0) {
          product.imageUrls = product.imageUrls.map(convertWorkerUrlToR2);
        }
      });
      
      setRelatedProducts(productsData);
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

           if (loading) {
           return (
             <div className="min-h-screen bg-gray-900 text-white">
               <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery Skeleton */}
            <div className="space-y-4">
              <div className="w-full h-96 bg-gray-800 rounded-2xl animate-pulse"></div>
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="w-full h-24 bg-gray-800 rounded-xl animate-pulse"></div>
                ))}
              </div>
            </div>
            
            {/* Product Details Skeleton */}
            <div className="space-y-6">
              <div className="h-8 bg-gray-800 rounded w-3/4 animate-pulse"></div>
              <div className="h-6 bg-gray-800 rounded w-1/2 animate-pulse"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="h-4 bg-gray-800 rounded animate-pulse"></div>
                ))}
              </div>
              <div className="flex space-x-4 pt-6">
                <div className="h-12 bg-gray-800 rounded-xl flex-1 animate-pulse"></div>
                <div className="h-12 bg-gray-800 rounded-xl flex-1 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

           if (!product) {
           return (
             <div className="min-h-screen bg-gray-900 text-white">
               <Navbar />
               <div className="flex items-center justify-center min-h-screen">
                 <div className="text-center">
                   <h1 className="text-2xl font-bold mb-4">Product not found</h1>
                   <Link href="/all-products" className="text-yellow-400 hover:text-yellow-300">
                     Back to all products
                   </Link>
                 </div>
               </div>
               <Footer />
             </div>
           );
         }

  const allImages = [...(product.images || []), ...(product.imageUrls || [])];
  const mainImage = allImages[selectedImageIndex] || allImages[0];

           return (
           <div className="min-h-screen bg-gray-900 text-white">
             <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-400">
            <li>
              <Link href="/" className="hover:text-yellow-400 transition-colors duration-200">
                Home
              </Link>
            </li>
            <li>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li>
              <Link href="/all-products" className="hover:text-yellow-400 transition-colors duration-200">
                All Products
              </Link>
            </li>
            <li>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="text-yellow-400">
              {product.brand} {product.modelName}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative w-full h-96 overflow-hidden rounded-2xl border border-gray-700">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={`${product.brand} ${product.modelName || ''} ${product.category}`}
                  className="w-full h-full object-cover"
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
            </div>

            {/* Thumbnail Images */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-full h-24 overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                      selectedImageIndex === index
                        ? 'border-yellow-400 shadow-lg shadow-yellow-400/25'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.brand} ${product.modelName || ''} ${product.category} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {product.brand} {product.modelName}
              </h1>
              <p className="text-xl text-yellow-200 mb-4">
                {product.category} • {product.yearOfManufacture}
              </p>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Kilometers</p>
                    <p className="text-white font-semibold">{product.kilometersDriven.toLocaleString()} km</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Status</p>
                    <p className="text-green-400 font-semibold">Available</p>
                  </div>
                </div>
              </div>
            </div>

                  {/* Fuel Type - Show if available */}
      {product.fuel && (
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.36 11.64a9 9 0 11-12.73 0L12 2l6.36 9.64z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Fuel Type</p>
              <p className="text-white font-semibold">{product.fuel}</p>
            </div>
          </div>
        </div>
      )}

      {/* Transmission Type - Show if available */}
      {product.transmission && (
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Transmission Type</p>
              <p className="text-white font-semibold">{product.transmission}</p>
            </div>
          </div>
        </div>
      )}

            {/* Description */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Description</h3>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => handleWhatsAppInquiry(product)}
                className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 text-white py-4 px-6 rounded-xl text-lg font-bold hover:from-yellow-700 hover:to-orange-700 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/25 transform hover:scale-105 flex items-center justify-center space-x-3"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>Get Price on WhatsApp</span>
              </button>
              
              <Link
                href="/all-products"
                className="flex-1 border-2 border-gray-600 text-gray-300 py-4 px-6 rounded-xl text-lg font-bold hover:border-gray-500 hover:text-gray-200 hover:bg-gray-700/20 transition-all duration-300 flex items-center justify-center space-x-3 transform hover:scale-105"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span>Browse All Cars</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                More {product.category} Vehicles
              </h2>
              <p className="text-xl text-yellow-200">
                Explore other vehicles in the same category
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => {
                const mainImage = (relatedProduct.images && relatedProduct.images.length > 0) 
                  ? relatedProduct.images[0] 
                  : (relatedProduct.imageUrls && relatedProduct.imageUrls.length > 0) 
                    ? relatedProduct.imageUrls[0] 
                    : null;
                
                return (
                  <div key={relatedProduct.id} className="group bg-gray-900/80 backdrop-blur-sm rounded-3xl border border-gray-700 hover:border-gray-600 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-black/50">
                    {/* Product Image */}
                    <div className="relative w-full h-48 overflow-hidden rounded-t-3xl">
                      {mainImage ? (
                        <img
                          src={mainImage}
                          alt={`${relatedProduct.brand} ${relatedProduct.modelName || ''} ${relatedProduct.category}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={handleImageError}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                          <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      
                      {/* Brand Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          {relatedProduct.brand}
                        </span>
                      </div>
                      
                      {/* Year Badge */}
                      <div className="absolute top-3 right-3">
                        <span className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-semibold">
                          {relatedProduct.yearOfManufacture}
                        </span>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="p-4">
                      <div className="mb-4">
                        {relatedProduct.modelName && (
                          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-gray-200 transition-colors duration-300">
                            {relatedProduct.modelName}
                          </h3>
                        )}
                        
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className="text-gray-300 text-sm font-medium">
                              {relatedProduct.kilometersDriven.toLocaleString()} km
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleWhatsAppInquiry(relatedProduct)}
                          className="flex-1 bg-gradient-to-r from-gray-700 to-gray-800 text-white py-2 px-3 rounded-lg text-sm font-bold hover:from-gray-600 hover:to-gray-700 transition-all duration-300 flex items-center justify-center space-x-1 shadow-lg hover:shadow-xl hover:shadow-black/25 transform hover:scale-105"
                        >
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                          </svg>
                          <span>Price</span>
                        </button>
                        
                        <Link
                          href={`/product/${relatedProduct.id}`}
                          className="flex-1 border-2 border-gray-600 text-gray-300 py-2 px-3 rounded-lg text-sm font-bold hover:border-gray-500 hover:text-gray-200 hover:bg-gray-700/20 transition-all duration-300 flex items-center justify-center space-x-1 transform hover:scale-105"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            
            {/* View All Products Button */}
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
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
} 