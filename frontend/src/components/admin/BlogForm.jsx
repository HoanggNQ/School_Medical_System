import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import BlogService from '../../api/services/blog.service';

const BlogForm = ({ isEdit = false, formData, handleInputChange, onCancel, onSubmit }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

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

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Tiêu đề bài viết</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Nhập tiêu đề bài viết"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contentCategoryId">Danh mục</Label>
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
        <Label htmlFor="bodyContent">Nội dung bài viết</Label>
        <Textarea
          id="bodyContent"
          value={formData.bodyContent}
          onChange={(e) => handleInputChange('bodyContent', e.target.value)}
          placeholder="Nhập nội dung bài viết"
          rows={10}
          className="min-h-[200px]"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          variant="outline"
          onClick={onCancel}
        >
          Hủy
        </Button>
        <Button
          onClick={onSubmit}
          className="btn-primary"
          disabled={loading}
        >
          {isEdit ? 'Cập nhật' : 'Tạo mới'}
        </Button>
      </div>
    </div>
  );
};

export default BlogForm; 