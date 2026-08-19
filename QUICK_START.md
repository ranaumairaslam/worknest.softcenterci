# Client API Quick Start Guide

## 🚀 Quick Examples

### 1. Display Dashboard Data

```javascript
// ClientDashboard.jsx
import { useEffect, useState } from "react";
import { getClientDashboard } from "../services/clientDashboardService";

export default function ClientDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      try {
        const result = await getClientDashboard();
        if (mounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadDashboard();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Welcome, {data.client.name}</h1>
      <div className="stats">
        <p>Projects: {data.statistics.projects}</p>
        <p>Progress: {data.statistics.progress}%</p>
        <p>Meetings: {data.statistics.meetings}</p>
        <p>Tasks: {data.statistics.tasks}</p>
      </div>
    </div>
  );
}
```

### 2. Using Hooks

```javascript
// ProjectsList.jsx
import { useClientProjects } from "../hooks/useClientApi";

export default function ProjectsList() {
  const { projects, loading, error, refetch } = useClientProjects();

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {projects.map(project => (
        <div key={project.id}>
          <h3>{project.name}</h3>
          <p>Progress: {project.progress}%</p>
          <p>Status: {project.status}</p>
        </div>
      ))}
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

### 3. Project Details

```javascript
// ProjectDetail.jsx
import { useClientProject } from "../hooks/useClientApi";

export default function ProjectDetail({ projectId }) {
  const { project, tasks, meetings, statistics, loading, error } = 
    useClientProject(projectId);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>{project.name}</h1>
      <p>{project.description}</p>
      
      <h2>Tasks ({tasks.length})</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <strong>{task.title}</strong> - {task.status}
          </li>
        ))}
      </ul>

      <h2>Meetings ({meetings.length})</h2>
      <ul>
        {meetings.map(meeting => (
          <li key={meeting.id}>
            {meeting.title} - {meeting.scheduled_at}
          </li>
        ))}
      </ul>

      <h2>Progress: {statistics.progress}%</h2>
      <div style={{
        width: '100%',
        height: '10px',
        backgroundColor: '#eee',
        borderRadius: '5px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${statistics.progress}%`,
          height: '100%',
          backgroundColor: '#4CAF50',
          transition: 'width 0.3s'
        }} />
      </div>
    </div>
  );
}
```

### 4. Meetings List

```javascript
// MeetingsList.jsx
import { useClientMeetings } from "../hooks/useClientApi";

