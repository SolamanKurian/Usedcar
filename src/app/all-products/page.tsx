'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
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

export default function AllProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYearFrom, setSelectedYearFrom] = useState('');
  const [selectedYearTo, setSelectedYearTo] = useState('');
  const [selectedFuel, setSelectedFuel] = useState('');
  const [selectedTransmission, setSelectedTransmission] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  // Available filter options
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [fuels, setFuels] = useState<string[]>([]);
  const [transmissions, setTransmissions] = useState<string[]>([]);
  
  // Mobile filter popup state
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

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

  // Share a product link
  const handleShareProduct = async (product: Product) => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const shareUrl = `${origin}/product/${product.id}`;
      const title = `${product.brand} ${product.modelName ?? ''}`.trim();
      const text = `Check out this ${product.category} (${product.yearOfManufacture}) on PreCar`;
      const nav: any = typeof navigator !== 'undefined' ? (navigator as any) : null;
      if (nav && typeof nav.share === 'function') {
        await nav.share({ title, text, url: shareUrl });
      } else if (nav && nav.clipboard && typeof nav.clipboard.writeText === 'function') {
        await nav.clipboard.writeText(shareUrl);
      }
    } catch (e) {
      // no-op on cancel
    }
  };

  // Filter and sort products
  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Search by model name
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.modelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by brand
    if (selectedBrand) {
      filtered = filtered.filter(product => product.brand === selectedBrand);
    }

    // Filter by model
    if (selectedModel) {
      filtered = filtered.filter(product => product.modelName === selectedModel);
    }

    // Filter by year range
    if (selectedYearFrom) {
      filtered = filtered.filter(product => product.yearOfManufacture >= parseInt(selectedYearFrom));
    }
    if (selectedYearTo) {
      filtered = filtered.filter(product => product.yearOfManufacture <= parseInt(selectedYearTo));
    }

    // Filter by fuel
    if (selectedFuel) {
      filtered = filtered.filter(product => product.fuel === selectedFuel);
    }

    // Filter by transmission
    if (selectedTransmission) {
      filtered = filtered.filter(product => product.transmission === selectedTransmission);
    }

    // Sort products - First by availability (available first, sold last), then by selected criteria
    filtered.sort((a, b) => {
      // First priority: available products come before sold products
      if (a.isSold !== b.isSold) {
        return a.isSold ? 1 : -1; // Available products (-1) come before sold products (1)
      }
      
      // Second priority: apply the selected sort criteria
      switch (sortBy) {
        case 'newest':
          return b.yearOfManufacture - a.yearOfManufacture;
        case 'oldest':
          return a.yearOfManufacture - b.yearOfManufacture;
        case 'lowest-km':
          return a.kilometersDriven - b.kilometersDriven;
        case 'highest-km':
          return b.kilometersDriven - a.kilometersDriven;
        default:
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });

    setFilteredProducts(filtered);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedBrand('');
    setSelectedModel('');
    setSelectedYearFrom('');
    setSelectedYearTo('');
    setSelectedFuel('');
    setSelectedTransmission('');
    setSortBy('newest');
    setCurrentPage(1); // Reset to first page when clearing filters
  };

  // Apply filters when any filter changes
  useEffect(() => {
    filterAndSortProducts();
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedCategory, selectedBrand, selectedModel, selectedYearFrom, selectedYearTo, selectedFuel, selectedTransmission, sortBy, products]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Pagination functions
  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
      
      // Sort by creation date (newest first) - include all products (available and sold)
      const allProducts = productsData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      setProducts(allProducts);
      setFilteredProducts(allProducts);
      
      // Extract unique filter options from all products
      const uniqueCategories = [...new Set(allProducts.map(p => p.category))].sort();
      const uniqueBrands = [...new Set(allProducts.map(p => p.brand))].sort();
      const uniqueModels = [...new Set(allProducts.map(p => p.modelName).filter((model): model is string => Boolean(model)))].sort();
      const uniqueYears = [...new Set(allProducts.map(p => p.yearOfManufacture))].sort((a, b) => b - a);
      const uniqueFuels = [...new Set(allProducts.map(p => p.fuel).filter((fuel): fuel is string => Boolean(fuel)))].sort();
      const uniqueTransmissions = [...new Set(allProducts.map(p => p.transmission).filter((transmission): transmission is string => Boolean(transmission)))].sort();
      
      setCategories(uniqueCategories);
      setBrands(uniqueBrands);
      setModels(uniqueModels);
      setYears(uniqueYears);
      setFuels(uniqueFuels);
      setTransmissions(uniqueTransmissions);
      
      // Try to fetch fuel types and transmissions from backend collections (admin-only)
      // If permission denied, we'll use the extracted options from products
      try {
        await fetchFuelTypes();
      } catch (error) {
        console.log('Using fuel types from products data (admin collections not accessible)');
      }
      
      try {
        await fetchTransmissions();
      } catch (error) {
        console.log('Using transmissions from products data (admin collections not accessible)');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFuelTypes = async () => {
    try {
      const fuelTypesCollection = collection(db!, 'fuel-types');
      const fuelTypesSnapshot = await getDocs(fuelTypesCollection);
      const fuelTypesData = fuelTypesSnapshot.docs.map(doc => doc.data().name);
      // Only update if we successfully got data and it's not empty
      if (fuelTypesData.length > 0) {
        setFuels(fuelTypesData);
      }
    } catch (error) {
      console.log('Fuel types from admin collection not accessible, using product data');
      // Don't update fuels state - keep the ones extracted from products
    }
  };

  const fetchTransmissions = async () => {
    try {
      const transmissionsCollection = collection(db!, 'transmissions');
      const transmissionsSnapshot = await getDocs(transmissionsCollection);
      const transmissionsData = transmissionsSnapshot.docs.map(doc => doc.data().name);
      // Only update if we successfully got data and it's not empty
      if (transmissionsData.length > 0) {
        setTransmissions(transmissionsData);
      }
    } catch (error) {
      console.log('Transmissions from admin collection not accessible, using product data');
      // Don't update transmissions state - keep the ones extracted from products
    }
  };

  if (loading) {
    return (
      <div className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              All Available Vehicles
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Browse our complete selection of quality used cars and machinery
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 animate-pulse">
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
            All Available Vehicles
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            No vehicles available at the moment. Please check back later.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-700 text-white text-lg font-bold rounded-xl hover:bg-gray-600 transition-all duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
             {/* Hero Section with Background Image */}
       <div className="relative overflow-hidden">
         {/* Background Image */}
         <div 
           className="absolute inset-0 bg-cover bg-center bg-no-repeat"
           style={{
             backgroundImage: 'url(/avail1.jpg)'
           }}
         ></div>
         {/* Dark Overlay */}
         <div className="absolute inset-0 bg-black/60"></div>
         {/* Gradient Overlay */}
         <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/20 via-orange-600/20 to-red-600/20"></div>
          
                   <div className="relative z-10 py-6 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Header */}
              <div className="text-center mb-4">
                <div className="flex items-center justify-center mb-6">
                  <h2 className="text-3xl md:text-4xl font-bold text-white">
                    All Available Vehicles
                  </h2>
                </div>
                <p className="text-base md:text-lg text-gray-200 max-w-3xl mx-auto">
                  Browse our complete selection of quality used cars and machinery
                </p>
                <p className="text-sm md:text-base text-gray-300 mt-2">
                  Showing {filteredProducts.length > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} available vehicles
                  {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
                </p>
              </div>

              {/* Filters moved to left sidebar in main content */}
            </div>
          </div>
          
          {/* Fade to background color */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent"></div>
        </div>

       <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Sidebar - Desktop */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-24 bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Search</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by model, brand, or category..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-3 pl-12 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                    />
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                {/* Filters */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Category</label>
                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200">
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Brand</label>
                    <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200">
                      <option value="">All Brands</option>
                      {brands.map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Model</label>
                    <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200">
                      <option value="">All Models</option>
                      {models.map(model => (
                        <option key={model} value={model}>{model}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Year From</label>
                      <select value={selectedYearFrom} onChange={(e) => setSelectedYearFrom(e.target.value)} className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200">
                        <option value="">Any</option>
                        {years.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Year To</label>
                      <select value={selectedYearTo} onChange={(e) => setSelectedYearTo(e.target.value)} className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200">
                        <option value="">Any</option>
                        {years.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Fuel</label>
                    <select value={selectedFuel} onChange={(e) => setSelectedFuel(e.target.value)} className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200">
                      <option value="">All Fuels</option>
                      {fuels.map(fuel => (
                        <option key={fuel} value={fuel}>{fuel}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Transmission</label>
                    <select value={selectedTransmission} onChange={(e) => setSelectedTransmission(e.target.value)} className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200">
                      <option value="">All Transmissions</option>
                      {transmissions.map(transmission => (
                        <option key={transmission} value={transmission}>{transmission}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Sort By</label>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200">
                      <option value="newest">Newest Year</option>
                      <option value="oldest">Oldest Year</option>
                      <option value="lowest-km">Lowest KM</option>
                      <option value="highest-km">Highest KM</option>
                    </select>
                  </div>
                </div>
                {(searchTerm || selectedCategory || selectedBrand || selectedModel || selectedYearFrom || selectedYearTo || selectedFuel || selectedTransmission) && (
                  <div className="pt-2">
                    <button onClick={clearFilters} className="w-full inline-flex items-center justify-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-500 transition-colors duration-200">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            </aside>

            {/* Main Content */}
            <section className="lg:col-span-9">
              {/* Mobile Controls: Filters + Sort */}
              <div className="lg:hidden mb-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="col-span-1 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-xl p-3 flex items-center justify-center shadow-lg hover:shadow-xl transition-transform duration-200 active:scale-95"
                >
                  <svg className="w-5 h-5 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M6 12h12M10 20h4" />
                  </svg>
                  <span className="font-semibold">Filters</span>
                </button>
                <div className="col-span-1">
                  <div className="relative">
                    <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16h10M7 8h10M10 4l-3 4 3 4M14 12l3 4-3 4" />
                    </svg>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none w-full pl-10 pr-9 py-3 bg-gray-800/80 border border-gray-700 rounded-xl text-white shadow-inner focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="newest">Newest Year</option>
                      <option value="oldest">Oldest Year</option>
                      <option value="lowest-km">Lowest KM</option>
                      <option value="highest-km">Highest KM</option>
                    </select>
                    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Mobile Filter Drawer */}
              {showMobileFilters && (
                <div className="lg:hidden fixed inset-0 z-50">
                  <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)}></div>
                  <div className="absolute inset-y-0 left-0 w-5/6 max-w-sm bg-gray-900 border-r border-gray-700 shadow-xl flex flex-col">
                    <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 flex items-center justify-between">
                      <h3 className="text-lg font-bold text-white">Filters</h3>
                      <button onClick={() => setShowMobileFilters(false)} className="p-2 text-gray-400 hover:text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="p-4 space-y-4 overflow-y-auto">
                      {/* Search */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Search</label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search by model, brand, or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-3 pl-12 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                          />
                          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                      </div>
                      {/* Category */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Category</label>
                        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200">
                          <option value="">All Categories</option>
                          {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>
                      {/* Brand */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Brand</label>
                        <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200">
                          <option value="">All Brands</option>
                          {brands.map(brand => (
                            <option key={brand} value={brand}>{brand}</option>
                          ))}
                        </select>
                      </div>
                      {/* Model */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Model</label>
                        <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200">
                          <option value="">All Models</option>
                          {models.map(model => (
                            <option key={model} value={model}>{model}</option>
                          ))}
                        </select>
                      </div>
                      {/* Year From/To */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">Year From</label>
                          <select value={selectedYearFrom} onChange={(e) => setSelectedYearFrom(e.target.value)} className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200">
                            <option value="">Any</option>
                            {years.map(year => (
                              <option key={year} value={year}>{year}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">Year To</label>
                          <select value={selectedYearTo} onChange={(e) => setSelectedYearTo(e.target.value)} className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200">
                            <option value="">Any</option>
                            {years.map(year => (
                              <option key={year} value={year}>{year}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      {/* Fuel */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Fuel</label>
                        <select value={selectedFuel} onChange={(e) => setSelectedFuel(e.target.value)} className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200">
                          <option value="">All Fuels</option>
                          {fuels.map(fuel => (
                            <option key={fuel} value={fuel}>{fuel}</option>
                          ))}
                        </select>
                      </div>
                      {/* Transmission */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Transmission</label>
                        <select value={selectedTransmission} onChange={(e) => setSelectedTransmission(e.target.value)} className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200">
                          <option value="">All Transmissions</option>
                          {transmissions.map(transmission => (
                            <option key={transmission} value={transmission}>{transmission}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="p-4 border-t border-gray-700 grid grid-cols-2 gap-3">
                      <button
                        onClick={() => {
                          clearFilters();
                          setShowMobileFilters(false);
                        }}
                        className="px-4 py-3 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-500 transition-colors duration-200"
                      >
                        Clear All
                      </button>
                      <button
                        onClick={() => setShowMobileFilters(false)}
                        className="px-4 py-3 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition-colors duration-200"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Products Grid */}
              {currentProducts.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No vehicles found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search criteria or filters</p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProducts.map((product) => {
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
                  
                  {/* Sold Badge */}
                  {product.isSold && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-red-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        SOLD
                      </span>
                    </div>
                  )}
                  
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
                        {product.isSold ? (
                          <>
                            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span className="text-red-400 text-sm font-medium">
                              Sold
                            </span>
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-green-400 text-sm font-medium">
                              Available
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    {/* Inline Share below availability */}
                    <div className="flex justify-end -mt-2 mb-2">
                      {!product.isSold && (
                        <button
                          onClick={() => handleShareProduct(product)}
                          className="p-2 rounded-lg border border-gray-600 text-gray-300 hover:border-gray-500 hover:text-gray-200 hover:bg-gray-700/20 transition-colors duration-200"
                          aria-label="Share product"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle cx="6" cy="12" r="2" strokeWidth={2} />
                            <circle cx="18" cy="6" r="2" strokeWidth={2} />
                            <circle cx="18" cy="18" r="2" strokeWidth={2} />
                            <path d="M8 12l8-6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M8 12l8 6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      )}
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
                    {product.isSold ? (
                      <>
                        <button
                          disabled
                          className="flex-1 bg-gray-600/50 text-gray-400 py-3 px-4 rounded-xl text-sm font-bold cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                          </svg>
                          <span>Sold</span>
                        </button>
                        
                        <Link
                          href={`/product/${product.id}`}
                          className="flex-1 border-2 border-gray-600 text-gray-300 py-3 px-4 rounded-xl text-sm font-bold hover:border-gray-500 hover:text-gray-200 hover:bg-gray-700/20 transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>View Details</span>
                        </Link>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleWhatsAppInquiry(product)}
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
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
                     </div>
         )}

         {/* Pagination Controls */}
         {totalPages > 1 && (
          <div className="mt-12 flex flex-col items-center">
            {/* Page Info */}
            <div className="text-center mb-6">
              <p className="text-gray-400 text-sm">
                Page {currentPage} of {totalPages} • {filteredProducts.length} vehicles total
              </p>
            </div>

            {/* Pagination Buttons */}
            <div className="flex items-center space-x-2">
              {/* Previous Button */}
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  currentPage === 1
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-700 text-white hover:bg-gray-600 hover:scale-105'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Previous</span>
              </button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {/* First Page */}
                {currentPage > 3 && (
                  <>
                    <button
                      onClick={() => goToPage(1)}
                      className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-700 text-white hover:bg-gray-600 transition-all duration-200"
                    >
                      1
                    </button>
                    {currentPage > 4 && (
                      <span className="px-2 text-gray-500">...</span>
                    )}
                  </>
                )}

                {/* Page Numbers Around Current */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  if (pageNum > 0 && pageNum <= totalPages) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          pageNum === currentPage
                            ? 'bg-yellow-600 text-white scale-105'
                            : 'bg-gray-700 text-white hover:bg-gray-600'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  return null;
                })}

                {/* Last Page */}
                {currentPage < totalPages - 2 && (
                  <>
                    {currentPage < totalPages - 3 && (
                      <span className="px-2 text-gray-500">...</span>
                    )}
                    <button
                      onClick={() => goToPage(totalPages)}
                      className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-700 text-white hover:bg-gray-600 transition-all duration-200"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              {/* Next Button */}
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  currentPage === totalPages
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-700 text-white hover:bg-gray-600 hover:scale-105'
                }`}
              >
                <span>Next</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Quick Navigation */}
            <div className="mt-4 flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Go to:</span>
              <select
                value={currentPage}
                onChange={(e) => goToPage(parseInt(e.target.value))}
                className="px-3 py-1 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                {Array.from({ length: totalPages }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Page {i + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 