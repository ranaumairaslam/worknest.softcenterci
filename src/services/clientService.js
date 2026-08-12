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
// GET SINGLE CLIENT (frontend fallback — backend route missing)
// =====================================================
export async function getClientById(id) {
  try {
    const all = await getAllClients();
    return all.find((c) => String(c.id) === String(id)) || null;
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
// CREATE CLIENT (creates client + login + initial project)
// =====================================================
export async function createClient(payload) {
  try {
    const body = {
      name: payload.name,
      email: payload.contact || payload.email,
      password: payload.password,
      project_name: payload.projectName || payload.name + ' Project',
      project_description: payload.projectDescription || payload.description || '',
    };

    console.log('📤 Creating client with body:', body);

    const response = await post(BASE, body);
    return transformClient(response?.data);
  } catch (error) {
    console.error('Error creating client:', error);
    
    // Show backend errors
    if (error.data?.message) {
      alert(`Error: ${error.data.message}`);
    }
    
    throw new Error(error.data?.message || error.message || 'Failed to create client');
  }
}

// =====================================================
// UPDATE CLIENT (Backend route missing — will fail gracefully)
// =====================================================
export async function updateClient(id, updates) {
  try {
    const body = {
      name: updates.name,
      email: updates.contact || updates.email,
    };

    console.log('📤 Updating client:', id, body);

    const response = await put(`${BASE}/${id}`, body);
    return transformClient(response?.data);
  } catch (error) {
    console.error('Error updating client:', error);
    
    if (error.status === 404) {
      alert('Update failed: Backend does not support client update yet. Please ask backend developer to add PUT /api/company/clients/:id');
    } else {
      alert(`Update failed: ${error.data?.message || error.message}`);
    }
    
    throw error;
  }
}

// =====================================================
// DELETE CLIENT (Backend route missing — will fail gracefully)
// =====================================================
export async function deleteClient(id) {
  try {
    console.log('🗑️ Deleting client:', id);
    await del(`${BASE}/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting client:', error);
    
    if (error.status === 404) {
      alert('Delete failed: Backend does not support client delete yet. Please ask backend developer to add DELETE /api/company/clients/:id');
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
  return client?.projects || [];
}

// =====================================================
// HELPER: Transform backend client → frontend format
// =====================================================
function transformClient(client) {
  if (!client) return null;

  return {
    id: client.id,
    name: client.name || '',
    contact: client.email || '',
    email: client.email || '',
    status: 'Active',
    industry: client.industry || 'Not specified',
    owner: client.name || 'Not specified',
    size: 'N/A',
    revenue: 0,
    location: 'N/A',
    address: '',
    phone: '',
    projects: (client.projects || []).length,
    projectsList: client.projects || [],
    projectIds: (client.projects || []).map((p) => p.id),
    userId: client.user_id || null,
    lastContact: formatDate(client.created_at),
    createdAt: formatDate(client.created_at),
  };
}

// Helper: Format date
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