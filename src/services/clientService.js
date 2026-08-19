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
// CREATE CLIENT
// Backend requires: ClientName, Email, password, projectName, ProjectDescription
// =====================================================
export async function createClient(payload) {
  try {
    const body = {
      ClientName: payload.name,
      Email: payload.contact || payload.email,
      password: payload.password || 'client12345',
      projectName: payload.projectName || `${payload.name} - Initial Project`,
      ProjectDescription: 
        payload.projectDescription || 
        `Initial project for ${payload.name}` +
        (payload.industry ? ` (${payload.industry})` : '') +
        (payload.owner ? ` - Owner: ${payload.owner}` : '') +
        (payload.location ? ` - Location: ${payload.location}` : ''),
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
// UPDATE CLIENT ⭐ (Now Works!)
// Backend accepts: ClientName, Email, password, projectName, ProjectDescription
// =====================================================
export async function updateClient(id, updates) {
  try {
    const body = {};
    
    if (updates.name !== undefined) body.ClientName = updates.name;
    if (updates.contact !== undefined || updates.email !== undefined) {
      body.Email = updates.contact || updates.email;
    }
    if (updates.password) body.password = updates.password;
    if (updates.projectName !== undefined) body.projectName = updates.projectName;
    if (updates.projectDescription !== undefined) {
      body.ProjectDescription = updates.projectDescription;
    }

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
// DELETE CLIENT ⭐ (Now Works!)
// =====================================================
export async function deleteClient(id) {
  try {
    console.log('🗑️ Deleting client:', id);
    await del(`${BASE}/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting client:', error);
    alert(`Delete failed: ${error.data?.message || error.message || 'Unknown error'}`);
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
// Handles Capital C naming convention!
// =====================================================
function transformClient(client) {
  if (!client) return null;

  // Backend uses Capital field names — handle both formats
  const name = 
    client.ClientName ||
    client.companyName ||
    client.company_name ||
    client.name ||
    'Unnamed Client';

  const email = 
    client.Email ||
    client.companyEmail ||
    client.company_email ||
    client.email ||
    '';

  const owner = 
    client.AccountOwnerName ||
    client.account_owner_name ||
    client.accountOwnerName ||
    client.owner ||
    name ||
    'Not specified';

  return {
    id: client.id,
    name: name,
    contact: email,
    email: email,
    status: capitalize(client.status || 'Active'),
    industry: client.industry || 'Not specified',
    owner: owner,
    size: client.companySize || client.company_size || client.size || 'N/A',
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