import React, { useEffect, useState } from 'react';
import BlogService from '../../api/services/blog.service';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search } from 'lucide-react';

const getShortContent = (content, maxLength = 120) => {
  if (!content) return '';
  if (content.length <= maxLength) return content;
  return content.slice(0, maxLength) + '...';
};

const randomReplies = () => Math.floor(Math.random() * 1000);
const randomViews = () => Math.floor(Math.random() * 10000);

const BlogListPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    fetchBlogs(currentPage);
  }, [currentPage, searchTerm]);

  const fetchBlogs = async (page = 0) => {
    setLoading(true);
    try {
      const response = await BlogService.getAllBlogs({ page, search: searchTerm });
      const blogData = response.data || {};
      setBlogs(blogData.contents || []);
      setTotalPages(blogData.totalPages || 0);
      setTotalElements(blogData.totalElements || 0);
      setCurrentPage(blogData.currentPage || 0);
    } catch (err) {
      setBlogs([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (blog) => {
    setSelectedBlog(blog);
    setIsDetailOpen(true);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Chào mừng bạn đến với bài viết </h1>
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Tìm kiếm theo tiêu đề..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                setSearchTerm(searchInput);
                setCurrentPage(0);
              }
            }}
            className="pl-10"
          />
        </div>
        <Button onClick={() => { setSearchTerm(searchInput); setCurrentPage(0); }}>Tìm kiếm</Button>
      </div>
      <div className="space-y-4">
        {blogs.map(blog => (
          <Card key={blog.id} className="flex items-center p-4 hover:bg-gray-50 transition cursor-pointer" onClick={() => handleCardClick(blog)}>
            <img
              src={blog.authorAvatarUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(blog.authorName || 'A')}
              alt={blog.authorName}
              className="w-14 h-14 rounded-full object-cover border mr-4"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-lg text-blue-700 truncate">{blog.title}</span>
                <span className="ml-2 px-2 py-0.5 rounded bg-gray-200 text-xs text-gray-700">{blog.contentCategoryName}</span>
              </div>
              <div className="text-gray-600 text-sm mb-1 truncate">{getShortContent(blog.bodyContent)}</div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{blog.authorName}</span>
                <span>•</span>
                <span>{new Date(blog.createdAt).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
            {/* <div className="flex flex-col items-end min-w-[80px] ml-4">
              <div className="text-xs text-gray-400">Replies:</div>
              <div className="font-bold text-lg text-gray-700">{randomReplies()}</div>
              <div className="text-xs text-gray-400">Views:</div>
              <div className="font-bold text-gray-700">{randomViews()}</div>
            </div> */}
          </Card>
        ))}
      </div>
      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <span>
          Trang {currentPage + 1} / {totalPages} ({totalElements} kết quả)
        </span>
        <div className="flex gap-2">
          <Button
            disabled={currentPage === 0}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
          >
            Trang trước
          </Button>
          <Button
            disabled={currentPage + 1 >= totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
          >
            Trang sau
          </Button>
        </div>
      </div>
      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            {selectedBlog && (
              <div className="flex items-center gap-4">
                <img
                  src={selectedBlog.authorAvatarUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(selectedBlog.authorName || 'A')}
                  alt={selectedBlog.authorName}
                  className="w-16 h-16 rounded-full object-cover border"
                />
                <div>
                  <div className="font-semibold text-lg">{selectedBlog.authorName}</div>
                  <div className="text-xs text-gray-500">{selectedBlog.contentCategoryName}</div>
                  <div className="text-xs text-gray-500">{new Date(selectedBlog.createdAt).toLocaleString('vi-VN')}</div>
                </div>
              </div>
            )}
          </DialogHeader>
          {selectedBlog && (
            <div className="space-y-4">
              <div className="font-bold text-2xl mb-2">{selectedBlog.title}</div>
              <div className="prose max-w-none text-gray-800 whitespace-pre-line">
                {selectedBlog.bodyContent}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogListPage; 