'use client';

import { useState, useRef } from 'react';
import { ImagePlus, X } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  onChange: (url: string | null) => void;
  value?: string | null;
}

export const ImageUpload = ({ onChange }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Only image files are supported');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('http://localhost:8080/api/posts/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload Failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(result);
      onChange(result.publicUrl);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image upload failed');
      setPreview(null);
      onChange(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPreview(null);
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="relative w-1/2 aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-[1] disabled:cursor-not-allowed"
        aria-label="Image upload"
      />
      
      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-lg">
          <span className="animate-pulse">Uploading...</span>
        </div>
      )}

      {error && (
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-red-100 text-red-600 text-sm text-center">
          {error}
        </div>
      )}

      {preview ? (
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-[2]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <ImagePlus className="h-8 w-8" />
          <span className="text-sm font-medium">Upload Image</span>
          <span className="text-xs">Click or drag and drop</span>
        </div>
      )}
    </div>
  );
}; 