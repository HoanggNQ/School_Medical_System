// Example usage of the paginated user API
import UserService from '../api/services/user.service';

// Example 1: Basic pagination
export const exampleBasicPagination = async () => {
  try {
    const result = await UserService.getUsersPaginated({
      page: 0,
      size: 10,
      sort: 'string'
    });
    console.log('Basic pagination result:', result);
    return result;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// Example 2: Search with pagination
export const exampleSearchWithPagination = async (searchTerm) => {
  try {
    const result = await UserService.getUsersPaginated({
      page: 0,
      size: 20,
      sort: 'string',
      search: searchTerm
    });
    console.log('Search result:', result);
    return result;
  } catch (error) {
    console.error('Error searching users:', error);
  }
};

// Example 3: Filter by role
export const exampleFilterByRole = async (roleName) => {
  try {
    const result = await UserService.getUsersPaginated({
      page: 0,
      size: 15,
      sort: 'string',
      roleName: roleName
    });
    console.log('Role filter result:', result);
    return result;
  } catch (error) {
    console.error('Error filtering by role:', error);
  }
};

// Example 4: Filter by status
export const exampleFilterByStatus = async (status) => {
  try {
    const result = await UserService.getUsersPaginated({
      page: 0,
      size: 15,
      sort: 'string',
      status: status
    });
    console.log('Status filter result:', result);
    return result;
  } catch (error) {
    console.error('Error filtering by status:', error);
  }
};

// Example 5: Complex filtering
export const exampleComplexFiltering = async () => {
  try {
    const result = await UserService.getUsersPaginated({
      page: 1,
      size: 25,
      sort: 'fullName',
      search: 'admin',
      roleName: 'ADMIN',
      status: 'ACTIVE'
    });
    console.log('Complex filtering result:', result);
    return result;
  } catch (error) {
    console.error('Error with complex filtering:', error);
  }
};

// Example 6: Using the custom hook in a React component
export const exampleHookUsage = `
import React from 'react';
import useUsersPaginated from '../hooks/useUsersPaginated';

const UserPaginatedComponent = () => {
  const {
    users,
    loading,
    error,
    pagination,
    goToPage,
    changePageSize,
    changeSort,
    search,
    filterByRole,
    filterByStatus,
    refresh
  } = useUsersPaginated({
    page: 0,
    size: 10,
    sort: 'string'
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Users ({pagination.totalElements} total)</h2>
      
      {/* Search */}
      <input 
        type="text" 
        placeholder="Search users..."
        onChange={(e) => search(e.target.value)}
      />
      
      {/* Filters */}
      <select onChange={(e) => filterByRole(e.target.value)}>
        <option value="">All Roles</option>
        <option value="ADMIN">Admin</option>
        <option value="SCHOOL_NURSE">School Nurse</option>
        <option value="PARENT">Parent</option>
        <option value="STUDENT">Student</option>
      </select>
      
      <select onChange={(e) => filterByStatus(e.target.value)}>
        <option value="">All Status</option>
        <option value="ACTIVE">Active</option>
        <option value="VERIFY">Verify</option>
        <option value="INACTIVE">Inactive</option>
      </select>
      
      {/* Table */}
      <table>
        <thead>
          <tr>
            <th onClick={() => changeSort('fullName')}>
              Name ↑
            </th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.userId}>
              <td>{user.fullName}</td>
              <td>{user.email || user.userName}</td>
              <td>{user.roleName}</td>
              <td>{user.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Pagination */}
      <div>
        <button 
          onClick={() => goToPage(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 0}
        >
          Previous
        </button>
        <span>Page {pagination.currentPage + 1} of {pagination.totalPages}</span>
        <button 
          onClick={() => goToPage(pagination.currentPage + 1)}
          disabled={pagination.currentPage >= pagination.totalPages - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};
`;

// Example 7: API request format
export const apiRequestExamples = {
  // Basic request
  basic: {
    url: 'https://school-medical-system.onrender.com/api/v1/user?page=0&size=10&sort=string',
    method: 'GET',
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN',
      'Content-Type': 'application/json'
    }
  },
  
  // With search
  withSearch: {
    url: 'https://school-medical-system.onrender.com/api/v1/user?page=0&size=20&sort=string&search=admin',
    method: 'GET'
  },
  
  // With role filter
  withRoleFilter: {
    url: 'https://school-medical-system.onrender.com/api/v1/user?page=0&size=15&sort=string&roleName=ADMIN',
    method: 'GET'
  },
  
  // With status filter
  withStatusFilter: {
    url: 'https://school-medical-system.onrender.com/api/v1/user?page=0&size=15&sort=string&status=ACTIVE',
    method: 'GET'
  },
  
  // Complex filtering
  complexFiltering: {
    url: 'https://school-medical-system.onrender.com/api/v1/user?page=1&size=25&sort=fullName&search=admin&roleName=ADMIN&status=ACTIVE',
    method: 'GET'
  }
};

// Example 8: Response format (based on actual API response)
export const expectedResponseFormat = {
  data: {
    data: {
      users: [
        {
          userId: 18,
          userName: "admin@gmail.com",
          fullName: "admin",
          email: "admin@gmail.com",
          phoneNumber: "0401729585",
          dob: "2000-06-20",
          gender: "string",
          address: "admin",
          roleName: "ADMIN",
          avatarUrl: null,
          status: "ACTIVE",
          dateCreated: null,
          updatedAt: null
        }
        // ... more users
      ],
      totalElements: 24,
      totalPages: 1,
      currentPage: 0
    }
  },
  code: "GET_SUCCESS",
  isSuccess: true,
  status: "OK",
  message: "Get user successfully"
};

// Example 9: Available parameters
export const availableParameters = {
  page: "number - Page number (0-based)",
  size: "number - Number of items per page",
  sort: "string - Sort field (default: 'string')",
  search: "string - Search term for name, email, phone (optional)",
  roleName: "string - Filter by role (ADMIN, SCHOOL_NURSE, PARENT, STUDENT) (optional)",
  status: "string - Filter by status (ACTIVE, VERIFY, INACTIVE) (optional)"
};

// Example 10: Usage in existing UserManagement component
export const integrationWithUserManagement = `
// In UserManagement.jsx, you can replace the current fetchUsers function:

const fetchUsers = async () => {
  try {
    setLoading(true);
    const response = await UserService.getUsersPaginated({
      page: 0,
      size: 100, // Get all users for now
      sort: 'string'
    });
    setUsers(response.data.data.users || []);
    setError(null);
  } catch (err) {
    setError('Failed to fetch users. Please try again later.');
    console.error('Error fetching users:', err);
  } finally {
    setLoading(false);
  }
};

// Or use the hook for more advanced features:
const {
  users,
  loading,
  error,
  pagination,
  goToPage,
  search,
  filterByRole
} = useUsersPaginated({
  page: 0,
  size: 10,
  sort: 'string'
});
`;

export default {
  exampleBasicPagination,
  exampleSearchWithPagination,
  exampleFilterByRole,
  exampleFilterByStatus,
  exampleComplexFiltering,
  exampleHookUsage,
  apiRequestExamples,
  expectedResponseFormat,
  availableParameters,
  integrationWithUserManagement
}; 