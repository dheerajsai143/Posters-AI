
import React, { useRef, useState } from 'react';

interface ImageUploadProps {
  label: string;
  required?: boolean;
  onImageSelected: (base64: string | undefined) => void;
  previewUrl?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ label, required, onImageSelected, previewUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      setPreviewError(false);
      
      // Reset input value to allow re-selecting the same file if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Create image object to handle resizing
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      
      img.onload = () => {
        // Dimensions
        const maxDimension = 1536; // Ideal max size for Flash Image model
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio preserving resize
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        // Draw to canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          // Fill white background to handle transparent PNGs gracefully
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, width, height);

          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to jpeg base64 with 0.9 quality
          const dataUrl = canvas.toDataURL('image/jpeg', 0.90);
          onImageSelected(dataUrl);
        } else {
            // Fallback if canvas fails
            const reader = new FileReader();
            reader.onloadend = () => {
                onImageSelected(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
        
        // Clean up and stop loading
        URL.revokeObjectURL(objectUrl);
        setIsProcessing(false);
      };

      img.onerror = () => {
          console.warn("Browser could not render image, falling back to raw file.");
          // If the browser can't render it (e.g. TIFF/HEIC), we just pass the file data
          // The API might still accept it, but preview will fail (handled by onError on img tag)
          const reader = new FileReader();
          reader.onloadend = () => {
             onImageSelected(reader.result as string);
             setIsProcessing(false);
          };
          reader.readAsDataURL(file);
          URL.revokeObjectURL(objectUrl);
      };

      img.src = objectUrl;
    }
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageSelected(undefined);
    setPreviewError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`
          relative h-48 w-full border-2 border-dashed rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-300 group
          ${isHovering 
            ? 'border-indigo-500 bg-indigo-500/10' 
            : 'border-zinc-700 bg-zinc-800/20 hover:border-zinc-600 hover:bg-zinc-800/40'
          }
          ${previewUrl && !previewError ? 'border-solid border-zinc-700' : ''}
        `}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {isProcessing ? (
          <div className="flex flex-col items-center justify-center text-indigo-400">
             <i className="fas fa-circle-notch fa-spin text-2xl mb-2"></i>
             <span className="text-xs font-bold animate-pulse">Processing Image...</span>
          </div>
        ) : previewUrl ? (
          <>
            {previewError ? (
               <div className="flex flex-col items-center text-zinc-400 p-4 text-center">
                  <i className="fas fa-file-image text-3xl mb-2 text-indigo-500"></i>
                  <span className="text-sm font-bold text-white">Image Uploaded</span>
                  <span className="text-xs mt-1">Preview not available for this format, but AI will still process it.</span>
               </div>
            ) : (
               <img 
                 src={previewUrl} 
                 alt="Preview" 
                 className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                 onError={() => setPreviewError(true)}
               />
            )}
            
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <span className="text-white text-sm font-medium"><i className="fas fa-pen mr-2"></i>Change Image</span>
            </div>
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 bg-zinc-900/80 hover:bg-red-500 text-white rounded-full p-2 w-8 h-8 flex items-center justify-center backdrop-blur-md transition-all shadow-lg border border-white/10 z-10"
              title="Remove Image"
            >
              <i className="fas fa-times text-xs"></i>
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center text-zinc-500 group-hover:text-indigo-400 transition-colors">
            <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center mb-3 group-hover:bg-indigo-500/20 transition-colors">
                 <i className="fas fa-cloud-upload-alt text-xl"></i>
            </div>
            <span className="text-sm font-medium">Click to upload photo</span>
            <span className="text-xs opacity-60 mt-1">Supports JPG, PNG, WebP, etc.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
