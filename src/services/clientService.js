import { get, post, put, del } from './apiClient.js';

const BASE = '/company/clients';

// =====================================================
// GET ALL CLIENTS
// =====================================================
export async function getAllClients() {
  try {
    const response = await get(BASE);
    const clients = response?.data || [];
    return clients.map(transformClient);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return [];
  }
}

// =====================================================
// GET SINGLE CLIENT
// =====================================================
export async function getClientById(id) {
  try {
    const response = await get(`${BASE}/${id}`);
    return transformClient(response?.data);
  } catch (error) {
    // Fallback: find from list
    const all = await getAllClients();
    return all.find((c) => String(c.id) === String(id)) || null;
  }
}

// =====================================================
// GET CLIENT BY NAME
// =====================================================
export async function getClientByName(name) {
  const all = await getAllClients();
  return all.find((c) => c.name === name) || null;
}

// =====================================================
// CREATE CLIENT — Sends ALL fields backend accepts
// =====================================================
export async function createClient(payload) {
  try {
    // Convert revenue to number
    let revenueValue = payload.revenue || '0';
    revenueValue = String(revenueValue).replace(/[$,\s]/g, '');
    const revenueNumber = Number(revenueValue) || 0;

    // Send ALL fields — backend will accept what it supports
    const body = {
      // Simple version fields (current backend)
      name: payload.name,
      email: payload.contact || payload.email,
      password: payload.password || 'client12345',
      project_name: (payload.name || 'Client') + ' - Initial Project',
      project_description: `Initial project for ${payload.name}`,
      
      // Advanced version fields (for when backend is fixed)
      companyName: payload.name,
      companyEmail: payload.contact || payload.email,
      address: payload.address || 'N/A',
      industry: payload.industry || '',
      AccountOwnerName: payload.owner || 'Unknown',
      companySize: payload.size || 'N/A',
      revenu: revenueNumber,
      revenue: revenueNumber,
      location: payload.location || payload.address || 'N/A',
    };

    console.log('📤 Creating client with body:', body);

    const response = await post(BASE, body);
    return transformClient(response?.data);
  } catch (error) {
    console.error('Error creating client:', error);
    
    if (error.data?.errors && Array.isArray(error.data.errors)) {
      const errorMessages = error.data.errors
        .map((e) => `${e.field}: ${e.message}`)
        .join('\n');
      const newError = new Error(errorMessages);
      newError.backendErrors = error.data.errors;
      throw newError;
    }
    
    throw new Error(error.data?.message || error.message || 'Failed to create client');
  }
}

// =====================================================
// UPDATE CLIENT
// =====================================================
export async function updateClient(id, updates) {
  try {
    let revenueValue = updates.revenue || '0';
    revenueValue = String(revenueValue).replace(/[$,\s]/g, '');
    const revenueNumber = Number(revenueValue) || 0;

    const body = {
      // Simple fields
      name: updates.name,
      email: updates.contact || updates.email,
      
      // Advanced fields
      companyName: updates.name,
      companyEmail: updates.contact || updates.email,
      address: updates.address || updates.location,
      industry: updates.industry,
      AccountOwnerName: updates.owner,
      companySize: updates.size,
      revenu: revenueNumber,
      revenue: revenueNumber,
      location: updates.location,
      status: updates.status?.toLowerCase(),
    };

    console.log('📤 Updating client:', id, body);

    const response = await put(`${BASE}/${id}`, body);
    return transformClient(response?.data);
  } catch (error) {
    console.error('Error updating client:', error);
    
    if (error.status === 404) {
      alert('Update failed: Backend does not support client update yet. Backend developer is fixing it.');
    } else if (error.data?.errors && Array.isArray(error.data.errors)) {
      const errorMessages = error.data.errors
        .map((e) => `${e.field}: ${e.message}`)
        .join('\n');
      const newError = new Error(errorMessages);
      newError.backendErrors = error.data.errors;
      throw newError;
    } else {
      alert(`Update failed: ${error.data?.message || error.message}`);
    }
    
    throw error;
  }
}

// =====================================================
// DELETE CLIENT
// =====================================================
export async function deleteClient(id) {
  try {
    console.log('🗑️ Deleting client:', id);
    await del(`${BASE}/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting client:', error);
    
    if (error.status === 404) {
      alert('Delete failed: Backend does not support client delete yet. Backend developer is fixing it.');
    } else {
      alert(`Delete failed: ${error.data?.message || error.message}`);
    }
    
    return false;
  }
}

// =====================================================
// COMPATIBILITY FUNCTIONS
// =====================================================
export async function linkProject(clientId, projectId) {
  return getClientById(clientId);
}

export async function unlinkProject(clientId, projectId) {
  return getClientById(clientId);
}

export async function getProjectsByClient(clientId) {
  const client = await getClientById(clientId);
  return client?.projectsList || [];
}

// =====================================================
// HELPER: Transform backend client → frontend format
// =====================================================
function transformClient(client) {
  if (!client) return null;

  return {
    id: client.id,
    name: client.companyName || client.name || '',
    contact: client.companyEmail || client.email || '',
    email: client.companyEmail || client.email || '',
    status: capitalize(client.status || 'Active'),
    industry: client.industry || 'Not specified',
    owner: client.AccountOwnerName || client.owner || client.name || 'Not specified',
    size: client.companySize || client.size || 'N/A',
    revenue: client.revenu || client.revenue || 0,
    location: client.location || client.address || 'N/A',
    address: client.address || '',
    phone: client.phone || '',
    projects: (client.projects || []).length || client.project_count || 0,
    projectsList: client.projects || [],
    projectIds: (client.projects || []).map((p) => p.id),
    userId: client.user_id || null,
    lastContact: formatDate(client.updated_at || client.created_at),
    createdAt: formatDate(client.created_at),
  };
}

function capitalize(str) {
  if (!str) return '';
  return String(str).charAt(0).toUpperCase() + String(str).slice(1).toLowerCase();
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return 'N/A';
  }
}