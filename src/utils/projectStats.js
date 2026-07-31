/**
 * Maps a stat card's `id` to a function that derives its live value
 * from the current task list. Any stat id NOT listed here (e.g.
 * "team", "overdue", "remaining") is left untouched, since those
 * aren't derivable from the task list alone.
 */
const STAT_CALCULATORS = {
  total: (tasks) => tasks.length,

  completed: (tasks) => tasks.filter((t) => t.status === "Completed").length,

  "in-progress": (tasks) => tasks.filter((t) => t.status === "In Progress").length,

  pending: (tasks) => tasks.filter((t) => t.status === "Pending").length,

  completion: (tasks) => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "Completed").length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    return `${percent}%`;
  },
};

/**
 * Returns a new stats array where every stat with a matching
 * calculator gets a live, recalculated value. Stats without a
 * calculator pass through unchanged.
 */
export function computeLiveStats(baseStats, tasks) {
  return baseStats.map((stat) => {
    const calculate = STAT_CALCULATORS[stat.id];
    if (!calculate) return stat;
    return { ...stat, value: String(calculate(tasks)) };
  });
}

/**
 * Returns a new project summary object with tasksTotal,
 * tasksCompleted, and progress recalculated from the live task list.
 */
export function computeLiveSummary(summary, tasks) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "Completed").length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return {
    ...summary,
    tasksTotal: total,
    tasksCompleted: completed,
    progress,
  };
}