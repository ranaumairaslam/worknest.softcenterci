import { get, post, patch } from './apiClient.js';

export async function getSuperAdminDashboard() {
  const response = await get('/super-admin/dashboard');
  return response?.data || { stats: {}, companies: [] };
}

export async function createCompany(companyData) {
  return post('/super-admin/companies', companyData);
}

export async function createTeamLeaderCompany(companyData) {
  return post('/super-admin/team-leader-companies', companyData);
}

export async function getSuperAdminCompanies() {
  const response = await get('/super-admin/companies');
  return response?.data || [];
}

export async function updateSuperAdminCompany(companyId, companyData) {
  return patch(`/super-admin/companies/${companyId}`, companyData);
}

export async function setSuperAdminCompanyStatus(companyId, status) {
  return patch(`/super-admin/companies/${companyId}/status`, { status });
}

export function toCompanyViewModel(company) {
  return {
    id: company.id,
    name: company.name,
    status: company.status === 'active' ? 'Active' : 'Inactive',
    industry: company.industry || 'N/A',
    owner: company.owner_name || 'Unassigned',
    email: company.company_email || company.owner_email || '',
    phone: company.phone || '',
    location: company.address || '',
    website: company.website || '',
    size: `${company.employee_count || 0} Employees`,
    createdAt: company.created_at,
  };
}
