import { get, post, put, del } from './apiClient.js';

const BASE = '/super-admin';

// =====================================================
// GET DASHBOARD STATS
// =====================================================
export async function getDashboardStats() {
  try {
    const response = await get(`${BASE}/dashboard`);
    return response?.data || null;
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    return null;
  }
}

// =====================================================
// GET ALL COMPANIES
// =====================================================
export async function getAllCompanies() {
  try {
    const response = await get(`${BASE}/companies`);
    const companies = response?.companies || response?.data || [];
    return companies.map(transformCompany);
  } catch (error) {
    console.error('Error fetching companies:', error);
    return [];
  }
}

// =====================================================
// GET SUPER ADMIN COMPANIES
// =====================================================
export async function getSuperAdminCompanies() {
  return await getAllCompanies();
}

// =====================================================
// GET SINGLE COMPANY
// =====================================================
export async function getCompanyById(id) {
  try {
    const response = await get(`${BASE}/companies/${id}`);
    return transformCompany(response?.data || response?.company);
  } catch (error) {
    console.error('Error fetching company:', error);
    return null;
  }
}

// =====================================================
// CREATE COMPANY
// =====================================================
export async function createCompany(payload) {
  try {
    console.log('📤 Creating company:', payload);
    const response = await post(`${BASE}/companies`, payload);
    return transformCompany(response?.data || response?.company || response);
  } catch (error) {
    console.error('Error creating company:', error);
    if (error.data?.errors && typeof error.data.errors === 'object') {
      const msg = Object.entries(error.data.errors)
        .map(([field, message]) => `${field}: ${message}`)
        .join('\n');
      throw new Error(msg);
    }
    throw new Error(error.data?.message || error.message || 'Failed to create company');
  }
}

// =====================================================
// UPDATE SUPER ADMIN COMPANY (PUT)
// =====================================================
export async function updateSuperAdminCompany(id, payload) {
  try {
    console.log('📤 Updating company:', id, payload);
    const response = await put(`${BASE}/companies/${id}`, payload);
    return transformCompany(response?.data || response?.company || response);
  } catch (error) {
    console.error('Error updating company:', error);
    if (error.data?.errors && typeof error.data.errors === 'object') {
      const msg = Object.entries(error.data.errors)
        .map(([field, message]) => `${field}: ${message}`)
        .join('\n');
      throw new Error(msg);
    }
    throw new Error(error.data?.message || error.message || 'Failed to update company');
  }
}

// =====================================================
// DELETE COMPANY
// =====================================================
export async function deleteCompany(id) {
  try {
    console.log('🗑️ Deleting company:', id);
    await del(`${BASE}/companies/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting company:', error);
    throw new Error(error.data?.message || error.message || 'Failed to delete company');
  }
}

// =====================================================
// GET REVENUE
// =====================================================
export async function getRevenue() {
  try {
    const response = await get(`${BASE}/revenue`);
    return {
      summary: response?.summary || {},
      payments: (response?.payments || []).map(transformPayment),
    };
  } catch (error) {
    console.error('Error fetching revenue:', error);
    return { summary: {}, payments: [] };
  }
}

// =====================================================
// UPDATE COMPANY STATUS (via PUT)
// Sends full company data + new status to backend
// =====================================================
export async function setSuperAdminCompanyStatus(id, status, companyData) {
  try {
    console.log('📤 Updating company status:', id, status);
    const response = await put(`${BASE}/companies/${id}`, {
      companyName: companyData?.name || 'Unknown',
      industry: companyData?.industry || 'N/A',
      address: companyData?.address || companyData?.location || 'N/A',
      status: status,
    });
    return transformCompany(response?.data || response?.company);
  } catch (error) {
    console.error('Error updating company status:', error);
    throw new Error(error.data?.message || error.message || 'Failed to update status');
  }
}

// =====================================================
// COMPANY VIEW MODEL (for external components)
// =====================================================
export function toCompanyViewModel(company) {
  if (!company) return null;
  return {
    id: company.id,
    name: company.name || '',
    email: company.email || '',
    industry: company.industry || 'N/A',
    owner: company.account_owner || company.owner || company.owner_name || 'N/A',
    status: company.status || 'Active',
    accountStatus: company.accountStatus || mapAccountStatus(company.status),
    phone: company.phone || '',
    revenue: company.revenue || '$0',
    size: company.size || 'N/A',
    paymentStatus: company.paymentStatus || 'Pending',
    location: company.location || company.address || 'N/A',
    password: company.password || '',
    receipt: company.receipt || '',
    createdAt: company.createdAt || company.created_at || null,
    updatedAt: company.updatedAt || company.updated_at || null,
  };
}

// =====================================================
// TRANSFORM COMPANY (backend → frontend)
// =====================================================
function transformCompany(company) {
  if (!company) return null;
  return {
    id: company.id,
    name: company.name || '',
    email: company.email || company.login_email || company.company_email || '',
    industry: company.industry || 'N/A',
    phone: company.phone || null,
    address: company.address || 'N/A',
    location: company.location || company.address || 'N/A',
    size: company.company_size || 'N/A',
    website: company.website || null,
    owner: company.account_owner || company.owner || company.owner_name || company.admin_name || 'N/A',
    owner_name: company.account_owner || company.owner_name || company.owner || 'N/A',
    status: capitalize(company.status || 'active'),
    revenue: company.platform_fee ? `$${company.platform_fee}` : '$0',
    paymentStatus: capitalize(company.payment_status || 'pending'),
    receipt: company.payment_receipt || '',
    accountStatus: mapAccountStatus(company.status),
    createdAt: company.created_at || null,
    updatedAt: company.updated_at || null,
    created_at: company.created_at || null,
    updated_at: company.updated_at || null,
    password: company.password || '',
    adminRole: company.admin_role || '',
    loginEmail: company.login_email || company.email || '',
  };
}

// =====================================================
// TRANSFORM PAYMENT (backend → frontend)
// =====================================================
function transformPayment(payment) {
  if (!payment) return null;
  return {
    id: payment.id,
    company: payment.company || '',
    owner: payment.owner || '',
    email: payment.email || '',
    revenue: payment.revenue || '0',
    paymentStatus: capitalize(payment.payment_status || 'pending'),
    location: payment.location || 'N/A',
    createdAt: payment.created_at || null,
  };
}

// =====================================================
// MAP ACCOUNT STATUS (backend status → frontend display)
// Backend: active, inactive, suspended, pending
// Frontend: Active, Terminated, Suspended, Active
// =====================================================
function mapAccountStatus(status) {
  if (!status) return 'Active';
  const s = String(status).toLowerCase();
  if (s === 'active') return 'Active';
  if (s === 'suspended') return 'Suspended';
  if (s === 'inactive') return 'Terminated';
  if (s === 'pending') return 'Active';
  return capitalize(status);
}

// =====================================================
// CAPITALIZE
// =====================================================
function capitalize(str) {
  if (!str) return '';
  return String(str).charAt(0).toUpperCase() + String(str).slice(1).toLowerCase();
}