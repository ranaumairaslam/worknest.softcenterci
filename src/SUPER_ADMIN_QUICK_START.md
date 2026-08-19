# Super Admin Integration - Quick Start

## 🚀 Fast Setup & Usage

### Service Layer Usage

```javascript
import {
  getSuperAdminDashboard,
  getSuperAdminCompanies,
  getCompanyById,
  createCompany,
  getSuperAdminRevenue,
  exportSuperAdminRevenue
} from "../services/superAdminService";

// Get dashboard
const dashboard = await getSuperAdminDashboard();

// Get companies
const companies = await getSuperAdminCompanies();

// Get single company
const company = await getCompanyById(1);

// Create company
const newCompany = await createCompany({
  name: "New Corp",
  industry: "Tech",
  account_owner: "John",
  email: "john@newcorp.com",
  password: "SecurePass123",
  company_size: "50-100",
  platform_fee: 5000,
  location: "NYC"
});

// Get revenue
const revenue = await getSuperAdminRevenue("paid");

// Export revenue
const csv = await exportSuperAdminRevenue("all");
```

### Hooks Usage

```javascript
// Dashboard Hook
import { useSuperAdminDashboard } from "../hooks/useSuperAdminApi";

function Dashboard() {
  const { data, loading, error, refetch } = useSuperAdminDashboard();
  
  if (loading) return <p>Loading...</p>;
  return <div>{data.total_companies} companies</div>;
}

// Companies Hook
import { useSuperAdminCompanies } from "../hooks/useSuperAdminApi";

function Companies() {
  const {
    companies,
    loading,
    addCompany,
    updateStatus,
    refetch
  } = useSuperAdminCompanies();
  
  return companies.map(c => (
    <div key={c.id}>
      {c.name} - {c.status}
      <button onClick={() => updateStatus(c.id, 'inactive')}>
        Deactivate
      </button>
    </div>
  ));
}

// Revenue Hook
import { useSuperAdminRevenue } from "../hooks/useSuperAdminApi";

function Revenue() {
  const { summary, payments, loading } = useSuperAdminRevenue("paid");
  
  return (
    <div>
      <h2>${summary.total_revenue}</h2>
      <table>
        <tbody>
          {payments.map(p => (
            <tr key={p.id}>
              <td>{p.company}</td>
              <td>${p.revenue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

## 📊 Data Structures

### Dashboard Data
```javascript
{
  total_companies: 15,
  active_companies: 12,
  new_this_month: 3,
  total_employees: 156,
  pending_approval: 1,
  suspended: 2,
  revenue: {
    total: 45000,
    pending: 12000,
    paid_companies: 10,
    failed: 3000
  }
}
```

### Company Data
```javascript
{
  id: 1,
  name: "Tech Corp",
  industry: "Technology",
  account_owner: "John Doe",
  company_size: "50-100",
  platform_fee: 5000,
  location: "New York",
  status: "active",
  payment_status: "paid",
  created_at: "2024-01-15T10:30:00Z",
  admin_user_id: 1,
  admin_name: "John Doe",
  login_email: "john@techcorp.com"
}
```

### Revenue Payment Data
```javascript
{
  id: 1,
  company: "Tech Corp",
  owner: "John Doe",
  revenue: 5000,
  payment_status: "paid",
  location: "New York",
  created_at: "2024-01-15T10:30:00Z"
}
```

## 🔑 Common Operations

### Get Dashboard Stats
```javascript
const dashboard = await getSuperAdminDashboard();
console.log(`Total Companies: ${dashboard.total_companies}`);
console.log(`Revenue: $${dashboard.revenue.total}`);
```

### List Companies with Status
```javascript
const companies = await getSuperAdminCompanies();
companies.forEach(c => {
  console.log(`${c.name}: ${c.status}`);
});
```

### Create New Company
```javascript
const newCompany = await createCompany({
  name: "Acme Corp",
  industry: "Finance",
  account_owner: "Jane Smith",
  email: "jane@acme.com",
  password: "SecurePass123",
  company_size: "20-50",
  platform_fee: 3000,
  location: "Los Angeles",
  status: "active"
});
console.log(`Created company: ${newCompany.id}`);
```

### Update Company Status
```javascript
const updated = await setSuperAdminCompanyStatus(1, "inactive");
console.log(`Company ${updated.id} is now ${updated.status}`);
```

### Get Revenue by Status
```javascript
// All revenue
const all = await getSuperAdminRevenue("all");

