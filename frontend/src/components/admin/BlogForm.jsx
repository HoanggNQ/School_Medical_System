import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import RichTextEditor from '@/components/ui/RichTextEditor';
import BlogService from '../../api/services/blog.service';

const BlogForm = ({ isEdit = false, formData, handleInputChange, onCancel, onSubmit, existingImageUrl = null }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(existingImageUrl);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setImagePreview(existingImageUrl);
  }, [existingImageUrl]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await BlogService.getAllCategories();
      setCategories(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create FormData for multipart/form-data
    const formDataToSend = new FormData();
    
    // Add content object as JSON string
    const contentObject = {
      title: formData.title,
      bodyContent: formData.bodyContent,
      contentCategoryId: formData.contentCategoryId
    };
    
    formDataToSend.append('content', JSON.stringify(contentObject));
    
    // Add image if selected
    if (selectedImage) {
      formDataToSend.append('image', selectedImage);
    }
    
    // Call the parent onSubmit with FormData
    onSubmit(formDataToSend);
  };

  return (
    <div className="overflow-y-auto max-h-[70vh] p-2">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Tiêu đề bài viết *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Nhập tiêu đề bài viết"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contentCategoryId">Danh mục *</Label>
          <Select 
            value={formData.contentCategoryId?.toString()} 
            onValueChange={(value) => handleInputChange('contentCategoryId', parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.contentcategoryName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bodyContent">Nội dung bài viết *</Label>
          <RichTextEditor
            value={formData.bodyContent}
            onChange={(value) => handleInputChange('bodyContent', value)}
            placeholder="Nhập nội dung bài viết..."
            height="400px"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Hình ảnh (tùy chọn)</Label>
          <div className="space-y-2">
            {/* Show existing image if editing */}
            {isEdit && existingImageUrl && !selectedImage && (
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Ảnh hiện tại:</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={removeImage}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="relative">
                  <img
                    src={existingImageUrl}
                    alt="Current blog image"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Ảnh hiện tại của bài viết
                </div>
              </Card>
            )}

            {/* Image upload area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label htmlFor="image" className="cursor-pointer">
                {!imagePreview ? (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 mx-auto text-gray-400" />
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-blue-600 hover:text-blue-500">
                        Click để chọn ảnh
                      </span>{' '}
                      hoặc kéo thả vào đây
                    </div>
                    <div className="text-xs text-gray-500">
                      PNG, JPG, GIF tối đa 10MB
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <ImageIcon className="w-8 h-8 mx-auto text-green-500" />
                    <div className="text-sm text-gray-600">
                      {isEdit && existingImageUrl && !selectedImage ? 'Ảnh mới đã được chọn' : 'Ảnh đã được chọn'}
                    </div>
                  </div>
                )}
              </label>
            </div>

            {/* Image preview for new selected image */}
            {imagePreview && selectedImage && (
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Xem trước ảnh mới:</span>
                </div>
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {selectedImage?.name} ({(selectedImage?.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              </Card>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            variant="outline"
            onClick={onCancel}
            type="button"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            className="btn-primary"
            disabled={loading}
            type="submit"
          >
            {isEdit ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlogForm; 