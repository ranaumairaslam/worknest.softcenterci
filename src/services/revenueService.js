import { get, post, put, del } from './apiClient.js';

const BASE = '/company/project-revenues';  // ✅ FIXED URL!

// =====================================================
// GET ALL REVENUES
// =====================================================
export async function getAllRevenues() {
  try {
    const response = await get(BASE);
    const revenues = response?.data || [];
    return revenues.map(transformRevenue);
  } catch (error) {
    console.error('Error fetching revenues:', error);
    return [];
  }
}

// =====================================================
// GET SINGLE REVENUE
// =====================================================
export async function getRevenueById(id) {
  try {
    const response = await get(`${BASE}/${id}`);
    return transformRevenue(response?.data);
  } catch (error) {
    console.error('Error fetching revenue:', error);
    return null;
  }
}

// =====================================================
// CREATE REVENUE
// =====================================================
export async function createRevenue(payload) {
  try {
    let amount = payload.amount || payload.Amount || 0;
    amount = String(amount).replace(/[$,\s]/g, '');
    const amountNumber = Number(amount) || 0;

    const body = {
      ProjectName: payload.project || payload.projectName || payload.ProjectName,
      ClientName: payload.client || payload.clientName || payload.ClientName,
      Amount: amountNumber,
      Date: payload.date || payload.Date,
      status: (payload.status || 'pending').toLowerCase(),
    };

    console.log('📤 Creating revenue with body:', body);

    const response = await post(BASE, body);
    return transformRevenue(response?.data);
  } catch (error) {
    console.error('Error creating revenue:', error);
    
    if (error.data?.errors && Array.isArray(error.data.errors)) {
      const errorMessages = error.data.errors
        .map((e) => `${e.field}: ${e.message}`)
        .join('\n');
      const newError = new Error(errorMessages);
      newError.backendErrors = error.data.errors;
      throw newError;
    }
    
    throw new Error(error.data?.message || error.message || 'Failed to create revenue');
  }
}

// =====================================================
// UPDATE REVENUE
// =====================================================
export async function updateRevenue(id, updates) {
  try {
    const body = {};
    
    if (updates.project !== undefined) body.ProjectName = updates.project;
    if (updates.client !== undefined) body.ClientName = updates.client;
    
    if (updates.amount !== undefined) {
      let amount = String(updates.amount).replace(/[$,\s]/g, '');
      body.Amount = Number(amount) || 0;
    }
    
    if (updates.date !== undefined) body.Date = updates.date;
    if (updates.status !== undefined) body.status = updates.status.toLowerCase();

    console.log('📤 Updating revenue:', id, body);

    const response = await put(`${BASE}/${id}`, body);
    return transformRevenue(response?.data);
  } catch (error) {
    console.error('Error updating revenue:', error);
    
    if (error.data?.errors && Array.isArray(error.data.errors)) {
      const errorMessages = error.data.errors
        .map((e) => `${e.field}: ${e.message}`)
        .join('\n');
      const newError = new Error(errorMessages);
      newError.backendErrors = error.data.errors;
      throw newError;
    }
    
    throw error;
  }
}

// =====================================================
// DELETE REVENUE
// =====================================================
export async function deleteRevenue(id) {
  try {
    console.log('🗑️ Deleting revenue:', id);
    await del(`${BASE}/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting revenue:', error);
    alert(`Delete failed: ${error.data?.message || error.message || 'Unknown error'}`);
    return false;
  }
}

// =====================================================
// GET REVENUE SUMMARY
// =====================================================
export async function getRevenueSummary(projects, clients) {
  try {
    const all = await getAllRevenues();
    
    const totalRevenue = all.reduce((sum, r) => sum + Number(r.amount || 0), 0);
    const completedRevenue = all
      .filter((r) => r.status === 'Complete')
      .reduce((sum, r) => sum + Number(r.amount || 0), 0);
    const pendingRevenue = all
      .filter((r) => r.status === 'Pending')
      .reduce((sum, r) => sum + Number(r.amount || 0), 0);

    const monthlyMap = {};
    all.forEach((r) => {
      if (!r.date) return;
      const month = String(r.date).slice(0, 7);
      if (!monthlyMap[month]) monthlyMap[month] = 0;
      monthlyMap[month] += Number(r.amount || 0);
    });

    const monthlyRevenue = Object.entries(monthlyMap)
      .map(([month, value]) => ({ month, value }))
      .sort((a, b) => a.month.localeCompare(b.month));

    return {
      totalRevenue,
      completedRevenue,
      pendingRevenue,
      totalEntries: all.length,
      monthlyRevenue,
      revenues: all,
    };
  } catch (error) {
    console.error('Error building revenue summary:', error);
    return {
      totalRevenue: 0,
      completedRevenue: 0,
      pendingRevenue: 0,
      totalEntries: 0,
      monthlyRevenue: [],
      revenues: [],
    };
  }
}

// =====================================================
// HELPER: Transform backend revenue → frontend format
// =====================================================
function transformRevenue(revenue) {
  if (!revenue) return null;

  const status = revenue.status === 'complete' ? 'Complete' : 'Pending';

  return {
    id: revenue.id,
    amount: Number(revenue.Amount) || 0,
    date: revenue.Date ? String(revenue.Date).slice(0, 10) : '',
    dateFormatted: formatDate(revenue.Date),
    status: status,
    project: revenue.ProjectName || 'Unassigned',
    projectId: revenue.project_id || null,
    client: revenue.ClientName || 'Unknown',
    clientId: revenue.client_id || null,
    clientEmail: revenue.client_email || '',
    createdAt: formatDate(revenue.created_at),
    updatedAt: formatDate(revenue.updated_at),
  };
}

function formatDate(dateString) {
  if (!dateString) return 'TBD';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

// =====================================================
// COMPATIBILITY EXPORTS
// =====================================================
export const getAll = getAllRevenues;
export const getById = getRevenueById;
export const create = createRevenue;
export const update = updateRevenue;
export const remove = deleteRevenue;