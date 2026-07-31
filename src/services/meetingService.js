let meetings = [
  {
    id: "m1",
    title: "Project Review Meeting",
    project: "CRM Dashboard",
    date: "2026-07-30",
    time: "2:00 PM",
    platform: "Google Meet",
    organizer: "Ahmed Khan",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    status: "Scheduled",
    type: "Client",
    participants: ["Sarah Khan", "Ahmed Ali", "Client Rep"],
  },
  {
    id: "m2",
    title: "Sprint Planning",
    project: "AI Recommendation Engine",
    date: "2026-07-31",
    time: "11:00 AM",
    platform: "Microsoft Teams",
    organizer: "Ali Raza",
    meetingLink: "https://teams.microsoft.com/l/meetup-join/xxxx",
    status: "Scheduled",
    type: "Team",
    participants: ["Waleed Hassan", "Areeba Noor", "Ahmed Ali"],
  },
  {
    id: "m3",
    title: "Weekly Team Standup",
    project: "Web Development",
    date: "2026-08-01",
    time: "10:00 AM",
    platform: "Zoom",
    organizer: "Sarah Khan",
    meetingLink: "https://zoom.us/j/123456789",
    status: "Scheduled",
    type: "Team",
    participants: ["Sarah Khan", "Team Members"],
  },
];

export async function getAllMeetings() {
  return meetings.map((m) => ({ ...m, participants: [...m.participants] }));
}

export async function getMeetingById(id) {
  const meeting = meetings.find((m) => m.id === id);
  return meeting ? { ...meeting, participants: [...meeting.participants] } : null;
}

export async function createMeeting(payload) {
  const newMeeting = {
    id: `m${Date.now()}`,
    title: payload.title,
    project: payload.project || "Unassigned",
    date: payload.date || "TBD",
    time: payload.time || "TBD",
    platform: payload.platform || "Online",
    organizer: payload.organizer || "Company Admin",
    meetingLink: payload.meetingLink || "",
    status: payload.status || "Scheduled",
    type: payload.type || "Team",
    participants: payload.participants || [],
  };

  meetings.push(newMeeting);
  return { ...newMeeting, participants: [...newMeeting.participants] };
}

export async function updateMeeting(id, updates) {
  const index = meetings.findIndex((m) => m.id === id);
  if (index === -1) return null;

  meetings[index] = {
    ...meetings[index],
    ...updates,
    participants: updates.participants || meetings[index].participants,
  };

  return { ...meetings[index], participants: [...meetings[index].participants] };
}

export async function deleteMeeting(id) {
  const index = meetings.findIndex((m) => m.id === id);
  if (index === -1) return false;

  meetings.splice(index, 1);
  return true;
}

export async function cancelMeeting(id) {
  return updateMeeting(id, { status: "Cancelled" });
}

export async function inviteParticipants(id, newParticipants) {
  const meeting = meetings.find((m) => m.id === id);
  if (!meeting) return null;

  const combined = [...new Set([...meeting.participants, ...newParticipants])];
  return updateMeeting(id, { participants: combined });
}

export async function getUpcomingMeetings() {
  return meetings
    .filter((m) => m.status === "Scheduled")
    .map((m) => ({ ...m, participants: [...m.participants] }));
}

export async function getMeetingsByType(type) {
  if (type === "All") return getAllMeetings();
  return meetings
    .filter((m) => m.type === type)
    .map((m) => ({ ...m, participants: [...m.participants] }));
}
