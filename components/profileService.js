import { get, put, del } from '../src/services/apiClient.js';

const BASE = '/profile';

// =====================================================
// GET CURRENT USER PROFILE
// =====================================================
export async function getProfile() {
  try {
    const response = await get(BASE);
    return response?.data || null;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

// =====================================================
// UPDATE PROFILE (Full Name)
// =====================================================
export async function updateProfile(payload) {
  try {
    const body = {
      fullName: payload.fullName || payload.name,
    };

    console.log('📤 Updating profile:', body);

    const response = await put(BASE, body);
    return response?.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw new Error(
      error.data?.message || error.message || 'Failed to update profile'
    );
  }
}

// =====================================================
// UPLOAD AVATAR (Profile Picture)
// =====================================================
export async function uploadAvatar(file) {
  try {
    const formData = new FormData();
    formData.append('image', file);

    console.log('📤 Uploading avatar to Cloudinary...');

    const token = localStorage.getItem('worknest_token');
    const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

    const response = await fetch(`${API_BASE_URL}${BASE}/avatar`, {
      method: 'POST',
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      const error = new Error(result?.message || 'Upload failed');
      error.status = response.status;
      error.data = result;
      throw error;
    }

    console.log('✅ Avatar uploaded:', result?.data?.avatarUrl);
    return result?.data;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw new Error(
      error.data?.message || error.message || 'Failed to upload avatar'
    );
  }
}

// =====================================================
// DELETE AVATAR (Remove Profile Picture)
// =====================================================
export async function deleteAvatar() {
  try {
    console.log('🗑️ Deleting avatar...');
    const response = await del(`${BASE}/avatar`);
    return response?.data;
  } catch (error) {
    console.error('Error deleting avatar:', error);
    throw new Error(
      error.data?.message || error.message || 'Failed to remove avatar'
    );
  }
}      