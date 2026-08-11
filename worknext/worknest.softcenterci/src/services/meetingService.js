import { normalizeFilters, getActor } from "./authContext";
import { filterMeetings } from "../utils/roleFilter";
import { onMeetingScheduled } from "./syncService";

let meetings = [
  {
    id: "m1",
    title: "Project Review Meeting",
    project: "CRM Dashboard",
    projectId: "p2",
    clientId: "c2",
    date: "2026-07-30",
    time: "2:00 PM",
    platform: "Google Meet",
    organizer: "Ahmed Khan",
    organizerId: "e2",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    status: "Scheduled",
    type: "Client",
    participants: ["Sarah Khan", "Ahmed Ali", "Client Rep"],
    participantIds: ["e1", "e2", "c1"],
  },
  {
    id: "m2",
    title: "Sprint Planning",
    project: "AI Recommendation Engine",
    projectId: "p6",
    teamId: "tm5",
    date: "2026-07-31",
    time: "11:00 AM",
    platform: "Microsoft Teams",
    organizer: "Waleed Hassan",
    organizerId: "e5",
    meetingLink: "https://teams.microsoft.com/l/meetup-join/xxxx",
    status: "Scheduled",
    type: "Team",
    participants: ["Waleed Hassan", "Areeba Noor", "Ahmed Ali"],
    participantIds: ["e5", "e3", "e2"],
  },
  {
    id: "m3",
    title: "Weekly Team Standup",
    project: "Alpha Platform Rebrand",
    projectId: "p1",
    teamId: "tm1",
    date: "2026-08-01",
    time: "10:00 AM",
    platform: "Zoom",
    organizer: "Sarah Khan",
    organizerId: "e1",
    meetingLink: "https://zoom.us/j/123456789",
    status: "Scheduled",
    type: "Team",
    participants: ["Sarah Khan"],
    participantIds: ["e1", "e7", "e8"],
  },
];

export async function getAllMeetings(roleOrFilters) {
  const filters = normalizeFilters(roleOrFilters);
  return filterMeetings(meetings, filters).map((m) => ({
    ...m,
    participants: [...m.participants],
    participantIds: [...(m.participantIds || [])],
  }));
}

export async function getMeetingById(id) {
  const meeting = meetings.find((m) => m.id === id);
  return meeting ? { ...meeting, participants: [...meeting.participants] } : null;
}

export async function createMeeting(payload, roleOrActor) {
  const actor = typeof roleOrActor === "object" && roleOrActor?.role
    ? roleOrActor
    : getActor(typeof roleOrActor === "string" ? roleOrActor : "companyAdmin");

  const newMeeting = {
    id: `m${Date.now()}`,
    title: payload.title,
    project: payload.project || "Unassigned",
    projectId: payload.projectId || null,
    teamId: payload.teamId || null,
    clientId: payload.clientId || null,
    date: payload.date || "TBD",
    time: payload.time || "TBD",
    platform: payload.platform || "Online",
    organizer: payload.organizer || actor.name,
    organizerId: payload.organizerId || actor.employeeId || actor.id,
    meetingLink: payload.meetingLink || "",
    status: payload.status || "Scheduled",
    type: payload.type || "Team",
    participants: payload.participants || [],
    participantIds: payload.participantIds || [],
  };

  meetings.push(newMeeting);
  await onMeetingScheduled(newMeeting, actor);

  return { ...newMeeting, participants: [...newMeeting.participants], participantIds: [...newMeeting.participantIds] };
}

export async function updateMeeting(id, updates, role) {
  const index = meetings.findIndex((m) => m.id === id);
  if (index === -1) return null;

  meetings[index] = {
    ...meetings[index],
    ...updates,
    participants: updates.participants || meetings[index].participants,
    lastModifiedByRole: role || meetings[index].lastModifiedByRole,
  };

  console.log("API call: updateMeeting", { id, updates, role });

  return { ...meetings[index], participants: [...meetings[index].participants] };
}

export async function deleteMeeting(id, role) {
  const index = meetings.findIndex((m) => m.id === id);
  if (index === -1) return false;

  meetings.splice(index, 1);
  console.log("API call: deleteMeeting", { id, role });
  return true;
}

export async function cancelMeeting(id, role) {
  return updateMeeting(id, { status: "Cancelled" }, role);
}

export async function inviteParticipants(id, newParticipants, role) {
  const meeting = meetings.find((m) => m.id === id);
  if (!meeting) return null;

  const combined = [...new Set([...meeting.participants, ...newParticipants])];
  return updateMeeting(id, { participants: combined }, role);
}

export async function getUpcomingMeetings(role) {
  console.log("API call: getUpcomingMeetings", { role });
  return meetings
    .filter((m) => m.status === "Scheduled")
    .map((m) => ({ ...m, participants: [...m.participants], role: role || undefined }));
}

export async function getMeetingsByType(type, role) {
  if (type === "All") return getAllMeetings(role);
  return meetings
    .filter((m) => m.type === type)
    .map((m) => ({ ...m, participants: [...m.participants], role: role || undefined }));
}
