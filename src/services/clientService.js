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
    projects: 5,
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
    projects: 3,
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
    lastContact: "2026-07-20",
  },
];

export async function getAllClients(role) {
  console.log("API call: getAllClients", { role });
  return clients.map((client) => ({ ...client, role: role || undefined }));
}

export async function getClientById(id) {
  return clients.find((client) => client.id === id) || null;
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
    projects: payload.projects || 0,
    lastContact: payload.lastContact || "Today",
  };

  const entry = { ...newClient, role: role || undefined };
  clients.push(entry);
  console.log("API call: createClient", { role, payload });
  return { ...entry };
}

export async function updateClient(id, updates, role) {
  const index = clients.findIndex((client) => client.id === id);
  if (index === -1) return null;

  clients[index] = { ...clients[index], ...updates, lastModifiedByRole: role || clients[index].lastModifiedByRole };
  console.log("API call: updateClient", { id, updates, role });
  return { ...clients[index] };
}

export async function deleteClient(id, role) {
  const index = clients.findIndex((client) => client.id === id);
  if (index === -1) return false;

  clients.splice(index, 1);
  console.log("API call: deleteClient", { id, role });
  return true;
}
