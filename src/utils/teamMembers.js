export function resolveTeamMembers(team, employees = []) {
  if (!team) return [];

  const memberIds = team.members || [];
  const seen = new Set();

  const addMember = (member) => {
    if (member && !seen.has(member.id)) {
      seen.add(member.id);
      return member;
    }
    return null;
  };

  const resolved = [];

  // Resolve explicit member ids first. If an id can't be found in the
  // employees list, create a minimal placeholder so counts and UI stay
  // consistent with `team.totalMembers`.
  memberIds.forEach((id) => {
    const found = employees.find((emp) => emp.id === id);
    const placeholder = {
      id,
      name: found ? found.name : `Member ${id}`,
      role: found ? found.role : "Team Member",
      email: found ? found.email : `${id}@softcentric.com`,
      team: team.name,
      status: found ? found.status : "Active",
    };

    const member = addMember(found || placeholder);
    if (member) resolved.push(member);
  });

  employees
    .filter((emp) => emp.team === team.name)
    .forEach((emp) => {
      const member = addMember(emp);
      if (member) resolved.push(member);
    });

  if (team.projectLeader) {
    const leader =
      employees.find((emp) => emp.name === team.projectLeader) ||
      {
        id: `leader-${team.id}`,
        name: team.projectLeader,
        role: "Project Leader",
        email: `${team.projectLeader.toLowerCase().replace(/\s+/g, ".")}@softcentric.com`,
        team: team.name,
        status: "Active",
      };

    const member = addMember(leader);
    if (member) resolved.unshift(member);
  }

  return resolved;
}

export function getTeamMemberCount(team, employees = []) {
  return resolveTeamMembers(team, employees).length;
}
