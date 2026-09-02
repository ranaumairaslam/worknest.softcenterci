import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import {
  deleteTask,
  updateTeamLeaderTask,
} from "../services/taskService";

import TaskOverviewTable from "../components/Cards/TaskOverviewTable";
import CreateTaskModal from "../components/Cards/CreateTaskModal";
import EditTaskModal from "../components/Cards/EditTaskModal";
import ProjectSearchSelect from "../components/Cards/ProjectSearchSelect";

import { useProjectOversightData } from "../hooks/useProjectOversightData";
import { getMembers } from "../services/teamLeaderService";

export default function TaskOverviewPage() {
  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    data,
    loading,
    error,
  } = useProjectOversightData();

  const [taskList, setTaskList] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // =====================================================
  // LOAD TASKS FROM DATA
  // =====================================================
  useEffect(() => {
    if (!data) return;

    console.log("📥 TASKS FROM API:", data.tasks);

    setTaskList(Array.isArray(data.tasks) ? data.tasks : []);
  }, [data]);

  // =====================================================
  // LOAD TEAM MEMBERS
  // =====================================================
  useEffect(() => {
    let mounted = true;

    async function loadMembers() {
      try {
        console.log("👥 Loading team members...");

        const members = await getMembers();

        console.log("👥 TEAM MEMBERS API RESPONSE:", members);

        if (!mounted) return;

        const formattedMembers = Array.isArray(members)
          ? members.map((member) => ({
              id: member.id,
              name:
                member.name ||
                member.full_name ||
                member.EmployeeName ||
                "Unknown Member",
              avatar:
                member.avatar ||
                (member.name || member.full_name || "?")
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase(),
            }))
          : [];

        console.log(
          "✅ FORMATTED TEAM MEMBERS:",
          formattedMembers
        );

        setTeamMembers(formattedMembers);
      } catch (err) {
        console.error(
          "❌ Failed to load team members:",
          err
        );

        if (mounted) {
          setTeamMembers([]);
        }
      }
    }

    loadMembers();

    return () => {
      mounted = false;
    };
  }, []);

  // =====================================================
  // LOADING
  // =====================================================
  if (loading) {
    return (
      <div className="p-6 text-slate-500 text-sm">
        Loading tasks…
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================
  if (error) {
    return (
      <div className="p-6 text-rose-500 text-sm">
        Failed to load project data.
      </div>
    );
  }

  const summary = data?.summary || {};
  const team = teamMembers;

  // =====================================================
  // CREATE TASK
  // =====================================================
  function handleCreateTask(newTask) {
    console.log("✅ NEW TASK CREATED:", newTask);

    if (
      !newTask?.projectId ||
      String(newTask.projectId) ===
        String(selectedProjectId)
    ) {
      setTaskList((prev) => [
        newTask,
        ...prev,
      ]);
    }

    setShowCreateTask(false);
  }

  // =====================================================
  // UPDATE TASK
  // =====================================================
  async function handleUpdateTask(taskId, updates) {
    const updatedTask = await updateTeamLeaderTask(taskId, {
      name: updates.taskName,
      assigneeName: updates.assigneeName,
      priority: updates.priority,
      ...(updates.dueDate !== undefined
        ? { dueDate: updates.dueDate }
        : {}),
    });

    setTaskList((prev) =>
      prev.map((task) =>
        String(task.id) === String(taskId)
          ? {
              ...task,
              ...updates,
              ...(updatedTask || {}),
            }
          : task
      )
    );

    setEditingTask(null);
  }

  // =====================================================
  // DELETE TASK
  // =====================================================
  // =====================================================
// DELETE TASK
// =====================================================
async function handleDeleteTask(taskId) {
  if (!taskId) return;

  try {
    const success = await deleteTask(taskId);

    if (!success) return;

    setTaskList((prev) =>
      prev.filter(
        (task) => String(task.id) !== String(taskId)
      )
    );
  } catch (error) {
    // No console log
  }
}

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">

      {/* =================================================
          HEADER
      ================================================= */}
      <div className="flex items-center justify-between flex-wrap gap-3">

        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Task Overview
          </h1>

          <p className="text-xs text-slate-400 mt-1">
            Dashboard &gt; Project Oversight &gt; Task Overview
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            console.log(
              "➕ Opening Create Task Modal"
            );

            console.log(
              "👥 Members available:",
              teamMembers
            );

            setShowCreateTask(true);
          }}
          className="flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg"
        >
          <Plus size={14} />
          Create Task
        </button>

      </div>

      {/* =================================================
          PROJECT SELECT
      ================================================= */}
      <div className="flex items-center gap-2">

        <label className="text-sm text-slate-500">
          Project:
        </label>

        {projects && projects.length > 0 ? (
          <ProjectSearchSelect
            projects={projects}
            selectedId={selectedProjectId}
            onSelect={setSelectedProjectId}
          />
        ) : (
          <span className="text-sm font-medium text-slate-800">
            {summary.name || "No Project"}
          </span>
        )}

      </div>

      {/* =================================================
          TASK TABLE
      ================================================= */}
      <TaskOverviewTable
        tasks={taskList}
        onEdit={setEditingTask}
        onDelete={handleDeleteTask}
      />

      {/* =================================================
          CREATE TASK MODAL
      ================================================= */}
      <CreateTaskModal
        open={showCreateTask}
        team={teamMembers}
        projects={projects}
        currentProjectId={selectedProjectId}
        onClose={() =>
          setShowCreateTask(false)
        }
        onCreate={handleCreateTask}
      />

      {/* =================================================
          EDIT TASK MODAL
      ================================================= */}
      <EditTaskModal
        task={editingTask}
        team={teamMembers}
        onClose={() =>
          setEditingTask(null)
        }
        onSave={handleUpdateTask}
      />

    </div>
  );
}