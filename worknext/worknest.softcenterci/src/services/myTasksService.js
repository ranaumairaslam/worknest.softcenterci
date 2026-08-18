export {
  getAllTasks as getMyTasks,
  getTasksByAssignee,
  createTask,
  updateTask as updateTaskStatus,
  deleteTask,
} from "./taskService";

export async function getTaskStats(role) {
  const { getTaskStatistics } = await import("./taskService");
  return getTaskStatistics(role);
}
