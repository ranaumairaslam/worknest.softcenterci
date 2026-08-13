# Client API Integration Guide

## 📋 Overview

This document provides a comprehensive guide for the aligned and integrated client APIs across the WorkNest application.

## 🏗️ Architecture

### Backend (Express.js)
- **Base URL:** `http://localhost:5000/api`
- **Base Path:** `/client`
- **Authentication:** Bearer token via `protect` middleware
- **Route File:** `worknext/src/modules/clients/client-user.routes.js`
- **Route Mount:** `worknext/src/routes/index.js` → `router.use('/client', clientUserRoutes)`

### Frontend (React + Vite)
- **Base URL:** `http://localhost:5173`
- **API Base:** `http://localhost:5000/api`
- **Architecture:** Service Layer + Hooks Pattern
- **State Management:** React hooks with local state

## 📡 API Endpoints

### 1. Dashboard Endpoint
```http
GET /api/client/dashboard
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "dashboard": "client",
  "data": {
    "client": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "company_id": 1,
      "company_name": "Tech Corp",
      "created_at": "2024-01-15T10:30:00Z"
    },
    "statistics": {
      "projects": 5,
      "progress": 75,
      "meetings": 3,
      "tasks": 12,
      "completed_tasks": 9
    },
    "projects": [
      {
        "id": 101,
        "name": "Project Alpha",
        "description": "Web application development",
        "status": "active",
        "start_date": "2024-01-01",
        "end_date": "2024-03-31",
        "total_tasks": 10,
        "completed_tasks": 7,
        "in_progress_tasks": 2,
        "pending_tasks": 1,
        "progress": 70,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "upcoming_meetings": [
      {
        "id": 201,
        "title": "Project Review",
        "description": "Monthly project review meeting",
        "scheduled_at": "2024-08-15T14:00:00Z",
        "meeting_link": "https://meet.google.com/abc-defg",
        "status": "scheduled",
        "created_at": "2024-08-01T00:00:00Z",
        "company_name": "Tech Corp"
      }
    ]
  }
}
```

### 2. Projects Endpoints

