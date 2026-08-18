import { createProject } from "../services/projectService.js";
import { getActor } from "../services/authContext.js";

async function main() {
  const projectInput = {
    name: "Alpha Platform Rebrand Verification",
    description: "Verify project creation payload resolves leader, team, and client.",
    leader: "Sarah Khan",
    team: "Mobile Team",
    client: "SoftCentric Ltd.",
    dueDate: "2026-09-01",
  };

  const actor = getActor("companyAdmin");
  const project = await createProject(projectInput, actor);

  console.log("Created project payload:", project);
  console.log("Resolved leaderId:", project.leaderId);
  console.log("Resolved teamId:", project.teamId);
  console.log("Resolved clientId:", project.clientId);
  console.log("Resolved memberIds:", project.memberIds);

  if (!project.leaderId) {
    throw new Error("Leader ID was not resolved.");
  }
  if (!project.teamId) {
    throw new Error("Team ID was not resolved.");
  }
  if (!project.clientId) {
    throw new Error("Client ID was not resolved.");
  }
  if (!Array.isArray(project.memberIds) || project.memberIds.length === 0) {
    throw new Error("Member IDs were not populated from team members.");
  }

  console.log("Project payload verification succeeded.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
