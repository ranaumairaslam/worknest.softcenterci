let clients = [
  {
    id: "c1",
    name: "SoftCentric Ltd.",
    contact: "info@softcentric.com",
    status: "Active",
    industry: "Technology",
    owner: "Amina Mir",
    size: "120 Employees",
    revenue: "$1.2M",
    location: "Lahore, PK",
    projects: 2,
    projectIds: ["p1", "p5"],
    lastContact: "2026-07-22",
  },
  {
    id: "c2",
    name: "Vertex Solutions",
    contact: "hello@vertex.com",
    status: "Active",
    industry: "Finance",
    owner: "Bilal Farooq",
    size: "85 Employees",
    revenue: "$920K",
    location: "Karachi, PK",
    projects: 2,
    projectIds: ["p2", "p4"],
    lastContact: "2026-07-18",
  },
  {
    id: "c3",
    name: "Novatech Partners",
    contact: "connect@novatech.com",
    status: "Pending",
    industry: "Healthcare",
    owner: "Sara Iqbal",
    size: "65 Employees",
    revenue: "$540K",
    location: "Islamabad, PK",
    projects: 2,
    projectIds: ["p3", "p6"],
    lastContact: "2026-07-20",
  },
];

export async function getAllClients(role) {
  return clients.map((client) => ({ ...client, projectIds: [...(client.projectIds || [])], role: role || undefined }));
}

export async function getClientById(id) {
  const client = clients.find((c) => c.id === id);
  return client ? { ...client, projectIds: [...(client.projectIds || [])] } : null;
}

export async function getClientByName(name) {
  const client = clients.find((c) => c.name === name);
  return client ? { ...client, projectIds: [...(client.projectIds || [])] } : null;
}

export async function createClient(payload, role) {
  const newClient = {
    id: `c${Date.now()}`,
    name: payload.name,
    contact: payload.contact || "",
    status: payload.status || "Active",
    industry: payload.industry || "Unknown",
    owner: payload.owner || "Unassigned",
    size: payload.size || "Unknown",
    revenue: payload.revenue || "$0",
    location: payload.location || "Unknown",
    projects: 0,
    projectIds: [],
    lastContact: payload.lastContact || "Today",
  };

  const entry = { ...newClient, role: role || undefined };
  clients.push(entry);
  return { ...entry };
}

export async function updateClient(id, updates, role) {
  const index = clients.findIndex((client) => client.id === id);
  if (index === -1) return null;

  clients[index] = { ...clients[index], ...updates, lastModifiedByRole: role || clients[index].lastModifiedByRole };
  return { ...clients[index], projectIds: [...(clients[index].projectIds || [])] };
}

export async function deleteClient(id, role) {
  const index = clients.findIndex((client) => client.id === id);
  if (index === -1) return false;
  clients.splice(index, 1);
  return true;
}

export async function linkProject(clientId, projectId) {
  const client = clients.find((c) => c.id === clientId);
  if (!client) return null;

  if (!client.projectIds) client.projectIds = [];
  if (!client.projectIds.includes(projectId)) {
    client.projectIds.push(projectId);
    client.projects = client.projectIds.length;
  }

  return { ...client, projectIds: [...client.projectIds] };
}

export async function unlinkProject(clientId, projectId) {
  const client = clients.find((c) => c.id === clientId);
  if (!client) return null;

  client.projectIds = (client.projectIds || []).filter((id) => id !== projectId);
  client.projects = client.projectIds.length;

  return { ...client, projectIds: [...client.projectIds] };
}

export async function getProjectsByClient(clientId) {
  const client = await getClientById(clientId);
  if (!client) return [];
  const { getProjectById } = await import("./projectService");
  const projects = await Promise.all((client.projectIds || []).map((id) => getProjectById(id)));
  return projects.filter(Boolean);
}
