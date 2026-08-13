import { useCallback, useEffect, useState } from "react";
import {
  getClientProjectDetail,
  getClientProjectProgress,
  getClientMeetingDetail,
  getClientMeetings,
  getClientProjects,
} from "../services/clientApiService";

/**
 * Hook for managing client projects
 */
export function useClientProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getClientProjects();
      setProjects(data || []);
    } catch (err) {
      console.error("Error loading projects:", err);
      setError(err.message || "Failed to load projects");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { projects, loading, error, refetch: load };
}

/**
 * Hook for managing a single project
 */
export function useClientProject(projectId) {
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!projectId) {
      setProject(null);
      setTasks([]);
      setMeetings([]);
      setStatistics(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [projectData, progressData] = await Promise.all([
        getClientProjectDetail(projectId),
        getClientProjectProgress(projectId),
      ]);

      setProject(projectData?.project || projectData);
      setTasks(projectData?.tasks || []);
      setMeetings(projectData?.meetings || []);
      setStatistics(progressData);
    } catch (err) {
      console.error("Error loading project:", err);
      setError(err.message || "Failed to load project");
      setProject(null);
      setTasks([]);
      setMeetings([]);
      setStatistics(null);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    project,
    tasks,
    meetings,
    statistics,
    loading,
    error,
    refetch: load,
  };
}

/**
 * Hook for managing client meetings
 */
export function useClientMeetings() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getClientMeetings();
      setMeetings(data || []);
    } catch (err) {
      console.error("Error loading meetings:", err);
      setError(err.message || "Failed to load meetings");
      setMeetings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { meetings, loading, error, refetch: load };
}

/**
 * Hook for managing a single meeting
 */
export function useClientMeeting(meetingId) {
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!meetingId) {
      setMeeting(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getClientMeetingDetail(meetingId);
      setMeeting(data);
    } catch (err) {
      console.error("Error loading meeting:", err);
      setError(err.message || "Failed to load meeting");
      setMeeting(null);
    } finally {
      setLoading(false);
    }
  }, [meetingId]);

  useEffect(() => {
    load();
  }, [load]);

  return { meeting, loading, error, refetch: load };
}
