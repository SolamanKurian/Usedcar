'use client';

import { useState, useRef, useEffect } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageUploadWithCropProps {
  onImageChange: (file: File | null) => void;
  disabled?: boolean;
  existingImage?: string;
  onRemoveExisting?: () => void;
  label: string;
  index: number;
}

export default function ImageUploadWithCrop({
  onImageChange,
  disabled = false,
  existingImage,
  onRemoveExisting,
  label,
  index
}: ImageUploadWithCropProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 80,
    height: 80,
    x: 10,
    y: 10
  });
  const [showCrop, setShowCrop] = useState(false);
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize preview URL with existing image if provided
  useEffect(() => {
    console.log('ImageUploadWithCrop useEffect - existingImage:', existingImage, 'index:', index);
    if (existingImage) {
      console.log('Setting preview URL to existing image:', existingImage);
      setPreviewUrl(existingImage);
      setImageLoadError(false);
      setImageLoading(true);
      
      // Add a timeout fallback in case onLoad doesn't fire
      const timeoutId = setTimeout(() => {
        console.log(`ImageUploadWithCrop ${index} - Timeout fallback, setting loading to false`);
        setImageLoading(false);
      }, 3000); // 3 second timeout
      
      return () => clearTimeout(timeoutId);
    } else {
      // Clear preview URL if no existing image
      setPreviewUrl(null);
      setImageLoadError(false);
      setImageLoading(false);
    }
  }, [existingImage, index]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log('File selected:', file);
    if (file && file.type.startsWith('image/')) {
      console.log('Valid image file selected:', file.name, file.type, file.size);
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      console.log('Created object URL:', url);
      setPreviewUrl(url);
      setShowCrop(true);
    } else {
      console.log('Invalid file or no file selected');
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
                       <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-gray-300 bg-gray-100 shadow-md relative" style={{ minHeight: '128px', minWidth: '128px' }}>
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
                   alt={`Product ${index + 1}`}
                   style={{ 
                     width: '100%',
                     height: '100%',
                     objectFit: 'cover',
                     display: 'block'
                   }}
                onLoad={() => {
                  console.log(`ImageUploadWithCrop ${index} - Image loaded successfully:`, previewUrl);
                  setImageLoading(false);
                  setImageLoadError(false);
                }}
                onError={(e) => {
                  console.error(`ImageUploadWithCrop ${index} - Image failed to load:`, previewUrl);
                  console.error('Error event:', e);
                  setImageLoading(false);
                  setImageLoadError(true);
                }}
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
          className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors h-32 flex items-center justify-center ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'
          }`}
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
            <p className="text-xs text-gray-500 mt-1">Click to upload</p>
          </div>
        </div>
      )}

      {showCrop && selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-[42.5vw] h-[42.5vh] flex flex-col shadow-2xl border-2 border-gray-300">
            <div className="p-1 border-b flex-shrink-0">
              <h3 className="text-xs font-medium text-gray-900">Crop Image</h3>
            </div>
            <div className="flex-1 flex justify-center items-center min-h-0">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                aspect={undefined}
                circularCrop={false}
              >
                <img
                  ref={setImageRef}
                  src={previewUrl || ''}
                  alt="Crop preview"
                  className="max-w-full max-h-full object-contain"
                  style={{ 
                    maxWidth: 'calc(42.5vw - 20px)',
                    maxHeight: 'calc(42.5vh - 80px)'
                  }}
                />
              </ReactCrop>
            </div>
            <div className="p-1 border-t bg-gray-50 flex-shrink-0">
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-600">
                  Drag to resize
                </div>
                <div className="flex space-x-1">
                  <button
                    type="button"
                    onClick={handleCancelCrop}
                    className="px-2 py-1 text-xs font-medium text-gray-700 bg-white rounded border border-gray-300 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCropComplete}
                    className="px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded border border-blue-600 hover:bg-blue-700"
                  >
                    Apply
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