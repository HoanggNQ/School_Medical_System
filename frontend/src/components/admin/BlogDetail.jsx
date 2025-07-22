import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag, Clock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import BlogService from '../../api/services/blog.service';

const BlogDetail = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlogDetail();
  }, [blogId]);

  const fetchBlogDetail = async () => {
    try {
      setLoading(true);
      const response = await BlogService.getBlogById(blogId);
      setBlog(response.data.data);
      console.log("response.data",response.data);
      setError(null);
    } catch (err) {
      setError('Không thể tải chi tiết bài viết. Vui lòng thử lại sau.');
      console.error('Error fetching blog detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    console.log('Back button clicked');
    navigate(-1);
  };

  const handleBackClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Back button clicked with event');
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <Button onClick={handleBack} className="bg-blue-600 hover:bg-blue-700 text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center max-w-md">
          <div className="text-gray-500 text-lg mb-4">Không tìm thấy bài viết</div>
          <Button onClick={handleBack} className="bg-blue-600 hover:bg-blue-700 text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Back button in top right corner */}
        <div className="mb-6 flex justify-end">
          <Button 
            onClick={handleBack} 
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>
        </div>

        {/* Blog content */}
        <Card className="shadow-lg border-0">
          {/* Blog header with image if available */}
          {blog.imageUrl && (
            <div className="w-full h-96 bg-gray-200 rounded-t-lg overflow-hidden">
              <img 
                src={blog.imageUrl} 
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            {/* Blog title */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                {blog.title}
              </h1>
            </div>
            
            {/* Author and date info */}
            <div className="flex items-center gap-6 text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="font-medium">{blog.authorName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(blog.createdAt).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{new Date(blog.createdAt).toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
            </div>

            {/* Category badge */}
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-blue-600" />
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {blog.contentCategoryName}
              </span>
            </div>

            {/* Author info with avatar */}
            <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
              <img
                src={blog.authorAvatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(blog.authorName || 'A')}&size=64&background=random`}
                alt={blog.authorName}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div>
                <div className="font-semibold text-gray-900">{blog.authorName}</div>
                <div className="text-sm text-gray-500">Tác giả bài viết</div>
              </div>
            </div>

            {/* Blog content */}
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-gray-800 leading-relaxed text-lg"
                dangerouslySetInnerHTML={{ __html: blog.bodyContent }}
              />
            </div>

            {/* Blog footer */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    Đăng bởi: {blog.authorName}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    Danh mục: {blog.contentCategoryName}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {new Date(blog.createdAt).toLocaleTimeString('vi-VN')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BlogDetail; 