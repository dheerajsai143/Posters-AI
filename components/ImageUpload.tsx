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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelected(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageSelected(undefined);
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
          relative h-40 w-full border-2 border-dashed rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-300 group
          ${isHovering 
            ? 'border-indigo-500 bg-indigo-500/10' 
            : 'border-zinc-700 bg-zinc-800/20 hover:border-zinc-600 hover:bg-zinc-800/40'
          }
          ${previewUrl ? 'border-solid border-zinc-700' : ''}
        `}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {previewUrl ? (
          <>
            <img src={previewUrl} alt="Preview" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm font-medium"><i className="fas fa-pen mr-2"></i>Change Image</span>
            </div>
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 bg-zinc-900/80 hover:bg-red-500 text-white rounded-full p-2 w-8 h-8 flex items-center justify-center backdrop-blur-md transition-all shadow-lg border border-white/10"
            >
              <i className="fas fa-times text-xs"></i>
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center text-zinc-500 group-hover:text-indigo-400 transition-colors">
            <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center mb-3 group-hover:bg-indigo-500/20 transition-colors">
                 <i className="fas fa-cloud-upload-alt text-xl"></i>
            </div>
            <span className="text-sm font-medium">Click to upload image</span>
            <span className="text-xs opacity-60 mt-1">or drag and drop</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;