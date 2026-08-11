export async function getMeetings() {
  return [
    { id: "mt1", title: "Sprint Planning", date: "2026-08-03", time: "10:00 AM", attendees: ["Sarah L.", "Jane Doe"], link: "https://meet.example.com/sprint-planning" },
    { id: "mt2", title: "Client Review Call", date: "2026-08-05", time: "2:00 PM", attendees: ["Sarah L.", "Sarah Member"], link: "https://meet.example.com/client-review" },
    { id: "mt3", title: "Design Handoff Sync", date: "2026-08-07", time: "11:30 AM", attendees: ["Jane Doe", "Noah Smith"], link: "https://meet.example.com/design-sync" },
  ];
}

export async function createMeeting(meeting) {
  console.log("API call: create meeting", meeting);
  return { ...meeting, id: `mt${Date.now()}` };
}

export async function updateMeeting(id, updates) {
  console.log("API call: update meeting", id, updates);
  return { id, ...updates };
}

export async function cancelMeeting(id) {
  console.log("API call: cancel meeting", id);
  return { id, cancelled: true };
}