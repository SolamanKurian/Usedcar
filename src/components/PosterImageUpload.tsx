'use client';

import { useState, useRef, useEffect } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface PosterImageUploadProps {
  onImageChange: (file: File | null) => void;
  disabled?: boolean;
  existingImage?: string;
  onRemoveExisting?: () => void;
  label: string;
  aspectRatio?: number; // width/height ratio, e.g., 16/9 = 1.78
}

export default function PosterImageUpload({
  onImageChange,
  disabled = false,
  existingImage,
  onRemoveExisting,
  label,
  aspectRatio = 16/9 // Default to 16:9 aspect ratio for posters
}: PosterImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 80,
    height: 80 / aspectRatio,
    x: 10,
    y: 10
  });
  const [showCrop, setShowCrop] = useState(false);
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to handle image loading errors (simplified like product pages)
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Image failed to load:', e.currentTarget.src);
    setImageLoadError(true);
  };

  // Initialize preview URL with existing image if provided
  useEffect(() => {
    if (existingImage) {
      setPreviewUrl(existingImage);
      setImageLoadError(false);
      setImageLoading(true);
      
      // Add a timeout fallback in case onLoad doesn't fire
      const timeoutId = setTimeout(() => {
        setImageLoading(false);
      }, 3000); // 3 second timeout
      
      return () => clearTimeout(timeoutId);
    } else {
      // Clear preview URL if no existing image
      setPreviewUrl(null);
      setImageLoadError(false);
      setImageLoading(false);
    }
  }, [existingImage]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setShowCrop(true);
    }
  };

  const handleCropComplete = async () => {
    if (!imageRef || !selectedFile) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scaleX = imageRef.naturalWidth / imageRef.width;
    const scaleY = imageRef.naturalHeight / imageRef.height;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    ctx.drawImage(
      imageRef,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );

    canvas.toBlob((blob) => {
      if (blob) {
        const croppedFile = new File([blob], selectedFile.name, {
          type: selectedFile.type,
        });
        
        // Create preview URL for the cropped image
        const croppedPreviewUrl = URL.createObjectURL(blob);
        setPreviewUrl(croppedPreviewUrl);
        
        onImageChange(croppedFile);
        setShowCrop(false);
        setSelectedFile(null);
      }
    }, selectedFile.type);
  };

  const handleCancelCrop = () => {
    setShowCrop(false);
    setSelectedFile(null);
    
    // If we had an existing image, restore it
    if (existingImage) {
      setPreviewUrl(existingImage);
    } else {
      // If no existing image, clear the preview and revoke the URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    }
  };

  const handleRemoveImage = () => {
    // Revoke the current preview URL if it's not an existing image
    if (previewUrl && previewUrl !== existingImage) {
      URL.revokeObjectURL(previewUrl);
    }
    
    setPreviewUrl(null);
    setSelectedFile(null);
    onImageChange(null);
    
    if (onRemoveExisting) {
      onRemoveExisting();
    }
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {previewUrl ? (
        <div className="relative group">
          <div className="w-full max-w-md rounded-xl overflow-hidden border-2 border-gray-300 bg-gray-100 shadow-md relative" style={{ aspectRatio: aspectRatio }}>
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-xs text-gray-500">Loading...</div>
              </div>
            )}
            {imageLoadError && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-50">
                <div className="text-xs text-red-500">Error loading image</div>
              </div>
            )}
                         <img
               src={previewUrl}
               alt="Poster preview"
               style={{ 
                 width: '100%',
                 height: '100%',
                 objectFit: 'cover',
                 display: 'block'
               }}
               onLoad={() => {
                 setImageLoading(false);
                 setImageLoadError(false);
               }}
               onError={handleImageError}
             />
            <div className="absolute inset-0 bg-transparent group-hover:bg-black group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center" style={{ zIndex: 2 }}>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center space-y-2">
                <button
                  type="button"
                  onClick={openFileDialog}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                  disabled={disabled}
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  disabled={disabled}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors flex items-center justify-center ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'
          }`}
          style={{ aspectRatio: aspectRatio, minHeight: '200px' }}
          onClick={!disabled ? openFileDialog : undefined}
        >
          <div>
            <svg
              className="mx-auto h-8 w-8 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-xs text-gray-500 mt-1">Click to upload poster image</p>
            <p className="text-xs text-gray-400 mt-1">Aspect ratio: {aspectRatio.toFixed(2)}:1</p>
          </div>
        </div>
      )}

      {showCrop && selectedFile && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-[95vw] h-[95vh] max-w-5xl max-h-[700px] flex flex-col shadow-2xl border-2 border-gray-300 relative">
            <div className="p-4 border-b flex-shrink-0 bg-white">
              <h3 className="text-lg font-medium text-gray-900">Crop Poster Image</h3>
              <p className="text-sm text-gray-500">Crop your image to fit the poster aspect ratio ({aspectRatio.toFixed(2)}:1)</p>
            </div>
            <div className="flex-1 flex justify-center items-center min-h-0 p-4 overflow-hidden">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                aspect={aspectRatio}
                circularCrop={false}
                keepSelection={true}
              >
                <img
                  ref={setImageRef}
                  src={previewUrl || ''}
                  alt="Crop preview"
                  className="max-w-full max-h-full object-contain"
                />
              </ReactCrop>
            </div>
            <div className="p-4 border-t bg-gray-50 flex-shrink-0 relative z-10">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Drag to resize • Maintains {aspectRatio.toFixed(2)}:1 aspect ratio
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={handleCancelCrop}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCropComplete}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded border border-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Apply Crop
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 