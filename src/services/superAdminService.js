import { get, post, put, del } from "./apiClient.js";

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
    const response = await get("/super-admin/dashboard");

    return (
      response?.data || {
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
      }
    );
  } catch (error) {
    console.error("Error fetching dashboard:", error);
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
    const response = await get("/super-admin/companies");
    
    // ✅ Backend response se companies array nikaalein
    const companiesArray = response?.companies || response?.data || [];
    
    // ✅ Har company ko frontend-friendly format mein transform karein
    return companiesArray.map((c) => ({
      id: c.id,
      name: c.name || "",
      email: c.email || "",
      industry: c.industry || "N/A",
      revenue: c.platform_fee || 0,  // platform_fee ko revenue banaya
      accountStatus:
        c.status === "active" ? "Active" :
        c.status === "suspended" ? "Suspended" :
        c.status === "inactive" ? "Terminated" : "Active",
    }));
  } catch (error) {
    console.error("Error fetching companies:", error);
    throw error;
  }
}

/**
 * Get single company
 * GET /api/super-admin/companies/:companyId
 */
export async function getCompanyById(companyId) {
  try {
    const response = await get(
      `/super-admin/companies/${companyId}`
    );

    return response?.company || response?.data || {};
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
    const response = await post(
      "/super-admin/companies",
      companyData
    );

    return response?.company || response?.data || response;
  } catch (error) {
    console.error("Error creating company:", error);
    throw error;
  }
}

/**
 * Create team leader company
 * POST /api/super-admin/team-leader-companies
 */
export async function createTeamLeaderCompany(companyData) {
  try {
    const response = await post(
      "/super-admin/team-leader-companies",
      companyData
    );

    return response?.company || response?.data || response;
  } catch (error) {
    console.error("Error creating team leader company:", error);
    throw error;
  }
}

/**
 * Update company details
 * PUT /api/super-admin/companies/:companyId
 */
export async function updateSuperAdminCompany(
  companyId,
  companyData
) {
  try {
    const response = await put(
      `/super-admin/companies/${companyId}`,
      companyData
    );

    return response?.company || response?.data || response;
  } catch (error) {
    console.error(
      `Error updating company ${companyId}:`,
      error
    );
    throw error;
  }
}

/**
 * Update company status
 * PUT /api/super-admin/companies/:companyId
 */
export async function setSuperAdminCompanyStatus(
  companyId,
  status
) {
  try {
    const response = await put(
      `/super-admin/companies/${companyId}`,
      {
        status,
      }
    );

    return response?.company || response?.data || response;
  } catch (error) {
    console.error(
      `Error updating company status ${companyId}:`,
      error
    );
    throw error;
  }
}

/**
 * Delete company
 * DELETE /api/super-admin/companies/:companyId
 */
export async function deleteSuperAdminCompany(companyId) {
  try {
    const response = await del(
      `/super-admin/companies/${companyId}`
    );

    return response?.data || response;
  } catch (error) {
    console.error(
      `Error deleting company ${companyId}:`,
      error
    );
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
export async function getSuperAdminRevenue(status = "all") {
  try {
    const params = new URLSearchParams();

    if (status && status !== "all") {
      params.append("status", status);
    }

    const query = params.toString();

    const response = await get(
      `/super-admin/revenue${query ? `?${query}` : ""}`
    );

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
    console.error("Error fetching revenue:", error);
    throw error;
  }
}

/**
 * Export revenue as CSV
 * GET /api/super-admin/revenue/export
 */
export async function exportSuperAdminRevenue(
  status = "all"
) {
  try {
    const params = new URLSearchParams();

    if (status && status !== "all") {
      params.append("status", status);
    }

    const query = params.toString();

    const response = await get(
      `/super-admin/revenue/export${query ? `?${query}` : ""}`
    );

    return response;
  } catch (error) {
    console.error("Error exporting revenue:", error);
    throw error;
  }
}

/**
 * =====================================================
 * DATA TRANSFORMATIONS
 * =====================================================
 */

export function toCompanyViewModel(company) {
  if (!company) return null;

  return {
    id: company.id,
    name: company.name || "",
    email:
      company.company_email ||
      company.owner_email ||
      company.login_email ||
      company.email ||
      "",
    industry: company.industry || "N/A",
    owner:
      company.account_owner ||
      company.owner_name ||
      "Unassigned",
    phone: company.phone || "",
    location:
      company.location ||
      company.address ||
      "",
    website: company.website || "",
    size:
      company.company_size ||
      `${company.employee_count || 0} Employees`,
    platformFee: company.platform_fee || 0,
    paymentStatus:
      company.payment_status || "Pending",
    status:
      company.status || "Active",
    password: company.password || "",
    receipt: company.receipt || null,
    revenue: company.revenue || 0,
    createdAt: company.created_at,
  };
}

export function toRevenuePaymentViewModel(payment) {
  return {
    id: payment.id,
    company: payment.company,
    owner: payment.owner,
    revenue: payment.revenue || 0,
    paymentStatus:
      payment.payment_status || "Pending",
    location: payment.location || "",
    createdAt: payment.created_at,
  };
}

/**
 * =====================================================
 * BACKWARD COMPATIBILITY
 * =====================================================
 */

/**
 * Old name used by table.jsx
 */
export const getAllCompanies = getSuperAdminCompanies;

/**
 * Old name used by dashboard cards
 */
export const getDashboardStats = getSuperAdminDashboard;