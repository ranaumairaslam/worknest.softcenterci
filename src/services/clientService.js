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

export async function getAllClients() {
  return clients.map((client) => ({ ...client }));
}

export async function getClientById(id) {
  return clients.find((client) => client.id === id) || null;
}

export async function createClient(payload) {
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

  clients.push(newClient);
  return { ...newClient };
}

export async function updateClient(id, updates) {
  const index = clients.findIndex((client) => client.id === id);
  if (index === -1) return null;

  clients[index] = {
    ...clients[index],
    ...updates,
  };

  return { ...clients[index] };
}

export async function deleteClient(id) {
  const index = clients.findIndex((client) => client.id === id);
  if (index === -1) return false;

  clients.splice(index, 1);
  return true;
}
