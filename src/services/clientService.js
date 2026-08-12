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
    console.error('Error fetching client:', error);
    return null;
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
// CREATE CLIENT
// =====================================================
export async function createClient(payload) {
  try {
    // ✅ Revenue ko number bana lein (agar string hai toh)
    let revenueValue = payload.revenue || '0';
    revenueValue = String(revenueValue).replace(/[$,\s]/g, '');
    const revenueNumber = Number(revenueValue) || 0;

    const body = {
      companyName: payload.name,
      companyEmail: payload.contact || payload.email,
      password: payload.password || 'client12345',
      address: payload.address || payload.location || 'N/A',
      industry: payload.industry || '',
      AccountOwnerName: payload.owner || 'Unknown',
      companySize: payload.size || 'N/A',
      revenu: revenueNumber,   // ✅ Number ke tor pe bhej rahe hain
      location: payload.location || payload.address || 'N/A',
    };

    console.log('📤 Creating client with body:', body);

    const response = await post(BASE, body);
    return transformClient(response?.data);
  } catch (error) {
    console.error('Error creating client:', error);
    
    // ✅ Backend errors ko clean format mein throw karein
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
// UPDATE CLIENT
// =====================================================
export async function updateClient(id, updates) {
  try {
    let revenueValue = updates.revenue || '0';
    revenueValue = String(revenueValue).replace(/[$,\s]/g, '');
    const revenueNumber = Number(revenueValue) || 0;

    const body = {
      companyName: updates.name,
      companyEmail: updates.contact || updates.email,
      address: updates.address || updates.location,
      industry: updates.industry,
      AccountOwnerName: updates.owner,
      companySize: updates.size,
      revenu: revenueNumber,
      location: updates.location,
      status: updates.status?.toLowerCase(),
    };

    const response = await put(`${BASE}/${id}`, body);
    return transformClient(response?.data);
  } catch (error) {
    console.error('Error updating client:', error);
    
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
// DELETE CLIENT
// =====================================================
export async function deleteClient(id) {
  try {
    await del(`${BASE}/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting client:', error);
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
  return client?.projectIds || [];
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
    industry: client.industry || 'Unknown',
    owner: client.AccountOwnerName || client.owner || 'Unassigned',
    size: client.companySize || client.size || 'Unknown',
    revenue: client.revenu || client.revenue || 0,
    location: client.location || client.address || 'Unknown',
    address: client.address || '',
    phone: client.phone || '',
    projects: client.project_count || 0,
    projectIds: client.project_ids || [],
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