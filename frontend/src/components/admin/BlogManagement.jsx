import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Eye, Filter, FileText, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import BlogService from '../../api/services/blog.service';
import BlogForm from './BlogForm';

const BlogManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    bodyContent: '',
    contentCategoryId: null
  });

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sort, setSort] = useState('id.asc');

  useEffect(() => {
    fetchBlogs(currentPage);
  }, [currentPage, searchTerm, sort,totalElements]);

  const fetchBlogs = async (page = 0) => {
    try {
      setLoading(true);
      const response = await BlogService.getAllBlogs({ page, sort, search: searchTerm });
      const blogData = response.data || {};
      setBlogs(blogData.contents || []);
      setTotalPages(blogData.totalPages || 0);
      setTotalElements(blogData.totalElements || 0);
      setCurrentPage(blogData.currentPage || 0);
      setError(null);
      console.log("blogs", response);
    } catch (err) {
      setError('Failed to fetch blogs. Please try again later.');
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateBlog = async (formDataToSend) => {
    if (!formData.title || formData.title.trim() === '') {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tiêu đề bài viết.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.bodyContent || formData.bodyContent.trim() === '') {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập nội dung bài viết.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.contentCategoryId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn danh mục.",
        variant: "destructive"
      });
      return;
    }

    setLoadingCreate(true);

    try {
      // Use createWithImage API if FormData is provided, otherwise use regular create
      const response = formDataToSend instanceof FormData 
        ? await BlogService.createBlogWithImage(formDataToSend)
        : await BlogService.createBlog(formData);
      
      console.log(response);

      if (response.data?.message) {
        toast({
          title: "Thành công!",
          description: "Bài viết đã được tạo thành công.",
          className: "bg-green-500 text-white"
        });

        setIsCreateModalOpen(false);
        setFormData({
          title: '',
          bodyContent: '',
          contentCategoryId: null
        });
        fetchBlogs(); 
      } else {
        toast({
          title: "Lỗi!",
          description: response.data?.message || "Tạo bài viết thất bại. Vui lòng thử lại.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Lỗi!",
        description: error.response?.data?.message || error.message || "Tạo bài viết thất bại. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleEditBlog = async (formDataToSend) => {
    try {
      // Use updateWithImage API if FormData is provided, otherwise use regular update
      const response = formDataToSend instanceof FormData 
        ? await BlogService.updateBlogWithImage(selectedBlog.id, formDataToSend)
        : await BlogService.updateBlog(selectedBlog.id, formData);
      
      if (response.data) {
        setBlogs(blogs.map(blog =>
          blog.id === selectedBlog.id ? response.data.data : blog
        ));
        setIsEditModalOpen(false);
        setSelectedBlog(null);
        setFormData({ title: '', bodyContent: '', contentCategoryId: null });
        toast({
          title: "Thành công!",
          description: "Bài viết đã được cập nhật.",
          className: "bg-green-500 text-white"
        });
        fetchBlogs(); // Refresh the list
      }
    } catch (error) {
      toast({
        title: "Lỗi!",
        description: error.response?.data?.message || "Không thể cập nhật bài viết.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteBlog = async (blogId) => {
    try {
      const response = await BlogService.deleteBlog(blogId);
      console.log(response);
      if (response.data) {
        toast({
          title: "Thành công!",
          description: "Bài viết đã được xóa.",
          className: "bg-green-500 text-white"
        });
        fetchBlogs();
      }
    } catch (error) {
      toast({
        title: "Lỗi!",
        description: error.response?.data?.message || "Không thể xóa bài viết.",
        variant: "destructive"
      });
    }
  };

  const openEditModal = (blog) => {
    setSelectedBlog(blog);
    setFormData({
      title: blog.title,
      bodyContent: blog.bodyContent,
      contentCategoryId: blog.contentCategoryId
    });
    setIsEditModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý bài viết</h1>
          <p className="text-gray-600 mt-2">Quản lý tất cả bài viết trong hệ thống</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={(open) => setIsCreateModalOpen(open)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Tạo bài viết mới</DialogTitle>
              <DialogDescription>
                Điền thông tin chi tiết để tạo bài viết mới trong hệ thống.
              </DialogDescription>
            </DialogHeader>
            <BlogForm
              formData={formData}
              handleInputChange={handleInputChange}
              onCancel={() => setIsCreateModalOpen(false)}
              onSubmit={handleCreateBlog}
            />
          </DialogContent>
        </Dialog>
        <Button className="btn-primary" onClick={() => setIsCreateModalOpen(true)} disabled={loadingCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm bài viết
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>Danh sách bài viết ({totalElements} bài viết)</CardTitle>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm theo tiêu đề..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setSearchTerm(searchInput);
                      setCurrentPage(0);
                    }
                  }}
                  className="pl-10"
                />
              </div>
              <Select value={sort} onValueChange={(value) => { setSort(value); setCurrentPage(0); }}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="id.asc">Mặc định (ID)</SelectItem>
                  <SelectItem value="title.asc">Tiêu đề (A-Z)</SelectItem>
                  <SelectItem value="title.desc">Tiêu đề (Z-A)</SelectItem>
                  <SelectItem value="contentCategoryEntity.contentcategoryName.asc">Danh mục (A-Z)</SelectItem>
                  <SelectItem value="contentCategoryEntity.contentcategoryName.desc">Danh mục (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="5" className="text-center py-8 text-gray-500">
                    {searchTerm
                      ? 'Không tìm thấy bài viết nào phù hợp với từ khóa tìm kiếm'
                      : 'Không có bài viết nào'
                    }
                  </TableCell>
                </TableRow>
              ) : (
                blogs.map((blog) => (
                  <TableRow key={blog.id} className="cursor-pointer" onClick={() => { setSelectedDetail(blog); setIsDetailModalOpen(true); }}>
                    <TableCell className="font-medium">{blog.id || 'N/A'}</TableCell>
                    <TableCell className="max-w-xs truncate">{blog.title || 'N/A'}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {blog.contentCategoryName || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell>{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2" onClick={e => e.stopPropagation()}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(blog)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            
                              handleDeleteBlog(blog.id);
                            
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mt-4">
        <span>
          Trang {currentPage + 1} / {totalPages} ({totalElements} kết quả)
        </span>
        <div className="flex gap-2">
          <Button
            disabled={currentPage === 0}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          >
            Trang trước
          </Button>
          <Button
            disabled={currentPage + 1 >= totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
          >
            Trang sau
          </Button>
        </div>
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa bài viết</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin bài viết trong hệ thống.
            </DialogDescription>
          </DialogHeader>
          <BlogForm
            isEdit={true}
            formData={formData}
            handleInputChange={handleInputChange}
            onCancel={() => setIsEditModalOpen(false)}
            onSubmit={handleEditBlog}
            existingImageUrl={selectedBlog?.imageUrl}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết bài viết</DialogTitle>
          </DialogHeader>
          {selectedDetail && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold text-gray-700">ID:</span>
                  <div>{selectedDetail.id || 'N/A'}</div>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Danh mục:</span>
                  <div>{selectedDetail.contentCategoryName || 'N/A'}</div>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Ngày tạo:</span>
                  <div>{selectedDetail.createdAt ? new Date(selectedDetail.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</div>
                </div>
                {/* <div>
                  <span className="font-semibold text-gray-700">Ngày cập nhật:</span>
                  <div>{selectedDetail.updatedAt ? new Date(selectedDetail.updatedAt).toLocaleDateString('vi-VN') : 'N/A'}</div>
                </div> */}
              </div>
              
              <div>
                <span className="font-semibold text-gray-700">Tiêu đề:</span>
                <div className="text-lg font-medium mt-1">{selectedDetail.title || 'N/A'}</div>
              </div>
              
              <div>
                <span className="font-semibold text-gray-700">Nội dung:</span>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg whitespace-pre-wrap max-h-[1000px] overflow-y-auto">
                  {selectedDetail.bodyContent || 'N/A'}
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>Đóng</Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default BlogManagement; 