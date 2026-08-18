let revenueRecords = [
  { id: "r1", projectId: "p1", projectName: "Alpha Platform Rebrand", amount: 85000, date: "2026-07-01", status: "Received", client: "SoftCentric Ltd." },
  { id: "r2", projectId: "p2", projectName: "CRM Dashboard", amount: 120000, date: "2026-07-05", status: "Received", client: "Vertex Solutions" },
  { id: "r3", projectId: "p3", projectName: "HR Management System", amount: 65000, date: "2026-07-10", status: "Pending", client: "Novatech Partners" },
  { id: "r4", projectId: "p7", projectName: "Finance Portal", amount: 78000, date: "2026-07-12", status: "Received", client: "SoftCentric Ltd." },
  { id: "r5", projectId: "p4", projectName: "Inventory System", amount: 95000, date: "2026-07-15", status: "Received", client: "Vertex Solutions" },
];

/**
 * Get all revenue records. Optional role parameter for audit/filtering.
 * @param {string} [role]
 */
export async function getAllRevenueRecords(role) {
  console.log("API call: getAllRevenueRecords", { role });
  return revenueRecords.map((r) => ({ ...r, role: role || undefined }));
}

/**
 * Get a revenue record by id.
 * @param {string} id
 * @param {string} [role]
 */
export async function getRevenueById(id, role) {
  console.log("API call: getRevenueById", { id, role });
  return revenueRecords.find((r) => r.id === id) || null;
}

/**
 * Create a revenue record.
 * @param {object} payload
 * @param {string} [role]
 */
export async function createRevenueRecord(payload, role) {
  const newRecord = {
    id: `r${Date.now()}`,
    projectId: payload.projectId || "",
    projectName: payload.projectName || "Unassigned",
    amount: Number(payload.amount) || 0,
    date: payload.date || new Date().toISOString().split("T")[0],
    status: payload.status || "Pending",
    client: payload.client || "Unknown",
  };

  const entry = { ...newRecord, role: role || undefined };
  revenueRecords.push(entry);
  console.log("API call: createRevenueRecord", { role, payload });
  return { ...entry };
}

/**
 * Update a revenue record.
 * @param {string} id
 * @param {object} updates
 * @param {string} [role]
 */
export async function updateRevenueRecord(id, updates, role) {
  const index = revenueRecords.findIndex((r) => r.id === id);
  if (index === -1) return null;

  revenueRecords[index] = {
    ...revenueRecords[index],
    ...updates,
    amount: updates.amount !== undefined ? Number(updates.amount) : revenueRecords[index].amount,
  };

  revenueRecords[index] = { ...revenueRecords[index], lastModifiedByRole: role || revenueRecords[index].lastModifiedByRole };
  console.log("API call: updateRevenueRecord", { id, updates, role });
  return { ...revenueRecords[index] };
}

/**
 * Delete a revenue record.
 * @param {string} id
 * @param {string} [role]
 */
export async function deleteRevenueRecord(id, role) {
  const index = revenueRecords.findIndex((r) => r.id === id);
  if (index === -1) return false;

  revenueRecords.splice(index, 1);
  console.log("API call: deleteRevenueRecord", { id, role });
  return true;
}

/**
 * Compute revenue summary across projects/clients; role optional.
 * @param {Array} projects
 * @param {Array} clients
 * @param {string} [role]
 */
export async function getRevenueSummary(projects, clients, role) {
  const records = await getAllRevenueRecords(role);
  const projectRevenue = projects.reduce((sum, project) => sum + (project.revenue || 0), 0);
  const recordTotal = records.reduce((sum, r) => sum + r.amount, 0);
  const totalRevenue = Math.max(projectRevenue, recordTotal);

  const revenuePerProject = projects.map((project) => ({
    id: project.id,
    name: project.name,
    value: project.revenue || records.filter((r) => r.projectId === project.id).reduce((s, r) => s + r.amount, 0),
  }));

  const monthlyMap = records.reduce((acc, record) => {
    const month = record.date ? record.date.slice(0, 7) : "Unknown";
    acc[month] = (acc[month] || 0) + record.amount;
    return acc;
  }, {});

  return {
    totalRevenue,
    monthlyRevenue: Object.entries(monthlyMap).map(([month, value]) => ({ month, value })),
    revenuePerProject,
    records,
    clientCount: clients?.length || 0,
  };
}