// Only paid
const paid = await getSuperAdminRevenue("paid");

// Only pending
const pending = await getSuperAdminRevenue("pending");

console.log(`Total: $${all.summary.total_revenue}`);
console.log(`Paid: $${paid.summary.total_revenue}`);
```

### Export Revenue as CSV
```javascript
const csv = await exportSuperAdminRevenue("paid");

// Download
const blob = new Blob([csv], { type: 'text/csv' });
const url = URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = 'revenue.csv';
link.click();
```

## ⚡ Component Examples

### Dashboard Component
```javascript
export default function Dashboard() {
  const { data, loading, error } = useSuperAdminDashboard();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <h1>Super Admin Dashboard</h1>
      <div className="grid">
        <Card title="Companies" value={data.total_companies} />
        <Card title="Active" value={data.active_companies} />
        <Card title="Revenue" value={`$${data.revenue.total}`} />
        <Card title="Paid Companies" value={data.revenue.paid_companies} />
      </div>
    </div>
  );
}
```

### Companies Table Component
```javascript
export default function CompaniesTable() {
  const { companies, loading, updateStatus } = useSuperAdminCompanies();

  if (loading) return <Spinner />;

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Owner</th>
          <th>Industry</th>
          <th>Status</th>
          <th>Revenue</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {companies.map(company => (
          <tr key={company.id}>
            <td>{company.name}</td>
            <td>{company.account_owner}</td>
            <td>{company.industry}</td>
            <td>{company.status}</td>
            <td>${company.platform_fee}</td>
            <td>
              <StatusButton
                status={company.status}
                onClick={() => updateStatus(
                  company.id,
                  company.status === 'active' ? 'inactive' : 'active'
                )}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### Revenue Page Component
```javascript
export default function RevenuePage() {
  const [status, setStatus] = useState("all");
  const { summary, payments, loading } = useSuperAdminRevenue(status);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const csv = await exportSuperAdminRevenue(status);
      // Download logic...
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <h1>Revenue</h1>
      
      <div className="stats">
        <Stat label="Total" value={`$${summary.total_revenue}`} />
        <Stat label="Pending" value={`$${summary.pending_revenue}`} />
        <Stat label="Paid Companies" value={summary.paid_companies} />
        <Stat label="Failed" value={`$${summary.failed_revenue}`} />
      </div>

      <div className="filters">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
        <button onClick={handleExport} disabled={exporting}>
          {exporting ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>

      <RevenueTable payments={payments} />
    </div>
  );
}
```

## 🎯 Common Patterns

### Pattern: Load and Display with Error Handling
```javascript
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  (async () => {
    try {
      const result = await getSuperAdminDashboard();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  })();
}, []);

if (loading) return <Spinner />;
if (error) return <Error message={error} />;
return <Dashboard data={data} />;
```

### Pattern: Form Submission
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  
  try {
    const company = await createCompany(formData);
    setSuccess(true);
    setTimeout(() => navigate('/companies'), 1500);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

### Pattern: List with Actions
```javascript
const { items, loading, refetch, updateItem } = useItems();

const handleUpdate = async (id, data) => {
  try {
    await updateItem(id, data);
    await refetch();
  } catch (err) {
    setError(err.message);
  }
};
```

## 🔍 Debugging Tips

- Check browser DevTools Network tab for API responses
- Log data in console with `console.log(data)`
- Use React DevTools to inspect component state
- Check backend logs for server-side errors
- Verify authentication token is valid
- Test endpoints with Postman first

## 📦 Import Statements

```javascript
// Services
import {
  getSuperAdminDashboard,
  getSuperAdminCompanies,
  getCompanyById,
  createCompany,
  updateSuperAdminCompany,
  setSuperAdminCompanyStatus,
  getSuperAdminRevenue,
  exportSuperAdminRevenue,
  toCompanyViewModel,
  toRevenuePaymentViewModel
} from "../services/superAdminService";

// Hooks
import {
  useSuperAdminDashboard,
  useSuperAdminCompanies,
  useSuperAdminCompany,
  useSuperAdminRevenue
} from "../hooks/useSuperAdminApi";
```

## ✨ Key Features

✅ Complete API integration  
✅ Error handling & retry  
✅ Loading states  
✅ CSV export  
✅ Company management  
✅ Revenue tracking  
✅ Pagination support  
✅ Status filtering  
✅ Modal dialogs  
✅ Form validation  

---

**Status:** ✅ Ready to Use
