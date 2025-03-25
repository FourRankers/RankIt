'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StarRating from '@/components/star-rating';
import { ImageUpload } from '@/components/image-upload';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';
import { Icons } from '@/components/icons';

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const categories = [
  { value: 'all', label: 'All' },
  { value: 'course', label: 'Course' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'building', label: 'Building' },
  { value: 'toilet', label: 'Toilet' },
  { value: 'other', label: 'Other' },
];

interface AddItemFormData {
  title: string;
  description: string;
  category: string;
  rating: number;
}

export const AddItemDialog = ({ open, onOpenChange, onSuccess }: AddItemDialogProps) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<AddItemFormData>({
    title: '',
    description: '',
    category: '',
    rating: 0
  });
  const [image, setImage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }));
  };

  const handleRatingChange = (value: number) => {
    setFormData(prev => ({
      ...prev,
      rating: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to create a post');
      window.location.href = '/auth/login';
      return;
    }

    if (!image) {
      toast.error('Please upload an image');
      return;
    }

    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/posts/create-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.uid}`,
          'userId': user.uid
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          authorId: user.uid,
          authorName:user.email,
          imageUrl: image,
          category: formData.category,
          authorRating: formData.rating,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create post');
      }

      toast.success('Post created successfully');
      onOpenChange(false);
      setFormData({
        title: '',
        description: '',
        category: '',
        rating: 0
      });
      setImage(null);
      
      if (onSuccess) {
        onSuccess();
      }

    } catch (error) {
      console.error('Error creating post:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter item name"
              disabled={isLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Image <span className="text-red-500">*</span>
            </label>
            <ImageUpload value={image} onChange={setImage} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Rating</label>
              <StarRating 
                rating={formData.rating} 
                onRatingChange={handleRatingChange}
                readonly={isLoading}
              />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe this item..."
              className="max-h-32 overflow-y-auto"
              rows={5}
              disabled={isLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              Category <span className="text-red-500">*</span>
            </label>
            <Select 
              value={formData.category}
              onValueChange={handleCategoryChange}
              disabled={isLoading}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                'Submit'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 