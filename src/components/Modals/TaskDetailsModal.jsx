import { X, Download, Eye, FileText } from "lucide-react";

export default function TaskDetailsModal({ task, onClose }) {
  if (!task) return null;

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // FIXED: Check all possible assignee fields including assignee_name from backend
  const assigneeName = 
    task.assignee_name ||           // Backend se aa rahi field (console me dikh raha hai)
    task.assigneeName ||            // Frontend mapped field
    task.assignee?.name ||          // Object structure agar ho
    task.assignedTo?.name ||        // Alternative object
    task.user?.name ||              // One more fallback
    "Unassigned";

  const assigneeInitial = assigneeName.charAt(0).toUpperCase();

  const handleDownloadFile = async () => {
    if (!task.submission?.filePath) {
      alert("No file submitted yet!");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${task.submission.filePath}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('worknest_token')}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = task.submission.fileName || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        alert('Failed to download file');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Error downloading file');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-800">
            Task Details
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">

          <div>
            <p className="text-xs font-medium text-slate-400">
              TASK TITLE
            </p>
            <p className="text-sm font-semibold text-slate-800 mt-1">
              {task.title || "Untitled Task"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-400">
              DESCRIPTION
            </p>
            <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap">
              {task.description || "No description available."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">

            <div>
              <p className="text-xs font-medium text-slate-400">
                STATUS
              </p>
              <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${
                task.status === 'under_review' ? 'bg-blue-100 text-blue-700' :
                task.status === 'done' || task.status === 'completed' ? 'bg-green-100 text-green-700' :
                task.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {task.status ? task.status.replace(/_/g, ' ').toUpperCase() : "Pending"}
              </span>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400">
                ASSIGNED TO
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold flex items-center justify-center">
                  {assigneeInitial}
                </div>
                <p className="text-sm text-slate-700">{assigneeName}</p>
              </div>
            </div>

          </div>

          {task.priority && (
            <div>
              <p className="text-xs font-medium text-slate-400">
                PRIORITY
              </p>
              <p className="text-sm text-slate-700 mt-1 capitalize">
                {task.priority}
              </p>
            </div>
          )}

          {task.dueDate || task.due_date && (
            <div>
              <p className="text-xs font-medium text-slate-400">
                DUE DATE
              </p>
              <p className="text-sm text-slate-700 mt-1">
                {formatDate(task.dueDate || task.due_date)}
              </p>
            </div>
          )}

          {/* NEW: Submission Section with File Download */}
          <div className="border-t border-slate-200 pt-4 mt-4">
            <p className="text-xs font-medium text-slate-400 mb-3">SUBMISSION</p>
            
            {task.submission && task.submission.filePath ? (
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <FileText size={18} className="text-blue-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {task.submission.fileName}
                    </p>
                    <p className="text-xs text-slate-500">
                      Submitted: {formatDate(task.submission.submittedAt)}
                    </p>
                    
                    {task.submission.description && (
                      <p className="text-xs text-slate-600 mt-2 italic p-2 bg-white rounded border border-slate-200">
                        "{task.submission.description}"
                      </p>
                    )}
                  </div>

                  <button
                    onClick={handleDownloadFile}
                    className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors flex-shrink-0"
                  >
                    <Download size={12} />
                    Download
                  </button>
                </div>

                {/* Image Preview */}
                {task.submission.fileType?.includes('image') && (
                  <img 
                    src={`${API_BASE_URL}${task.submission.filePath}`} 
                    alt="Preview"
                    className="mt-3 w-full h-48 object-contain rounded-lg border border-slate-200"
                  />
                )}

                {/* PDF Preview */}
                {task.submission.fileType?.includes('pdf') && (
                  <iframe
                    src={`${API_BASE_URL}${task.submission.filePath}`}
                    className="mt-3 w-full h-64 border border-slate-200 rounded-lg"
                    title="PDF Preview"
                  />
                )}
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-2">
                <FileText size={16} className="text-yellow-600 flex-shrink-0" />
                <p className="text-sm text-yellow-800">
                  No file has been submitted for this task yet.
                </p>
              </div>
            )}
          </div>

        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full mt-6 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium py-2 rounded-lg"
        >
          Close
        </button>

      </div>
    </div>
  );
}