'use client';

import { useState, useRef } from 'react';
import { ImagePlus, X } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  onChange: (file: File | null) => void;
  value?: File | null;
}

export const ImageUpload = ({ onChange }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        onChange(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please upload an image file');
        e.target.value = '';
      }
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
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-[1]"
      />
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