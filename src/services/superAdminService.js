import { get, post, put, del } from "./apiClient.js";

/**
 * Helper: first non-empty value
 */
function pick(obj, keys, fallback = "") {
  if (!obj) return fallback;
  for (const key of keys) {
    const value = obj[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return typeof value === "string" ? value.trim() : value;
    }
  }
  return fallback;
}

/**
 * Helper to normalize payment status (e.g. paid -> Paid)
 */
function normalizePaymentStatus(rawStatus) {
  if (!rawStatus) return "Pending";
  const s = String(rawStatus).toLowerCase().trim();
  if (s === "paid" || s === "completed" || s === "success") return "Paid";
  if (s === "failed" || s === "rejected") return "Failed";
  return "Pending";
}

/**
 * Normalize company account status for UI
 * Dashboard Terminate checkbox uses "Terminated"
 */
function normalizeAccountStatus(rawStatus) {
  const s = String(rawStatus || "").toLowerCase().trim();
  if (s === "suspended") return "Suspended";
  if (s === "inactive" || s === "terminated") return "Terminated";
  if (s === "pending") return "Pending";
  return "Active";
}

/**
 * Map one backend company -> frontend shape
 */
function mapCompany(c = {}) {
  const owner = pick(c, [
    "account_owner",
    "accountOwner",
    "AccountOwnerName",
    "owner_name",
    "ownerName",
    "owner",
    "user_name",
    "userName",
    "contact_person",
    "contactPerson",
    "admin_name",
    "adminName",
  ], "Unassigned");

  const location = pick(c, [
    "location",
    "address",
    "company_address",
    "companyAddress",
    "city",
    "country",
  ], "—");

  const normalizedStatus = normalizeAccountStatus(c.status);

  const rawPaymentStatus = pick(c, [
    "paymentStatus",
    "payment_status",
    "payment_state",
    "platform_fee_status",
  ], "Pending");

  return {
    id: c.id,
    name: pick(c, ["name", "companyName", "company_name"], ""),
    email: pick(c, ["email", "companyEmail", "company_email", "login_email", "owner_email"], ""),
    industry: pick(c, ["industry"], "Software"),
    revenue: c.platform_fee ?? c.revenue ?? 0,
    platformFee: c.platform_fee ?? c.revenue ?? 0,
    status: normalizedStatus,
    accountStatus: normalizedStatus,
    paymentStatus: normalizePaymentStatus(rawPaymentStatus),
    owner,
    location,
    phone: pick(c, ["phone", "contact_phone"], ""),
    website: pick(c, ["website"], ""),
    size: pick(c, ["company_size", "companySize", "size"], ""),
    password: c.password || "",
    receipt: c.receipt || c.payment_receipt || null,
    createdAt: c.created_at || c.createdAt || null,
    rawCompany: c,
  };
}

