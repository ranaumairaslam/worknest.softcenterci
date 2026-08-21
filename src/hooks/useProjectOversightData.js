import { useEffect, useState } from "react";
import {
  getProjects,
  getProjectTasks,
  getTeamMembers,
  getTeamProgressStats,
} from "../services/projectLeaderService";

export function useProjectOversightData() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const [data, setData] = useState({
    summary: {},
    team: [],
    tasks: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* =====================================================
     LOAD PROJECTS
  ===================================================== */

  useEffect(() => {
    let mounted = true;

    async function loadProjects() {
      try {
        setLoading(true);
        setError(null);

        console.log("📡 Loading projects...");

        const result = await getProjects();

        console.log("📁 PROJECTS FROM API:", result);

        if (!mounted) return;

        const projectList = Array.isArray(result)
          ? result
          : [];

        setProjects(projectList);

        if (projectList.length > 0) {
          const firstProjectId = projectList[0].id;

          console.log(
            "🎯 FIRST PROJECT:",
            firstProjectId
          );

          setSelectedProjectId(firstProjectId);
        } else {
          setData({
            summary: {},
            team: [],
            tasks: [],
          });

          setLoading(false);
        }
      } catch (err) {
        console.error(
          "❌ FAILED TO LOAD PROJECTS:",
          err
        );

        if (mounted) {
          setError(err);
          setLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      mounted = false;
    };
  }, []);

  /* =====================================================
     LOAD SELECTED PROJECT DATA
  ===================================================== */

  useEffect(() => {
    if (!selectedProjectId) {
      return;
    }

    let mounted = true;

    async function loadProjectData() {
      try {
        setLoading(true);
        setError(null);

        console.log(
          "🔍 Loading tasks for project:",
          selectedProjectId
        );

        /*
         * Load independently.
         *
         * Agar ek API fail ho jaye to poora page
         * forever loading nahi rahega.
         */

        const tasksPromise = getProjectTasks(
          selectedProjectId
        );

        const teamPromise = getTeamMembers(
          selectedProjectId
        );

        const statsPromise = getTeamProgressStats(
          selectedProjectId
        );

        const [tasksResult, teamResult, statsResult] =
          await Promise.all([
            tasksPromise,
            teamPromise,
            statsPromise,
          ]);

        if (!mounted) return;

        console.log(
          "📦 TASKS API RESPONSE:",
          tasksResult
        );

        console.log(
          "👥 TEAM API RESPONSE:",
          teamResult
        );

        console.log(
          "📊 STATS API RESPONSE:",
          statsResult
        );

        const project = projects.find(
          (p) =>
            String(p.id) ===
            String(selectedProjectId)
        );

        setData({
          summary: {
            ...(project || {}),
            ...(statsResult?.summary || {}),
          },

          team: Array.isArray(teamResult)
            ? teamResult
            : [],

          tasks: Array.isArray(tasksResult)
            ? tasksResult
            : [],
        });

        console.log(
          "✅ TASKS FOR PROJECT:",
          selectedProjectId,
          tasksResult
        );
      } catch (err) {
        console.error(
          "❌ FAILED TO LOAD PROJECT DATA:",
          err
        );

        if (mounted) {
          setError(err);

          /*
           * IMPORTANT:
           * Error ke baad bhi loading false hoga.
           */
          setData((prev) => ({
            ...prev,
            tasks: [],
          }));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProjectData();

    return () => {
      mounted = false;
    };
  }, [selectedProjectId, projects]);

  return {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    data,
    loading,
    error,
  };
}