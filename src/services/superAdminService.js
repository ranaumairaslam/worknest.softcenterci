import { get, post, patch } from './apiClient.js';

/**
 * =====================================================
 * SUPER ADMIN DASHBOARD
 * =====================================================
 */

/**
 * Get super admin dashboard data
 * GET /api/super-admin/dashboard
 */
export async function getSuperAdminDashboard() {
  try {
    const response = await get('/super-admin/dashboard');
    return response?.data || {
      total_companies: 0,
      active_companies: 0,
      new_this_month: 0,
      total_employees: 0,
      pending_approval: 0,
      suspended: 0,
      revenue: {
        total: 0,
        pending: 0,
        paid_companies: 0,
        failed: 0,
      },
    };
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    throw error;
  }
}

/**
 * =====================================================
 * COMPANIES
 * =====================================================
 */

/**
 * Get all companies
 * GET /api/super-admin/companies
 */
export async function getSuperAdminCompanies() {
  try {
    const response = await get('/super-admin/companies');
    return response?.data || [];
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
}

/**
 * Get single company details
 * GET /api/super-admin/companies/:companyId
 */
export async function getCompanyById(companyId) {
  try {
    const response = await get(`/super-admin/companies/${companyId}`);
    return response?.company || {};
  } catch (error) {
    console.error(`Error fetching company ${companyId}:`, error);
    throw error;
  }
}

/**
 * Create new company
 * POST /api/super-admin/companies
 */
export async function createCompany(companyData) {
  try {
    const response = await post('/super-admin/companies', companyData);
    return response?.company || response;
  } catch (error) {
    console.error('Error creating company:', error);
    throw error;
  }
}

/**
 * Create team leader company
 * POST /api/super-admin/team-leader-companies
 */
export async function createTeamLeaderCompany(companyData) {
  try {
    const response = await post('/super-admin/team-leader-companies', companyData);
    return response?.company || response;
  } catch (error) {
    console.error('Error creating team leader company:', error);
    throw error;
  }
}

/**
 * Update company details
 * PATCH /api/super-admin/companies/:companyId
 */
export async function updateSuperAdminCompany(companyId, companyData) {
  try {
    const response = await patch(`/super-admin/companies/${companyId}`, companyData);
    return response?.company || response;
  } catch (error) {
    console.error(`Error updating company ${companyId}:`, error);
    throw error;
  }
}

/**
 * Set company status
 * PATCH /api/super-admin/companies/:companyId/status
 */
export async function setSuperAdminCompanyStatus(companyId, status) {
  try {
    const response = await patch(`/super-admin/companies/${companyId}/status`, { status });
    return response?.company || response;
  } catch (error) {
    console.error(`Error updating company status ${companyId}:`, error);
    throw error;
  }
}

/**
 * =====================================================
 * REVENUE
 * =====================================================
 */

/**
 * Get revenue data
 * GET /api/super-admin/revenue
 */
export async function getSuperAdminRevenue(status = 'all') {
  try {
    const params = new URLSearchParams();
    if (status && status !== 'all') {
      params.append('status', status);
    }
    
    const response = await get(`/super-admin/revenue?${params.toString()}`);
    return {
      summary: response?.summary || {
        total_revenue: 0,
        pending_revenue: 0,
        paid_companies: 0,
        failed_revenue: 0,
      },
      payments: response?.payments || [],
    };
  } catch (error) {
    console.error('Error fetching revenue:', error);
    throw error;
  }
}

/**
 * Export revenue as CSV
 * GET /api/super-admin/revenue/export
 */
export async function exportSuperAdminRevenue(status = 'all') {
  try {
    const params = new URLSearchParams();
    if (status && status !== 'all') {
      params.append('status', status);
    }
    
    const response = await get(`/super-admin/revenue/export?${params.toString()}`);
    return response;
  } catch (error) {
    console.error('Error exporting revenue:', error);
    throw error;
  }
}

/**
 * =====================================================
 * DATA TRANSFORMATIONS
 * =====================================================
 */

export function toCompanyViewModel(company) {
  return {
    id: company.id,
    name: company.name,
    status: company.status === 'active' ? 'Active' : 'Inactive',
    industry: company.industry || 'N/A',
    owner: company.account_owner || company.owner_name || 'Unassigned',
    email: company.company_email || company.owner_email || company.login_email || '',
    phone: company.phone || '',
    location: company.location || company.address || '',
    website: company.website || '',
    size: company.company_size || `${company.employee_count || 0} Employees`,
    platformFee: company.platform_fee || 0,
    paymentStatus: company.payment_status || 'Pending',
    createdAt: company.created_at,
  };
}

export function toRevenuePaymentViewModel(payment) {
  return {
    id: payment.id,
    company: payment.company,
    owner: payment.owner,
    revenue: payment.revenue || 0,
    paymentStatus: payment.payment_status || 'Pending',
    location: payment.location || '',
    createdAt: payment.created_at,
  };
}
