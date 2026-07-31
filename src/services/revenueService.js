let revenueRecords = [
  { id: "r1", projectId: "p1", projectName: "Alpha Platform Rebrand", amount: 85000, date: "2026-07-01", status: "Received", client: "SoftCentric Ltd." },
  { id: "r2", projectId: "p2", projectName: "CRM Dashboard", amount: 120000, date: "2026-07-05", status: "Received", client: "Vertex Solutions" },
  { id: "r3", projectId: "p3", projectName: "HR Management System", amount: 65000, date: "2026-07-10", status: "Pending", client: "Novatech Partners" },
  { id: "r4", projectId: "p7", projectName: "Finance Portal", amount: 78000, date: "2026-07-12", status: "Received", client: "SoftCentric Ltd." },
  { id: "r5", projectId: "p4", projectName: "Inventory System", amount: 95000, date: "2026-07-15", status: "Received", client: "Vertex Solutions" },
];

export async function getAllRevenueRecords() {
  return revenueRecords.map((r) => ({ ...r }));
}

export async function getRevenueById(id) {
  return revenueRecords.find((r) => r.id === id) || null;
}

export async function createRevenueRecord(payload) {
  const newRecord = {
    id: `r${Date.now()}`,
    projectId: payload.projectId || "",
    projectName: payload.projectName || "Unassigned",
    amount: Number(payload.amount) || 0,
    date: payload.date || new Date().toISOString().split("T")[0],
    status: payload.status || "Pending",
    client: payload.client || "Unknown",
  };

  revenueRecords.push(newRecord);
  return { ...newRecord };
}

export async function updateRevenueRecord(id, updates) {
  const index = revenueRecords.findIndex((r) => r.id === id);
  if (index === -1) return null;

  revenueRecords[index] = {
    ...revenueRecords[index],
    ...updates,
    amount: updates.amount !== undefined ? Number(updates.amount) : revenueRecords[index].amount,
  };

  return { ...revenueRecords[index] };
}

export async function deleteRevenueRecord(id) {
  const index = revenueRecords.findIndex((r) => r.id === id);
  if (index === -1) return false;

  revenueRecords.splice(index, 1);
  return true;
}

export async function getRevenueSummary(projects, clients) {
  const records = await getAllRevenueRecords();
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
