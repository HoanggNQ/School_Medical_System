import { useState, useEffect, useCallback } from 'react';
import UserService from '../api/services/user.service';

export const useUsersPaginated = (initialParams = {}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    currentPage: 0
  });
  const [params, setParams] = useState({
    page: 0,
    size: 10,
    sort: 'string',
    search: '',
    roleName: '',
    status: '',
    ...initialParams
  });

  const fetchUsers = useCallback(async (searchParams = params) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await UserService.getUsersPaginated(searchParams);
      
      // Handle the response format from the user API
      if (response.data && response.data.data && response.data.data.users) {
        // Format: { data: { data: { users: [...], totalElements: 24, totalPages: 1, currentPage: 0 } } }
        setUsers(response.data.data.users);
        setPagination({
          page: response.data.data.currentPage,
          size: searchParams.size,
          totalElements: response.data.data.totalElements,
          totalPages: response.data.data.totalPages,
          currentPage: response.data.data.currentPage
        });
      } else if (response.data && response.data.users) {
        // Alternative format: { data: { users: [...], totalElements: 24, totalPages: 1, currentPage: 0 } }
        setUsers(response.data.users);
        setPagination({
          page: response.data.currentPage || 0,
          size: searchParams.size,
          totalElements: response.data.totalElements || 0,
          totalPages: response.data.totalPages || 0,
          currentPage: response.data.currentPage || 0
        });
      } else {
        // Fallback for simple array format
        setUsers(response.data || []);
        setPagination({
          page: 0,
          size: (response.data || []).length,
          totalElements: (response.data || []).length,
          totalPages: 1,
          currentPage: 0
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [params]);

  const updateParams = useCallback((newParams) => {
    setParams(prev => ({ ...prev, ...newParams }));
  }, []);

  const goToPage = useCallback((page) => {
    updateParams({ page });
  }, [updateParams]);

  const changePageSize = useCallback((size) => {
    updateParams({ size, page: 0 }); // Reset to first page when changing page size
  }, [updateParams]);

  const changeSort = useCallback((sort) => {
    updateParams({ sort, page: 0 }); // Reset to first page when changing sort
  }, [updateParams]);

  const search = useCallback((searchTerm) => {
    updateParams({ search: searchTerm, page: 0 }); // Reset to first page when searching
  }, [updateParams]);

  const filterByRole = useCallback((roleName) => {
    updateParams({ roleName, page: 0 }); // Reset to first page when filtering
  }, [updateParams]);

  const filterByStatus = useCallback((status) => {
    updateParams({ status, page: 0 }); // Reset to first page when filtering
  }, [updateParams]);

  const refresh = useCallback(() => {
    fetchUsers(params);
  }, [fetchUsers, params]);

  // Fetch users when params change
  useEffect(() => {
    fetchUsers(params);
  }, [fetchUsers, params]);

  return {
    users,
    loading,
    error,
    pagination,
    params,
    updateParams,
    goToPage,
    changePageSize,
    changeSort,
    search,
    filterByRole,
    filterByStatus,
    refresh
  };
};

export default useUsersPaginated; 