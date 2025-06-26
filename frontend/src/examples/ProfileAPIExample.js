// Example usage of the Profile API
import UserService from '../api/services/user.service';

// Example 1: Get user profile
export const exampleGetProfile = async () => {
  try {
    const result = await UserService.getProfile();
    console.log('Profile data:', result);
    return result;
  } catch (error) {
    console.error('Error fetching profile:', error);
  }
};

// Example 2: Update user profile
export const exampleUpdateProfile = async (profileData) => {
  try {
    const result = await UserService.updateProfile(profileData);
    console.log('Profile updated:', result);
    return result;
  } catch (error) {
    console.error('Error updating profile:', error);
  }
};

// Example 3: Complete profile update example
export const exampleCompleteProfileUpdate = async () => {
  try {
    // First get current profile
    const currentProfile = await UserService.getProfile();
    console.log('Current profile:', currentProfile);

    // Prepare update data
    const updateData = {
      fullName: 'Nguyễn Văn A',
      phoneNumber: '0901234567',
      dob: '1990-01-01',
      gender: 'male',
      address: '123 Đường ABC, Quận 1, TP.HCM'
    };

    // Update profile
    const updatedProfile = await UserService.updateProfile(updateData);
    console.log('Updated profile:', updatedProfile);
    return updatedProfile;
  } catch (error) {
    console.error('Error in complete profile update:', error);
  }
};

// Example 4: Profile data structure
export const profileDataStructure = {
  fullName: "string - Họ và tên người dùng",
  email: "string - Email (read-only)",
  phoneNumber: "string - Số điện thoại",
  dob: "string - Ngày sinh (YYYY-MM-DD format)",
  gender: "string - Giới tính (male/female/other)",
  address: "string - Địa chỉ",
  roleName: "string - Vai trò (read-only)",
  status: "string - Trạng thái (read-only)"
};

// Example 5: API request format
export const apiRequestExamples = {
  // Get profile
  getProfile: {
    url: 'https://school-medical-system.onrender.com/api/v1/user/profile',
    method: 'GET',
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN',
      'Content-Type': 'application/json'
    }
  },
  
  // Update profile
  updateProfile: {
    url: 'https://school-medical-system.onrender.com/api/v1/user/update',
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN',
      'Content-Type': 'application/json'
    },
    body: {
      fullName: 'Nguyễn Văn A',
      phoneNumber: '0901234567',
      dob: '1990-01-01',
      gender: 'male',
      address: '123 Đường ABC, Quận 1, TP.HCM'
    }
  }
};

// Example 6: Response format
export const expectedResponseFormat = {
  // Get profile response
  getProfile: {
    data: {
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
    },
    code: "GET_SUCCESS",
    isSuccess: true,
    status: "OK",
    message: "Get profile successfully"
  },
  
  // Update profile response
  updateProfile: {
    data: {
      userId: 18,
      userName: "admin@gmail.com",
      fullName: "Nguyễn Văn A",
      email: "admin@gmail.com",
      phoneNumber: "0901234567",
      dob: "1990-01-01",
      gender: "male",
      address: "123 Đường ABC, Quận 1, TP.HCM",
      roleName: "ADMIN",
      avatarUrl: null,
      status: "ACTIVE",
      dateCreated: null,
      updatedAt: "2024-01-15T10:30:00.000Z"
    },
    code: "UPDATE_SUCCESS",
    isSuccess: true,
    status: "OK",
    message: "Profile updated successfully"
  }
};

// Example 7: Using in React component
export const reactComponentExample = `
import React, { useState, useEffect } from 'react';
import UserService from '../api/services/user.service';

const ProfileComponent = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await UserService.getProfile();
      setProfile(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updateData) => {
    try {
      setLoading(true);
      const response = await UserService.updateProfile(updateData);
      setProfile(response.data.data || response.data);
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>No profile data</div>;

  return (
    <div>
      <h2>Profile</h2>
      <p>Name: {profile.fullName}</p>
      <p>Email: {profile.email}</p>
      <p>Phone: {profile.phoneNumber}</p>
      <p>Role: {profile.roleName}</p>
      {/* Add form to update profile */}
    </div>
  );
};
`;

// Example 8: Validation rules
export const validationRules = {
  fullName: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-ZÀ-ỹ\s]+$/
  },
  phoneNumber: {
    required: false,
    pattern: /^[0-9]{10,11}$/
  },
  dob: {
    required: false,
    pattern: /^\d{4}-\d{2}-\d{2}$/,
    maxDate: new Date().toISOString().split('T')[0]
  },
  gender: {
    required: false,
    enum: ['male', 'female', 'other']
  },
  address: {
    required: false,
    maxLength: 255
  }
};

// Example 9: Error handling
export const errorHandlingExample = `
const handleProfileUpdate = async (profileData) => {
  try {
    // Validate data before sending
    if (!profileData.fullName || profileData.fullName.length < 2) {
      throw new Error('Họ và tên phải có ít nhất 2 ký tự');
    }

    if (profileData.phoneNumber && !/^[0-9]{10,11}$/.test(profileData.phoneNumber)) {
      throw new Error('Số điện thoại không hợp lệ');
    }

    const response = await UserService.updateProfile(profileData);
    
    // Update local storage
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...profileData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }

    return response;
  } catch (error) {
    console.error('Profile update error:', error);
    throw error;
  }
};
`;

export default {
  exampleGetProfile,
  exampleUpdateProfile,
  exampleCompleteProfileUpdate,
  profileDataStructure,
  apiRequestExamples,
  expectedResponseFormat,
  reactComponentExample,
  validationRules,
  errorHandlingExample
}; 