/**
 * =====================================================
 * SUPER ADMIN DASHBOARD
 * =====================================================
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

export async function getSuperAdminCompanies() {
  try {
    const response = await get("/super-admin/companies");
    const companiesArray = response?.companies || response?.data || [];
    return companiesArray.map(mapCompany);
  } catch (error) {
    console.error("Error fetching companies:", error);
    throw error;
  }
}

export async function getCompanyById(companyId) {
  try {
    const response = await get(`/super-admin/companies/${companyId}`);
    const company = response?.company || response?.data || {};
    return mapCompany(company);
  } catch (error) {
    console.error(`Error fetching company ${companyId}:`, error);
    throw error;
  }
}

export async function createCompany(companyData) {
  try {
    const response = await post("/super-admin/companies", companyData);
    const company = response?.company || response?.data || response;
    return company?.id ? mapCompany(company) : company;
  } catch (error) {
    console.error("Error creating company:", error);
    throw error;
  }
}

export async function createTeamLeaderCompany(companyData) {
  try {
    const response = await post("/super-admin/team-leader-companies", companyData);
    const company = response?.company || response?.data || response;
    return company?.id ? mapCompany(company) : company;
  } catch (error) {
    console.error("Error creating team leader company:", error);
    throw error;
  }
}

export async function updateSuperAdminCompany(companyId, companyData = {}) {
  try {
    // Ensure required aliases always present
    const name =
      companyData.name ||
      companyData.companyName ||
      companyData.company_name ||
      "";

    const email =
      companyData.email ||
      companyData.companyEmail ||
      companyData.company_email ||
      "";

    const industry = companyData.industry || "Software";

    let status = String(companyData.status || "active").toLowerCase();
    if (status === "terminated") status = "inactive";

    const payload = {
      ...companyData,
      name,
      companyName: name,
      company_name: name,
      email,
      companyEmail: email,
      company_email: email,
      industry,
      status,
    };

    const response = await put(
      `/super-admin/companies/${companyId}`,
      payload
    );

    const company = response?.company || response?.data || response;
    return company?.id ? mapCompany(company) : company;
  } catch (error) {
    console.error(`Error updating company ${companyId}:`, error);
    throw error;
  }
}

export async function setSuperAdminCompanyStatus(
  companyId,
  status,
  company = {}
) {
  try {
    const raw = company.rawCompany || {};

    const name = pick(
      { ...raw, ...company },
      ["name", "companyName", "company_name"],
      "Company"
    );
    const email = pick(
      { ...raw, ...company },
      ["email", "companyEmail", "company_email", "login_email"],
      ""
    );
    const industry = pick(
      { ...raw, ...company },
      ["industry"],
      "Software"
    );
    const owner = pick(
      { ...raw, ...company },
      [
        "owner",
        "account_owner",
        "accountOwner",
        "AccountOwnerName",
        "owner_name",
        "ownerName",
      ],
      ""
    );
    const location = pick(
      { ...raw, ...company },
      ["location", "address", "company_address"],
      ""
    );

    const payload = {
      name,
      companyName: name,
      email,
      companyEmail: email,
      industry,
      status,
    };

    if (owner && owner !== "Unassigned") {
      payload.account_owner = owner;
      payload.owner_name = owner;
      payload.AccountOwnerName = owner;
      payload.owner = owner;
    }

    if (location && location !== "—") {
      payload.location = location;
      payload.address = location;
    }

    const response = await put(
      `/super-admin/companies/${companyId}`,
      payload
    );

    const updated = response?.company || response?.data || response;
    return updated?.id ? mapCompany(updated) : updated;
  } catch (error) {
    console.error(`Error updating company status ${companyId}:`, error);
    throw error;
  }
}

export async function deleteSuperAdminCompany(companyId) {
  try {
    const response = await del(`/super-admin/companies/${companyId}`);
    return response?.data || response;
  } catch (error) {
    console.error(`Error deleting company ${companyId}:`, error);
    throw error;
  }
}

/**
 * =====================================================
 * REVENUE
 * =====================================================
 * ✅ ONLY CHANGE: merge company Suspended/Terminated status
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

    // ✅ NEW (minimal): company status map for sync with dashboard
    const statusById = new Map();
    const statusByName = new Map();
    try {
      const companies = await getSuperAdminCompanies();
      companies.forEach((c) => {
        const st = c.accountStatus || c.status || "Active";
        if (c.id != null) statusById.set(String(c.id), st);
        if (c.name) statusByName.set(String(c.name).toLowerCase(), st);
      });
    } catch (_) {
      // revenue still works without merge
    }

    const rawPayments =
      response?.payments ||
      response?.data?.payments ||
      response?.data ||
      [];

    const payments = Array.isArray(rawPayments)
      ? rawPayments.map((p) => {
          const companyName = pick(p, ["company", "company_name", "name"], "N/A");
          const companyId = p.company_id ?? p.companyId ?? p.id;

          const accountStatus =
            statusById.get(String(companyId)) ||
            statusByName.get(String(companyName).toLowerCase()) ||
            "Active";

          return {
            id: p.id || p.company_id,
            company: companyName,
            owner: pick(
              p,
              [
                "owner",
                "owner_name",
                "account_owner",
                "user_name",
                "contact_person",
              ],
              "—"
            ),
            email: pick(p, ["email", "company_email", "login_email"], "—"),
            owner_id: p.owner_id ?? p.ownerId ?? null,
            revenue: p.revenue ?? p.platform_fee ?? p.amount ?? 0,
            payment_status: normalizePaymentStatus(
              p.payment_status || p.paymentStatus || p.status
            ),
            paymentStatus: normalizePaymentStatus(
              p.payment_status || p.paymentStatus || p.status
            ),
            address: pick(p, ["address", "location", "city", "country"], "—"),
            location: pick(p, ["location", "address", "city", "country"], "—"),
            // ✅ so Revenue page can show Suspended / Terminated
            accountStatus,
            status: accountStatus,
            createdAt: p.created_at,
          };
        })
      : [];

    return {
      summary: response?.summary || {
        total_revenue: 0,
        pending_revenue: 0,
        paid_companies: 0,
        failed_revenue: 0,
      },
      payments,
    };
  } catch (error) {
    console.error("Error fetching revenue:", error);
    throw error;
  }
}

export async function exportSuperAdminRevenue(status = "all") {
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
  return mapCompany(company);
}

export function toRevenuePaymentViewModel(payment) {
  if (!payment) return null;
  return {
    id: payment.id,
    company: pick(payment, ["company", "company_name", "name"], "N/A"),
    owner: pick(
      payment,
      ["owner", "owner_name", "account_owner", "user_name"],
      "—"
    ),
    revenue: payment.revenue || 0,
    paymentStatus: normalizePaymentStatus(
      payment.payment_status || payment.paymentStatus
    ),
    location: pick(payment, ["location", "address"], "—"),
    accountStatus: payment.accountStatus || payment.status || "Active",
    createdAt: payment.created_at,
  };
}

/**
 * =====================================================
 * BACKWARD COMPATIBILITY
 * =====================================================
 */

export const getAllCompanies = getSuperAdminCompanies;
export const getDashboardStats = getSuperAdminDashboard;