#### Get All Projects
```http
GET /api/client/projects
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "projects": [
    {
      "id": 101,
      "name": "Project Alpha",
      "description": "Web application development",
      "status": "active",
      "start_date": "2024-01-01",
      "end_date": "2024-03-31",
      "total_tasks": 10,
      "completed_tasks": 7,
      "in_progress_tasks": 2,
      "pending_tasks": 1,
      "progress": 70,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Get Single Project
```http
GET /api/client/projects/:projectId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "project": {
    "id": 101,
    "name": "Project Alpha",
    "description": "Web application development",
    "status": "active",
    "start_date": "2024-01-01",
    "end_date": "2024-03-31",
    "total_tasks": 10,
    "completed_tasks": 7,
    "in_progress_tasks": 2,
    "pending_tasks": 1,
    "progress": 70,
    "created_at": "2024-01-01T00:00:00Z"
  },
  "tasks": [
    {
      "id": 1001,
      "title": "Setup database",
      "description": "Initialize PostgreSQL database",
      "status": "completed",
      "priority": "high",
      "due_date": "2024-01-15",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "meetings": [
    {
      "id": 201,
      "title": "Project Review",
      "description": "Monthly review",
      "scheduled_at": "2024-08-15T14:00:00Z",
      "meeting_link": "https://meet.google.com/abc-defg",
      "status": "scheduled",
      "created_at": "2024-08-01T00:00:00Z"
    }
  ]
}
```

#### Get Project Progress
```http
GET /api/client/projects/:projectId/progress
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "project": {
    "id": 101,
    "name": "Project Alpha",
    "description": "Web application development",
    "status": "active",
    "start_date": "2024-01-01",
    "end_date": "2024-03-31",
    "total_tasks": 10,
    "completed_tasks": 7,
    "in_progress_tasks": 2,
    "pending_tasks": 1,
    "progress": 70,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### 3. Meetings Endpoints

#### Get All Meetings
```http
GET /api/client/meetings
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "meetings": [
    {
      "id": 201,
      "title": "Project Review",
      "description": "Monthly review",
      "scheduled_at": "2024-08-15T14:00:00Z",
      "meeting_link": "https://meet.google.com/abc-defg",
      "status": "scheduled",
      "created_at": "2024-08-01T00:00:00Z",
      "company_id": 1,
      "company_name": "Tech Corp"
    }
  ]
}
```

#### Get Single Meeting
```http
GET /api/client/meetings/:meetingId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "meeting": {
    "id": 201,
    "title": "Project Review",
    "description": "Monthly review",
    "scheduled_at": "2024-08-15T14:00:00Z",
    "meeting_link": "https://meet.google.com/abc-defg",
    "status": "scheduled",
    "created_at": "2024-08-01T00:00:00Z",
    "company_id": 1,
    "company_name": "Tech Corp"
  }
}
```

#### Create Meeting
```http
POST /api/client/meetings
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Project Review",
  "description": "Monthly review meeting",
  "scheduled_at": "2024-08-15T14:00:00Z",
  "meeting_link": "https://meet.google.com/abc-defg",
  "status": "scheduled"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Meeting created successfully",
  "meeting": {
    "id": 201,
    "title": "Project Review",
    "description": "Monthly review meeting",
    "scheduled_at": "2024-08-15T14:00:00Z",
    "meeting_link": "https://meet.google.com/abc-defg",
    "status": "scheduled",
    "client_id": 1,
    "company_id": 1,
    "created_at": "2024-08-01T00:00:00Z"
  }
}
```

## 🔌 Frontend Service Layer

### clientApiService.js
Direct integration layer with backend APIs.

**Exports:**
```javascript
export async function getClientDashboard()
export async function getClientProjects()
export async function getClientProjectDetail(projectId)
export async function getClientProjectProgress(projectId)
export async function getClientMeetings()
export async function getClientMeetingDetail(meetingId)
export async function createClientMeeting(meetingData)
```

**Usage:**
```javascript
import { getClientDashboard } from '../services/clientApiService';

const dashboardData = await getClientDashboard();
console.log(dashboardData.data.statistics);
```

### clientDashboardService.js
Business logic layer that aggregates client data.

**Exports:**
```javascript
export async function getClientDashboard(role = "client")
export async function getClientProjectsList()
export async function getClientMeetingsList()
```

**Returns:** Formatted data for UI consumption

## 🎣 React Hooks

### useClientApi.js
Reusable React hooks for state management.

#### useClientProjects()
```javascript
const { projects, loading, error, refetch } = useClientProjects();
```

#### useClientProject(projectId)
```javascript
const { 
  project, 
  tasks, 
  meetings, 
  statistics, 
  loading, 
  error, 
  refetch 
} = useClientProject(projectId);
```

#### useClientMeetings()
```javascript
const { meetings, loading, error, refetch } = useClientMeetings();
```

#### useClientMeeting(meetingId)
```javascript
const { meeting, loading, error, refetch } = useClientMeeting(meetingId);
```

## 📄 Updated Pages

### ClientDashboard.jsx
Displays dashboard statistics and project overview.

**Features:**
- Loads dashboard data
- Displays stats cards
- Shows project progress
- Includes error handling
- Shows empty state

**Data Flow:**
```
ClientDashboard → useEffect → getClientDashboard() → Backend API
                  └→ setStats, setProjects
```

### ProjectsClient.jsx
Displays all client projects.

**Features:**
- Lists all projects
- Shows project progress
- Clickable to view details
- Includes error handling
- Shows empty state

**Data Flow:**
```
ProjectsClient → useEffect → getClientProjectsList() → Backend API
                 └→ setProjects
```

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    React Components                          │
│  (ClientDashboard, ProjectsClient, etc.)                    │
└────────────────┬────────────────────────────────────────────┘
                 │ useEffect()
                 ▼
┌─────────────────────────────────────────────────────────────┐
│               clientDashboardService                         │
│  (getClientDashboard, getClientProjectsList, etc.)          │
└────────────────┬────────────────────────────────────────────┘
                 │ await
                 ▼
┌─────────────────────────────────────────────────────────────┐
│               clientApiService                              │
│  (get, post functions with apiClient)                       │
└────────────────┬────────────────────────────────────────────┘
                 │ fetch()
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                   Express Backend                            │
│     /api/client/dashboard                                   │
│     /api/client/projects                                    │
│     /api/client/meetings                                    │
└─────────────────────────────────────────────────────────────┘
```

## 🧪 Testing

### Using Postman
1. Get auth token from `/api/auth/login`
2. Add `Authorization: Bearer <token>` header
3. Test endpoints at `http://localhost:5000/api/client/*`

### Using Browser DevTools
1. Open Network tab
2. Navigate to client dashboard
3. Look for requests to `/api/client/dashboard`
4. Inspect response payload

### Using React DevTools
1. Install React DevTools extension
2. Check component props and state
3. Verify data flow from API to UI

## ✅ Integration Checklist

- ✅ Backend routes defined and mounted
- ✅ Frontend service layer created
- ✅ Dashboard service updated
- ✅ React hooks created
- ✅ Components updated
- ✅ Error handling added
- ✅ Empty states implemented
- ✅ Loading states managed
- ✅ No syntax errors

## 🚀 Next Steps

1. **Test APIs** - Use Postman to verify endpoints
2. **Check Auth** - Ensure tokens are sent correctly
3. **Monitor Errors** - Check browser console for API errors
4. **Performance** - Monitor network tab for slow requests
5. **Edge Cases** - Test with no data, errors, timeouts

## 📞 Support

For issues:
1. Check browser console for error messages
2. Verify API endpoint URLs
3. Confirm authentication tokens
4. Check network requests in DevTools
5. Review backend logs for errors