export default function MeetingsList() {
  const { meetings, loading, error } = useClientMeetings();

  if (loading) return <p>Loading meetings...</p>;
  if (error) return <p>Error: {error}</p>;

  const upcomingMeetings = meetings.filter(m => 
    new Date(m.scheduled_at) > new Date()
  );

  return (
    <div>
      <h2>Upcoming Meetings ({upcomingMeetings.length})</h2>
      {upcomingMeetings.length === 0 ? (
        <p>No upcoming meetings</p>
      ) : (
        <ul>
          {upcomingMeetings.map(meeting => (
            <li key={meeting.id}>
              <h3>{meeting.title}</h3>
              <p>Time: {new Date(meeting.scheduled_at).toLocaleString()}</p>
              <p>Status: {meeting.status}</p>
              {meeting.meeting_link && (
                <a href={meeting.meeting_link} target="_blank" rel="noreferrer">
                  Join Meeting
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### 5. Create Meeting

```javascript
// CreateMeeting.jsx
import { useState } from "react";
import { createClientMeeting } from "../services/clientApiService";

export default function CreateMeeting() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduled_at: '',
    meeting_link: '',
    status: 'scheduled'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const meeting = await createClientMeeting(formData);
      setSuccess(true);
      setFormData({
        title: '',
        description: '',
        scheduled_at: '',
        meeting_link: '',
        status: 'scheduled'
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Meeting Title"
        value={formData.title}
        onChange={(e) => setFormData({...formData, title: e.target.value})}
        required
      />

      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
      />

      <input
        type="datetime-local"
        value={formData.scheduled_at}
        onChange={(e) => setFormData({...formData, scheduled_at: e.target.value})}
        required
      />

      <input
        type="url"
        placeholder="Meeting Link"
        value={formData.meeting_link}
        onChange={(e) => setFormData({...formData, meeting_link: e.target.value})}
      />

      {error && <div style={{color: 'red'}}>{error}</div>}
      {success && <div style={{color: 'green'}}>Meeting created successfully!</div>}

      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Meeting'}
      </button>
    </form>
  );
}
```

### 6. Single Meeting Detail

```javascript
// MeetingDetail.jsx
import { useClientMeeting } from "../hooks/useClientApi";

export default function MeetingDetail({ meetingId }) {
  const { meeting, loading, error, refetch } = useClientMeeting(meetingId);

  if (loading) return <p>Loading meeting...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!meeting) return <p>Meeting not found</p>;

  return (
    <div>
      <h1>{meeting.title}</h1>
      <p>{meeting.description}</p>
      
      <div>
        <p><strong>Date & Time:</strong> {new Date(meeting.scheduled_at).toLocaleString()}</p>
        <p><strong>Status:</strong> {meeting.status}</p>
        <p><strong>Company:</strong> {meeting.company_name}</p>
      </div>

      {meeting.meeting_link && (
        <div>
          <a href={meeting.meeting_link} target="_blank" rel="noreferrer">
            Join Meeting
          </a>
        </div>
      )}

      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

## 📋 Common Patterns

### Pattern 1: Data with Error Handling

```javascript
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  let mounted = true;

  (async () => {
    try {
      const result = await fetchData();
      if (mounted) setData(result);
    } catch (err) {
      if (mounted) setError(err);
    } finally {
      if (mounted) setLoading(false);
    }
  })();

  return () => { mounted = false; };
}, []);
```

### Pattern 2: With Refetch

```javascript
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);

const loadData = async () => {
  setLoading(true);
  try {
    const result = await fetchData();
    setData(result);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  loadData();
}, []);

return (
  <div>
    {/* Display data */}
    <button onClick={loadData}>Refresh</button>
  </div>
);
```

### Pattern 3: Form Submission

```javascript
const [formData, setFormData] = useState({});
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    await createItem(formData);
    // Reset form or redirect
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

return (
  <form onSubmit={handleSubmit}>
    {/* form fields */}
    {error && <div>{error}</div>}
    <button type="submit" disabled={loading}>
      {loading ? 'Saving...' : 'Submit'}
    </button>
  </form>
);
```

## 🔗 Import Statements

```javascript
// Services
import { getClientDashboard } from "../services/clientDashboardService";
import { 
  getClientProjects, 
  getClientProjectDetail,
  getClientMeetings,
  createClientMeeting 
} from "../services/clientApiService";

// Hooks
import {
  useClientProjects,
  useClientProject,
  useClientMeetings,
  useClientMeeting
} from "../hooks/useClientApi";
```

## 🎯 Best Practices

✅ Always check `mounted` flag before setState in useEffect  
✅ Add error handling for all API calls  
✅ Show loading states to users  
✅ Display empty states when data is not available  
✅ Use hooks for reusable logic  
✅ Keep components focused on presentation  
✅ Log errors to console for debugging  
✅ Add try-catch blocks around async operations  

## 🐛 Common Issues & Solutions

### Issue: "Accessing state before it's loaded"
```javascript
// ❌ Wrong
return <div>{data.name}</div>; // data is null initially

// ✅ Right
return <div>{data?.name || 'Loading...'}</div>;
```

### Issue: "Component unmounted warning"
```javascript
// ✅ Correct - Check mounted flag
let mounted = true;
// ... async operation
if (mounted) setState(value);
return () => { mounted = false; };
```

### Issue: "Infinite re-renders"
```javascript
// ✅ Correct - Add dependencies
useEffect(() => {
  loadData();
}, []); // Empty dependency array

// ✅ Or specific dependencies
useEffect(() => {
  loadProject();
}, [projectId]); // Re-run when projectId changes
```

## 📚 Additional Resources

- [API Integration Guide](./API_INTEGRATION_GUIDE.md)
- [Integration Report](./INTEGRATION_REPORT.md)
- [React Hooks Documentation](https://react.dev/reference/react/hooks)
- [Async/Await Guide](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises)

---

**Happy Coding! 🚀**
