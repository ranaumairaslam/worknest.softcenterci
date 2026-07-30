import { useRef, useState } from "react";
import { Download } from "lucide-react";

const initialReports = [
  {
    id: 1,
    name: "Monthly Revenue June 2026",
    category: "Financial",
    size: "15 GB",
    type: "PDF",
    fileObj: null,
  },
  {
    id: 2,
    name: "Company Activity Audit",
    category: "Engineering",
    size: "13 GB",
    type: "CSV",
    fileObj: null,
  },
  {
    id: 3,
    name: "Employee Performance",
    category: "HR",
    size: "8 GB",
    type: "PDF",
    fileObj: null,
  },
  {
    id: 4,
    name: "System Security Report",
    category: "Security",
    size: "5 GB",
    type: "CSV",
    fileObj: null,
  },
];

export default function ReportsPDF() {
  const [reports, setReports] = useState(initialReports);
  const fileInputRef = useRef(null);

  const handleAddReportClick = () => {
    fileInputRef.current.click();
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const extension = file.name.split(".").pop().toUpperCase();

    const newReport = {
      id: Date.now(),
      name: file.name,
      category: "Uncategorized",
      size: formatFileSize(file.size),
      type: extension,
      fileObj: file,
    };

    setReports((prevReports) => [...prevReports, newReport]);

    e.target.value = "";
  };

  const handleDownload = (report) => {
    let url;

    if (report.fileObj) {
      url = URL.createObjectURL(report.fileObj);
    } else {
      const dummyContent = `Report: ${report.name}\nCategory: ${report.category}\nType: ${report.type}`;
      const blob = new Blob([dummyContent], { type: "text/plain" });
      url = URL.createObjectURL(blob);
    }

    const link = document.createElement("a");
    link.href = url;
    link.download = report.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full mt-[30px] bg-white border border-gray-200 rounded-2xl shadow-sm">
      <div className="flex flex-row items-center">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800"> Downloadable Reports</h2>
          <p className="text-sm text-gray-500 mt-1">Scheduled & Pre-Generated Reports</p>
        </div>

        <button
          type="button"
          onClick={handleAddReportClick}
          className="bg-[#016472] h-[50px] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#01535e] transition"
        >
          + Add Report
        </button>

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Report Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">File Size</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium text-gray-800">{report.name}</td>
                <td className="px-6 py-4 text-gray-600">{report.category}</td>
                <td className="px-6 py-4 text-gray-600">{report.size}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    type="button"
                    onClick={() => handleDownload(report)}
                    className="inline-flex items-center gap-2 bg-[#016472] hover:bg-[#015360] text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                  >
                    <Download size={16} />
                    {report.type}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}