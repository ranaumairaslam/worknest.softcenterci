import { post } from '../src/services/apiClient.js';

const AUTH_BASE = '/auth';

// =====================================================
// LOGIN (Optional - if you want to add later)
// =====================================================
export async function login(email, password) {
  try {
    const response = await post(`${AUTH_BASE}/login`, {
      email,
      password,
    });
    
    if (response?.token) {
      localStorage.setItem('worknest_token', response.token);
      localStorage.setItem('worknest_user', JSON.stringify(response.user));
    }
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(error.data?.message || error.message || 'Login failed');
  }
}

// =====================================================
// CHANGE PASSWORD ⭐
// Backend: POST /api/auth/change-password
// =====================================================
export async function changePassword(payload) {
  try {
    const body = {
      currentPassword: payload.currentPassword,
      newPassword: payload.newPassword,
      confirmPassword: payload.confirmPassword,
    };

    console.log('📤 Changing password...');

    const response = await post(`${AUTH_BASE}/change-password`, body);
    
    // Backend removes token after password change - user must login again
    if (response?.success) {
      localStorage.removeItem('worknest_token');
      localStorage.removeItem('worknest_user');
    }
    
    return response;
  } catch (error) {
    console.error('Change password error:', error);
    throw new Error(
      error.data?.message || error.message || 'Failed to change password'
    );
  }
}

// =====================================================
// FORGOT PASSWORD - Step 1 (Check Account)
// Backend: POST /api/auth/forgot-password
// =====================================================
export async function forgotPassword(emailOrPhone) {
  try {
    const body = {};
    
    // Auto-detect if email or phone
    if (emailOrPhone.includes('@')) {
      body.email = emailOrPhone;
    } else {
      body.phone = emailOrPhone;
    }

    console.log('📤 Sending forgot password request:', body);

    const response = await post(`${AUTH_BASE}/forgot-password`, body);
    return response;
  } catch (error) {
    console.error('Forgot password error:', error);
    throw new Error(
      error.data?.message || error.message || 'Failed to check account'
    );
  }
}

// =====================================================
// RESET PASSWORD - Step 2 (After Firebase OTP verification)
// Backend: POST /api/auth/reset-password
// =====================================================
export async function resetPassword(payload) {
  try {
    const body = {
      firebaseIdToken: payload.firebaseIdToken,
      newPassword: payload.newPassword,
      confirmPassword: payload.confirmPassword,
    };

    // Add email or phone
    if (payload.email) body.email = payload.email;
    if (payload.phone) body.phone = payload.phone;

    console.log('📤 Resetting password...');

    const response = await post(`${AUTH_BASE}/reset-password`, body);
    return response;
  } catch (error) {
    console.error('Reset password error:', error);
    throw new Error(
      error.data?.message || error.message || 'Failed to reset password'
    );
  }
}

// =====================================================
// LOGOUT (Client-side)
// =====================================================
export function logout() {
  localStorage.removeItem('worknest_token');
  localStorage.removeItem('worknest_user');
  window.location.href = '/login';
}