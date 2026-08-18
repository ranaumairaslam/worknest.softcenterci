import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Upload, FileImage, X } from "lucide-react";
import { createCompany, updateSuperAdminCompany } from "../../services/superAdminService.js";

export default function AddCompany() {
  const navigate = useNavigate();
  const location = useLocation();
  const companyToEdit = location.state?.company || null;

  const [formData, setFormData] = useState({
    companyName: companyToEdit?.name || "",
    industry: companyToEdit?.industry || "",
    owner: companyToEdit?.owner || "",
    email: companyToEdit?.email || "",
    password: companyToEdit?.password || "",
    size: companyToEdit?.size || "",
    revenue: companyToEdit?.revenue
      ? String(companyToEdit.revenue).replace("$", "")
      : "",
    location: companyToEdit?.location || "",
    status: companyToEdit?.status || "Active",
    paymentStatus: companyToEdit?.paymentStatus || companyToEdit?.Buy || "Pending",
    receipt: companyToEdit?.receipt || null,
    receiptName: companyToEdit?.receiptName || ""
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const isEditMode = Boolean(companyToEdit);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleReceiptChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, receipt: "Please upload an image file." }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, receipt: "Receipt image must be less than 5MB." }));
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        receipt: reader.result,
        receiptName: file.name
      }));
      setErrors((prev) => ({ ...prev, receipt: "" }));
      setIsUploading(false);
    };

    reader.onerror = () => {
      setErrors((prev) => ({ ...prev, receipt: "Unable to upload receipt." }));
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const removeReceipt = () => {
    setFormData((prev) => ({
      ...prev,
      receipt: null,
      receiptName: ""
    }));
    setErrors((prev) => ({ ...prev, receipt: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.companyName.trim()) newErrors.companyName = "Company name is required";
    if (!formData.industry) newErrors.industry = "Please select an industry";
    if (!formData.owner.trim()) newErrors.owner = "Account owner is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.size.trim()) newErrors.size = "Company size is required";

    if (!formData.revenue.trim()) {
      newErrors.revenue = "Payment is required";
    } else if (Number(formData.revenue) <= 0) {
      newErrors.revenue = "Payment must be greater than $0";
    }

    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.status) newErrors.status = "Please select company status";
    if (!formData.paymentStatus) newErrors.paymentStatus = "Please select payment status";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
  if (isEditMode) {
  await updateSuperAdminCompany(companyToEdit.id, {
    companyName: formData.companyName.trim(),
    ownerName: formData.owner.trim(),
    account_owner: formData.owner.trim(),
    industry: formData.industry,
    address: formData.location.trim(),
    location: formData.location.trim(),
    company_size: formData.size.trim(),
    platform_fee: formData.revenue.replace("$", "").trim(),
    status: formData.status.toLowerCase(),
    payment_status: formData.paymentStatus.toLowerCase(),
  });
}
       else {
        await createCompany({
  companyName: formData.companyName.trim(),
  ownerName: formData.owner.trim(),
  account_owner: formData.owner.trim(),
  email: formData.email.trim(),
  password: formData.password,
  industry: formData.industry,
  address: formData.location.trim(),
  location: formData.location.trim(),
  company_size: formData.size.trim(),
  platform_fee: formData.revenue.trim(),
});
      }
      navigate("/companies", { replace: true, state: { refreshCompanies: Date.now() } });
    } catch (error) {
      setErrors({ submit: error.message || "Unable to save company." });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto mb-6">
        <Link to="/companies" className="inline-flex items-center gap-2 text-gray-600 hover:text-[#016472] mb-4 transition">
          <ArrowLeft size={18} />
          Back to Companies
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          {isEditMode ? "Edit Company" : "Add New Company"}
        </h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">
          {isEditMode ? "Update company information and login credentials." : "Add company information and create login credentials."}
        </p>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm">
        <form onSubmit={handleSubmit} noValidate>
          {errors.submit && <p className="mx-5 mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-600">{errors.submit}</p>}
          <div className="px-5 sm:px-8 py-5 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Company Information</h2>
            <p className="text-sm text-gray-500 mt-1">Enter the details and login credentials for the company.</p>
          </div>

          <div className="p-5 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
              <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Enter company name" className={`w-full px-4 py-3 border rounded-lg outline-none transition ${errors.companyName ? "border-red-500" : "border-gray-300 focus:border-[#016472] focus:ring-1 focus:ring-[#016472]"}`} />
              {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Industry</label>
              <select name="industry" value={formData.industry} onChange={handleChange} className={`w-full px-4 py-3 border rounded-lg outline-none bg-white transition ${errors.industry ? "border-red-500" : "border-gray-300 focus:border-[#016472] focus:ring-1 focus:ring-[#016472]"}`}>
                <option value="">Choose Industry</option>
                <option value="Web Development">Web Development</option>
                <option value="Software Development">Software Development</option>
                <option value="Mobile App Development">Mobile App Development</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="Data Science">Data Science</option>
                <option value="Cloud Computing">Cloud Computing</option>
                <option value="Cyber Security">Cyber Security</option>
                <option value="IT Consulting">IT Consulting</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="E-Commerce">E-Commerce</option>
                <option value="SaaS">SaaS</option>
                <option value="Finance">Finance</option>
                <option value="Other">Other</option>
              </select>
              {errors.industry && <p className="text-red-500 text-xs mt-1">{errors.industry}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Account Owner</label>
              <input type="text" name="owner" value={formData.owner} onChange={handleChange} placeholder="Enter account owner" className={`w-full px-4 py-3 border rounded-lg outline-none transition ${errors.owner ? "border-red-500" : "border-gray-300 focus:border-[#016472] focus:ring-1 focus:ring-[#016472]"}`} />
              {errors.owner && <p className="text-red-500 text-xs mt-1">{errors.owner}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Company Login Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="e.g. admin@company.com" className={`w-full px-4 py-3 border rounded-lg outline-none transition ${errors.email ? "border-red-500" : "border-gray-300 focus:border-[#016472] focus:ring-1 focus:ring-[#016472]"}`} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              <p className="text-xs text-gray-400 mt-1">Company will use this email to login.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Company Login Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="Enter login password" className={`w-full px-4 pr-12 py-3 border rounded-lg outline-none transition ${errors.password ? "border-red-500" : "border-gray-300 focus:border-[#016472] focus:ring-1 focus:ring-[#016472]"}`} />
                <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#016472] transition">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              <p className="text-xs text-gray-400 mt-1">Minimum 6 characters.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Company Size</label>
              <input type="text" name="size" value={formData.size} onChange={handleChange} placeholder="e.g. 20 Employees" className={`w-full px-4 py-3 border rounded-lg outline-none transition ${errors.size ? "border-red-500" : "border-gray-300 focus:border-[#016472] focus:ring-1 focus:ring-[#016472]"}`} />
              {errors.size && <p className="text-red-500 text-xs mt-1">{errors.size}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Payment</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                <input type="number" name="revenue" value={formData.revenue} onChange={handleChange} placeholder="Amount" min="1" step="0.01" className={`w-full pl-8 pr-4 py-3 border rounded-lg outline-none transition ${errors.revenue ? "border-red-500" : "border-gray-300 focus:border-[#016472] focus:ring-1 focus:ring-[#016472]"}`} />
              </div>
              {errors.revenue && <p className="text-red-500 text-xs mt-1">{errors.revenue}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Arifwala, Punjab" className={`w-full px-4 py-3 border rounded-lg outline-none transition ${errors.location ? "border-red-500" : "border-gray-300 focus:border-[#016472] focus:ring-1 focus:ring-[#016472]"}`} />
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Company Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none bg-white focus:border-[#016472] focus:ring-1 focus:ring-[#016472]">
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Status</label>
              <select name="paymentStatus" value={formData.paymentStatus} onChange={handleChange} className={`w-full px-4 py-3 border rounded-lg outline-none bg-white transition ${errors.paymentStatus ? "border-red-500" : "border-gray-300 focus:border-[#016472] focus:ring-1 focus:ring-[#016472]"}`}>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Failed">Failed</option>
              </select>
              {errors.paymentStatus && <p className="text-red-500 text-xs mt-1">{errors.paymentStatus}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Receipt</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-5 sm:p-6 hover:border-[#016472] transition">
                {!formData.receipt ? (
                  <label htmlFor="receipt-upload" className="flex flex-col items-center justify-center cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-[#a3feff]/40 flex items-center justify-center mb-3">
                      <Upload size={22} className="text-[#016472]" />
                    </div>
                    <p className="text-sm font-semibold text-gray-700 text-center">{isUploading ? "Uploading..." : "Upload Payment Receipt"}</p>
                    <p className="text-xs text-gray-400 text-center mt-1">Click to select receipt from computer or mobile gallery</p>
                    <p className="text-xs text-gray-400 mt-2">JPG, JPEG, PNG • Maximum 5MB</p>
                    <input id="receipt-upload" type="file" accept="image/*" onChange={handleReceiptChange} className="hidden" />
                  </label>
                ) : (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="relative shrink-0">
                      <img src={formData.receipt} alt="Payment Receipt" className="w-24 h-24 object-cover rounded-lg border border-gray-200" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <FileImage size={20} className="text-[#016472] shrink-0" />
                        <p className="text-sm font-medium text-gray-700 truncate">{formData.receiptName || "Payment Receipt"}</p>
                      </div>
                      <p className="text-xs text-green-600 mt-1">Receipt uploaded successfully</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <label htmlFor="receipt-change" className="cursor-pointer inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-[#016472] bg-[#a3feff]/30 rounded-lg hover:bg-[#a3feff]/50 transition">
                          <Upload size={14} />
                          Change Receipt
                          <input id="receipt-change" type="file" accept="image/*" onChange={handleReceiptChange} className="hidden" />
                        </label>
                        <button type="button" onClick={removeReceipt} className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition">
                          <X size={14} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {errors.receipt && <p className="text-red-500 text-xs mt-1">{errors.receipt}</p>}
              <p className="text-xs text-gray-400 mt-2">Upload a clear picture of the payment receipt.</p>
            </div>
          </div>

          <div className="px-5 sm:px-8 py-5 border-t border-gray-200 flex flex-col-reverse sm:flex-row justify-end gap-3">
            <Link to="/companies" className="w-full sm:w-auto text-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition">
              Cancel
            </Link>
            <button type="submit" className="w-full sm:w-auto px-6 py-3 bg-[#016472] text-white rounded-lg font-medium hover:bg-[#01535e] transition">
              {isEditMode ? "Update Company" : "Add Company"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
